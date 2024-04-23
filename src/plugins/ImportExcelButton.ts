import {
  CommandType,
  ICommandService,
  IUniverInstanceService,
  Plugin,
} from '@univerjs/core'
import {
  ComponentManager,
  IMenuService,
  MenuGroup,
  MenuItemType,
  MenuPosition,
} from '@univerjs/ui'
import type { IAccessor } from '@wendellhu/redi'
import { Inject, Injector } from '@wendellhu/redi'
import { FolderSingle } from '@univerjs/icons'

/**
 * wait user select Excel file
 */

function waitUserSelectExcelFile() {

}

/**
 * parse Excel file to univer data
 * @param excel
 * @returns { v: string }[][]
 */

function parseExcel2UniverData() {

}

/**
 * Import Excel Button Plugin
 *
 */

class ImportExcelButtonPlugin extends Plugin {
  constructor(
        // inject injector, required
        @Inject(Injector) override readonly _injector: Injector,
        // inject menu service, toad toolbar button
        @Inject(IMenuService) private menuService: IMenuService,
        // inject command service, to register command handler
        @Inject(ICommandService) private readonly commandService: ICommandService,
        // inject component manager, to register icon component
        @Inject(ComponentManager) private readonly componentMangeaer: ComponentManager,
  ) {
    // plugin id
    super('import-excel-button')
  }

  onStarting() {
    this.componentMangeaer.register('FolderSingle', FolderSingle)

    const buttonId = 'import-excel-button'

    const menuItem = {
      id: buttonId,
      title: 'Import Excel',
      tooltip: 'Import Excel',
      icon: 'FolderSingle',
      type: MenuItemType.BUTTON,
      group: MenuGroup.CONTEXT_MENU_DATA,
      position: [MenuPosition.TOOLBAR_START],
    }
    this.menuService.addMenuItem(menuItem)

    const command = {
      type: CommandType.OPERATION,
      id: buttonId,
      handler: (accessor: IAccessor) => {
        const univer = accessor.get(IUniverInstanceService)
        const commandService = accessor.get(ICommandService)
        const sheet = univer.getCurrentUniverSheetInstance().getActiveSheet()
      },
    }
  }
}
