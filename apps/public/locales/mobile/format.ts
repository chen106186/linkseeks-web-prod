import { BaseExtension } from '../base'
import { LanguageKeys } from './types'

/**
 * 在这里做一些翻译文案带参数的方法
 */
export class FormatExtension extends BaseExtension<LanguageKeys> {
  /**
   * 格式化字节长度
   */
  formatByteLength({ byteNum, chineseNum }) {
    return this.translate('web.common.tip_byteLengthLimit', { byteNum, chineseNum })
  }

  /**
   * 将文本转换成带货币括号的形式
   */
  formatCurrencyWith(locale: string) {
    return `${locale}(${this.translate('web.common.currencySymbol')})`
  }

  /**
   * 将文本转换成 "请选择xxx"
   */
  formatFormSelectTip(locale: string) {
    return `${this.translate('mobile.common.qingxuanze')}${locale}`
  }

  /**
   * 将文本转换成 “请输入xxx”
   */
  formatFormInputTip(locale: string) {
    return `${this.translate('mobile.common.qingshuru')}${locale}`
  }
}
