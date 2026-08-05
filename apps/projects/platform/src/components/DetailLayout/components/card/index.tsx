import React from 'react'

export interface CardType {
  /** 瞄点id */
  id?: string
  /** 标题 */
  title?: string
  /** 按钮组件 */
  extra?: React.ReactNode
  /** 背景颜色 */
  backgroundColor?: string
  children?: JSX.Element
}

const Card: React.FC<CardType> = (props: CardType) => {
  const { id, title, extra, children, backgroundColor } = props
  return (
    <div id={id} className="ant-card ant-card-bordered" style={{ marginBottom: 8 }}>
      <div
        className="ant-card-head"
        style={{
          padding: 0,
          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
          minHeight: 0,
        }}
      >
        <div className="ant-card-head-wrapper" style={{ padding: '16px 16px 0px' }}>
          <div
            className="ant-card-head-wrapper"
            style={{ color: backgroundColor ? '#FFF' : '#303133', fontSize: '14px' }}
          >
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
