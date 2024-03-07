import { App, ItemView, Modal, Plugin, WorkspaceLeaf } from "obsidian";
import { initialUniverDocs, initialUniverSheets } from "docs";

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
			}
		);
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Hello Univer");

		this.registerView(
			UniverDocView.viewType,
			(leaf) => new UniverDocView(leaf)
		);

		this.registerView(
			UniverSheetView.viewType,
			(leaf) => new UniverSheetView(leaf)
		);

		this.addCommand({
			id: "open-my-react-view",
			name: "create univer doc",
			callback: () => {
				this.activateView('doc');
			},
		});

		this.addCommand({
			id: "open-my-react-view",
			name: "create univer sheet",
			callback: () => {
				this.activateView('sheet');
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

	async activateView(type: "doc" | "sheet") {
		let leaf = this.app.workspace.getLeaf(true); 
	
		await leaf.setViewState({
			type: type === "doc" ? UniverDocView.viewType : UniverSheetView.viewType,
			active: true,
		}).then(() => {
			this.app.workspace.revealLeaf(leaf);
		});
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
			this.plugin.activateView('doc');
			this.close();
		};

		sheetButton.onclick = () => {
			console.log("begin to create sheet");
			this.plugin.activateView('sheet');
			this.close();
		};
	}

	onClose() {
		const { contentEl } = this;
		console.log("ops~");
		contentEl.empty();
	}
}

class UniverDocView extends ItemView {
	static viewType = "univer-doc";

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return UniverDocView.viewType;
	}

	getDisplayText(): string {
		return "univer doc view";
	}

	async onOpen() {
		const appContainer = document.createElement("div");
		appContainer.id = "doc-app";
		this.containerEl.childNodes[1].appendChild(appContainer);

		const univerdocContainer = document.createElement("div");
		univerdocContainer.id = "univerdoc";
		this.containerEl.childNodes[1].appendChild(univerdocContainer);

		initialUniverDocs();
	}

	async onClose() {}
}

class UniverSheetView extends ItemView {
	static viewType = "univer-sheet";

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return UniverSheetView.viewType;
	}

	getDisplayText(): string {
		return "univer sheet view";
	}

	async onOpen() {
		const appContainer = document.createElement("div");
		appContainer.id = "sheet-app";
		this.containerEl.childNodes[1].appendChild(appContainer);

		initialUniverSheets();
	}

	async onClose() {}
}
