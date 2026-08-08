import React from 'react'

export interface IconContextProps {
  size?: number | string
  color?: string
  className?: string
  prefix?: string
  style?: React.CSSProperties
  attr?: React.SVGAttributes<SVGAElement>
}

export const DefaultIconContext: IconContextProps = {
  size: '1em',
  color: undefined,
  className: undefined,
  prefix: undefined,
  style: undefined,
  attr: undefined,
}

export const IconContext: React.Context<IconContextProps> = React.createContext(DefaultIconContext)
