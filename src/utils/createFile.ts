import { Notice, type App } from 'obsidian'
import { ViewType } from '~/main'

export async function createNewFile(app: App, suffix: string, type: ViewType, folderPath?: string, fileNum?: number): Promise<void> {
  console.log("createNewFile------------", folderPath, fileNum)
  if (folderPath) {
    try {
      await app.vault.createFolder(folderPath)
    }
    catch (err) {
      console.log("issue in making folder");
			console.log(err);
    }
  }
  const fileName = `Untitled${fileNum !== undefined ? `-${fileNum}` : ''}.${suffix}`
  const filePath = folderPath !== undefined ? `${folderPath}/${fileName}` : fileName

  try {
    await app.vault.create(filePath, '')

    await app.workspace.getLeaf(true).setViewState({
      type: type,
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
      return await createNewFile(app, suffix, type, folderPath, (fileNum || 0) + 1)
  }
}


export function setCtxPos(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const p = {x: rect.left, y:rect.top}

  let r = document.querySelector(':root') as HTMLElement
  if(p.x) {
    r.style.setProperty('--ctx_menu_x', `${p.x}px`)
    r.style.setProperty('--ctx_menu_y', (-1*p.y + 50 )+ "px"  )
  }
}