import {
  Plugin,
} from '@univerjs/core'
import type { Dependency } from '@wendellhu/redi'
import { Inject, Injector } from '@wendellhu/redi'
import { ExchangeController } from './controllers/exchange.controller'
import { ExchangeService, IExchangeService } from './services/exchange.service'

export class ExchangePlugin extends Plugin {
  constructor(
        @Inject(Injector) override readonly _injector: Injector,
  ) {
    super('exchange-client')
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
