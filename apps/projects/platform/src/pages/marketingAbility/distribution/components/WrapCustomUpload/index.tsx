import React from 'react'
import CustomUpload from '@/components/NiceForm/components/CustomUpload'

const WrapCustomUpload = (props) => {
  const imgUrl = props.value
  const errors = props.errors
  const editable = props.editable
  return (
    <>
      {editable ? (
        <div>
          <CustomUpload {...props}></CustomUpload>
        </div>
      ) : (
        <div>
          <img src={imgUrl} style={{ width: '104px', height: '104px' }} />
        </div>
      )}
    </>
  )
}

WrapCustomUpload.isFieldComponent = true

export default WrapCustomUpload
