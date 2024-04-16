import type { IWorkbookData, Nullable, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import type { UniverPluginSettings } from '@/types/setting'
import { sheetInit } from '@/univer/sheets'
import { transformSnapshotJsonToWorkbookData } from '@/utils/snapshot'

export const Type = 'univer-xlsx'
export class XlsxTypeView extends TextFileView {
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver
  sheetData: IWorkbookData | object
  settings: UniverPluginSettings
  workbookData: Nullable<IWorkbookData>

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
  }

  getViewData(): string {
    // return JSON.stringify(this.workbook.save())
    return ''
  }

  async setViewData(_data: string, _: boolean) {
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
    // @ts-expect-error
    const transformData = await window.univerProExchangeImport(raw)
    const json = JSON.parse(transformData)

    this.workbookData = transformSnapshotJsonToWorkbookData(json.snapshot, json.sheetBlocks)

    this.workbook = this.univer.createUniverSheet(this.workbookData ?? {})

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
