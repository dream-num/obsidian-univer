/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Nullable } from '@univerjs/core'
import { Univer, UserManagerService } from '@univerjs/core'

import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'

import { defaultTheme } from '@univerjs/design'
import { UniverUIPlugin } from '@univerjs/ui'

import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverSheetsPlugin } from '@univerjs/sheets'
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui'

import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui'

import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui'

import type { IThreadCommentMentionDataSource } from '@univerjs/thread-comment-ui'
import { IThreadCommentMentionDataService, UniverThreadCommentUIPlugin } from '@univerjs/thread-comment-ui'
import { UniverSheetsThreadCommentPlugin } from '@univerjs/sheets-thread-comment'

import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula'
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt'
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation'
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor'
import { UniverSheetsSortUIPlugin } from '@univerjs/sheets-sort-ui'
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui'
import type { IUniverUIConfig } from '@univerjs/ui/lib/types/controllers/ui/ui.controller'
import { getLanguage, univerLocales } from '@/utils/common'
import type { UniverPluginSettings } from '@/types/setting'
import { ExchangePlugin } from '@/plugins/ExchangePlugin'

export function sheetInit(option: IUniverUIConfig, settings: UniverPluginSettings) {
// univer
  const univer = new Univer({
    theme: defaultTheme,
    locale: getLanguage(settings),
    locales: univerLocales,
  })

  univer.registerPlugin(UniverDocsPlugin, { hasScroll: false })
  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverUIPlugin, option)
  univer.registerPlugin(UniverDocsUIPlugin)
  univer.registerPlugin(UniverSheetsPlugin, { notExecuteFormula: false })
  univer.registerPlugin(UniverSheetsUIPlugin)

  // sheet feature plugins
  univer.registerPlugin(UniverSheetsNumfmtPlugin)
  univer.registerPlugin(UniverSheetsZenEditorPlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin, { notExecuteFormula: false })
  univer.registerPlugin(UniverSheetsFormulaPlugin, { notExecuteFormula: false })
  // hyperlink
  univer.registerPlugin(UniverSheetsHyperLinkUIPlugin)
  // data validation
  univer.registerPlugin(UniverSheetsDataValidationPlugin)

  // Exchange
  univer.registerPlugin(ExchangePlugin)

  // sort
  univer.registerPlugin(UniverSheetsSortUIPlugin)
  // condition formatting
  univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin)
  // drawing
  univer.registerPlugin(UniverSheetsDrawingUIPlugin)
  // univer.registerPlugin(UniverDocsDrawingUIPlugin);

  const mockUser = {
    userID: 'Owner_qxVnhPbQ',
    name: 'Owner',
    avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==',
    anonymous: false,
    canBindAnonymous: false,
  }

  class CustomMentionDataService implements IThreadCommentMentionDataService {
    dataSource: Nullable<IThreadCommentMentionDataSource>
    trigger: string = '@'

    async getMentions() {
      return [
        // {
        //   id: mockUser.userID,
        //   label: mockUser.name,
        //   type: 'user',
        //   icon: mockUser.avatar,
        // },
        // {
        //   id: '2',
        //   label: 'User2',
        //   type: 'user',
        //   icon: mockUser.avatar,
        // },
      ]
    }
  }

  // comment
  univer.registerPlugin(UniverThreadCommentUIPlugin, { overrides: [[IThreadCommentMentionDataService, { useClass: CustomMentionDataService }]] })
  univer.registerPlugin(UniverSheetsThreadCommentPlugin)

  const injector = univer.__getInjector()
  const userManagerService = injector.get(UserManagerService)
  userManagerService.setCurrentUser(mockUser)

  return univer
}
