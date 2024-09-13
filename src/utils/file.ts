import { Type as DocType } from '@/views/udoc'
import { Type as SheetType } from '@/views/usheet'
import { Type as XlsxType } from '@/views/xlsx'
import JSZip from 'jszip'
import { type App, Notice } from 'obsidian'

export async function createNewFile(app: App, suffix: string, folderPath?: string, fileNum?: number): Promise<void> {
  if (folderPath) {
    try {
      await app.vault.createFolder(folderPath)
    }
    catch (err) {
      console.error(err)
    }
  }
  const fileName = `Untitled${fileNum !== undefined ? `-${fileNum}` : ''}.${suffix}`
  const filePath = folderPath !== undefined ? `${folderPath}/${fileName}` : fileName
  try {
    await app.vault.create(filePath, '')
    await app.workspace.getLeaf(true).setViewState({
      type: getFileType(suffix),
      active: true,
      state: {
        file: filePath,
      },
    })

    new Notice(`Created new ${suffix} file: ${filePath}`)
  }
  catch (err) {
    const error = err
    if (error.message.includes('File already exists'))
      return await createNewFile(app, suffix, folderPath, (fileNum || 0) + 1)
  }
}

export function transformToExcelBuffer(data: Record<string, any>): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const zip = new JSZip()
    Object.keys(data).forEach((key) => {
      zip.file(key, data[key])
    })

    zip.generateAsync({ type: 'blob' }).then((content) => {
      readFileHandler(content).then((result) => {
        resolve(result as ArrayBuffer)
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

export function readFileHandler(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer)
    }

    reader.onerror = () => {
      reject(reader.error)
    }

    reader.readAsArrayBuffer(file)
  })
}

function getFileType(suffix: string) {
  switch (suffix) {
    case 'udoc':
      return DocType
    case 'xlsx':
      return XlsxType
    default:
      return SheetType
  }
}

export function getUploadXlsxFile() {
  return new Promise((resolve: (file: File | null) => void, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx'

    input.onchange = () => {
      if (input.files && input.files.length > 0)
        resolve(input.files[0])
      else
        reject(new Error('No file selected'))
    }

    input.click()
  })
}

export async function downLoadExcel(excelBuffer: ArrayBuffer, fileName: string): Promise<void> {
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.xlsx`
  document.body.appendChild(a)

  a.click()

  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
