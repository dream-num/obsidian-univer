import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import { App, ItemView, Modal, Plugin, WorkspaceLeaf } from "obsidian";

import { LocaleType, Univer, LogLevel } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import {
	UniverRPCMainThreadPlugin,
	IUniverRPCMainThreadConfig,
} from "@univerjs/rpc";
import { UniverFindReplacePlugin } from "@univerjs/find-replace";
import { DEFAULT_DOCUMENT_DATA_CN } from "./data/default-document-data-cn";
import { DEFAULT_WORKBOOK_DATA_DEMO } from "./data/default-workbook-data-demo";

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
			this.plugin.activateView("doc");
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
		// await loadStyleSheet(shadowRoot);
		await initialUniverDocs();
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
		initialUniverSheets();
	}

	async onClose() {}
}

// async function loadStyleSheet(root: ShadowRoot) {
// 	const cssUrl = "./main.css";
// 	try {
// 		const response = await fetch(cssUrl);
// 		const cssText = await response.text();

// 		const styleEl = document.createElement("style");
// 		styleEl.textContent = cssText;
// 		root.append(styleEl);
// 	} catch (error) {
// 		console.error("failed to load style.sheet");
// 	}
// }



export async function initialUniverDocs() {

	const univer = new Univer({
		theme: defaultTheme,
		locale: LocaleType.ZH_CN,
	});

	univer.registerPlugin(UniverRenderEnginePlugin);
	univer.registerPlugin(UniverFormulaEnginePlugin);

	univer.registerPlugin(UniverUIPlugin, {
		container: "doc-app",
		header: true,
		toolbar: true,
	});

	univer.registerPlugin(UniverDocsPlugin, {
		standalone: true,
	});
	univer.registerPlugin(UniverDocsUIPlugin, {
		container: "univerdoc",
		layout: {
			docContainerConfig: {
				innerLeft: false,
			},
		},
	});

	univer.createUniverDoc(DEFAULT_DOCUMENT_DATA_CN);
}

export function initialUniverSheets() {
	const univer = new Univer({
		theme: defaultTheme,
		locale: LocaleType.ZH_CN,
		logLevel: LogLevel.VERBOSE,
	});

	univer.registerPlugin(UniverDocsPlugin, {
		hasScroll: false,
	});
	univer.registerPlugin(UniverRenderEnginePlugin);
	univer.registerPlugin(UniverUIPlugin, {
		container: "sheet-app",
		header: true,
		toolbar: true,
		footer: true,
	});

	univer.registerPlugin(UniverDocsUIPlugin);

	univer.registerPlugin(UniverSheetsPlugin, {
		notExecuteFormula: true,
	});
	univer.registerPlugin(UniverSheetsUIPlugin);

	// sheet feature plugins

	univer.registerPlugin(UniverSheetsNumfmtPlugin);
	univer.registerPlugin(UniverSheetsZenEditorPlugin);
	univer.registerPlugin(UniverFormulaEnginePlugin, {
		notExecuteFormula: true,
	});
	univer.registerPlugin(UniverSheetsFormulaPlugin);
	univer.registerPlugin(UniverRPCMainThreadPlugin, {
		workerURL: "./worker.js",
	} as IUniverRPCMainThreadConfig);

	// find replace
	univer.registerPlugin(UniverFindReplacePlugin);

	// create univer sheet instance
	univer.createUniverSheet(DEFAULT_WORKBOOK_DATA_DEMO);
}
