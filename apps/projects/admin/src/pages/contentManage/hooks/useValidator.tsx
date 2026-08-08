import React, { useEffect, useState } from 'react'
import { registerValidationRules } from '@apps/formily'

const useCustomValidator = () => {
  useEffect(() => {
    //自定义校验规则
    registerValidationRules({
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
      isInteger: (value, des, rules) => {
        if (typeof value == 'undefined' || value == '') {
          return ''
        }
        const isNumber = /^\d+$/
        const message = des ? '只允许填写正整数' : des
        const pattern = /[0-9]+\.[0-9]*/
        return !isNumber.test(value) || pattern.test(value) ? message : ''
      },
    })
  }, [])
}

export default useCustomValidator
