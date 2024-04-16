import type { App } from 'obsidian'
import { PluginSettingTab, Setting } from 'obsidian'
import type UniverPlugin from '../main'

export class SettingTab extends PluginSettingTab {
  plugin: UniverPlugin

  constructor(app: App, plugin: UniverPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()
    containerEl.createEl('h2', { text: 'Univer Settings' })

    new Setting(containerEl)
      .setName('language')
      .setDesc('choose the language')
      .addDropdown((drop) => {
        drop
          .addOptions({
            EN: 'English',
            ZH: '简体中文',
          })
          .setValue(this.plugin.settings.language)
          .onChange(async (value: 'ZH' | 'EN') => {
            this.plugin.settings.language = value
            await this.plugin.saveSettings()
          })
      })
    new Setting(containerEl)
      .setName('support xlsx file type')
      .setDesc('choose whether to support xlsx file type and its import and export')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.isSupportXlsx)
          .onChange(async (value: boolean) => {
            this.plugin.settings.isSupportXlsx = value
            await this.plugin.saveSettings()
          })
      })
  }
}
