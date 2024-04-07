// import { zhCN, enUS } from "univer:locales";
import { LocaleType } from '@univerjs/core'

import { enUS as UniverDesignEnUS } from '@univerjs/design'
import { enUS as UniverSheetsEnUS } from '@univerjs/sheets'
import { enUS as UniverSheetsFormulaEnUS } from '@univerjs/sheets-formula'
import { enUS as UniverSheetsDataValidationEnUS } from '@univerjs/sheets-data-validation';
import { enUS as UniverSheetsConditionalFormattingUIEnUS } from '@univerjs/sheets-conditional-formatting-ui';
import { enUS as UniverSheetsUIEnUS } from '@univerjs/sheets-ui'
import { enUS as UniverUiEnUS } from '@univerjs/ui'
import { enUS as UniverDocsUIEnUS } from '@univerjs/docs-ui'

// export const locales = {
//   [LocaleType.ZH_CN]: zhCN,
//   [LocaleType.EN_US]: enUS,
// };

export const legacyLocales = {
  [LocaleType.EN_US]: {
    ...UniverSheetsEnUS,
    ...UniverDocsUIEnUS,
    ...UniverSheetsUIEnUS,
    ...UniverSheetsFormulaEnUS,
    ...UniverSheetsDataValidationEnUS,
    ...UniverSheetsConditionalFormattingUIEnUS,
    ...UniverUiEnUS,
    ...UniverDesignEnUS,
  },
}
