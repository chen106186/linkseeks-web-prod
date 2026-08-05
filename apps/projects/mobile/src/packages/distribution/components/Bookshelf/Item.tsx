/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 18:51:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 16:33:30
 * @Description: 图书架子项组件
 */
import React from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import bookshelfContext from './context'
import './index.scss'

interface BookshelfItemProps {
  /**
   * label文本
   */
  label: React.ReactNode
  /**
   * content文本
   */
  content: React.ReactNode
  /**
   * 是否展示右侧箭头并开启点击反馈
   */
  isLink?: boolean
  /**
   * 是否展示边框
   */
  border?: boolean
  /**
   * label宽度
   */
  labelWidth?: number
  /**
   * label样式
   */
  labelStyle?: React.CSSProperties
  /**
   * label样式
   */
  labelClassName?: string
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义链接样式
   */
  customLinkStyle?: React.CSSProperties
  /**
   * 点击事件
   */
  onPress?: () => void
}

const BookshelfItem: React.FC<BookshelfItemProps> = (props: BookshelfItemProps) => {
  const {
    label,
    content,
    isLink,
    border = false,
    labelWidth = 'auto',
    labelStyle,
    labelClassName,
    customStyle,
    customLinkStyle,
    onPress,
  } = props

  const context = React.useContext(bookshelfContext)

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  const renderContent = () => {
    if (typeof content !== 'object') {
      return <Text className="bookshelf-item-content">{content}</Text>
    }
    return <View className="bookshelf-item-content">{content}</View>
  }

  const mergeLabelWidth = labelWidth || context?.labelWidth

  return (
    <View
      className={classNames('bookshelf-item', {
        'bookshelf-item__border': border,
      })}
      style={customStyle}
      onClick={handlePress}
    >
      <Text
        className={classNames('bookshelf-item-label', labelClassName)}
        style={{
          width: mergeLabelWidth ? `${mergeLabelWidth}px` : 'auto',
          ...labelStyle,
        }}
      >
        {label}
      </Text>
      {renderContent()}
      {isLink ? (
        <View className="bookshelf-item-link" style={customLinkStyle}>
          <Icons name="ChevronRight" size={12} color="#909399" />
        </View>
      ) : null}
    </View>
  )
}

BookshelfItem.defaultProps = {
  isLink: false,
  customStyle: {},
  onPress: undefined,
  border: false,
  labelWidth: 0,
  labelStyle: {},
  customLinkStyle: {},
}

export default BookshelfItem
