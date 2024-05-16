/* eslint-disable ts/no-redeclare */
import type { Workbook } from '@univerjs/core'
import { IUniverInstanceService, LocaleService, Tools, UniverInstanceType } from '@univerjs/core'
import { IMessageService } from '@univerjs/ui'
import type { IDisposable } from '@wendellhu/redi'
import { Inject, createIdentifier } from '@wendellhu/redi'
import { MessageType } from '@univerjs/design'
import { fillDefaultSheetBlock, transformSnapshotJsonToWorkbookData, transformWorkbookDataToSnapshotJson } from '@/utils/snapshot'
import { downLoadExcel, readFileHandler, transformToExcelBuffer } from '@/utils/file'
import { emitter } from '@/main'

export interface IExchangeService {
  uploadJson: (file: File | string) => Promise<void>
  downloadJson: () => Promise<void>
}

export const IExchangeService = createIdentifier<IExchangeService>('exchange-client.exchange-service')

export class ExchangeService implements IExchangeService, IDisposable {
  constructor(
        @Inject(IUniverInstanceService) private _univerInstanceService: IUniverInstanceService,
        @IMessageService private readonly _messageService: IMessageService,
        @Inject(LocaleService) private readonly _localeService: LocaleService,
  ) {}

  dispose(): void {
  }

  /**
   * @description Upload a json file
   * @param file
   */
  async uploadJson(file: File | string) {
    const buffer = await readFileHandler(file as Blob)

    if (buffer.byteLength !== 0) {
      // @ts-expect-error
      const transformData = await window.univerProExchangeImport(buffer)
      const jsonData = JSON.parse(transformData)
      const excel2WorkbookData = transformSnapshotJsonToWorkbookData(jsonData.snapshot, jsonData.sheetBlocks)

      if (!excel2WorkbookData)
        return

      if (!excel2WorkbookData.id)
        excel2WorkbookData.id = Tools.generateRandomId(6)
      const workbookData = fillDefaultSheetBlock(excel2WorkbookData)
      this._univerInstanceService.disposeUnit(this._getUnitID())
      this._messageService.show({
        type: MessageType.Warning,
        content: this._localeService.t('exchange.uploading'),
      })
      setTimeout(() => {
        this._univerInstanceService.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData)
        const workbook = this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)
        emitter.emit('exchange-upload', workbook)
      }, 500)
    }
    else {
      this._messageService.show({
        type: MessageType.Error,
        content: this._localeService.t('exchange.uploadError'),
      })
    }
  }

  async downloadJson() {
    const saveWorkbookData = this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)?.save()
    if (!saveWorkbookData)
      return

    const snapshotJSON = await transformWorkbookDataToSnapshotJson(saveWorkbookData)
    const snapshot = JSON.stringify(snapshotJSON)
    // @ts-expect-error
    const excelRaw = await window.univerProExchangeExport(snapshot)
    const excelBuffer = await transformToExcelBuffer(excelRaw)
    await downLoadExcel(excelBuffer, this._getUnitName())
  }

  private _getUnitID(): string {
    return this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!.getUnitId()
  }

  private _getUnitName(): string {
    return this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!.getActiveSpreadsheet().getName() || 'univer'
  }
}
