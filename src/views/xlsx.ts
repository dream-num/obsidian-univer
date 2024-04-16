import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import exec from '@univerjs-pro/exchange-wasm/wasm_exec?raw'
import init from '@univerjs-pro/exchange-wasm/exchange.wasm?init'
import type { UniverPluginSettings } from '@/types/setting'
import { sheetInit } from '@/univer/sheets'
import { transformSnapshotJsonToWorkbookData } from '@/utils/snapshot'

async function injectWasm() {
  try {
    // eslint-disable-next-line no-new-func
    new Function(exec)()

    // @ts-expect-error
    const go = new window.Go()

    init(go.importObject).then((instance) => {
      go.run(instance)
    }).catch((err) => {
      console.error(err)
    })
  }
  catch (err) {
    console.error(err)
  }
}

function readFile(file: ArrayBuffer): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      // @ts-expect-error
      const result = window.univerProExchangeImport(reader.result)
      resolve(result)
    }

    reader.readAsArrayBuffer(new Blob([file]))
  })
}

export const Type = 'univer-xlsx'

export class XlsxTypeView extends TextFileView {
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver
  sheetData: IWorkbookData | object
  settings: UniverPluginSettings

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
  }

  getViewData(): string {
    return JSON.stringify(this.workbook.save())
  }

  async setViewData(_data: string, _: boolean) {
    await injectWasm()

    this.domInit()
    this.univer?.dispose()
    this.workbook?.dispose()

    if (!this.file)
      return

    const options = {
      container: this.rootContainer,
      header: true,
      footer: true,
    }
    this.univer = sheetInit(options, this.settings)

    this.FUniver = FUniver.newAPI(this.univer)

    this.univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)

    const raw = await this.app.vault.readBinary(this.file)
    const result = await readFile(raw)

    const json = JSON.parse(result)
    const workbookData = transformSnapshotJsonToWorkbookData(json.snapshot, json.sheetBlocks)

    if (workbookData)
      this.workbook = this.univer.createUniverSheet(workbookData)

    // this.FUniver.onCommandExecuted(() => {
    //   this.requestSave()
    // })
  }

  getViewType() {
    return Type
  }

  clear(): void {}

  async onOpen() {}

  domInit() {
    this.contentEl.empty()
    this.rootContainer = this.contentEl.createDiv()
    this.rootContainer.id = 'Xlsx-app'
    this.rootContainer.classList.add('uproduct-container')
  }

  async onClose() {
    // this.requestSave()
    this.univer?.dispose()
    this.workbook?.dispose()
    this.contentEl.empty()
  }
}
