import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import { DEFAULT_WORKBOOK_DATA_DEMO as SHEET_EN } from '../data/default-workbook-data-demo-EN'
import { DEFAULT_WORKBOOK_DATA_DEMO as SHEET_CN } from '../data/default-workbook-data-demo-CN'
import type { UniverPluginSettings } from '~/types/setting'
import { sheetInit } from '~/univer/sheets'

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
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

  setViewData(data: string, _: boolean): void {
    this.domInit()
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
    try {
      sheetData = JSON.parse(data)
    }
    catch (err) {
      sheetData = {} as IWorkbookData
    }

    this.workbook = this.univer.createUniverSheet(sheetData)
    this.univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)
    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
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
}
