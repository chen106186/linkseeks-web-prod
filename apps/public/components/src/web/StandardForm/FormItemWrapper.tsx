import { Form, FormItemProps } from '@linkseeks/ui'
import React from 'react'

const { Item } = Form

interface FormItemWrapperProps extends FormItemProps {
  validateRules?: {
    type: keyof typeof ValidateType
    max?: any
    message?: string
  }[]

  full?: boolean

  display?: boolean
}

// 计算字符串长度
// 会认为中文是两个字符，其他为一个字符
const calculateCNStringLength = (str: string) => {
  return str.replace(/[\u4e00-\u9fa5]/g, '@@')
}

export const ValidateType = {
  chineseLength: {
    transform: calculateCNStringLength,
  },
}

const FormItemWrapper = (props: FormItemWrapperProps) => {
  const { validateRules, full, display = true, ...reset } = props

  const rules = []
  return display ? <Item {...reset} /> : null
}

export default FormItemWrapper
