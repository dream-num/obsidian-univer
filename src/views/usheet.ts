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
import { DEFAULT_WORKBOOK_DATA_DEMO as SHEET_EN } from "../data/default-workbook-data-demo-EN";
import { DEFAULT_WORKBOOK_DATA_DEMO as SHEET_CN } from "../data/default-workbook-data-demo-CN";

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
    return JSON.stringify(this.workbook.save());
  }

  setViewData(data: string, _: boolean): void {
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
    let sheetData: IWorkbookData;
    try {
      sheetData = JSON.parse(data);
    } catch (err) {
      sheetData = this.getDefaultData();
    }
    setTimeout(() => {
      this.workbook = this.univer.createUniverSheet(sheetData);

      this.FUniver.onCommandExecuted(() => {
        this.requestSave();
      });
    }, 0);
    
  }

  getViewType() {
    return Type;
  }

  clear(): void {}

  async onOpen() {
  }

  domInit() {
    this.contentEl.empty();
    this.rootContainer = this.contentEl.createDiv();
    this.rootContainer.id = "usheet-app";
    this.rootContainer.classList.add("uproduct-container");
  }

  async onClose() {
    this.requestSave();
    this.univer?.dispose();
    this.workbook?.dispose();
    this.contentEl.empty();
  }

  getDefaultData(): IWorkbookData {
    if(this.settings.doc === "TEMPLATE" && this.settings.language === "EN") {
      return SHEET_EN;
    } else if(this.settings.doc === "TEMPLATE" && this.settings.language === "ZH") {
      return SHEET_CN;
    } else {
      return {} as IWorkbookData;
    }
  }
}
