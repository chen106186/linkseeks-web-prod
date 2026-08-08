/**
 * 信息完整度组件
 * @author Crayon
 */

import { useState, useImperativeHandle, forwardRef, ReactNode } from 'react'
import { FormInstance } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

export type HandleType = {
  /**
   * @param form FormInstance<any> 传入 form 对象，默认通过 form.getFieldsValue() 获取值，若传入的不是 form 对象，则需要手动组装一个有 getFieldsValue 方法的对象
   * @param otherValues Object 其他需要计算的值
   */
  render: (form: FormInstance<any>, otherValues?: Object) => void
}

export type listFieldsConfigItemType = {
  parentField: string // 父级字段名
  valueField?: string[] // 当前需要计算的值字段
  children?: listFieldsConfigItemType // 子级
}

type PropsType = {
  title?: string | ReactNode // 标题
  disabled?: boolean // 是否禁用(即不展示)
  ignoreConfig?: Array<{ key?: string; value?: any; ignoreKey: string }> // 需要忽略的字段（key 和 value 是 忽略 ignoreKey 的前置条件）
  listFieldConfig?: listFieldsConfigItemType[] // 列表字段内部需要计算的字段配置
}

type ColorItemType = { bg: string; text: string }

type ColorType = {
  error: ColorItemType
  warning: ColorItemType
  success: ColorItemType
}

const COLOR: ColorType = {
  error: { bg: '#FDE8EA', text: '#E34D59' },
  warning: { bg: '#FCF7E8', text: '#D8A042' },
  success: { bg: '#E4F7EF', text: '#00A98F' },
}

/** 根据数值获取对应颜色 */
export const getColor = (scale: number) => {
  if (scale < 60) {
    return COLOR.error
  }
  if (scale < 85) {
    return COLOR.warning
  }
  if (scale <= 100) {
    return COLOR.success
  }
}

const FormProgress = ({ title, disabled, ignoreConfig = [], listFieldConfig = [] }: PropsType, ref: any) => {
  const intl = useIntl()
  const [scale, setScale] = useState<number>(0)

  useImperativeHandle(ref, () => ({
    // 通过 ref 调用 render 方法进行计算及渲染完整度
    render(form: FormInstance<any>, otherValues = {}) {
      if (disabled) return

      const values = {
        ...form.getFieldsValue(),
        ...otherValues,
      }

      // 递归列表字段内部需要计算的字段配置
      const deepListFieldConfig = (filedList, fieldConfig, level: number) => {
        filedList[fieldConfig.parentField]?.forEach((i, idx) => {
          fieldConfig.valueField?.forEach((v) => {
            values[v + `_${level}_${idx}`] = i[v] // 将需要计算的值拼一个特殊标识存储到 values 中
          })
          if (fieldConfig.children) {
            deepListFieldConfig(i, fieldConfig.children, level + 1)
          }
        })
      }

      // 列表字段的列表内存在动态（即可输入可变化）的值
      // 根据配置进行递归扁平化到values中
      listFieldConfig.map((item) => {
        deepListFieldConfig(values, item, 1)
      })

      // 处理忽略字段
      ignoreConfig?.forEach((item) => {
        // 1. 当 key 或者 value 没配置的情况，默认忽略 ignoreKey
        // 2. 当 values 里 [key] 的值 与 value 相等的情况下 忽略 ignoreKey
        if ((!item.key && !item.value && item.ignoreKey) || values[item.key] === item.value) {
          delete values[item.ignoreKey]
        }
      })

      let denominator = Object.keys(values).length
      let molecule = 0
      for (let key in values) {
        // '' undefined null 不进行计算
        if (!['', undefined, null].includes(values[key])) {
          // 空数组不进行计算
          if (Array.isArray(values[key]) && !values[key].length) {
            continue
          }
          molecule++
        }
      }
      const result = Number(((molecule / denominator) * 100).toFixed(0))
      setScale(result)
    },
  }))

  return (
    <div className={styles.progressBox}>
      {title}
      {!disabled && (
        <div className={styles.progress} style={{ backgroundColor: getColor(scale)?.bg, color: getColor(scale)?.text }}>
          {intl.formatMessage({ id: 'process.infointegrity', defaultMessage: '信息完整度' })} {scale}%
        </div>
      )}
    </div>
  )
}

export default forwardRef(FormProgress)
