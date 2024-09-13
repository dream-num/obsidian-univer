import { Disposable, ICommandService, LifecycleStages, OnLifecycle } from '@univerjs/core'
import { IMenuManagerService, RibbonStartGroup } from '@univerjs/ui'
import { ExchangeClientDownloadJsonOperation, ExchangeClientUploadJsonOperation } from '../commands/exchange.operation'
import { EXCHANGE_OPERATION_ID, ExchangeDownloadJsonMenuItemFactory, ExchangeUploadJsonMenuItemFactory } from './menu'

@OnLifecycle(LifecycleStages.Steady, ExchangeController)
export class ExchangeController extends Disposable {
  constructor(
    @ICommandService private readonly _commandService: ICommandService,
    @IMenuManagerService private readonly _menuManagerService: IMenuManagerService,
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

  private _initMenus() {
    this._menuManagerService.mergeMenu({
      [RibbonStartGroup.OTHERS]: {
        [EXCHANGE_OPERATION_ID]: {
          order: 12,
          [ExchangeClientUploadJsonOperation.id]: {
            order: 0,
            menuItemFactory: ExchangeUploadJsonMenuItemFactory,
          },
          [ExchangeClientDownloadJsonOperation.id]: {
            order: 1,
            menuItemFactory: ExchangeDownloadJsonMenuItemFactory,
          },
        },
      },
    })
  }
}
