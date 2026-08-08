import React from 'react'
import { Link } from '@linkseeks/router-core'
import { EyeOutlined } from '@ant-design/icons'
import { Button } from '@linkseeks/ui'
import useAccess from '@apps/services/auth/useAccess'

export interface EyeAuthButtonProps {
  children?: any
  url?: string
  class?: boolean
  type?: 'button' | 'link'
  handleClick?: any
}

const EyeAuthButton: React.FC<EyeAuthButtonProps> = (props) => {
  const { handleUrlAccess } = useAccess()
  if (props.url && handleUrlAccess(props.url.split('?')[0])) {
    return props.type === 'link' ? (
      <Link to={props.url || ''}>
        <>
          {props.children}
          {!props.class && <EyeOutlined />}
        </>
      </Link>
    ) : (
      <Button onClick={props.handleClick} type="link">
        {props.children} {!props.class && <EyeOutlined />}
      </Button>
    )
  } else {
    return props.children
  }
}

EyeAuthButton.defaultProps = {
  type: 'link',
}

export default EyeAuthButton
