import type { App } from 'obsidian'
import { Modal } from 'obsidian'
import { createNewFile } from '~/utils/createFile'

export class ChooseTypeModal extends Modal {
  constructor(app: App) {
    super(app)
  }

  onOpen(): void {
    const { contentEl } = this
    this.titleEl.setText('Please choose the type of file you want to create')

    const btnContainer = contentEl.createDiv()
    btnContainer.classList.add('univer-modal-btn-container')

    const docBtn = btnContainer.createEl('button', { text: 'univer-doc', cls: 'univer-mdal-btn' })
    const sheetBtn = btnContainer.createEl('button', { text: 'univer-sheet', cls: 'univer-mdal-btn' })

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
}
