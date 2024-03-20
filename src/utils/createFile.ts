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


export function setCtxPos(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const p = {x: rect.left, y:rect.top}

  let r = document.querySelector(':root') as HTMLElement
  console.log('r-----------', r)
  if(p.x) {
    r.style.setProperty('--ctx_menu_x', `${p.x}px`)
    r.style.setProperty('--ctx_menu_y', (-1*p.y + 50 )+ "px"  )
  }
}