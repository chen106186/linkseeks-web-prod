import React, { FC } from 'react'
import cx from 'classnames'
import { IconContext, IconContextProps } from './iconContext'

export interface IconTree {
  id?: string
  name?: string
  svg?: string
  icons?: IconTree[]
  [key: string]: any
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode
  size?: string | number
  color?: string
  title?: string
  attr?: Record<string, string>
  className?: string
}

export const IconBase: FC<IconBaseProps> = (props) => {
  const elem = (conf: IconContextProps) => {
    const { title, size, color, style, className, ...svgProps } = props
    const computedSize = size || conf.size || '1em'
    const computedStyle = {
      color: color || conf.color,
      ...conf.style,
      ...style,
    }

    return (
      <span className={cx('anticon', className)} {...svgProps}>
        {/* {props.children} */}
        {/* @ts-ignore */}
        {React.cloneElement(props.children, { width: computedSize, height: computedSize, style: computedStyle })}
        {/* <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          {...svgProps}
          style={computedStyle}
					width='1em'
					height='1em'
          // width={computedSize}
          // height={computedSize}
          xmlns="http://www.w3.org/2000/svg"
        >
          {props.children}
        </svg> */}
      </span>
    )
  }
  return <IconContext.Consumer>{(conf: IconContextProps) => elem(conf)}</IconContext.Consumer>
}
