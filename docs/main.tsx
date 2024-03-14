import { LocaleType, Univer } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { DEFAULT_DOCUMENT_DATA_CN } from "../data/default-document-data-cn";
import { useEffect } from "react";

export function UniverDocComponent({
	UIContainer,
}: {
	UIContainer: HTMLDivElement;
}) {
	useEffect(() => {
		if (UIContainer) {
			const univer = new Univer({
				theme: defaultTheme,
				locale: LocaleType.ZH_CN,
			});

			univer.registerPlugin(UniverRenderEnginePlugin);
			univer.registerPlugin(UniverFormulaEnginePlugin);

			univer.registerPlugin(UniverUIPlugin, {
				container: UIContainer,
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

			return () => {
				univer.dispose();
			}
		} else {
			console.error("UIContainer is not exist");
		}
	}, [UIContainer]);

	return null;
}
