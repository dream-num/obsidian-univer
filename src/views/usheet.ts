import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { Tools, UniverInstanceType } from '@univerjs/core'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import type { UniverPluginSettings } from '@/types/setting'
import { sheetInit } from '@/univer/sheets'
import { fillDefaultSheetBlock } from '@/utils/snapshot'

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver
  sheetData: IWorkbookData | object
  settings: UniverPluginSettings
  oriData: string

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
    // this.exchangeServiceInstance.exchangeUpload$.subscribe((excel2WorkbookData: IWorkbookData) => {
    //   this.createUniverSheet(this.oriData, excel2WorkbookData)
    // })

    // emitter.on('exchange-upload', (excel2WorkbookData: IWorkbookData) => {
    //   this.createUniverSheet(this.oriData, excel2WorkbookData)
    // })
  }

  getViewData(): string {
    return JSON.stringify(this.workbook.save())
  }

  setViewData(data: string, _: boolean): void {
    this.domInit()
    this.oriData = data
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

  async createUniverSheet(data: string, excel2WorkbookData: IWorkbookData | null) {
    this.univer?.dispose()
    this.workbook?.dispose()

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
    this.workbook = this.univer.createUnit(UniverInstanceType.SHEET, filledWorkbookData)
    window.workbook = this.workbook
    this.univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)
    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
  }
}
