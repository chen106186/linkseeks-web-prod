import React from 'react'
import { Link } from '@linkseeks/router-core'
import { EyeOutlined } from '@ant-design/icons'
import { Button } from '@linkseeks/ui'

export interface EyePreviewProps {
  url?: string
  type?: 'button' | 'link'
  handleClick?()
  children: any
}

const EyePreview: React.FC<EyePreviewProps> = (props) => {
  return props.type === 'link' ? (
    <Link to={props.url || ''}>
      {props.children} <EyeOutlined />
    </Link>
  ) : (
    <Button onClick={props.handleClick} type="link">
      {props.children} <EyeOutlined />
    </Button>
  )
}

EyePreview.defaultProps = {
  type: 'link',
}

export default EyePreview
