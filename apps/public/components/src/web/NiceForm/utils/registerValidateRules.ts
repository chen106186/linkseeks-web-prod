/**
 * @ Author: Liangzhu
 * @ Create Time: 2023-06-12 14:22:09
 * @ Modified by: Your name
 * @ Modified time: 2023-06-12 14:25:09
 * @ Description:  自定义校验规则
 */

import { registerValidateRules } from '@apps/form'

function setRegisterValidateRules() {
  registerValidateRules({
    limitByte: (value, desc, rules) => {
      const { allowChineseTransform = true, maxByte } = desc
      let str = value
      let message = `不能超过${maxByte}个字符`
      if (allowChineseTransform) {
        str = str.replace(/[\u4E00-\u9FA5]/g, 'AA')
        message += `,或者${maxByte / 2}个汉字`
      }
      return str.length > maxByte ? message : ''
    },
  })
}

export default setRegisterValidateRules
