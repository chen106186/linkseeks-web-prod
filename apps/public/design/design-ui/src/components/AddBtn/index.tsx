import React from 'react'

interface AddBtnProps {
  style?: React.CSSProperties
}

const AddBtn: React.FC<AddBtnProps> = (props) => {
  const { children, style } = props

  return <div style={style}>{children}</div>
}

export default AddBtn
