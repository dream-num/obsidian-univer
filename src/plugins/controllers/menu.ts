import type { IMenuButtonItem, IMenuSelectorItem } from '@univerjs/ui'
import { MenuGroup, MenuItemType, MenuPosition } from '@univerjs/ui'
import type { IAccessor } from '@wendellhu/redi'
import { ExchangeClientDownloadJsonOperation, ExchangeClientUploadJsonOperation } from '@/plugins/commands/exchange.operation'

const EXCHANGE_OPERATION_ID = 'exchange-client.operation.exchange'

export function ExchangeMenuItemFactory(): IMenuSelectorItem<string> {
  return {
    id: EXCHANGE_OPERATION_ID,
    group: MenuGroup.TOOLBAR_OTHERS,
    type: MenuItemType.SUBITEMS,
    icon: 'DirectExportSingle',
    tooltip: 'exchange.file',
    positions: [MenuPosition.TOOLBAR_START],
  }
}

export function ExchangeUploadJsonMenuItemFactory(accessor: IAccessor): IMenuButtonItem<string> {
  return {
    id: ExchangeClientUploadJsonOperation.id,
    type: MenuItemType.BUTTON,
    title: 'exchange.uploadJson',
    icon: 'FolderSingle',
    positions: [EXCHANGE_OPERATION_ID],
  }
}

// TODO: change the exchange.downloadJson to a subitem
export function ExchangeDownloadJsonMenuItemFactory(accessor: IAccessor): IMenuButtonItem<string> {
  return {
    id: ExchangeClientDownloadJsonOperation.id,
    tooltip: 'exchange.downloadJson',
    type: MenuItemType.BUTTON,
    // title: 'exchange.downloadJson',
    icon: 'ExportSingle',
    positions: [MenuPosition.TOOLBAR_START],
  }
}
