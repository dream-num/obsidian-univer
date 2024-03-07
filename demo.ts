// import { DemoComponent } from "./test";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { initialUniverDocs, initialUniverSheets } from "docs";

export class MyReactView extends ItemView {
	static viewType = "react-demo";

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return MyReactView.viewType;
	}

	getDisplayText(): string {
		return "My React View";
	}

	async onOpen() {
		const appContainer = document.createElement("div");
		appContainer.id = "app";
		this.containerEl.childNodes[1].appendChild(appContainer);

		const univerdocContainer = document.createElement("div");
		univerdocContainer.id = "univerdoc";
		this.containerEl.childNodes[1].appendChild(univerdocContainer);

		// initialUniverDocs();
		initialUniverSheets();
	}

	async onClose() {}
}
