import axios from 'axios'
import crypto from 'crypto'

// 有道翻译API的请求参数
const appid = '20230219001567440'
const appSecret = 'aiuYm4KzF1dPhulSd1Yn'
const apiUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate'

// 获取当前时间戳
function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000)
}

// 生成签名
function generateSignature(text, salt, curtime) {
  const str = appid + text + salt + appSecret
  const hmac = crypto.createHash('md5').update(str).digest('hex')
  return hmac
}

// 发送翻译请求
export async function translateText(text: string, options: any = {}) {
  const { from = 'zh', to = 'en' } = options
  const salt = new Date().getTime()
  const curtime = getCurrentTimestamp()
  const sign = generateSignature(text, salt, curtime)
  const params = {
    q: text,
    appid: appid,
    salt: salt,
    from: from,
    to: to,
    sign: sign,
  }
  return new Promise<any>(async (resolve, reject) => {
    try {
      const response = await axios.post(apiUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      setTimeout(() => {
        resolve(response.data.trans_result)
      }, 1000)
    } catch (error) {
      console.error('Error translating text:', error)
      reject(error)
    }
  })
}
