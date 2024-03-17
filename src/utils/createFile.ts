import type { App } from 'obsidian'

export async function createNewFile(app: App, suffix: string, folderPath?: string, fileNum?: number): Promise<void> {
  if (folderPath) {
    try {
      await app.vault.createFolder(folderPath)
    }
    catch (err) {
    }
  }
  const fileName = `Untitled${fileNum !== undefined ? `-${fileNum}` : ''}.${suffix}`
  const filePath = folderPath !== undefined ? `${folderPath}/${fileName}` : fileName

  try {
    await app.vault.create(filePath, '')
  }
  catch (err) {
    const error = err
    if (error.message.includes('File already exists'))
      return await createNewFile(app, suffix, folderPath, (fileNum || 0) + 1)
  }
}
