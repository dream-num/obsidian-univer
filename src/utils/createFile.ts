import { Notice, type App } from 'obsidian'
import { Type as DocType } from '~/views/udoc';
import { Type as SheetType } from '~/views/usheet';

export async function createNewFile(app: App, suffix: string, folderPath?: string, fileNum?: number): Promise<void> {
  if (folderPath) {
    try {
      await app.vault.createFolder(folderPath)
    }
    catch (err) {
			console.error(err);
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
        file: filePath
      }
    })
    new Notice(`Created new ${suffix} file: ${filePath}`)
  }
  catch (err) {
    const error = err
    if (error.message.includes('File already exists'))
      return await createNewFile(app, suffix, folderPath, (fileNum || 0) + 1)
  }
}


