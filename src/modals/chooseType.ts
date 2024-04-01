import type { App } from "obsidian";
import { Modal } from "obsidian";
import { UniverPluginSettings } from "~/types/setting";
import { createNewFile } from "~/utils/createFile";

interface ModalText {
  title: string;
  docBtn: string;
  sheetBtn: string;
  templateDocBtn: string;
  templateSheetBtn: string;
}

export class ChooseTypeModal extends Modal {
  settings: UniverPluginSettings;
  constructor(app: App, settings: UniverPluginSettings) {
    super(app);
    this.settings = settings;
  }

  onOpen(): void {
    const { contentEl } = this;
    this.titleEl.setText(this.getModalText().title);

    const btnContainer = contentEl.createDiv();
    btnContainer.classList.add("univer-modal-btn-container");

    const docBtn = btnContainer.createEl("button", {
      text: this.getModalText().docBtn,
      cls: "univer-mdal-btn",
    });
    const templateDocBtn = btnContainer.createEl("button", {
      text: this.getModalText().templateDocBtn,
      cls: "univer-mdal-btn",
    });

    const sheetBtn = btnContainer.createEl("button", {
      text: this.getModalText().sheetBtn,
      cls: "univer-mdal-btn",
    });
    const templateSheetBtn = btnContainer.createEl("button", {
      text: this.getModalText().templateSheetBtn,
      cls: "univer-mdal-btn",
    });

    docBtn.onclick = () => {
      this.settings.doc = "DEFAULT"
      createNewFile(this.app, "udoc");
      this.close();
    };

    templateDocBtn.onclick = () => {
      this.settings.doc = "TEMPLATE"
      createNewFile(this.app, "udoc");
      this.close();
    };

    sheetBtn.onclick = () => {
      this.settings.sheet = "DEFAULT"
      createNewFile(this.app, "usheet");
      this.close();
    };

    templateSheetBtn.onclick = () => {
      this.settings.sheet = "TEMPLATE"
      createNewFile(this.app, "usheet");
      this.close(); 
    };
  }

  onClose(): void {
    this.contentEl.empty();
  }

  getModalText(): ModalText {
    if (this.settings.language === "EN") {
      return {
        title: "Please choose the type of file you want to create",
        docBtn: "univer-doc",
        templateDocBtn: "univer-doc-template",
        sheetBtn: "univer-sheet",
        templateSheetBtn: "univer-sheet-template",
      };
    } else {
      return {
        title: "请选择您要创建的文件类型",
        docBtn: "univer-文档",
        templateDocBtn: "univer-文档模板",
        sheetBtn: "univer-表格",
        templateSheetBtn: "univer-表格模板",
      };
    }
  }
}
