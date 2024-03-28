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

export const Type = "univer-test";

export class UTestView extends TextFileView {
  rootContainer: HTMLDivElement;
  workbook: object;
  sheetData: Record<string, string> = {};

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewData(): string {
    console.log("getViewData++++++++++", this.workbook);
    return JSON.stringify(this.workbook);
  }

  setViewData(data: string, _: boolean): void {
    console.log("setViewData++++++++++", this.workbook);
    this.domInit();

    let sheetData: object;
    try {
      sheetData = JSON.parse(data);
    } catch (err) {
      sheetData = {};
    }
    setTimeout(() => {
      console.log("sheetData--------------", sheetData);
      console.log("workbook--------------", this.workbook);
      this.workbook = sheetData;
      this.renderSheet(sheetData);
    }, 0);
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

  renderSheet(sheetData: object) {
    this.rootContainer.empty()
    this.createInputForm();

    const table = document.createElement("table");
    Object.entries(sheetData).forEach(([key, value]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = key;
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(th);
      tr.appendChild(td);
      table.appendChild(tr);
    });
    this.rootContainer.appendChild(table);
  }

  createInputForm() {
    const form = document.createElement("form");
    const inputKey = document.createElement("input");
    inputKey.setAttribute("placeholder", "Key");
    const inputValue = document.createElement("input");
    inputValue.setAttribute("placeholder", "Value");
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    form.appendChild(inputKey);
    form.appendChild(inputValue);
    form.appendChild(submitButton);

    this.rootContainer.appendChild(form);

    form.onsubmit = (e) => {
      e.preventDefault();
      const key = inputKey.value.trim();
      const value = inputValue.value.trim();
      if (key && value) {
        this.sheetData[key] = value; // 更新sheetData
        this.renderSheet(this.sheetData); // 重新渲染表格
        // 清空输入
        inputKey.value = '';
        inputValue.value = '';
      }
    };
  }

  async onClose() {
    console.log("onClose++++++++++", this.workbook);
    this.requestSave();
    this.contentEl.empty();
    console.log("onClose-------------", this.workbook, this.contentEl);
  }
}
