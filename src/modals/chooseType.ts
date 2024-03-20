import type { App } from 'obsidian'
import { Modal } from 'obsidian'
import { createNewFile } from '~/utils/createFile'
import { Type as USheetType } from '~/views/usheet'
import { Type as UDocType } from '~/views/udoc'

export class ChooseTypeModal extends Modal {
  constructor(app: App) {
    super(app)
  }

  onOpen(): void {
    const { contentEl } = this
    this.titleEl.setText('请选择要创建的文件类型')

    const btnContainer = contentEl.createDiv()
    btnContainer.classList.add('univer-modal-btn-container')

    const docBtn = btnContainer.createEl('button', { text: '文档', cls: 'univer-mdal-btn' })
    const sheetBtn = btnContainer.createEl('button', { text: '表格', cls: 'univer-mdal-btn' })

    docBtn.onclick = () => {
      createNewFile(this.app, 'udoc', UDocType)
      this.close()
    }

    sheetBtn.onclick = () => {
      createNewFile(this.app, 'usheet', USheetType)
      this.close()
    }
  }

  onClose(): void {
    this.contentEl.empty()
    this.close()
  }
}
