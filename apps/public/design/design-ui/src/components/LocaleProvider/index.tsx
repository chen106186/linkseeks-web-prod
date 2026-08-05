import React from 'react'
import LocaleContext from './context'
import { LocaleCodeType } from '../../locale'
import { AlbumLocale } from '../../locale/types/album'
import { CategoryLocale } from '../../locale/types/category'
import { HeaderLocale } from '../../locale/types/header'
import { QuickNavLocal } from '../../locale/types/quicknav'
import { CompanyInfoLocale } from '../../locale/types/companyinfo'
import { FloorLineLocale } from '../../locale/types/floorline'
import { GlobalLocale } from '../../locale/types/global'
import { PlatformLocale } from '../../locale/types/platform'
import { MobileLocale } from '../../locale/types/mobile'
import { FooterLocale } from '../../locale/types/footer'

export interface Locale {
  locale: string
  global?: GlobalLocale
  Album?: AlbumLocale
  Category?: CategoryLocale
  Header?: HeaderLocale
  QuickNav?: QuickNavLocal
  CompanyInfo?: CompanyInfoLocale
  FloorLine?: FloorLineLocale
  Footer?: FooterLocale
  Platform?: PlatformLocale
  Mobile?: MobileLocale
}

export interface LocaleProviderProps {
  locale: LocaleCodeType
  children?: React.ReactNode
  style?: React.CSSProperties
  backgroundColor?: string
}

const LocaleProvide: React.FC<LocaleProviderProps> = (props) => {
  const { locale, style, backgroundColor, children } = props

  const wrapStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || '#F5F6F7',
    ...style,
  }

  return (
    <div style={wrapStyle}>
      <LocaleContext.Provider value={{ locale, exist: true }}>
        {children}
      </LocaleContext.Provider>
    </div>
  )
}

LocaleProvide.defaultProps = {
  locale: 'zh-CN',
}

export default LocaleProvide
