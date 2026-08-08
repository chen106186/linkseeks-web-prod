import React from 'react'
import { InputNumber, InputNumberProps } from 'antd'

interface IProps extends InputNumberProps {
  decimals?: number // 保留小数位(1位以上起效)
  tips?: React.ReactNode | string
}

/**
 * 数字输入框
 * @param {number | string} width 输入框宽度
 * @param {number} decimals 保留小数位(1位以上起效)
 * @returns
 */
const NumberInput = ({ decimals, tips, ...rest }: IProps) => {

  // 限制小数位
  const limitDecimals = (value: string | number | undefined): string => {
    let i = 1,
      str = '\\d'
    if (decimals) {
      while (i < decimals) {
        str += '\\d'
        i++
      }
    }
    const reg2 = new RegExp('^(\\-)*(\\d+)\\.(' + str + ').*$')
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg2, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg2, '$1$2.$3') : ''
    } else {
      return ''
    }
  }

  return (
    <>
      <InputNumber
        formatter={decimals ? limitDecimals : undefined}
        parser={decimals ? limitDecimals : undefined}
        {...rest}
      />
      {tips && <div style={{ color:'#91959B' }}>{tips}</div>}
    </>
  )
}

export default NumberInput
