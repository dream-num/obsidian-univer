import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { sheetInit } from '~/utils/univer'
import { FUniver } from "@univerjs/facade";

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
  contentData: string
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook
  FUniver: FUniver

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewData(): string {
    console.log('saveing')
    return JSON.stringify(this.workbook.save())
  }

  setViewData(data: string, _: boolean): void {
    if (this.univer)
      this.univer.dispose()
    this.univer = sheetInit({
      container: 'usheet-app',
      header: true,
      toolbar: true,
      footer: true,
    })
    this.FUniver = FUniver.newAPI(this.univer)
    let sheetData: IWorkbookData | object

    try {
      sheetData = JSON.parse(data)
    }
    catch (err) {
      sheetData = {}
    }
    setTimeout(() => {
      this.workbook = this.univer.createUniverSheet(sheetData)
    }, 0)

    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
  }


  getViewType() {
    return Type
  }

  clear(): void {

  }

  async onOpen() {
    this.rootContainer = this.contentEl as HTMLDivElement
    this.rootContainer.id = 'usheet-app'
    this.rootContainer.classList.add('usheet-container')
    this.rootContainer.empty()
  }

  async onClose() {
    this.requestSave()
    this.univer.dispose()
  }
}
