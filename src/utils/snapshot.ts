import type { IWorkbookData, Nullable } from '@univerjs/core'
import type {
  IFetchMissingChangesetsRequest,
  IFetchMissingChangesetsResponse,
  IGetResourcesRequest,
  IGetResourcesResponse,
  IGetSheetBlockRequest,
  IGetSheetBlockResponse,
  IGetUnitOnRevRequest,
  IGetUnitOnRevResponse,
  ISaveChangesetRequest,
  ISaveChangesetResponse,
  ISaveSheetBlockRequest,
  ISaveSheetBlockResponse,
  ISaveSnapshotRequest,
  ISaveSnapshotResponse,
  ISheetBlock,
  ISnapshot,
  IWorkbookMeta,
  IWorksheetMeta,
} from '@univerjs/protocol'
import type { ILogContext, ISnapshotServerService } from '@univerjs-pro/collaboration'
import { ErrorCode, UniverType } from '@univerjs/protocol'
import { b64DecodeUnicode, b64EncodeUnicode, getSheetBlocksFromSnapshot, textDecoder, textEncoder, transformSnapshotToWorkbookData, transformWorkbookDataToSnapshot } from '@univerjs-pro/collaboration'

export class ClientSnapshotServerService implements ISnapshotServerService {
  private _sheetBlockCache: Map<string, ISheetBlock> = new Map()

  /** Load snapshot from a database. */
  getUnitOnRev(context: ILogContext, params: IGetUnitOnRevRequest): Promise<IGetUnitOnRevResponse> {
    return Promise.resolve({
      snapshot: {
        unitID: '',
        type: UniverType.UNIVER_SHEET,
        rev: 0,
        workbook: undefined,
        doc: undefined,
      },
      changesets: [],
      error: {
        code: ErrorCode.OK,
        message: '',
      },
    })
  }

  /** Load sheet block from a database.  */
  getSheetBlock(context: ILogContext, params: IGetSheetBlockRequest): Promise<IGetSheetBlockResponse> {
    // get block from cache
    const block = this._sheetBlockCache.get(params.blockID)

    return Promise.resolve({
      block,
      error: {
        code: ErrorCode.OK,
        message: '',
      },
    })
  }

  /** Fetch missing changeset */
  fetchMissingChangesets(
    context: ILogContext,
    params: IFetchMissingChangesetsRequest,
  ): Promise<IFetchMissingChangesetsResponse> {
    return Promise.resolve({
      changesets: [],
      error: {
        code: ErrorCode.OK,
        message: '',
      },
    })
  }

  getResourcesRequest(context: ILogContext, params: IGetResourcesRequest): Promise<IGetResourcesResponse> {
    return Promise.resolve({
      resources: {},
      error: {
        code: ErrorCode.OK,
        message: '',
      },
    })
  }

  /** Save snapshot to a database. */
  saveSnapshot(context: ILogContext, params: ISaveSnapshotRequest): Promise<ISaveSnapshotResponse> {
    return Promise.resolve({
      error: {
        code: ErrorCode.OK,
        message: '',
      },
    })
  };

  /** Save sheet block to a database. */
  saveSheetBlock(context: ILogContext, params: ISaveSheetBlockRequest): Promise<ISaveSheetBlockResponse> {
    const { block } = params

    if (!block) {
      return Promise.resolve({
        error: {
          code: ErrorCode.UNDEFINED,
          message: 'block is required',
        },
        blockID: '',
      })
    }

    // save block to cache
    this._sheetBlockCache.set(block.id, block)

    return Promise.resolve({
      error: {
        code: ErrorCode.OK,
        message: '',
      },
      blockID: block.id,
    })
  };

  /** Save changeset to a database. */
  saveChangeset(context: ILogContext, params: ISaveChangesetRequest): Promise<ISaveChangesetResponse> {
    return Promise.resolve({
      error: {
        code: ErrorCode.OK,
        message: '',
      },
      concurrent: [],
    })
  };
}

export interface WorksheetMetaJson extends Omit<IWorksheetMeta, 'originalMeta'> {
  originalMeta: string
}

export interface WorkbookMetaJson extends Omit<IWorkbookMeta, 'originalMeta' | 'sheets'> {
  originalMeta: string
  sheets: {
    [key: string]: Partial<WorksheetMetaJson>
  }
}

export interface ISnapshotJson extends Omit<ISnapshot, 'workbook'> {
  workbook: Partial<WorkbookMetaJson>
}

export interface ISheetBlockData extends Omit<ISheetBlock, 'data'> {
  data: string
}

export interface ISheetBlockJson {
  [key: string]: Partial<ISheetBlockData>
}

/**
 * The originalMeta value in the JSON data transmitted from the backend is in string format and needs to be converted to Uint8Array first to fully comply with the ISnapshot format.
 * @param snapshot
 * @returns
 */
export function transformSnapshotMetaToBuffer(snapshot: ISnapshotJson): Nullable<ISnapshot> {
  const workbook = snapshot.workbook
  if (!workbook)
    return null

  const sheets: {
    [key: string]: IWorksheetMeta
  } = {}

  if (workbook.sheets) {
    // Loop through sheets and convert originalMeta
    Object.keys(workbook.sheets).forEach((sheetKey) => {
      const sheet = workbook.sheets && workbook.sheets[sheetKey]

      if (!sheet)
        return

      // Set the converted Uint8Array to originalMeta
      sheets[sheetKey] = {
        ...sheet,
        type: sheet.type || 0,
        id: sheet.id || '',
        name: sheet.name || '',
        rowCount: sheet.rowCount || 0,
        columnCount: sheet.columnCount || 0,
        originalMeta: textEncoder.encode(b64DecodeUnicode(sheet.originalMeta || '')),
      }
    })
  }

  // Set the converted Uint8Array to originalMeta
  const workbookOriginalMeta = textEncoder.encode(b64DecodeUnicode(workbook.originalMeta || ''))

  return {
    ...snapshot,
    workbook: {
      ...workbook,
      unitID: workbook.unitID || '',
      rev: workbook.rev || 0,
      creator: workbook.creator || '',
      name: workbook.name || '',
      sheetOrder: workbook.sheetOrder || [],
      resources: workbook.resources || [],
      blockMeta: workbook.blockMeta || {},
      originalMeta: workbookOriginalMeta,
      sheets,
    },
  }
}

/**
 * The data in the sheet block is in string format and needs to be converted to Uint8Array first to fully comply with the ISheetBlock format.
 * @param sheetBlocks
 * @returns
 */
export function transformSheetBlockMetaToBuffer(sheetBlocks: ISheetBlockJson): ISheetBlock[] {
  const sheetBlockArray: ISheetBlock[] = []
  Object.keys(sheetBlocks).forEach((blockKey) => {
    const block = sheetBlocks[blockKey]
    sheetBlockArray.push({
      ...block,
      id: block.id || '',
      startRow: block.startRow || 0,
      endRow: block.endRow || 0,
      data: textEncoder.encode(b64DecodeUnicode(block.data || '')),
    })
  })
  return sheetBlockArray
}

/**
 * Convert snapshot data to workbook data
 * @param snapshot
 * @param sheetBlocks
 * @returns
 */
export function transformSnapshotJsonToWorkbookData(snapshot: ISnapshotJson, sheetBlocks: ISheetBlockJson): Nullable<IWorkbookData> {
  const snapshotData = transformSnapshotMetaToBuffer(snapshot)
  if (!snapshotData || !sheetBlocks)
    return null

  const blocks = transformSheetBlockMetaToBuffer(sheetBlocks)

  return transformSnapshotToWorkbookData(snapshotData, blocks)
}

/**
 * Convert the Uint8Array in the snapshot to a string for easy transmission to the backend
 * @param snapshot
 * @returns
 */
export function transformSnapshotMetaToString(snapshot: ISnapshot): Nullable<ISnapshotJson> {
  const workbook = snapshot.workbook
  if (!workbook)
    return null

  const sheets: {
    [key: string]: Partial<WorksheetMetaJson>
  } = {}

  if (workbook.sheets) {
    // Loop through sheets and convert originalMeta
    Object.keys(workbook.sheets).forEach((sheetKey) => {
      const sheet = workbook.sheets[sheetKey]
      sheets[sheetKey] = {
        ...sheet,
        originalMeta: b64EncodeUnicode(textDecoder.decode(sheet.originalMeta)),
      }
    })
  }

  const workbookOriginalMeta = b64EncodeUnicode(textDecoder.decode(workbook.originalMeta))

  return {
    ...snapshot,
    workbook: {
      ...workbook,
      originalMeta: workbookOriginalMeta,
      sheets,
    },
  }
}

/**
 * Convert the Uint8Array in the sheet block to a string for easy transmission to the backend
 * @param sheetBlocks
 * @returns
 */
export function transformSheetBlockMetaToString(sheetBlocks: ISheetBlock[]): ISheetBlockJson {
  const sheetBlockJson: ISheetBlockJson = {}
  sheetBlocks.forEach((block) => {
    sheetBlockJson[block.id] = {
      ...block,
      data: b64EncodeUnicode(textDecoder.decode(block.data)),
    }
  })
  return sheetBlockJson
}

/**
 * Convert the workbook data to snapshot data
 * @param workbookData
 * @returns
 */
export async function transformWorkbookDataToSnapshotJson(workbookData: IWorkbookData): Promise<{ snapshot: ISnapshotJson, sheetBlocks: ISheetBlockJson }> {
  const context: ILogContext = {
    metadata: undefined,
  }

  const unitID = workbookData.id
  const rev = workbookData.rev ?? 0

  const snapshotService: ISnapshotServerService = new ClientSnapshotServerService()

  const { snapshot } = await transformWorkbookDataToSnapshot(context, workbookData, unitID, rev, snapshotService)

  const sheetBlocks = await getSheetBlocksFromSnapshot(snapshot, snapshotService)

  const snapshotJson = transformSnapshotMetaToString(snapshot as any)

  if (!snapshotJson)
    throw new Error('Failed to transform snapshot to string')

  return {
    snapshot: snapshotJson,
    sheetBlocks: transformSheetBlockMetaToString(sheetBlocks),
  }
}

export function fillDefaultSheetBlock(workbookData: IWorkbookData): IWorkbookData {
  const sheets = workbookData.sheets

  if (sheets) {
    Object.keys(sheets).forEach((sheetId) => {
      const sheet = sheets[sheetId]
      if (sheet.columnCount)
        sheet.columnCount = Math.max(36, sheet.columnCount)

      if (sheet.rowCount)
        sheet.rowCount = Math.max(99, sheet.rowCount)
    })
  }
  return workbookData
}
