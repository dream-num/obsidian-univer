import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import { LocaleType, Univer, LogLevel } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverSheetsPlugin } from "@univerjs/sheets";
// import { UniverSheetsFindPlugin } from '@univerjs/sheets-find-replace';
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import {
	UniverRPCMainThreadPlugin,
	IUniverRPCMainThreadConfig,
} from "@univerjs/rpc";
import { UniverFindReplacePlugin } from "@univerjs/find-replace";
import { DEFAULT_DOCUMENT_DATA_CN } from "./data/default-document-data-cn";
import { DEFAULT_WORKBOOK_DATA_DEMO } from "./data/default-workbook-data-demo";

export async function initialUniverDocs() {

	const univer = new Univer({
		theme: defaultTheme,
		locale: LocaleType.ZH_CN,
	});

	univer.registerPlugin(UniverRenderEnginePlugin);
	univer.registerPlugin(UniverFormulaEnginePlugin);

	univer.registerPlugin(UniverUIPlugin, {
		container: "doc-app",
		header: true,
		toolbar: true,
	});

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

	univer.createUniverDoc(DEFAULT_DOCUMENT_DATA_CN);
}

export function initialUniverSheets() {
	const univer = new Univer({
		theme: defaultTheme,
		locale: LocaleType.ZH_CN,
		logLevel: LogLevel.VERBOSE,
	});

	// core plugins
	univer.registerPlugin(UniverDocsPlugin, {
		hasScroll: false,
	});
	univer.registerPlugin(UniverRenderEnginePlugin);
	univer.registerPlugin(UniverUIPlugin, {
		container: "sheet-app",
		header: true,
		toolbar: true,
		footer: true,
	});

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
	univer.registerPlugin(UniverRPCMainThreadPlugin, {
		workerURL: "./worker.js",
	} as IUniverRPCMainThreadConfig);

	// find replace
	univer.registerPlugin(UniverFindReplacePlugin);
	// univer.registerPlugin(UniverSheetsFindPlugin);

	// create univer sheet instance
	univer.createUniverSheet(DEFAULT_WORKBOOK_DATA_DEMO);
}
