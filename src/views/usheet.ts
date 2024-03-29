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
import { UniverPluginSettings } from "~/types/setting";

export const Type = "univer-sheet";

export class USheetView extends TextFileView {
  rootContainer: HTMLDivElement;
  univer: Univer;
  workbook: Workbook;
  FUniver: FUniver;
  sheetData: IWorkbookData | object;
  settings: UniverPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf);
    this.settings = settings;
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

    const options = {
      container: this.rootContainer,
      header: true,
      footer: true,
    };
    this.univer = sheetInit(options, this.settings);
    this.FUniver = FUniver.newAPI(this.univer);
    let sheetData: IWorkbookData | object;
    try {
      sheetData = Tools.deepClone(JSON.parse(data));
    } catch (err) {
      sheetData = Tools.deepClone({});
    }
    setTimeout(() => {
      this.workbook = this.univer.createUniverSheet(sheetData);
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
    console.log("onOpen++++++++", this.workbook);
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
  }
}
