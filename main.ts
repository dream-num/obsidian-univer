import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log("univer plugin has beginning");
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon(
			"cable",
			"Univer",
			(evt: MouseEvent) => {
				new ChooseTypeModal(this.app).open();
			}
		);
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Hello Univer");

		this.addCommand({
			id: "open-choose-type-modal",
			name: "create the product",
			callback: () => {
				new ChooseTypeModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {
		console.log("univer plugin has ended");
	}

	async loadSettings() {
		// this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		const data = await this.loadData();
		if (data) {
			this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
		} else {
			this.settings = DEFAULT_SETTINGS;
			await this.saveData(this.settings);
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

class ChooseTypeModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen(): void {
		const { contentEl } = this;
		console.log("whoa!");

		const title = contentEl.createEl("h3", {
			text: "请选择要创建的文件类型",
			cls: "modal-title",
		});

		const buttonsContainer = contentEl.createDiv({
			cls: "buttons-container",
		});

		const docButton = buttonsContainer.createEl("button", {
			text: "创建文档",
			cls: "modal-button",
		});

		const sheetButton = buttonsContainer.createEl("button", {
			text: "创建表格",
			cls: "modal-button",
		});

		docButton.onclick = () => {
			console.log("begin to create docs");
			this.close();
		};

		sheetButton.onclick = () => {
			console.log("begin to create sheet");
			this.close;
		};
	}

	onClose() {
		const { contentEl } = this;
		console.log('ops~')
		contentEl.empty();
	}
}
