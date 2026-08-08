import { getWebIntl } from '@apps/locales'
import { Validate } from './Validate'
import { compareIsEmpty } from './utils'
import {
  ValidateTextLengthOptions,
  ValidateNumberOptions,
  ValidateRequiredOptions,
  validateLanguageRequiredOptions,
  validateDecimalOptions,
  validateNumberRangeOptions,
} from './validateType'

interface ValidatorOptions {}

const translate = getWebIntl()
export class Validator {
  options: ValidatorOptions = {}
  constructor(options?: ValidatorOptions) {
    if (options) {
      Object.assign(this.options, options)
    }
  }

  /**
   * 必填校验
   */
  validateRequired(options: ValidateRequiredOptions) {
    const validate = new Validate(async (value, formInstance, rule) => {
      // rule.type 可以拿到数据类型，这里直接做简单的必填校验
      if (compareIsEmpty(value)) {
        throw options.message || translate('web.common.qingshuru', { defaultMessage: '请输入' })
      }
      return true
    })

    return validate.init()
  }

  /**
   * 数字校验
   */
  validateNumber(options: ValidateNumberOptions) {
    const validate = new Validate(async (value, formInstance, rule) => {
      const { min, max, length } = options
      const numberValue = Number(value)
      if (value && isNaN(numberValue)) {
        throw translate('web.common.qingshurushuzi', { defaultMessage: '请输入数字' })
      }
      if (length && value?.length > length) {
        throw translate('web.common.bunengchaoguoweishu', { defaultMessage: '不得超过{{length}}位', length })
      }
      if (min !== undefined && numberValue < min) {
        throw translate('web.common.zuixiaozhiwei', { defaultMessage: '最小值为{{min}}', min })
      }
      if (max !== undefined && numberValue > max) {
        throw translate('web.common.zuidazhiwei', { defaultMessage: '最大值为{{max}}', max })
      }
      return true
    })

    return validate.init()
  }

  /**
   * 校验文本长度
   */
  validateTextLength(options: ValidateTextLengthOptions) {
    const validate = new Validate(async (value, formInstance, rule) => {
      const { length } = options
      if (length && String(value).length > length) {
        throw (
          options.message ||
          translate('web.common.zuiduoshurugezi', { defaultMessage: '最多输入{{length}}个字', length })
        )
      }
      return true
    })

    return validate.init()
  }

  /**
   * 国际化场景下校验所有国际化文案必填
   */
  validateLanguageRequired(options: validateLanguageRequiredOptions) {
    const validate = new Validate(async (value, formInstance, rule) => {
      const { required, length } = options
      if (required) {
        if (!value) {
          throw translate('web.common.qingtianxie', { defaultMessage: '请填写' })
        }
        if (Array.isArray(value)) {
          if (value.some((item) => !item.value)) {
            throw translate('web.common.qingtianxie', { defaultMessage: '请填写' })
          }
        }
      }

      if (length) {
        if (Array.isArray(value)) {
          if (value.some((item) => item.value?.length > length)) {
            throw translate('web.common.qingjianchaziduanchangdu', { defaultMessage: '请检查字段长度' })
          }
        }
      }
      return true
    })

    return validate.init()
  }

  /**
   * 校验小数位数
   */
  validateDecimal(options: validateDecimalOptions) {
    const validate = new Validate(async (value) => {
      const { length = 1 } = options
      if (typeof value === 'string' && value.indexOf('.') !== -1) {
        if (value.length - value.indexOf('.') - 1 > length) {
          throw translate('web.common.decimalMax', { length })
        }
      }
    })

    return validate.init()
  }

  /**
   * 校验数字区间
   */
  validateNumberRange(options: validateNumberRangeOptions) {
    const validate = new Validate(async (value) => {
      const { min, max } = options
      const mathValue = Number(value)
      if (mathValue > min && mathValue <= max) {
      } else {
        throw translate('web.common.numberRangeTip', { min, max })
      }
    })

    return validate.init()
  }
}
