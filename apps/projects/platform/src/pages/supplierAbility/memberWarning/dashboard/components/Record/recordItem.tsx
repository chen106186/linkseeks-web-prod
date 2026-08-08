import StatusTag, { StatusTagProps } from '@/components/StatusTag'
import React from 'react'

interface Iprops {
  type?: Pick<StatusTagProps, 'type'>['type']
  alert: string
  content: string
}

const RecordItem: React.FC<Iprops> = (props: Iprops) => {
  const { type, alert, content } = props
  return (
    <div>
      <StatusTag type={type} title={alert} />
      <p style={{ margin: '0' }}>{content}</p>
    </div>
  )
}

RecordItem.defaultProps = {
  type: 'primary',
}

export default RecordItem
