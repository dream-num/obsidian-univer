import { IWorkbookData, Univer, Workbook } from "@univerjs/core";
import { FUniver } from "@univerjs/facade";
import { TextFileView, WorkspaceLeaf } from "obsidian";
import { docInit } from "~/utils/univer";
import { DEFAULT_DOCUMENT_DATA_CN } from "../data/default-document-data-cn";

export const Type = "univer-doc";

export class UDocView extends TextFileView {
  workbook: any;
  univer: Univer;
  FUniver: FUniver;
  rootContainer: HTMLDivElement;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewData(): string {
    return JSON.stringify(this.workbook.save());
  }

  setViewData(data: string, clear: boolean): void {
    if (this.univer) this.univer.dispose();

    this.univer = docInit({
      container: "udoc-app",
      header: true,
      toolbar: true,
    });
    this.FUniver = FUniver.newAPI(this.univer);

    let docData: IWorkbookData | object;

    try {
      docData = JSON.parse(data);
    } catch {
      docData = DEFAULT_DOCUMENT_DATA_CN;
    }

    setTimeout(() => {
      this.workbook = this.univer.createUniverDoc(docData);
    }, 0);

    this.FUniver.onCommandExecuted(() => {
      this.requestSave();
    });
  }

  getViewType() {
    return Type;
  }

  clear(): void {}

  async onOpen() {
    this.rootContainer = this.contentEl as HTMLDivElement;
    this.rootContainer.id = "udoc-app";
    this.rootContainer.classList.add("uproduct-container");
  }

  async onClose() {
    this.requestSave();

    this.univer.dispose();
  }
}
