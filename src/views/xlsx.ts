import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import { Tools } from '@univerjs/core'
import type { TFile, WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { FUniver } from '@univerjs/facade'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import type { UniverPluginSettings } from '@/types/setting'
import { sheetInit } from '@/univer/sheets'
import { transformSnapshotJsonToWorkbookData, transformWorkbookDataToSnapshotJson } from '@/utils/snapshot'
import { transformToExcelBuffer } from '@/utils/file'

export const Type = 'univer-xlsx'
export class XlsxTypeView extends TextFileView {
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
  }

  getViewData(): string {
    this.saveToExcel(this.legacyFile, this.workbook)
    return ''
  }

  async setViewData(_data: string, _clear: boolean) {
    if (!this.settings.isSupportXlsx) {
      this.contentEl.createEl('h2', { text: 'Xlsx file type is not supported, please enable it in the settings' })
      return
    }

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

    this.univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)

    const raw = await this.app.vault.readBinary(this.legacyFile)
    // @ts-expect-error
    const transformData = await window.univerProExchangeImport(raw)
    const jsonData = JSON.parse(transformData)
    let workbookData = transformSnapshotJsonToWorkbookData(jsonData.snapshot, jsonData.sheetBlocks)
    if (!workbookData)
      workbookData = Tools.deepClone({}) as IWorkbookData

    this.workbook = this.univer.createUniverSheet(workbookData)
  }

  getViewType() {
    return Type
  }

  clear(): void {}

  async onOpen() {
  }

  domInit() {
    this.contentEl.empty()
    this.rootContainer = this.contentEl.createDiv()
    this.rootContainer.id = 'Xlsx-app'
    this.rootContainer.classList.add('uproduct-container')
  }

  async onClose() {
    await this.saveToExcel(this.file!, this.workbook)
    this.univer?.dispose()
    this.workbook?.dispose()
    this.contentEl.empty()
  }

  async saveToExcel(file: TFile, workbook: Workbook) {
    if (!file || !workbook)
      return

    const saveWorkbookData = workbook.save()
    const snapshotJSON = await transformWorkbookDataToSnapshotJson(saveWorkbookData)
    const snapshot = JSON.stringify(snapshotJSON)
    // @ts-expect-error
    const excelRaw = await window.univerProExchangeExport(snapshot)
    const excelBuffer = await transformToExcelBuffer(excelRaw)
    await this.app.vault.modifyBinary(file, excelBuffer)
  }
}
