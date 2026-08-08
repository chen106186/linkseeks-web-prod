import React from 'react'

const Text = (props: any) => {
  const { value } = props
  return <span {...props}>{value}</span>
}

Text.defaultProps = {}

Text.isFieldComponent = true

export default Text
