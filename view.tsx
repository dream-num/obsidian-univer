/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextFileView } from "obsidian";
import React from "react";
import { createRoot } from "react-dom/client";
import { UniverDocComponent } from "./docs/main";
import { UniverSheetComponent } from "./sheets/main";

import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import "@univerjs/sheets-numfmt/lib/index.css";

export const VIEW_TYPE_UNIVERDOCS = "univer-doc-view";
export const VIEW_TYPE_UNIVERSHEETS = "univer-sheet-view";

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

	abstract getViewType(): string;
	abstract getContainerId(): string;
	abstract getDisplayText(): string;
	abstract renderComponent(container: HTMLElement): React.ReactElement;

	getViewData(): string {
		console.log("getViewData", this.outData);
		return JSON.stringify(this.outData);
	}

	setViewData(data: string, clear: boolean): void {
		if (data.trim()) {
			this.inData = JSON.parse(data);
		} else {
			this.inData = {};
		}
		console.log("setViewData", this.inData);

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
		this.root.render(this.renderComponent(container));
	}

	clear(): void {
	}

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

export class UniverSheetsView extends UniverBaseView {
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
