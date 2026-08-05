import React from 'react'
import { I18nextProvider, i18n } from '@linkseeks/i18n'

export interface I18nProps {
  i18n: i18n
}
export const I18nProvider = (props: any) => {
  const { i18n, children } = props
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
