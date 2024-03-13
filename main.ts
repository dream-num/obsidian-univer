import designCss from "@univerjs/design/lib/index.css";
import uiCss from "@univerjs/ui/lib/index.css";
import docuiCss from "@univerjs/docs-ui/lib/index.css";
import sheetsuiCss from "@univerjs/sheets-ui/lib/index.css";
import sheetsFormulaCss from "@univerjs/sheets-formula/lib/index.css";

import { App, ItemView, Modal, Plugin, WorkspaceLeaf, Notice } from "obsidian";
import { UniverSheetComponent } from "sheets/main";
import { UniverDocsView, VIEW_TYPE_UNIVERDOCS } from "./view";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

const univerCss = [designCss, uiCss, docuiCss, sheetsuiCss, sheetsFormulaCss];

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
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

		const app = this.app;
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("New univerdoc")
						.setIcon("document")
						.onClick(function () {
							createNewFile(app, file.path, 0);
						});
				});
			})
		);

		this.registerView(
			VIEW_TYPE_UNIVERDOCS,
			(leaf) => new UniverDocsView(leaf)
		);

		this.registerView(
			UniverSheetView.viewType,
			(leaf) => new UniverSheetView(leaf)
		);

		this.addCommand({
			id: "open-my-react-view",
			name: "create univer doc",
			callback: () => {
				this.activateView("doc");
			},
		});

		this.addCommand({
			id: "open-my-react-view",
			name: "create univer sheet",
			callback: () => {
				this.activateView("sheet");
			},
		});

		this.addCommand({
			id: "open-choose-type-modal",
			name: "create the product",
			callback: () => {
				new ChooseTypeModal(this.app).open();
			},
		});

		this.registerExtensions(["udoc"], VIEW_TYPE_UNIVERDOCS);
	}

	async activateView(type: "doc" | "sheet") {
		const leaf = this.app.workspace.getLeaf(true);

		await leaf
			.setViewState({
				type:
					type === "doc"
						? UniverDocView.viewType
						: UniverSheetView.viewType,
				active: true,
			})
			.then(() => {
				this.app.workspace.revealLeaf(leaf);
			});
	}

	async testView() {
		const leaf = this.app.workspace.getLeaf(true);

		await leaf
			.setViewState({
				type: VIEW_TYPE_UNIVERDOCS,
				active: true,
			})
			.then(() => {
				console.log("hello this is testView");
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			createNewFile(this.app, undefined, undefined);
			// this.plugin.testView();
			// this.plugin.activateView("doc");

			this.close();
		};

		sheetButton.onclick = () => {
			console.log("begin to create sheet");
			this.plugin.activateView("sheet");
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
		this.contentEl.appendChild(appContainer);
		appContainer.style.height = "100%";

		injectStyles(univerCss);
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
		this.contentEl.appendChild(appContainer);
		appContainer.style.height = "100%";
		injectStyles(univerCss);

		UniverSheetComponent();
	}

	async onClose() {}
}

function injectStyles(cssStrings: string[]) {
	cssStrings.forEach((cssString) => {
		const styleEl = document.createElement("style");
		styleEl.textContent = cssString;
		document.head.appendChild(styleEl);
	});
}

async function createNewFile(app: App, folderPath?: string, fileNum?: number): Promise<void> {
	if (folderPath) {
		try {
			await app.vault.createFolder(folderPath);
		} catch (err) {
			console.log("issue in making folder");
			console.log(err);
		}
	}

	let fileName = "Untitled.udoc";

	if (fileNum) {
		fileName = "Untitled" + fileNum + ".udoc";
	}

	let filePath = fileName;
	if (folderPath) {
		filePath = folderPath + "/" + fileName;
	}

	try {
		await app.vault.create(filePath, "");

		await app.workspace.getLeaf(true).setViewState({
			type: VIEW_TYPE_UNIVERDOCS,
			active: true,
			state: { file: filePath },
		});

		new Notice("Create spreadsheet at : " + filePath);
	} catch (err) {
		const error = err;
		if (error.message.includes("File already exists")) {
			return await createNewFile(app, folderPath, (fileNum || 0) + 1);
		}
	}
}
