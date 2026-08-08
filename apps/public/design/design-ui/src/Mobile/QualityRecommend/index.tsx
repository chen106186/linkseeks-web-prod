import React, { useState } from 'react'

export interface QualityRecommendProps {
  className?: string
  defaultActiveType: number
  visible?: boolean
}

const QualityRecommend: React.FC<QualityRecommendProps> = (props) => {
  const { children, defaultActiveType, visible = true, className } = props
  const [activeType, seActiveType] = useState<number>(defaultActiveType)

  if (!visible) return null

  return (
    <div className={className}>
      {children &&
        React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            activeType,
            updateActiveType: (type: number) => seActiveType(type),
          })
        })}
    </div>
  )
}

QualityRecommend.defaultProps = {
  defaultActiveType: 1,
}

export default QualityRecommend
