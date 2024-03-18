import './style/univer.css'
import { defu } from 'defu'
import type { App } from 'obsidian'
import { Modal, Plugin } from 'obsidian'
import { Type as USheetType, USheetView } from './views/usheet'
import { Type as UDocType, UDocView } from './views/udoc'
import type { SettingType } from '~/types/setting'
import { createNewFile } from '~/utils/createFile'

const DEFAULT_SETTINGS: SettingType = {
  mySetting: 'default',
}

export default class UniverPlugin extends Plugin {
  settings: SettingType

  async onload() {
    await this.loadSettings()

    // ribbon icon & the class
    this.addRibbonIcon('cable', 'Univer', () => {
      const modal = new ChooseTypeModal(this.app)
      modal.open()
    })

    this.addStatusBarItem().setText('Univer is running')

    // register view
    this.registerView(
      USheetType,
      leaf => new USheetView(leaf),
    )

    this.registerView(
      UDocType,
      leaf => new UDocView(leaf),
    )

    this.registerExtensions(['usheet'], USheetType)
    this.registerExtensions(['udoc'], UDocType)
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = defu({}, DEFAULT_SETTINGS, await this.loadData())
  }
}

class ChooseTypeModal extends Modal {
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
    this.close()
  }
}
