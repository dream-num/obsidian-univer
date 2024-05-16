export class Modal {
  private modalElement: HTMLElement | null = null

  constructor() {
    this.initModal()
  }

  private initModal(): void {
    // find modal element
    this.modalElement = document.querySelector('.univer-exchange-modal-overlay')

    // is not exist, create a new one
    if (!this.modalElement) {
      this.modalElement = document.createElement('div')
      this.modalElement.className = 'univer-exchange-modal-overlay'
      this.modalElement.style.display = 'none'
      this.modalElement.style.position = 'absolute'
      this.modalElement.style.top = '0'
      this.modalElement.style.left = '0'
      this.modalElement.style.width = '100%'
      this.modalElement.style.height = '100%'
      this.modalElement.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
      this.modalElement.style.justifyContent = 'center'
      this.modalElement.style.alignItems = 'center'
      this.modalElement.style.color = 'rgb(var(--text-color))'
      this.modalElement.style.fontSize = '24px'
      this.modalElement.style.zIndex = '8'

      // append to container
      const container = document.querySelector('.univer-app-container')
      container?.appendChild(this.modalElement)
    }
  }

  public open(content: string): void {
    this.initModal()

    if (this.modalElement) {
      this.modalElement.innerHTML = `<div class="modal-content">${content}</div>`
      this.modalElement.style.display = 'flex' // show modal
    }
  }

  public close(): void {
    if (this.modalElement)
      this.modalElement.style.display = 'none' // hide modal
  }
}
