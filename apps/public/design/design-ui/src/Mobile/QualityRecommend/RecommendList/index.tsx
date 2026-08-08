import React from 'react'

export interface RecommendListProps {
  className: string
  activeType?: number
}

const RecommendList: React.FC<RecommendListProps> = (props) => {
  const { children, activeType, className } = props

  return (
    <div className={className}>
      {children &&
        React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            activeType,
          })
        })}
    </div>
  )
}

export default RecommendList
