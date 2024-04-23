/* eslint-disable ts/no-redeclare */
import { IUniverInstanceService, LocaleService } from '@univerjs/core'
import { IMessageService } from '@univerjs/ui'
import type { IDisposable } from '@wendellhu/redi'
import { Inject, createIdentifier } from '@wendellhu/redi'
import { transformSnapshotJsonToWorkbookData } from '@/utils/snapshot'

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
  ) { }

  dispose(): void {

  }

  /**
   * @description Upload a json file
   * @param file
   */
  async uploadJson(file: File | string) {
    const json = JSON.parse(file as string)
    const workbookData = transformSnapshotJsonToWorkbookData(json.snapshot, json.sheetBlocks)

    // univer should be dispose
    // create workbookData
  }

  async downloadJson() {

  }
}
