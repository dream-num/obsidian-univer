import "./style/univer.css";
import { defu } from "defu";
import { Plugin } from "obsidian";
import { Type as USheetType, USheetView } from "./views/usheet";
import { Type as UDocType, UDocView } from "./views/udoc";
import { ChooseTypeModal } from "./modals/chooseType";
import type { SettingType } from "~/types/setting";

export type ViewType = typeof USheetType | typeof UDocType;


export default class UniverPlugin extends Plugin {
  settings: SettingType;

  async onload() {

    // ribbon icon & the class
    this.addRibbonIcon("cable", "Univer", () => {
      const modal = new ChooseTypeModal(this.app);
      modal.open();
    });

    // register view
    this.registerView(USheetType, (leaf) => new USheetView(leaf));

    this.registerView(UDocType, (leaf) => new UDocView(leaf));

    this.registerExtensions(["usheet"], USheetType);
    this.registerExtensions(["udoc"], UDocType);
  }

  onunload() {}
}
