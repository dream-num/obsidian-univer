import { LocaleType, Univer } from "@univerjs/core";
import { defaultTheme } from '@univerjs/design'
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { DEFAULT_DOCUMENT_DATA_CN } from './data/default-document-data-cn';

// type FileType = 'docs' | 'sheets'

export class UniverService {
	static initialize(containerId: string) {
		const univer = new Univer({
			theme: defaultTheme,
			locale: LocaleType.ZH_CN
		})


		univer.registerPlugin(UniverRenderEnginePlugin)
		univer.registerPlugin(UniverFormulaEnginePlugin)

		univer.registerPlugin(UniverUIPlugin, {
			container: 'app',
			header: true,
			toolbar: true
		})

		univer.registerPlugin(UniverDocsPlugin, {
			standalone: true
		})
		univer.registerPlugin(UniverDocsUIPlugin, {
			container: 'univerdoc',
			layout: {
				docContainerConfig: {
					innerLeft: false,
				},
			},
		});

		univer.createUniverDoc(DEFAULT_DOCUMENT_DATA_CN)

	}

	
}
// type function for docs & sheets
// function univerNeeds(univer: Univer, type: FileType): Univer {
// 	if (type === 'docs') {
// 		univer.registerPlugin(UniverFormulaEnginePlugin)

// 		univer.registerPlugin(UniverUIPlugin, {
// 			container: 'app',
// 			header: true,
// 			toolbar: true
// 		})

// 		univer.registerPlugin(UniverDocsPlugin, {
// 			standalone: true
// 		})
// 		univer.registerPlugin(UniverDocsUIPlugin, {
// 			container: 'univerdoc',
// 			layout: {
// 				docContainerConfig: {
// 					innerLeft: false,
// 				},
// 			},
// 		});

// 		univer.createUniverDoc(DEFAULT_DOCUMENT_DATA_CN)
// 	}

// 	// if(type === 'sheets') {
// 	// 	return 
// 	// }
// }
