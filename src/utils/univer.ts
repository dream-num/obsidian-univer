import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import { LocaleType, Univer } from "@univerjs/core";
import { defaultTheme, enUS as UniverDesignEnUS } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import {
  UniverDocsUIPlugin,
  enUS as UniverDocsUIEnUS,
} from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin, enUS as UniverUIEnUS } from "@univerjs/ui";
import type { IUniverUIConfig } from "@univerjs/ui/lib/types/ui-plugin";

const locales = {
  [LocaleType.EN_US]: {
    ...UniverDocsUIEnUS,
    ...UniverUIEnUS,
    ...UniverDesignEnUS,
  },
};

export function sheetInit(option: IUniverUIConfig) {
  const univer = new Univer({
    theme: defaultTheme,
  });
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, option);

  // doc plugins
  univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
  });
  univer.registerPlugin(UniverDocsUIPlugin);

  // sheet plugins
  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  return univer;
}

export function docInit(option: IUniverUIConfig) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.ZH_CN,
    locales,
  });

  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, option);
  univer.registerPlugin(UniverDocsPlugin, {
    standalone: true,
  });
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
