import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export interface IProps {
  label: string
  text: React.ReactNode
}

const Label: React.FC<IProps> = (props: any) => {
  const { label, text } = props
  return (
    <>
      {(text || text === 0) && (
        <div style={{ display: 'flex' }}>
          <Text style={{ width: '55px', display: 'inline-block' }} type="secondary">
            {label}:
          </Text>
          <Text>{text}</Text>
        </div>
      )}
    </>
  )
}
export default Label
