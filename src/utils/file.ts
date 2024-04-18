import JSZip from 'jszip'
import { type App, Notice } from 'obsidian'
import { Type as DocType } from '@/views/udoc'
import { Type as SheetType } from '@/views/usheet'

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
      type: suffix === 'udoc' ? DocType : SheetType,
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

function readFileHandler(file: Blob) {
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