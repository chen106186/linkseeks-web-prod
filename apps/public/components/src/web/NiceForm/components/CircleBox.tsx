import React from 'react'

const CircleBox = (props) => {
  return <div className="form-circle-box">{props.value}</div>
}

CircleBox.defaultProps = {}

CircleBox.isFieldComponent = true

export default CircleBox
