import type { DocumentDataModel, IDocumentData, Univer } from '@univerjs/core'
import { Tools, UniverInstanceType } from '@univerjs/core'
import { FUniver } from '@univerjs/facade'
import type { WorkspaceLeaf } from 'obsidian'
import { TextFileView } from 'obsidian'
import type { UniverPluginSettings } from '@/types/setting'
import { docInit } from '@/univer/docs'

export const Type = 'univer-doc'

export class UDocView extends TextFileView {
  documentModal: DocumentDataModel
  univer: Univer
  FUniver: FUniver
  rootContainer: HTMLDivElement
  settings: UniverPluginSettings

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf)
    this.settings = settings
  }

  getViewData(): string {
    return JSON.stringify(Tools.deepClone(this.documentModal.getSnapshot()))
  }

  setViewData(data: string): void {
    this.univer?.dispose()

    const option = {
      container: this.rootContainer,
      header: true,
    }
    this.univer = docInit(option, this.settings)
    this.FUniver = FUniver.newAPI(this.univer)

    let docData: IDocumentData

    try {
      docData = JSON.parse(data)
    }
    catch {
      docData = {} as IDocumentData
    }

    setTimeout(() => {
      this.documentModal = this.univer.createUnit(UniverInstanceType.DOC, docData)
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
    this.requestSave()

    this.univer.dispose()
  }
}
