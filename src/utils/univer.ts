import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import "@univerjs/sheets-numfmt/lib/index.css";
import { LocaleType, Univer } from "@univerjs/core";
import { enUS as UniverDesignEnUS, defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import {
  enUS as UniverDocsUIEnUS,
  UniverDocsUIPlugin,
} from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin, enUS as UniverSheetsEnUS } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import {
  UniverSheetsUIPlugin,
  enUS as UniverSheetsUIEnUS,
} from "@univerjs/sheets-ui";
import { enUS as UniverUiEnUS, UniverUIPlugin } from "@univerjs/ui";
import type { IUniverUIConfig } from "@univerjs/ui/lib/types/ui-plugin";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import { UniverFindReplacePlugin } from "@univerjs/find-replace";
import { UniverSheetsFindReplacePlugin } from "@univerjs/sheets-find-replace";
import { UniverPluginSettings } from "~/types/setting";

const locales = {
  [LocaleType.EN_US]: {
    ...UniverSheetsEnUS,
    ...UniverDocsUIEnUS,
    ...UniverSheetsUIEnUS,
    ...UniverUiEnUS,
    ...UniverDesignEnUS,
  },
};

export function sheetInit(option: IUniverUIConfig, settings: UniverPluginSettings) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: settings.language === "EN" ? LocaleType.EN_US : LocaleType.ZH_CN,
    locales,
  });

  univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
  });
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, option);

  univer.registerPlugin(UniverDocsUIPlugin);

  univer.registerPlugin(UniverSheetsPlugin, {
    notExecuteFormula: true,
  });
  univer.registerPlugin(UniverSheetsUIPlugin);

  // sheet feature plugins
  univer.registerPlugin(UniverSheetsNumfmtPlugin);
  univer.registerPlugin(UniverSheetsZenEditorPlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin, {
    notExecuteFormula: true,
  });
  univer.registerPlugin(UniverSheetsFormulaPlugin);

  // find replace
  univer.registerPlugin(UniverFindReplacePlugin);
  univer.registerPlugin(UniverSheetsFindReplacePlugin);
  
  return univer;
}

export function docInit(option: IUniverUIConfig, settings: UniverPluginSettings) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: settings.language === "EN" ? LocaleType.EN_US : LocaleType.ZH_CN,
    locales,
  });

  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, option);
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin, {
    container: "univerdoc",
    layout: {
      docContainerConfig: {
        innerLeft: false,
      },
    },
  });

  return univer;
}
