import { Univer } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter'
import { UniverFindReplacePlugin } from '@univerjs/find-replace'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace'
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor'
import { UniverUIPlugin } from '@univerjs/ui'
import { UniverDataValidationPlugin } from '@univerjs/data-validation'
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation'
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui'
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui'
// import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import type { IUniverUIConfig } from '@univerjs/ui/lib/types/controllers/ui/ui.controller'
import { getLanguage, univerLocales } from '@/utils/common'
import type { UniverPluginSettings } from '@/types/setting'
import { ExchangePlugin } from '@/plugins/ExchangePlugin'

export function sheetInit(
  option: IUniverUIConfig,
  settings: UniverPluginSettings,
) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: getLanguage(settings),
    locales: univerLocales,
  })

  univer.registerPlugin(UniverDocsPlugin, {
    hasScroll: false,
  })
  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverUIPlugin, option)

  univer.registerPlugin(UniverDocsUIPlugin)

  univer.registerPlugin(UniverSheetsPlugin, {
    notExecuteFormula: false,
  })
  univer.registerPlugin(UniverSheetsUIPlugin)

  // sheet feature plugins
  univer.registerPlugin(UniverSheetsNumfmtPlugin)
  univer.registerPlugin(UniverSheetsZenEditorPlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin, {
    notExecuteFormula: false,
  })
  univer.registerPlugin(UniverSheetsFormulaPlugin)

  // // find replace
  univer.registerPlugin(UniverFindReplacePlugin)

  // data validation
  univer.registerPlugin(UniverDataValidationPlugin)
  univer.registerPlugin(UniverSheetsDataValidationPlugin)
  univer.registerPlugin(UniverSheetsFindReplacePlugin)

  // filter
  univer.registerPlugin(UniverSheetsFilterPlugin)
  univer.registerPlugin(ExchangePlugin)

  univer.registerPlugin(UniverSheetsHyperLinkUIPlugin)

  univer.registerPlugin(UniverSheetsDrawingUIPlugin)

  // univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)

  return univer
}
