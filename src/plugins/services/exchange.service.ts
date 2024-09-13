/* eslint-disable ts/no-redeclare */
import type { IDisposable, Workbook } from '@univerjs/core'
import { downLoadExcel, readFileHandler, transformToExcelBuffer } from '@/utils/file'
import { fillDefaultSheetBlock, transformSnapshotJsonToWorkbookData, transformWorkbookDataToSnapshotJson } from '@/utils/snapshot'
import { createIdentifier, generateRandomId, Inject, IUniverInstanceService, LocaleService, UniverInstanceType } from '@univerjs/core'
import { MessageType } from '@univerjs/design'
import { IMessageService } from '@univerjs/ui'

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
        excel2WorkbookData.id = generateRandomId(6)

      const workbookData = fillDefaultSheetBlock(excel2WorkbookData)
      const previousSheetBarCount = document.querySelectorAll('.univer-sheet-bar').length
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const currentUniverSheetBar = document.querySelectorAll('.univer-sheet-bar').length
            if (currentUniverSheetBar !== previousSheetBarCount) {
              observer.disconnect()
              this._univerInstanceService.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData)
              const workbook = this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)
              break
            }
          }
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      this._univerInstanceService.disposeUnit(this._getUnitID())
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
    return this._univerInstanceService.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!.getActiveSpreadsheet().getName() || document.title.split(' - ')[0]
  }
}
