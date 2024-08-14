import {
  LocaleService,
  Plugin,
  UniverInstanceType,
} from '@univerjs/core'

import type { Dependency } from '@wendellhu/redi'
import { Inject, Injector } from '@wendellhu/redi'
import { ExchangeController } from './controllers/exchange.controller'
import { ExchangeService, IExchangeService } from './services/exchange.service'
import { enUS, ruRU, viVN, zhCN, zhTW } from './locale/index'

export class ExchangePlugin extends Plugin {
  static override type = UniverInstanceType.UNIVER_SHEET
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
      ruRU,
      viVN,
      zhTW,
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
