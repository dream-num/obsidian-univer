import type { UniverPluginSettings } from '@/types/setting'
import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { TFile, WorkspaceLeaf } from 'obsidian'

import { sheetInit } from '@/univer/sheets'
import { fillDefaultSheetBlock } from '@/utils/snapshot'
import { IUniverInstanceService, Tools, UniverInstanceType } from '@univerjs/core'
import { FUniver } from '@univerjs/facade'
import { TextFileView } from 'obsidian'

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver
  sheetData: IWorkbookData | object
  settings: UniverPluginSettings
  legacyFile: TFile
  private univerInstanceService: IUniverInstanceService

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
  }

  getViewData(): string {
    const workbook = this.univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!
    return JSON.stringify(workbook.save())
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
    this.contentEl.empty()
  }

  createUniverSheet(data: string, excel2WorkbookData: IWorkbookData | null) {
    this.univer?.dispose()
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
    this.univerInstanceService = this.univer.__getInjector().get(IUniverInstanceService)
    let sheetData: IWorkbookData

    if (excel2WorkbookData)
      sheetData = excel2WorkbookData
    else if (data)
      sheetData = JSON.parse(data)
    else
      sheetData = { id: Tools.generateRandomId(6) } as IWorkbookData
    const filledWorkbookData = fillDefaultSheetBlock(sheetData)
    this.univer.createUnit(UniverInstanceType.UNIVER_SHEET, filledWorkbookData)

    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
  }
}
