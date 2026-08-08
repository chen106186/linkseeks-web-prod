import React from 'react'

export interface CardType {
  id?: string
  title?: string
  extra?: React.ReactNode
  backgroundColor?: string
}

const Card: React.FC<CardType> = (props: any) => {
  const { id, title, extra, children, backgroundColor } = props
  return (
    <div id={id} className="ant-card ant-card-bordered" style={{ overflow: 'hidden' }}>
      <div
        className="ant-card-head"
        style={{ padding: 0, backgroundColor: backgroundColor ? backgroundColor : 'transparent' }}
      >
        <div className="ant-card-head-wrapper" style={{ padding: '12px 16px' }}>
          <div className="ant-card-head-wrapper" style={{ color: backgroundColor ? '#FFF' : '#303133' }}>
            {title}
          </div>
          {extra && <div className="ant-card-extra">{extra}</div>}
        </div>
      </div>
      <div className="ant-card-body">{children}</div>
    </div>
  )
}
export default Card
