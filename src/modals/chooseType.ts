import type { App } from 'obsidian'
import { Modal } from 'obsidian'
import type { UniverPluginSettings } from '@/types/setting'
import { createNewFile } from '@/utils/createFile'

interface ModalText {
  title: string
  docBtn: string
  sheetBtn: string
}

export class ChooseTypeModal extends Modal {
  settings: UniverPluginSettings
  constructor(app: App, settings: UniverPluginSettings) {
    super(app)
    this.settings = settings
  }

  onOpen(): void {
    const { contentEl } = this
    this.titleEl.setText(this.getModalText().title)

    const btnContainer = contentEl.createDiv()
    btnContainer.classList.add('univer-modal-btn-container')

    const docBtn = btnContainer.createEl('button', {
      text: this.getModalText().docBtn,
      cls: 'univer-mdal-btn',
    })

    const sheetBtn = btnContainer.createEl('button', {
      text: this.getModalText().sheetBtn,
      cls: 'univer-mdal-btn',
    })

    docBtn.onclick = () => {
      createNewFile(this.app, 'udoc')
      this.close()
    }

    sheetBtn.onclick = () => {
      createNewFile(this.app, 'usheet')
      this.close()
    }
  }

  onClose(): void {
    this.contentEl.empty()
  }

  getModalText(): ModalText {
    if (this.settings.language === 'EN') {
      return {
        title: 'Please choose the type of file you want to create',
        docBtn: 'univer doc',
        sheetBtn: 'univer sheet',
      }
    }
    else {
      return {
        title: '请选择您要创建的文件类型',
        docBtn: 'univer 文档',
        sheetBtn: 'univer 表格',
      }
    }
  }
}
