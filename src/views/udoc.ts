import type { DocumentDataModel, IDocumentData, Univer } from "@univerjs/core";
import { Tools } from "@univerjs/core";
import { FUniver } from "@univerjs/facade";
import type { WorkspaceLeaf } from "obsidian";
import { TextFileView } from "obsidian";
import { UniverPluginSettings } from "~/types/setting";
import { docInit } from "~/univer/docs";
import { DEFAULT_DOCUMENT_DATA_EN } from '../data/default-document-data-en';
import { DEFAULT_DOCUMENT_DATA_CN } from "~/data/default-document-data-cn";

export const Type = "univer-doc";

export class UDocView extends TextFileView {
  documentData: DocumentDataModel;
  univer: Univer;
  FUniver: FUniver;
  rootContainer: HTMLDivElement;
  settings: UniverPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: UniverPluginSettings) {
    super(leaf);
    this.settings = settings;
  }

  getViewData(): string {
    return JSON.stringify(Tools.deepClone(this.documentData.getSnapshot()));
  }

  setViewData(data: string): void {
    this.univer?.dispose();

    const option  = {
      container: this.rootContainer,
      header: true,
    }
    this.univer = docInit(option, this.settings);
    this.FUniver = FUniver.newAPI(this.univer);

    let docData: DocumentDataModel | object;

    try {
      docData = JSON.parse(data);
    } catch {
      docData = this.getDefaultData();
    }

    setTimeout(() => {
      this.documentData = this.univer.createUniverDoc(docData);
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

  getDefaultData(): IDocumentData {
    if(this.settings.doc === "TEMPLATE" && this.settings.language === "EN") {
      return DEFAULT_DOCUMENT_DATA_EN;
    } else if(this.settings.doc === "TEMPLATE" && this.settings.language === "ZH") {
      return DEFAULT_DOCUMENT_DATA_CN;
    } else {
      return {} as IDocumentData;
    }
  }
}
