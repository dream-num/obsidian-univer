import './style/univer.css'
import { defu } from 'defu'
import { Plugin, addIcon } from 'obsidian'
import { Type as USheetType, USheetView } from './views/usheet'
import { Type as XlsxType, XlsxTypeView } from './views/xlsx'
import { Type as UDocType, UDocView } from './views/udoc'
import { ChooseTypeModal } from './modals/chooseType'
import { SettingTab } from './modals/settingTab'
import { univerIconSvg } from './utils/common'
import { injectWasm } from './utils/wasm'
import type { UniverPluginSettings } from '@/types/setting'

export type ViewType = typeof USheetType | typeof UDocType

export default class UniverPlugin extends Plugin {
  settings: UniverPluginSettings

  async onload() {
    await this.loadSettings()
    await injectWasm()

    addIcon('univer', univerIconSvg)

    // ribbon icon & the class
    this.addRibbonIcon('univer', 'Univer', () => {
      const modal = new ChooseTypeModal(this.app, this.settings)
      modal.open()
    })

    // add the setting tab
    this.addSettingTab(new SettingTab(this.app, this))

    // register view
    this.registerView(USheetType, leaf => new USheetView(leaf, this.settings))
    this.registerView(XlsxType, leaf => new XlsxTypeView(leaf, this.settings))

    this.registerView(UDocType, leaf => new UDocView(leaf, this.settings))

    this.registerExtensions(['usheet'], USheetType)
    this.registerExtensions(['udoc'], UDocType)
    this.registerExtensions(['xlsx'], XlsxType)
    this.registerExtensions(['xls'], XlsxType)
  }

  async loadSettings() {
    this.settings = defu(this.settings, {
      language: 'EN',
    })
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  onunload() {}
}
