import { Univer, Workbook } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { useEffect, useRef } from "react";
import { FUniver } from "@univerjs/facade";

const UniverSheet = ({
	UIContainer,
	data,
	onChange,
}: {
	UIContainer: HTMLDivElement;
	data: any;
	onChange: (data: any) => void;
}) => {
	const univerRef = useRef<Univer | null>(null);
	const workbookRef = useRef<Workbook | null>(null);
	const univerAPI = useRef<FUniver | null>(null);

	const init = (data = {}) => {
		const univer = new Univer({
			theme: defaultTheme,
		});
		univerRef.current = univer;
		univerAPI.current = FUniver.newAPI(univer);

		// core plugins
		univer.registerPlugin(UniverRenderEnginePlugin);
		univer.registerPlugin(UniverFormulaEnginePlugin);
		univer.registerPlugin(UniverUIPlugin, {
			container: UIContainer,
			header: true,
			toolbar: true,
			footer: true,
		});

		// doc plugins
		univer.registerPlugin(UniverDocsPlugin, {
			hasScroll: false,
		});
		univer.registerPlugin(UniverDocsUIPlugin);

		// sheet plugins
		univer.registerPlugin(UniverSheetsPlugin);
		univer.registerPlugin(UniverSheetsUIPlugin);
		univer.registerPlugin(UniverSheetsFormulaPlugin);
		// create workbook instance
		workbookRef.current = univer.createUniverSheet(data);
	};

	const saveData = () => {
		if (!workbookRef.current) {
			throw new Error("Workbook is not initialized");
		}
		const saveData = workbookRef.current.save();
		onChange(saveData);
	};

	const destroyUniver = () => {
		console.log("销毁univer");
		univerRef.current?.dispose();
		univerRef.current = null;
		workbookRef.current = null;
	};

	useEffect(() => {
		console.log("init UIContainer");
		init(data);
		return () => {
			destroyUniver();
		};
	}, [UIContainer, data]);

	univerAPI.current?.onCommandExecuted((command) => {
		console.log("command executed", command);
		saveData();
	});

	return null;
};

export default UniverSheet;
