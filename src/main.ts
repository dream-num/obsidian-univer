import './style/univer.css'
import { defu } from 'defu'
import { Plugin } from 'obsidian'
import { Type as USheetType, USheetView } from './views/usheet'
import { Type as UDocType, UDocView } from './views/udoc'
import { ChooseTypeModal } from './modals/chooseType'
import type { SettingType } from '~/types/setting'

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
