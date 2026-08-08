import React from 'react'

interface ViewProps {
  style?: React.CSSProperties
  children: React.ReactNode
}

const View: React.FC<ViewProps> = (props: ViewProps) => {
  const { children, style } = props

  return <div style={style}>{children}</div>
}

export default View
