import React from 'react'
import { Button } from '@linkseeks/ui'

interface IPros {
  title: string
}

const Submit = (props: IPros) => {
  return (
    <Button htmlType="submit" type="primary">
      {props.title}
    </Button>
  )
}

Submit.defaultProps = {
  title: '查询',
}

Submit.isFieldComponent = true

export default Submit
