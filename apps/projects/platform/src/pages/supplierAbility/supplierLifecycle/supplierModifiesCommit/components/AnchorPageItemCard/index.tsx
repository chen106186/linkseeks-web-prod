/*
 * @Description: 锚点项Card
 */
import React from 'react'
import themeConfig from '@apps/config/lingxi.theme.config'
import MellowCard from '@/components/MellowCard'

interface AnchorPageItemCardProps {
  /**
   * 标题
   */
  title: string
  /**
   * 锚点key
   */
  anchorKey: string

  children: React.ReactNode
}

const AnchorPageItemCard = (props) => {
  const { schema, children } = props
  const componentProps: AnchorPageItemCardProps = schema.getExtendsComponentProps() || {}

  return (
    <div id={componentProps.anchorKey}>
      <MellowCard
        title={componentProps.title}
        bodyStyle={{
          paddingBottom: 0,
        }}
        style={{
          marginBottom: themeConfig['@margin-md'],
        }}
      >
        {children}
      </MellowCard>
    </div>
  )
}

AnchorPageItemCard.isVirtualFieldComponent = true

export default AnchorPageItemCard
