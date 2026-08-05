import { CSSProperties } from 'react'

export type StyleProps = string | CSSProperties

export interface GodComponent {
  className?: string

  customStyle?: string | CSSProperties

  children?: React.ReactNode
}

export interface GodIconBaseProps2 extends GodComponent {
  value: string

  color?: string
}

export interface GodIconBaseProps extends GodComponent {
  name: string

  color?: string

  prefixClass?: string

  size?: number | string
}

export default GodComponent
