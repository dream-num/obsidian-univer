import { Disposable, ICommandService, LifecycleStages, OnLifecycle } from '@univerjs/core'
import type { IMenuItemFactory } from '@univerjs/ui'
import { IMenuService } from '@univerjs/ui'
import { Inject, Injector } from '@wendellhu/redi'
import { ExchangeClientDownloadJsonOperation, ExchangeClientUploadJsonOperation } from '../commands/exchange.operation'
import { ExchangeDownloadJsonMenuItemFactory } from './menu'

@OnLifecycle(LifecycleStages.Steady, ExchangeController)
export class ExchangeController extends Disposable {
  constructor(
    @Inject(Injector) private readonly _injector: Injector,
    @ICommandService private readonly _commandService: ICommandService,
    @IMenuService private readonly _menuService: IMenuService,
  ) {
    super()
    this._initCommands()
    this._initMenus()
  }

  private _initCommands() {
    [
      ExchangeClientUploadJsonOperation,
      ExchangeClientDownloadJsonOperation,
    ].forEach((command) => {
      this.disposeWithMe(this._commandService.registerCommand(command))
    })
  }

  // TODO: release the menu item
  private _initMenus() {
    ([
      // ExchangeMenuItemFactory,
      // ExchangeUploadJsonMenuItemFactory,
      ExchangeDownloadJsonMenuItemFactory,
    ] as IMenuItemFactory[]).forEach((factory) => {
      this.disposeWithMe(this._menuService.addMenuItem(this._injector.invoke(factory)))
    })
  }
}
