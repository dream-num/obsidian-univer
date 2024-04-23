import type {
  ICellData,
} from '@univerjs/core'
import {
  CommandType,
  ICommandService,
  IUniverInstanceService,
  Plugin,
} from '@univerjs/core'
import { SetRangeValuesCommand } from '@univerjs/sheets'
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
 * wait user select csv file
 */
function waitUserSelectCSVFile(onSelect: (data: {
  data: string[][]
  colsCount: number
  rowsCount: number
}) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'
  input.click()

  input.onchange = () => {
    const file = input.files?.[0]
    if (!file)
      return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result
      if (typeof text !== 'string')
        return

      // tip: use npm package to parse csv
      const rows = text.split(/\r\n|\n/)
      const data = rows.map(line => line.split(','))

      const colsCount = data.reduce((max, row) => Math.max(max, row.length), 0)

      onSelect({
        data,
        colsCount,
        rowsCount: data.length,
      })
    }
    reader.readAsText(file)
  }
}

/**
 * parse csv to univer data
 * @param csv
 * @returns { v: string }[][]
 */
function parseCSV2UniverData(csv: string[][]): ICellData[][] {
  return csv.map((row) => {
    return row.map((cell) => {
      return {
        v: cell || '',
      }
    })
  })
}

/**
 * Import CSV Button Plugin
 * A simple Plugin example, show how to write a plugin.
 */
class ImportCSVButtonPlugin extends Plugin {
  constructor(
    // inject injector, required
    @Inject(Injector) override readonly _injector: Injector,
    // inject menu service, to add toolbar button
    @Inject(IMenuService) private menuService: IMenuService,
    // inject command service, to register command handler
    @Inject(ICommandService) private readonly commandService: ICommandService,
    // inject component manager, to register icon component
    @Inject(ComponentManager) private readonly componentManager: ComponentManager,
  ) {
    // plugin id
    super('import-csv-plugin')
  }

  /**
   * The first lifecycle of the plugin mounted on the Univer instance,
   * the Univer business instance has not been created at this time.
   * The plugin should add its own module to the dependency injection system at this lifecycle.
   * It is not recommended to initialize the internal module of the plugin outside this lifecycle.
   */
  onStarting() {
    // register icon component
    this.componentManager.register('FolderSingle', FolderSingle)

    const buttonId = 'import-csv-button'

    const menuItem = {
      id: buttonId,
      title: 'Import CSV',
      tooltip: 'Import CSV',
      icon: 'FolderSingle', // icon name
      type: MenuItemType.BUTTON,
      group: MenuGroup.CONTEXT_MENU_DATA,
      positions: [MenuPosition.TOOLBAR_START],
    }
    this.menuService.addMenuItem(menuItem)

    const command = {
      type: CommandType.OPERATION,
      id: buttonId,
      handler: (accessor: IAccessor) => {
        // inject univer instance service
        const univer = accessor.get(IUniverInstanceService)
        const commandService = accessor.get(ICommandService)
        // get current sheet
        const sheet = univer.getCurrentUniverSheetInstance().getActiveSheet()
        // wait user select csv file
        waitUserSelectCSVFile(({ data, rowsCount, colsCount }) => {
          // set sheet size
          sheet.setColumnCount(colsCount)
          sheet.setRowCount(rowsCount)

          // set sheet data
          commandService.executeCommand(SetRangeValuesCommand.id, {
            range: {
              startColumn: 0, // start column index
              startRow: 0, // start row index
              endColumn: colsCount - 1, // end column index
              endRow: rowsCount - 1, // end row index
            },
            value: parseCSV2UniverData(data),
          })
        })
        return true
      },
    }
    this.commandService.registerCommand(command)
  }
}

export default ImportCSVButtonPlugin
