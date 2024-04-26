import { LocaleType, Univer } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter'
import { UniverFindReplacePlugin } from '@univerjs/find-replace'
// import type { IUniverRPCMainThreadConfig } from '@univerjs/rpc'
// import { UniverRPCMainThreadPlugin } from '@univerjs/rpc'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsFindReplacePlugin } from '@univerjs/sheets-find-replace'
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor'
import { UniverUIPlugin } from '@univerjs/ui'
import { UniverDataValidationPlugin } from '@univerjs/data-validation'
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation'
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'
import type { IUniverUIConfig } from '@univerjs/ui/lib/types/ui-plugin'
import { legacyLocales } from '@/utils/common'
import type { UniverPluginSettings } from '@/types/setting'
import { ExchangePlugin } from '@/plugins/ExchangePlugin'

export function sheetInit(
  option: IUniverUIConfig,
  settings: UniverPluginSettings,
) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: settings.language === 'EN' ? LocaleType.EN_US : LocaleType.ZH_CN,
    locales: legacyLocales,
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
  // TODO: make the webworker useable
  // univer.registerPlugin(UniverRPCMainThreadPlugin, {
  //   workerURL: workerScriptURL,
  // } as IUniverRPCMainThreadConfig)

  // find replace
  univer.registerPlugin(UniverFindReplacePlugin)

  // data validation
  univer.registerPlugin(UniverDataValidationPlugin)
  univer.registerPlugin(UniverSheetsDataValidationPlugin)
  univer.registerPlugin(UniverSheetsFindReplacePlugin)

  // filter
  univer.registerPlugin(UniverSheetsFilterPlugin)
  univer.registerPlugin(ExchangePlugin)

  univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)

  window.univer = univer

  return univer
}
