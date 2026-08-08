import React from 'react'
import styled from 'styled-components'

const CircleBox = (props) => {
  return <div className="form-circle-box">{props.value}</div>
}

CircleBox.defaultProps = {}

CircleBox.isFieldComponent = true

export default CircleBox
