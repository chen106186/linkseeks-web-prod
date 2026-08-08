/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 09:58:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-26 14:14:22
 * @Description: 适用公用列表
 */
import React, { useState, useEffect } from 'react'
import { Checkbox, Row, Col } from 'antd'
import classNames from 'classnames'
import defaultLogo from '@/assets/default_logo.jpg'
import styles from './index.less'

export type OptionItemType = {
  /**
   * logo图片
   */
  logo: string
  /**
   * 名称
   */
  label: string
  /**
   * 数据id
   */
  value: number
}

export type ValueType = any[]

export type ApplicableListProps = {
  /**
   * 选项
   */
  options: OptionItemType[]
  /**
   * 值
   */
  value?: any[]
  /**
   * 默认值
   */
  defaultValue?: any[]
  /**
   * 选项改变触发事件
   */
  onChange?: (value: ValueType) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
}

const ShopList: React.FC<ApplicableListProps> = (props) => {
  const { options = [], value: outerValue, defaultValue = [], onChange, disabled } = props
  const initValue = 'value' in props ? outerValue : defaultValue
  const [value, setValue] = useState<ValueType>(initValue!)

  useEffect(() => {
    if ('value' in props) {
      setValue(props.value!)
    }
  }, [props.value])

  const handleChange = (val: ValueType) => {
    if (!('value' in props)) {
      setValue(val)
    }
    if (onChange) {
      onChange(val)
    }
  }

  return (
    <div className={styles['applicable-list']}>
      <Checkbox.Group
        value={value}
        onChange={handleChange}
        className={styles['applicable-list-checkboxGroup']}
        disabled={disabled}
      >
        <Row gutter={[16, 16]}>
          {options.map((item) => {
            const itemCls = classNames(styles['applicable-list-item'], {
              [styles['applicable-list-item-checked']]: Array.isArray(value) && value.includes(item.value),
            })
            return (
              <Col span={6} key={item.value}>
                <div className={itemCls}>
                  <img src={item.logo || defaultLogo} className={styles['applicable-list-item-logo']} />
                  <div className={styles['applicable-list-item-title']}>{item.label}</div>
                  <Checkbox value={item.value} className={styles['applicable-list-item-checkbox']} />
                </div>
              </Col>
            )
          })}
        </Row>
      </Checkbox.Group>
    </div>
  )
}

export default ShopList
