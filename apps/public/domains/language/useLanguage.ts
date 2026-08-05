import languageService, { LanguageInfo } from './language.service'
import { CookieStorageModule } from '@linkseeks/storage'
import { getI18n } from '@linkseeks/i18n'
import { useEffect, useState } from 'react'

const LANGUAGE_KEY = 'linkseeks_locale'

const LanguageStorage = new CookieStorageModule({
  storageKey: LANGUAGE_KEY,
})

/**
 * 默认语言是中文
 * 若后续需要更改可以在此处变更，与i18n库无关
 *
 * 由于是兜底的默认值，所以没图标
 */
const finallyLanguageInfo: LanguageInfo = {
  language: 'zh-CN',
  img: '',
  key: 'zh-CN',
}

export const useLanguage = () => {
  const [language, _setLanguage] = useState<LanguageInfo>(LanguageStorage.getItem() || finallyLanguageInfo)
  const [languageList, setLanguageList] = useState<LanguageInfo[]>([])

  useEffect(() => {
    languageService.getLanguageList().then((data) => {
      setLanguageList(data)
    })
  }, [])

  const setLanguage = (key: string) => {
    const languageInfo = languageService.findLanguage(key)
    if (languageInfo) {
      _setLanguage(languageInfo)
      LanguageStorage.setItem(languageInfo)
      getI18n().changeLanguage(languageInfo.key)
    }
  }

  return {
    languageList,
    language,
    setLanguage,
  }
}
