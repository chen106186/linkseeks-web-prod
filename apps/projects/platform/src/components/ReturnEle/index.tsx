import React, { Component } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'

interface IProps {
  description?: string
  logoSrc?: string
}

const ReturnEle: React.FC<IProps> = (props) => {
  const { description, logoSrc } = props

  const bubbles = (e: any) => {
    let ev = e || window.event
    if (ev && ev.stopPropagation) {
      ev.stopPropagation()
    } else {
      ev.cancelBubble = true
    }
  }

  return (
    <>
      <span style={{ fontSize: 12, color: '#909399FF' }}>
        <ArrowLeftOutlined />
        {logoSrc ? (
          <img
            src={logoSrc}
            style={{ width: 48, height: 48, margin: '0 0 0 14px', cursor: 'default' }}
            onClick={bubbles}
          />
        ) : (
          description
        )}
      </span>
    </>
  )
}

export default ReturnEle
