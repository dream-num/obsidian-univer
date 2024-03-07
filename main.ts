// import { MyReactView } from "UniverService";
import { App, Modal, Plugin } from "obsidian";
import { MyReactView } from 'demo'

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
				const modal = new ChooseTypeModal(this.app);
				modal.plugin = this;
				modal.open();
				this.activateView();
			}
		);
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Hello Univer");

		this.registerView(
			MyReactView.viewType,
			(leaf) => new MyReactView(leaf)
		);

		this.addCommand({
			id: "open-my-react-view",
			name: "Open My React View",
			callback: () => {
				this.activateView();
			},
		});

		this.addCommand({
			id: "open-choose-type-modal",
			name: "create the product",
			callback: () => {
				new ChooseTypeModal(this.app).open();
			},
		});
	}

	async activateView() {
		let leaf = this.app.workspace.getLeaf(true); // 获取或创建一个leaf
		await leaf.setViewState({
			type: MyReactView.viewType,
			active: true,
		});
		this.app.workspace.revealLeaf(leaf); // 显示这个leaf
	}

	onunload() {
		console.log("univer plugin has ended");
	}

	async loadSettings() {
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

class ChooseTypeModal extends Modal {
	plugin: MyPlugin;

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
			this.plugin.activateView();
			// how to do
			this.close();
		};

		sheetButton.onclick = () => {
			console.log("begin to create sheet");
			this.close;
		};
	}

	onClose() {
		const { contentEl } = this;
		console.log("ops~");
		contentEl.empty();
	}
}
