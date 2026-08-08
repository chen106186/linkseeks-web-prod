import React, { useContext } from 'react'
import { createContext } from "react";

export interface LocaleLibs {
  [key: string]: {
    [ts: string]: string
  }
}

export interface LocaleMsg {
  locale: string,
  libs: LocaleLibs,
  setLocale(locale: string): void,
}

export interface LocaleContainerProps {
  value: LocaleLibs
}

const LocaleContext = createContext<LocaleMsg>({
  locale: 'zh-CN',
  setLocale(locale: string) { console.log('empty: ' + locale) },
  libs: {}
})

export const LocaleContainer = props => <LocaleContext.Provider {...props}/>

export const useLocale = () => {
  const locales = useContext(LocaleContext)

  /**
   * 第一个参数为对应的翻译， 第二个参数可操作国际化文案
   */
  return [locales.libs[locales.locale], locales]
}
