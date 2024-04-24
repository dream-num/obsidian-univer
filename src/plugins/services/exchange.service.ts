/* eslint-disable ts/no-redeclare */
import { IUniverInstanceService, LocaleService, Tools } from '@univerjs/core'
import { IMessageService } from '@univerjs/ui'
import type { IDisposable } from '@wendellhu/redi'
import { Inject, createIdentifier } from '@wendellhu/redi'
import { MessageType } from '@univerjs/design'
import { emitter } from '@/main'
import { transformSnapshotJsonToWorkbookData } from '@/utils/snapshot'
import { readFileHandler } from '@/utils/file'

export interface IExchangeService {
  uploadJson: (file: File | string) => Promise<void>
  downloadJson: () => Promise<void>
}

export const IExchangeService = createIdentifier<IExchangeService>('exchange-client.exchange-service')

export class ExchangeService implements IExchangeService, IDisposable {
  // public _exchangeUpload$ = new BehaviorSubject<IWorkbookData>({} as IWorkbookData)
  // readonly exchangeUpload$ = this._exchangeUpload$.asObservable()

  constructor(
        @IUniverInstanceService private readonly _univerInstanceService: IUniverInstanceService,
        @IMessageService private readonly _messageService: IMessageService,
        @Inject(LocaleService) private readonly _localeService: LocaleService,
  ) { }

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

      emitter.emit('exchange-upload', excel2WorkbookData)
    }
    else {
      this._messageService.show({
        type: MessageType.Error,
        content: this._localeService.t('exchange.uploadError'),
      })
    }
  }

  async downloadJson() {

  }
}
