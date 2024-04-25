import {
  LocaleService,

  Plugin,
  UniverInstanceType,
} from '@univerjs/core'

import type { Dependency } from '@wendellhu/redi'
import { Inject, Injector } from '@wendellhu/redi'
import { ExchangeController } from './controllers/exchange.controller'
import { ExchangeService, IExchangeService } from './services/exchange.service'
import zhCN from './locale/zh-CN'
import enUS from './locale/en-US'

export class ExchangePlugin extends Plugin {
  static override type = UniverInstanceType.SHEET
  static override pluginName = 'exchange-client'
  constructor(
        @Inject(Injector) override readonly _injector: Injector,
        @Inject(LocaleService) private readonly _localeService: LocaleService,
  ) {
    super()
  }

  initialize() {
    this._localeService.load({
      zhCN,
      enUS,
    })

    const dependencies: Dependency[] = [
      [ExchangeController],
      [IExchangeService, { useClass: ExchangeService }],
    ] as Dependency[]

    dependencies.forEach(dependency => this._injector.add(dependency))
  }

  override onReady(): void {
    this.initialize()
  }
}
