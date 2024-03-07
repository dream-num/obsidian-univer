// import { DemoComponent } from "./test";
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { LocaleType, Univer } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { DEFAULT_DOCUMENT_DATA_CN } from "./data/default-document-data-cn";

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
		console.log('univer has opoen-----------')
		const univer = new Univer({
			theme: defaultTheme,
			locale: LocaleType.ZH_CN,
		});

		const appContainer = this.containerEl.children[1] as HTMLElement;
		appContainer.id = "app";
		this.containerEl.appendChild(appContainer);

		const univerdocContainer = document.createElement("div");
		univerdocContainer.id = "univerdoc";
		this.containerEl.appendChild(univerdocContainer);

		univer.registerPlugin(UniverRenderEnginePlugin);
		univer.registerPlugin(UniverFormulaEnginePlugin);
		univer.registerPlugin(UniverUIPlugin, {
			container: "app",
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

	async onClose() {
		// 清理，避免内存泄漏
		ReactDOM.unmountComponentAtNode(
			this.containerEl.children[1] as HTMLElement
		);
	}
}
