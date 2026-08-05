/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-11 10:49:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 10:56:22
 * @Description: 复制文本组件
 */
import React from 'react'
import { Text, View, Toast } from '@apps/mobile-ui'
import { setClipboardData } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import './index.scss'

interface CopyProps {
  /**
   * 需要复制到剪贴板的内容，只支持文本
   */
  text: string
  /**
   * 描述，复制按钮 左侧文本
   */
  description?: string
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义文本样式
   */
  customTextStyle?: React.CSSProperties
  /**
   * 自定义描述文本样式
   */
  customDescriptionStyle?: React.CSSProperties
}

const Copy: React.FC<CopyProps> = (props: CopyProps) => {
  const { text, description, customStyle, customTextStyle, customDescriptionStyle } = props
  const intl = useIntl()

  const handleCopy = () => {
    if (!text) {
      Toast.show({ title: intl.formatMessage({ id: 'components.copy.tip', defaultMessage: '没有可复制的内容' }) })
      return
    }
    setClipboardData({
      data: text,
      success: () => {
        if (process.env.TARO_ENV === 'h5') {
          Toast.show({
            title: intl.formatMessage({ id: 'components.copy.success.tip', defaultMessage: '内容复制成功' }),
            icon: 'none',
          })
        }
      },
    })
  }

  return (
    <View onClick={handleCopy} className="copy" style={customStyle}>
      {description && (
        <Text className="copy-desc" style={customDescriptionStyle}>
          {description}
        </Text>
      )}
      <View className="copy-main">
        <Text className="copy-text" style={customTextStyle}>
          {intl.formatMessage({ id: 'components.copy.text', defaultMessage: '复制' })}
        </Text>
      </View>
    </View>
  )
}

Copy.defaultProps = {
  customStyle: {},
  customTextStyle: {},
}

export default Copy
