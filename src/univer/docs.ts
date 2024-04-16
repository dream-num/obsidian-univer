import { LocaleType, Univer } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverUIPlugin } from '@univerjs/ui'
import type { IUniverUIConfig } from '@univerjs/ui/lib/types/ui-plugin'
import { legacyLocales } from '@/utils/common'
import type { UniverPluginSettings } from '@/types/setting'

export function docInit(
  option: IUniverUIConfig,
  settings: UniverPluginSettings,
) {
  const univer = new Univer({
    theme: defaultTheme,
    locale: settings.language === 'EN' ? LocaleType.EN_US : LocaleType.ZH_CN,
    locales: legacyLocales,
  })

  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin)
  univer.registerPlugin(UniverUIPlugin, option)
  univer.registerPlugin(UniverDocsPlugin)
  univer.registerPlugin(UniverDocsUIPlugin, {
    container: 'univerdoc',
    layout: {
      docContainerConfig: {
        innerLeft: false,
      },
    },
  })

  return univer
}
