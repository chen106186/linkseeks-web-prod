import { OSS_DOMAIN } from '@/constants'
import { LOCAL_VERSION } from '@/constants/locales'
import axios from 'axios'
import { getI18n } from '@linkseeks/i18n'

export const updateLocalesFile = (locale: string) => {
  return new Promise((resolve, reject) => {
    const url = `/miniprogram/locales/${LOCAL_VERSION}/${locale}/translation.json`

    axios
      .get(OSS_DOMAIN + url, {
        headers: {
          accept: '*/*',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          // 更新国际化资源
          getI18n().addResourceBundle(locale, 'translation', res.data)
          resolve(res.data)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
