import {
  Plugin,
  UniverInstanceType,
} from '@univerjs/core'
import type { Dependency } from '@wendellhu/redi'
import { Inject, Injector } from '@wendellhu/redi'
import { ExchangeController } from './controllers/exchange.controller'
import { ExchangeService, IExchangeService } from './services/exchange.service'

export class ExchangePlugin extends Plugin {
  static override type = UniverInstanceType.SHEET
  static override pluginName = 'exchange-client'
  constructor(
        @Inject(Injector) override readonly _injector: Injector,
  ) {
    super()
  }

  initialize() {
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
