/*
 * @Description: 折叠Card
 */
import React, { useState } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import './index.scss'

export interface CollapseCardProps extends Omit<MellowCardProps, 'bodyStyle'> {
  /**
   * 是否默认展开，默认 true
   */
  defaultCollapse?: boolean
  /**
   * 自定义内容样式
   */
  customContentStyle?: React.CSSProperties
}

const CollapseCard: React.FC<CollapseCardProps> = (props: CollapseCardProps) => {
  const { defaultCollapse = true, customContentStyle, extra, ...restProps } = props

  const [isCollapse, setIsCollapse] = useState(defaultCollapse)

  const handleToggle = () => {
    setIsCollapse(!isCollapse)
  }

  return (
    <MellowCard
      {...restProps}
      extra={
        !extra ? (
          <View className="collapse-card-arrow" onClick={handleToggle}>
            <View className="collapse-card-arrow-txt">{isCollapse ? '收起' : '展开'}</View>
            {isCollapse ? (
              <Icons name="ChevronUp" size={14} color="#91959B" />
            ) : (
              <Icons name="ChevronDown" size={14} color="#91959B" />
            )}
          </View>
        ) : (
          extra
        )
      }
      bodyStyle={{
        padding: 0,
      }}
    >
      <View
        className={classNames('collapse-card-content', {
          'collapse-card-content-show': isCollapse,
          'collapse-card-content-hide': !isCollapse,
          'collapse-card-content-empty': extra,
        })}
        style={customContentStyle}
      >
        {restProps.children}
      </View>
    </MellowCard>
  )
}

export default CollapseCard
