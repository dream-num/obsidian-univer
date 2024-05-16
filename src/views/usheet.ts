import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { TFile, WorkspaceLeaf } from 'obsidian'
import { Tools, UniverInstanceType } from '@univerjs/core'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import type { UniverPluginSettings } from '@/types/setting'
import { sheetInit } from '@/univer/sheets'
import { fillDefaultSheetBlock } from '@/utils/snapshot'
import { emitter } from '@/main'

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver
  sheetData: IWorkbookData | object
  settings: UniverPluginSettings
  legacyFile: TFile

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
    emitter.on('exchange-upload', (_workbook: Workbook) => {
      this.workbook = _workbook
    })
  }

  getViewData(): string {
    return JSON.stringify(this.workbook.save())
  }

  setViewData(data: string, _: boolean): void {
    this.createUniverSheet(data, null)
  }

  getViewType() {
    return Type
  }

  clear(): void {}

  async onOpen() {}

  domInit() {
    this.contentEl.empty()
    this.rootContainer = this.contentEl.createDiv()
    this.rootContainer.id = 'usheet-app'
    this.rootContainer.classList.add('uproduct-container')
  }

  async onClose() {
    this.requestSave()
    this.univer?.dispose()
    this.workbook?.dispose()
    this.contentEl.empty()
  }

  createUniverSheet(data: string, excel2WorkbookData: IWorkbookData | null) {
    this.univer?.dispose()
    this.workbook?.dispose()
    this.domInit()

    if (!this.file)
      return
    this.legacyFile = this.file

    const options = {
      container: this.rootContainer,
      header: true,
      footer: true,
    }
    this.univer = sheetInit(options, this.settings)
    this.FUniver = FUniver.newAPI(this.univer)
    let sheetData: IWorkbookData

    if (excel2WorkbookData)
      sheetData = excel2WorkbookData
    else if (data)
      sheetData = JSON.parse(data)
    else
      sheetData = { id: Tools.generateRandomId(6) } as IWorkbookData
    const filledWorkbookData = fillDefaultSheetBlock(sheetData)
    this.workbook = this.univer.createUnit(UniverInstanceType.UNIVER_SHEET, filledWorkbookData)

    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
  }
}
