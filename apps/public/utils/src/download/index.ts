import { postSupportFileDownload } from '@apps/apis'

/**
 * base64文件下载
 */
export const downloadFileByBase64 = (base64Data: string, fileName: string) => {
  const blob = new Blob([atob(base64Data)], { type: 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}

/**
 * 网络文件下载
 * @param url
 * @param fileName
 */
export const downloadFile = (url: string, fileName: string) => {
  const x = new XMLHttpRequest()
  x.open('GET', url, true)
  x.responseType = 'blob'
  x.onload = function () {
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }
  x.send()
}

export const downloadFileByBlob = (blob: Blob, fileName: string) => {
  let url = window.URL.createObjectURL(blob)
  let downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = url
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(url)
}

/**
 * 导出文件
 */
export const exportFile = async (exportApi: Function, param: any) => {
  if (exportApi && typeof exportApi === 'function') {
    const { response } = (await exportApi(param, {
      responseType: 'blob',
      getResponse: true,
    })) as any
    if (response.data) {
      const contentDispositionHeader = response.headers['content-disposition']
      if (contentDispositionHeader) {
        const matches = contentDispositionHeader.match(/filename=([^;]+)/)
        const fileName = matches ? matches[1] : `${new Date().getTime()}.xls`
        if (fileName) {
          downloadFileByBlob(response.data, decodeURIComponent(fileName))
        }
      }
    }
  }
}

/**
 * 下载文件
 * @param fileUrl 文件地址
 * @param fileName 文件名
 */
export const downloadFileByNameAndUrl = async (fileUrl: string, fileName: string) => {
  const { response } = await postSupportFileDownload(
    {
      fileUrl,
      fileName,
    },
    {
      responseType: 'blob',
      getResponse: true,
    },
  )

  if (response.data) {
    let blob = new Blob([response.data as any])
    let downloadFilename = fileName //设置下载的文件名
    downloadFileByBlob(blob, downloadFilename)
  }
}
