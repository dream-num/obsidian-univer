import JSZip from 'jszip'

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
