import type { IWorkbookData, Nullable } from '@univerjs/core'
import { b64DecodeUnicode, textEncoder, transformSnapshotToWorkbookData } from '@univerjs/core'

import type { ISheetBlock, ISnapshot, IWorkbookMeta, IWorksheetMeta } from '@univerjs/protocol'

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
