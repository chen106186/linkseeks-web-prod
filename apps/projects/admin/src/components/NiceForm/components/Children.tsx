import React from 'react'

const Children = ({ props }) => {
  const children = props['x-component-props'] ? props['x-component-props'].children : null
  return children
}

Children.defaultProps = {}

Children.isFieldComponent = true

export default Children
