import { postSupportFileConvertPdfPreview } from '@apps/apis'
/**
 * 转换临时路径
 * @param fileUrl
 */
const convertTemporaryLinks = async (fileUrl: string) => {
  try {
    // 假设后端返回的Base64编码数据
    const { data } = await postSupportFileConvertPdfPreview({ fileUrl }, { ctlType: 'none' })
    // 去掉Base64前缀（如果有的话），例如：data:application/pdf;base64,...
    const base64Data = data?.fileBase64?.replace(/^data:application\/pdf;base64,/, '')
    // 将Base64字符串转换为二进制数据
    const byteCharacters = atob(base64Data)
    // 创建一个二进制数组
    const byteArray = new Uint8Array(byteCharacters.length)
    // 将字符转换为字节数组
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i)
    }
    // 创建Blob对象
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    // 创建临时URL
    const blobUrl = URL.createObjectURL(blob)
    // 返回临时URL
    return blobUrl
  } catch (err) {
    console.log('documentationPreviewConvertLinks err :>> ', err)
  }
}
/**
 * 在线预览文档方法 - PDF转换临时路径
 * @param url 源文档链接
 * @returns 使用方式如下
 * ```
  const btnClick = async (fileUrl: any) => {
    const url = await documentationPreview(fileUrl)
    // 打开新窗口预览PDF
    window.open(url, '_blank')
  }
 * ```
 */
export const newDocumentationPreview = async (url: string) => {
  if (url?.endsWith('pdf')) {
    return await convertTemporaryLinks(url)
  } else {
    return Promise.resolve(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`)
  }
}
/*
 * 在线预览文档方法
 */
export const openDocumentationPreview = async (url: string) => {
  try {
    const data = await newDocumentationPreview(url)
    window.open(data, '_blank')
  } catch (err) {
    console.log('openDocumentationPreview err :>> ', err)
  }
}
/**
 * 在线预览文档方法
 * @param url 源文档链接
 * @param usePfile pdf文件是否使用公共链接做转化（目前只有安卓APP需要用到
 * @returns 可用于 iframe/webview 预览的文档链接
 */
export const documentationPreview = (url: string, usePfile?: boolean) => {
  if (url?.endsWith('pdf')) {
    return usePfile ? `https://pfile.com.cn/api/profile/onlinePreview?url=${encodeURIComponent(url)}` : url
  } else {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
  }
}
