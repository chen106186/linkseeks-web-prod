import useAccess from '@apps/services/auth/useAccess'
import { Link, useLocation } from '@linkseeks/router-core'
import { EyeIcon } from '@linkseeks/icons'
import React, { useMemo } from 'react'
import { ReactNode } from 'react'

interface LinkAuthButtonProps {
  access: string
  children?: ReactNode
  url?: string
  icon?: boolean
}

const LinkAuthButton = (props: LinkAuthButtonProps) => {
  const access = useAccess()
  const location = useLocation()
  const url = useMemo(() => {
    if (props.url) {
      return props.url
    } else {
      const { pathname } = useLocation()
      const connectPath = pathname + '/' + props.access
      return connectPath
    }
  }, [props.url, props.access, location])
  return access[props.access] ? (
    <Link to={url}>
      {props.icon && <EyeIcon size={15} />}
      {props.children}
    </Link>
  ) : null
}

export default LinkAuthButton
