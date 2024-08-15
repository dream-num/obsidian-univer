/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IAccessor, ICommand } from '@univerjs/core'
import { CommandType } from '@univerjs/core'
import { getUploadXlsxFile } from '@/utils/file'
import { IExchangeService } from '@/plugins/services/exchange.service'

export const ExchangeClientUploadJsonOperation: ICommand = {
  id: 'exchange-client.operation.upload-json',
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    const exchangeService = accessor.get(IExchangeService) as any

    const file = await getUploadXlsxFile()

    if (!file)
      return false

    exchangeService.uploadJson(file)
    return true
  },
}

export const ExchangeClientDownloadJsonOperation: ICommand = {
  id: 'exchange-client.operation.download-json',
  type: CommandType.OPERATION,
  handler: async (accessor: IAccessor) => {
    const exchangeService = accessor.get(IExchangeService) as any

    exchangeService.downloadJson()
    return true
  },
}
