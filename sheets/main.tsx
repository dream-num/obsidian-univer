import { LocaleType, LogLevel, Univer } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsNumfmtPlugin } from "@univerjs/sheets-numfmt";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { useEffect } from "react";

export function UniverSheetComponent({
	UIContainer,
}: {
	UIContainer: HTMLDivElement;
}) {
	useEffect(() => {
		if (UIContainer) {
			// univer
			const univer = new Univer({
				theme: defaultTheme,
				locale: LocaleType.ZH_CN,
				logLevel: LogLevel.VERBOSE,
			});

			// core plugins
			univer.registerPlugin(UniverDocsPlugin, {
				hasScroll: false,
			});
			univer.registerPlugin(UniverDocsUIPlugin);
			univer.registerPlugin(UniverRenderEnginePlugin);
			univer.registerPlugin(UniverUIPlugin, {
				container: "sheet-app",
				header: true,
				toolbar: true,
				footer: true,
			});
			univer.registerPlugin(UniverSheetsPlugin);
			univer.registerPlugin(UniverSheetsUIPlugin);

			// sheet feature plugins
			univer.registerPlugin(UniverSheetsNumfmtPlugin);
			univer.registerPlugin(UniverFormulaEnginePlugin);
			univer.registerPlugin(UniverSheetsFormulaPlugin);

			// create univer sheet instance
			univer.createUniverSheet({});
			return () => {
				univer.dispose();
			}
		} else {
			console.error("UIContainer is not exist");
		}
	}, [UIContainer]);

	return null;
}
