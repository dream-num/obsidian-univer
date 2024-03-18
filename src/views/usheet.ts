import type { IWorkbookData, Univer, Workbook } from '@univerjs/core'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { init } from '~/utils/univer'

export const Type = 'univer-sheet'

export class USheetView extends TextFileView {
  contentData: string
  rootContainer: HTMLDivElement
  univer: Univer
  workbook: Workbook

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewData(): string {
    return JSON.stringify(this.workbook.save())
  }

  setViewData(data: string, _: boolean): void {
    if (this.univer)
      this.univer.dispose()
    this.univer = init({
      container: 'usheet-app',
      header: true,
      toolbar: true,
      footer: true,
    })
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
    // Nothing to clean up.
    this.requestSave()
    this.univer.dispose()
  }
}
