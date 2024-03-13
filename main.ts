import { App, Modal, Plugin, Notice } from "obsidian";
import { UniverDocsView, UniverSheetsView, VIEW_TYPE_UNIVERDOCS, VIEW_TYPE_UNIVERSHEETS } from "./view";

interface UniverPluginSettings {
	mySetting: string;
}
export type UniverType = 'udoc' | 'usheet';

const DEFAULT_SETTINGS: UniverPluginSettings = {
	mySetting: "default",
};


export default class UniverPlugin extends Plugin {
	settings: UniverPluginSettings;

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

		this.registerView(
			VIEW_TYPE_UNIVERDOCS,
			(leaf) => new UniverDocsView(leaf)
		);
		this.registerView(
			VIEW_TYPE_UNIVERSHEETS,
			(leaf) => new UniverSheetsView(leaf)
		);

		this.registerExtensions(["udoc"], VIEW_TYPE_UNIVERDOCS);
		this.registerExtensions(["usheet"], VIEW_TYPE_UNIVERSHEETS);
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
	plugin: UniverPlugin;

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
			cls: "modal-buttons-container",
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
			createNewFile(this.app, 'udoc', undefined, undefined);
			this.addMenuItem('udoc');
			this.close();
		};

		sheetButton.onclick = () => {
			console.log("begin to create sheet");
			createNewFile(this.app, 'usheet', undefined, undefined);
			this.addMenuItem('usheet');
			this.close();
		};
	}

	onClose() {
		const { contentEl } = this;
		console.log("ops~");
		contentEl.empty();
	}

	addMenuItem(type: UniverType) {
		const title = type === "udoc" ? "New univerdoc" : "New universheet";
		const icon = type === "udoc" ? "document" : "table";
		this.app.workspace.on('file-menu', (menu, file) => {
			menu.addItem((item) => {
				item.setTitle(title)
					.setIcon(icon)
					.onClick(() => {
						createNewFile(this.app, type, file.path, 0);
					});
			});	
		});
	}
}


async function createNewFile(app: App, type: UniverType, folderPath?: string, fileNum?: number): Promise<void> {
	const fileType = type;
	if (folderPath) {
		try {
			await app.vault.createFolder(folderPath);
		} catch (err) {
			console.log("issue in making folder");
			console.log(err);
		}
	}

	let fileName = `Untitled.${fileType}`;

	if (fileNum) {
		fileName = "Untitled" + fileNum + `.${fileType}`;
	}

	let filePath = fileName;
	if (folderPath) {
		filePath = folderPath + "/" + fileName;
	}

	try {
		await app.vault.create(filePath, "");

		await app.workspace.getLeaf(true).setViewState({
			type: type === 'udoc' ? VIEW_TYPE_UNIVERDOCS : VIEW_TYPE_UNIVERSHEETS,
			active: true,
			state: { file: filePath },
		});

		new Notice(`create ${fileType} at : ` + filePath);
	} catch (err) {
		const error = err;
		if (error.message.includes("File already exists")) {
			return await createNewFile(app, type, folderPath, (fileNum || 0) + 1);
		}
	}
}
