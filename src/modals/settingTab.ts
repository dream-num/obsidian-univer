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
      .setName('laguage')
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
  }
}
