import type { DocumentDataModel, Univer } from '@univerjs/core'
import { Tools } from '@univerjs/core'
import { FUniver } from '@univerjs/facade'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import { DEFAULT_DOCUMENT_DATA_CN } from '../data/default-document-data-cn'
import { docInit } from '~/utils/univer'
import { setCtxPos } from '~/utils/resize'

export const Type = 'univer-doc'

export class UDocView extends TextFileView {
  documentData: DocumentDataModel
  univer: Univer
  FUniver: FUniver
  rootContainer: HTMLDivElement
  resizeObserver: ResizeObserver | void

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewData(): string {
    return JSON.stringify(Tools.deepClone(this.documentData.getSnapshot()))
  }

  setViewData(data: string): void {
    this.univer?.dispose()
    this.univer = docInit({
      container: this.rootContainer,
      header: true,
      toolbar: true,
    })
    this.FUniver = FUniver.newAPI(this.univer)

    let docData: DocumentDataModel | object

    this.resizeObserver = new ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'))
      setCtxPos(this.rootContainer)
    }).observe(this.rootContainer)

    try {
      docData = JSON.parse(data)
    }
    catch {
      docData = Tools.deepClone(DEFAULT_DOCUMENT_DATA_CN)
    }

    setTimeout(() => {
      this.documentData = this.univer.createUniverDoc(docData)
    }, 0)

    this.FUniver.onCommandExecuted(() => {
      this.requestSave()
    })
  }

  getViewType() {
    return Type
  }

  clear(): void {}

  async onOpen() {
    this.rootContainer = this.contentEl as HTMLDivElement
    this.rootContainer.id = 'udoc-app'
    this.rootContainer.classList.add('uproduct-container')
  }

  async onClose() {
    if (this.resizeObserver)
      this.resizeObserver.disconnect()

    this.requestSave()

    this.univer.dispose()
  }
}
