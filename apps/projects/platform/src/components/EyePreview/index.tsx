import React from 'react'
import { Link } from '@linkseeks/router-core'
import { EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export interface EyePreviewProps {
  children?: any
  url?: string
  class?: boolean
  type?: 'button' | 'link'
  handleClick?: any
}

const EyePreview: React.FC<EyePreviewProps> = (props) => {
  return props.type === 'link' ? (
    <Link to={props.url || ''}>
      <>
        {props.children}
        {!props.class && <EyeOutlined />}
      </>
    </Link>
  ) : (
    <Button onClick={props.handleClick} type="link" style={{ padding: props.class && 0 }}>
      {props.children} {!props.class && <EyeOutlined />}
    </Button>
  )
}

EyePreview.defaultProps = {
  type: 'link',
}

export default EyePreview
