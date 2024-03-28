import {
  Tools,
  type IWorkbookData,
  type Univer,
  type Workbook,
} from "@univerjs/core";
import type { WorkspaceLeaf } from "obsidian";
import { TextFileView } from "obsidian";
import { FUniver } from "@univerjs/facade";
import { sheetInit } from "~/utils/univer";

export const Type = "univer-sheet";

export class USheetView extends TextFileView {
  rootContainer: HTMLDivElement;
  univer: Univer;
  workbook: Workbook;
  FUniver: FUniver;
  sheetData: IWorkbookData | object;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewData(): string {
    console.log("getViewData++++++++++", this.workbook);
    return JSON.stringify(this.workbook.save());
  }

  setViewData(data: string, _: boolean): void {
    console.log("setViewData++++++++++", this.workbook);
    this.domInit();
    this.univer?.dispose();
    this.workbook?.dispose();

    this.univer = sheetInit({
      container: this.rootContainer,
      header: true,
      footer: true,
    });
    this.FUniver = FUniver.newAPI(this.univer);
    let sheetData: IWorkbookData | object;
    try {
      sheetData = JSON.parse(data);
    } catch (err) {
      sheetData = Tools.deepClone({});
    }
    setTimeout(() => {
      console.log('univer--------------', this.univer)
      console.log('sheetData--------------', sheetData)
      console.log('workbook--------------', this.workbook)
      this.workbook = this.univer.createUniverSheet(sheetData);
      this.getViewData();
    }, 0);

    // this.FUniver.onCommandExecuted(() => {
    //   this.requestSave();
    // });
  }

  getViewType() {
    return Type;
  }

  clear(): void {}

  async onOpen() {
    console.log('onOpen++++++++', this.workbook)

  }

  domInit() {
    this.contentEl.empty();
    this.rootContainer = this.contentEl.createDiv();
    this.rootContainer.id = "usheet-app";
    this.rootContainer.classList.add("uproduct-container");
  }

  async onClose() {
    console.log("onClose++++++++++", this.univer, this.workbook);
    this.requestSave();
    this.univer?.dispose();
    this.workbook?.dispose();
    this.contentEl.empty();
    console.log("onClose-------------", this.univer, this.workbook, this.contentEl);
  }
}
