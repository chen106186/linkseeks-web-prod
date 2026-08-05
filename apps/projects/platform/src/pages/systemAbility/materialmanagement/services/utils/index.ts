import { message } from 'antd'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
let copyLast = null

export const linkCopyFun = (value) => {
  if (copyLast !== value) {
    copyLast = value
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(() => {
        console.log('navigator clipboard 向剪贴板写文本 :>> ', value)
        message.success(translate('web.common.fuzhichenggong'))
      })
    } else {
      const domUrl = document.createElement('input')
      domUrl.value = value
      domUrl.id = 'createDom'
      document.body.appendChild(domUrl)
      domUrl.select()
      document.execCommand('Copy')
      const createDom = document.getElementById('createDom')
      createDom?.parentNode?.removeChild(createDom)
      message.success(translate('web.common.fuzhichenggong'))
    }
    setTimeout(() => {
      copyLast = null
    }, 2500)
  } else {
    console.log('同一链接复制触发频率过高 :>> ')
  }
}
