/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFileView } from "obsidian";
import React from "react";
import { createRoot } from "react-dom/client";
import { UniverDocComponent } from "./docs/main";
import { UniverSheetComponent } from "./sheets/main";
import UniverSheet from "./sheets/sheet";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import "@univerjs/sheets-numfmt/lib/index.css";

export const VIEW_TYPE_UNIVERDOCS = "univer-doc-view";
export const VIEW_TYPE_UNIVERSHEETS = "univer-sheet-view";

export interface UniverDataSetting {
	UIContainer: HTMLElement;
	data: any;
	onChange: (data: any) => void;
}

function setCtxPos(el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const p = { x: rect.left, y: rect.top };

	const r = document.querySelector(":root") as HTMLElement;

	if (r && p.x) {
		r.style.setProperty("--ctx_menu_x", -1 * p.x + "px");
		r.style.setProperty("--ctx_menu_y", -1 * p.y + 50 + "px");
	}
}


abstract class UniverBaseView extends TextFileView {
	root: any;
	univerElement: HTMLElement;
	univerContainer: HTMLElement;
	resizeObserver: ResizeObserver | void;
	contianerId: string;
	inData: any;
	outData: any;
	isSaveingData: boolean;

	abstract getViewType(): string;
	abstract getContainerId(): string;
	abstract getDisplayText(): string;
	abstract renderComponent(container: HTMLElement): React.ReactElement;

	getViewData(): string {
		console.log("getViewData------------", this.outData);
		return JSON.stringify(this.outData);
	}

	setViewData(data: string, clear: boolean): void {
		console.log("setViewData------------", data);
		if (data.trim()) {
			this.inData = JSON.parse(data);
		} else {
			this.inData = {name: "sheet1"};
		}

		this.refresh();
	}

	refresh() {
		this.univerElement.empty();
		const container = document.createElement("div");
		container.style.height = "100%";
		container.id = this.getContainerId();
		this.univerElement.appendChild(container);

		this.resizeObserver = new ResizeObserver(() => {
			window.dispatchEvent(new Event("resize"));
			setCtxPos(container);
		}).observe(container);

		this.univerContainer = container;
		if (!this.root) {
			this.root = createRoot(container);
		}
		// const setting = {
		// 	UIContainer: container,
		// 	data: this.inData,
		// 	onChange: (data: any) => {
		// 		this.outData = data;
		// 		this.autoSaveData();
		// 	},
		// }

		this.root.render(this.renderComponent(container));
	}

	clear(): void {}

	async onOpen() {
		this.univerElement = this.contentEl;
	}

	async onClose() {
		this.requestSave();

		if (this.root) {
			this.root.unmount();
		}

		this.contentEl.empty();
	}

	autoSaveData() {
		console.log("begin to auto save data");
		if (this.isSaveingData) {
			return;
		}

		this.isSaveingData = true;
		setTimeout(() => {
			this.requestSave();
			console.log("auto save data");
			this.isSaveingData = false;
		}, 5000);
	}
}

export class UniverDocsView extends UniverBaseView {
	getViewType(): string {
		return VIEW_TYPE_UNIVERDOCS;
	}

	getContainerId(): string {
		return "doc-app";
	}

	getDisplayText(): string {
		return "univer docs view";
	}

	renderComponent(container: HTMLDivElement): React.ReactElement {
		return <UniverDocComponent UIContainer={container} />;
	}
}

export class UniverSheetsView2 extends UniverBaseView {
	getViewType(): string {
		return VIEW_TYPE_UNIVERSHEETS;
	}

	getContainerId(): string {
		return "sheet-app";
	}

	getDisplayText(): string {
		return "univer sheets view";
	}

	renderComponent(container: HTMLDivElement): React.ReactElement {
		return <UniverSheetComponent UIContainer={container} />;
	}
}

export class UniverSheetsView extends TextFileView {
	root: any;
	univerElement: HTMLElement;
	univerContainer: HTMLElement;
	resizeObserver: ResizeObserver | void;
	contianerId: string;
	inData: any;
	outData: any;
	isSaveingData: boolean;

	getViewType(): string {
		return VIEW_TYPE_UNIVERSHEETS;
	}

	getContainerId(): string {
		return "sheet-app";
	}

	getDisplayText(): string {
		return "univer sheets view";
	}

	getViewData(): string {
		console.log('get view data+++++++++++++++')
		if (this.outData) {
			const r = JSON.stringify(this.outData);
			console.log("univer saved!!", r);
			return r;
		} else {
			console.log("univer null saved!!");
			return "";
		}
	}

	setViewData(data: string, clear: boolean): void {
		console.log("setViewData------------", data);
		if (data.trim()) {
			this.inData = JSON.parse(data);
		} else {
			this.inData = [{name: "sheet1"}];
		}

		this.refresh();
	}

	refresh() {
		console.log("refresh---------");
		this.univerElement.empty();
		const container = document.createElement("div");
		container.style.height = "100%";
		container.id = this.getContainerId();
		this.univerElement.appendChild(container);

		this.resizeObserver = new ResizeObserver(() => {
			window.dispatchEvent(new Event("resize"));
			setCtxPos(container);
		}).observe(container);

		this.univerContainer = container;
		if (!this.root) {
			this.root = createRoot(container);
		}
		const setting = {
			UIContainer: container,
			data: this.inData,
			onChange: (data: any) => {
				this.outData = data;
				this.autoSaveData();
			},
		};

		this.root.render(<UniverSheet {...setting} />);
	}

	clear(): void {}

	async onOpen() {
		this.univerElement = this.contentEl;
	}

	async onClose() {
		console.log("onClose");
		this.requestSave();

		if (this.root) {
			this.root.unmount();
		}

		this.contentEl.empty();
	}

	autoSaveData() {
		console.log("begin to auto save data");
		if (this.isSaveingData) {
			return;
		}

		this.isSaveingData = true;
		setTimeout(() => {
			this.requestSave();
			console.log("auto save data");
			this.isSaveingData = false;
		}, 1000);
	}
}
