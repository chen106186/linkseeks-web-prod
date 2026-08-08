/*
 * @Description: 省市区选择组件
 */
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import themeConfig from '@apps/config/lingxi.theme.config'
import AreaSelectItem, { AreaSelectValueType } from './AreaSelectItem'
import styles from './index.less'

interface AreaSelectProps {
  /**
   * 值，code数组
   */
  value?: AreaSelectValueType[]
  /**
   * 选择触发改变
   */
  onChange?: (value: AreaSelectValueType[]) => void
  /**
   * 选择级别，3到街道，2到区，1到市
   */
  level?: 1 | 2 | 3
  /**
   * 是否监听value变化
   */
  valueChange?: boolean
}

const MAX = 3 // 到街道

const AreaSelect: React.FC<AreaSelectProps> = (props) => {
  const { value, level = 3, valueChange = true, onChange } = props
  const [innerValues, setInnerValues] = useState<AreaSelectValueType[]>([])

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props && value?.length && valueChange) {
      setInnerValues(value)
    }
  }, [value])

  const triggerChange = (value: AreaSelectValueType[]) => {
    if (onChange) {
      onChange(value)
    }
  }

  const handleResetChang = (newInnerValues: AreaSelectValueType[], index: number) => {
    let i = index + 1
    while (i < newInnerValues.length) {
      newInnerValues[i] = undefined
      i++
    }
    newInnerValues = newInnerValues.filter(Boolean)
  }

  const handleSelectChange = (value: AreaSelectValueType, index: number) => {
    let newInnerValues = [...innerValues]

    newInnerValues[index] = value

    // 如果是清空操作，则把当前层级之后的 选项 及 值 也清空
    if (!value) {
      handleResetChang(newInnerValues, index)
      triggerChange([])
    } else {
      handleResetChang(newInnerValues, index)
      let i = index + 1
      while (i < newInnerValues.length) {
        newInnerValues[i] = undefined
        i++
      }
      newInnerValues = newInnerValues.filter(Boolean)
      triggerChange([])
    }

    if (!('value' in props) || !valueChange) {
      setInnerValues(newInnerValues)
    }

    // 全部选择了才触发 onChange
    if (newInnerValues.length >= level) {
      triggerChange(newInnerValues)
    } else {
      setInnerValues(newInnerValues)
    }
  }

  return (
    <div className={styles['area-select']}>
      <Row gutter={parseInt(themeConfig['@padding-sm'])}>
        <Col span={6}>
          <AreaSelectItem
            pcode={null}
            customClassName={styles['area-select-item']}
            value={innerValues[0]}
            onChange={(value) => handleSelectChange(value, 0)}
            placeholder={intl.formatMessage({ id: 'components.shengfenzhixiashi', defaultMessage: '-省份/直辖市-' })}
          />
        </Col>
        <Col span={6}>
          <AreaSelectItem
            pcode={innerValues[0]?.code}
            customClassName={styles['area-select-item']}
            value={innerValues[1]}
            onChange={(value) => handleSelectChange(value, 1)}
            placeholder={intl.formatMessage({ id: 'components.shi', defaultMessage: '-市-' })}
          />
        </Col>
        {level > 1 && (
          <Col span={6}>
            <AreaSelectItem
              pcode={innerValues[1]?.code}
              customClassName={styles['area-select-item']}
              value={innerValues[2]}
              onChange={(value) => handleSelectChange(value, 2)}
              placeholder={intl.formatMessage({ id: 'components.qu', defaultMessage: '-区-' })}
            />
          </Col>
        )}
        {level > 2 && (
          <Col span={6}>
            <AreaSelectItem
              pcode={innerValues[2]?.code}
              customClassName={styles['area-select-item']}
              value={innerValues[3]}
              onChange={(value) => handleSelectChange(value, 3)}
              placeholder={intl.formatMessage({ id: 'components.jiedao', defaultMessage: '-街道-' })}
            />
          </Col>
        )}
      </Row>
    </div>
  )
}

export default AreaSelect
