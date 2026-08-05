import React from 'react'
import { Space } from '@linkseeks/ui'

const CustomStatus = (props: { value: any }) => {
  return (
    <>
      <Space>
        <span className={props.value === 1 ? 'commonStatusValid' : 'commonStatusInvalid'}></span>
        <span>{props.value === 1 ? '有效' : '无效'}</span>
      </Space>
    </>
  )
}

export default CustomStatus
