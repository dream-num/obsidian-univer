import type { IAccessor } from '@univerjs/core'
import type { IMenuButtonItem, IMenuSelectorItem } from '@univerjs/ui'
import { ExchangeClientDownloadJsonOperation, ExchangeClientUploadJsonOperation } from '@/plugins/commands/exchange.operation'
import { MenuGroup, MenuItemType, MenuPosition } from '@univerjs/ui'

export const EXCHANGE_OPERATION_ID = 'exchange-client.operation.exchange'

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

export function ExchangeDownloadJsonMenuItemFactory(accessor: IAccessor): IMenuButtonItem<string> {
  return {
    id: ExchangeClientDownloadJsonOperation.id,
    type: MenuItemType.BUTTON,
    title: 'exchange.downloadJson',
    icon: 'ExportSingle',
    positions: [EXCHANGE_OPERATION_ID],
  }
}
