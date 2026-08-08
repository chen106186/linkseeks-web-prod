/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-16 09:51:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 20:19:10
 * @Description: 售后评价表单
 */
import React, { CSSProperties, useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Rate, View, Text, TextArea } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import MellowCard from '@/components/MellowCard'
import styles from './index.module.scss'

export interface Values {
  /**
   * 评分，1-5
   */
  level: number
  /**
   * 评价内容
   */
  content: string
}

interface IProps {
  /**
   * 表单元素值变化触发
   */
  onChange: (values: Values) => void
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 评价输入框 focus 事件
   */
  onFocus?: () => void
  /**
   * 评价输入框 blur 事件
   */
  onBlur?: () => void
}

const STAR_MAP: { [key: number]: string } = {
  1: 'afterRecords.components.evaluation.bad',
  2: 'afterRecords.components.evaluation.bad',
  3: 'afterRecords.components.evaluation.middle',
  4: 'afterRecords.components.evaluation.good',
  5: 'afterRecords.components.evaluation.good',
}

const Evaluation: React.FC<IProps> = (props: IProps) => {
  const { onChange, customStyle, onFocus, onBlur } = props
  const [star, setStar] = useState(5)
  const [comment, setComment] = useState('')

  const intl = useIntl()

  const handleCommontChange = (text: string) => {
    setComment(text)
  }

  const handleStarChange = (value) => {
    setStar(value)
  }

  useEffect(() => {
    if (onChange) {
      onChange({ level: star, content: comment })
    }
  }, [star, comment])

  const handleFocus = () => {
    if (onFocus) {
      onFocus()
    }
  }

  const handleBlur = () => {
    if (onBlur) {
      onBlur()
    }
  }

  return (
    <View className={styles['as-evaluation-form']} style={customStyle}>
      <View
        style={{
          flex: 1,
        }}
      >
        <MellowCard
          title={intl.formatMessage({
            id: 'afterRecords.components.evaluation.level.title',
            defaultMessage: '售后满意度',
          })}
          headStyle={{
            borderBottomWidth: 0,
          }}
        >
          <View className={styles['as-evaluation-form-rate']}>
            <Text className={styles['as-evaluation-form-rate-text']}>
              {intl.formatMessage({ id: STAR_MAP[star] as any })}
            </Text>
            <Rate value={star} size={32} onChange={handleStarChange} />
          </View>
        </MellowCard>
        <MellowCard
          title={intl.formatMessage({ id: 'afterRecords.components.evaluation.content', defaultMessage: '售后评价' })}
          headStyle={{
            borderBottomWidth: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <TextArea
            placeholder={intl.formatMessage({
              id: 'afterRecords.components.evaluation.content.placeholder',
              defaultMessage: '点击填写评价内容',
            })}
            value={comment}
            onChange={handleCommontChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            count={false}
          />
        </MellowCard>
      </View>
    </View>
  )
}

Evaluation.defaultProps = {
  customStyle: {},
  onFocus: undefined,
  onBlur: undefined,
}

export default Evaluation
