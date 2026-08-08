import React from 'react'
import { Space } from 'antd'

const CustomStatus = (props) => {
  console.log(props)
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
