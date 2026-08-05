import React from 'react'

const Text = (props) => {
  return <span {...props.props['x-component-props']}>{props.value}</span>
}

Text.defaultProps = {}

Text.isFieldComponent = true

export default Text
