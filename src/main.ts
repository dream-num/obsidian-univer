import './style/style.css'
import { defu } from 'defu'
import { Plugin } from 'obsidian'
import { Type as USheetType, USheetView } from './views/usheet'
import type { SettingType } from '~/types/setting'
import { createNewFile } from '~/utils/createFile'

const DEFAULT_SETTINGS: SettingType = {
  mySetting: 'default',
}

export default class SheetPlugin extends Plugin {
  settings: SettingType

  async onload() {
    await this.loadSettings()

    this.registerView(
      USheetType,
      leaf => new USheetView(leaf),
    )

    this.addRibbonIcon('dice', 'Create New File', () => {
      createNewFile(this.app, 'usheet')
    })

    this.registerExtensions(['usheet'], USheetType)
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = defu({}, DEFAULT_SETTINGS, await this.loadData())
  }
}
