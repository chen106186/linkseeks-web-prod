import React from 'react'
// import { UploadImage } from '@apps/components'

const CustomUpload = (props) => {
  const { mutators } = props
  const uploadProps = props.props['x-component-props'] || {}
  return null
  // <UploadImage
  //   imgUrl={props.value}
  //   onChange={(data) => {
  //     // 这里能拿到change后的data值
  //     mutators.change(data)
  //   }}
  //   {...uploadProps}
  // />
}

CustomUpload.isFieldComponent = true

export default CustomUpload
