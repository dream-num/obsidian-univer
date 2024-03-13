import { LocaleType, Univer, LogLevel } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverSheetsZenEditorPlugin } from "@univerjs/sheets-zen-editor";
import {
	UniverRPCMainThreadPlugin,
	IUniverRPCMainThreadConfig,
} from "@univerjs/rpc";
import { UniverFindReplacePlugin } from "@univerjs/find-replace";
import { DEFAULT_WORKBOOK_DATA_DEMO } from "../data/default-workbook-data-demo";
import { useEffect } from "react";

export function UniverSheetComponent({
	UIContainer,
}: {
	UIContainer: HTMLDivElement;
}) {
	useEffect(() => {
		if (UIContainer) {
			const univer = new Univer({
				theme: defaultTheme,
				locale: LocaleType.ZH_CN,
				logLevel: LogLevel.VERBOSE,
			});

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

			// create univer sheet instance
			univer.createUniverSheet(DEFAULT_WORKBOOK_DATA_DEMO);
		} else {
			console.error("UIContainer is not exist");
		}
	}, [UIContainer]);

	return null;
}
