import * as React from 'react'

import { resolveMapping, isPureVariable } from '@apps/design-utils'
import defaultLocaleData from './default'
import LocaleContext from './context'
import getLocale, { LocaleCodeType } from '../../locale'
// import { Locale } from '.'

export interface LocaleReceiverProps {
  componentName: string
  defaultLocale?: LocaleCodeType
  children: (
    locale: object,
    lang: (key: string, defaultMessage: string, option?: any) => any,
    localeCode?: string,
    fullLocale?: object,
  ) => React.ReactNode
}

interface LocaleInterface {
  [key: string]: any
}

export interface LocaleReceiverContext {
  antLocale?: LocaleInterface
}

export default class LocaleReceiver extends React.Component<LocaleReceiverProps> {
  static defaultProps = {
    componentName: 'global',
  }

  static contextType = LocaleContext

  fnGetLocale() {
    const { componentName } = this.props
    const linkseeksLocale = this.context
    const locale: any = getLocale(linkseeksLocale?.locale || 'zh-CN')
    const localeFromContext =
      componentName && locale ? locale[componentName] : {}
    return {
      ...localeFromContext,
    }
  }

  fnGetLangFn() {
    const { componentName } = this.props
    const linkseeksLocale = this.context
    const locale: any = getLocale(linkseeksLocale?.locale || 'zh-CN')
    const localeFromContext =
      componentName && locale ? locale[componentName] : {}

    const localeFn = (key: string, defaultMessage: string, option?: any) => {
      const value = localeFromContext[key]
        ? localeFromContext[key]
        : defaultMessage
      if (option) {
        return resolveMapping(value, option)
      }
      return value
    }

    return localeFn
  }

  getLocaleCode() {
    const linkseeksLocale = this.context

    const localeCode = linkseeksLocale && linkseeksLocale.locale
    // Had use LocaleProvide but didn't set locale
    if (linkseeksLocale && linkseeksLocale.exist && !localeCode) {
      return defaultLocaleData.locale
    }
    return localeCode
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children(
          this.fnGetLocale(),
          this.fnGetLangFn(),
          this.getLocaleCode(),
          this.context,
        )}
      </React.Fragment>
    )
  }
}
