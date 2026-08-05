/*
 * @Description: 锚点Card容器
 */
import React from 'react'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'

interface AnchorCardVirtualFieldWrapProps extends MellowCardProps {
  /**
   * 标题
   */
  title: string
  /**
   * 锚点key
   */
  anchorKey: string
}

const AnchorCardVirtualFieldWrap = (props) => {
  const { children } = props
  const xComponentProps: AnchorCardVirtualFieldWrapProps = props.props['x-component-props'] || {}
  const { anchorKey, title, ...rest } = xComponentProps
  return (
    <div id={anchorKey}>
      <MellowCard
        title={title}
        bodyStyle={{
          paddingBottom: 0,
        }}
        {...rest}
      >
        {children}
      </MellowCard>
    </div>
  )
}

AnchorCardVirtualFieldWrap.isVirtualFieldComponent = true

export default AnchorCardVirtualFieldWrap
