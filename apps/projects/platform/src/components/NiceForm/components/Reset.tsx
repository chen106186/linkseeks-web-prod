import React from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'

// schema组件 重置按钮

const Reset = () => {
  const intl = useIntl()
  return (
    <Button htmlType="reset" type="primary">
      {intl.formatMessage({ id: 'components.zhongzhi' })}
    </Button>
  )
}

Reset.defaultProps = {}

Reset.isFieldComponent = true

export default Reset
