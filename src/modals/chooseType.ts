import type { App } from 'obsidian'
import { Modal } from 'obsidian'
import type { UniverPluginSettings } from '@/types/setting'
import { createNewFile } from '@/utils/file'

interface ModalText {
  title: string
  docBtn: string
  sheetBtn: string
  excelBtn: string
}

export class ChooseTypeModal extends Modal {
  settings: UniverPluginSettings
  constructor(app: App, settings: UniverPluginSettings) {
    super(app)
    this.settings = settings
  }

  onOpen(): void {
    const { contentEl } = this
    this.titleEl.setText(this.getModalText().title)

    const btnContainer = contentEl.createDiv()
    btnContainer.classList.add('univer-modal-btn-container')

    const docBtn = btnContainer.createEl('button', {
      text: this.getModalText().docBtn,
      cls: 'univer-mdal-btn',
    })

    const sheetBtn = btnContainer.createEl('button', {
      text: this.getModalText().sheetBtn,
      cls: 'univer-mdal-btn',
    })

    const excelBtn = btnContainer.createEl('button', {
      text: 'Excel',
      cls: 'univer-mdal-btn',
    })

    docBtn.onclick = () => {
      createNewFile(this.app, 'udoc')
      this.close()
    }

    sheetBtn.onclick = () => {
      createNewFile(this.app, 'usheet')
      this.close()
    }

    excelBtn.onclick = () => {
      createNewFile(this.app, 'xlsx')
      this.close()
    }
  }

  onClose(): void {
  // 清空 contentEl 元素的内容
    this.contentEl.empty()
  }

  getModalText(): ModalText {
    if (this.settings.language === 'RU') {
      return {
        title: 'Выберите тип создаваемого файла',
        docBtn: 'Univer Документ',
        sheetBtn: 'Univer Таблица',
        excelBtn: 'Excel',
      }
    }
    else if (this.settings.language === 'ZH') {
      return {
        title: '请选择您要创建的文件类型',
        docBtn: 'Univer 文档',
        sheetBtn: 'Univer 表格',
        excelBtn: 'Excel',
      }
    }
    else if (this.settings.language === 'TW') {
      return {
        title: '請選擇要建立的文件類型',
        docBtn: 'Univer 文檔',
        sheetBtn: 'Univer 表格',
        excelBtn: 'Excel',
      }
    }
    else if (this.settings.language === 'VN') {
      return {
        title: 'Vui lòng chọn loại tệp bạn muốn tạo',
        docBtn: 'Univer Tài liệu',
        sheetBtn: 'Univer Bảng',
        excelBtn: 'Excel',
      }
    }
    else {
      return {
        title: 'Please choose the type of file you want to create',
        docBtn: 'Univer Doc',
        sheetBtn: 'Univer Sheet',
        excelBtn: 'Excel',
      }
    }
  }
}
