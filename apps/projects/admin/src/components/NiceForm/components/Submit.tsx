import React, { useState } from 'react'
import { Input, Space, Button } from 'antd'

const Submit = (props) => {
  return (
    <Button htmlType="submit" type="primary">
      查询
    </Button>
  )
}

Submit.defaultProps = {}

Submit.isFieldComponent = true

export default Submit
