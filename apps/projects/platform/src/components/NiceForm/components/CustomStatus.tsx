import React from 'react'
import { Space } from 'antd'
import { useIntl } from '@linkseeks/i18n'
const CustomStatus = (props) => {
  const intl = useIntl()
  return (
    <>
      <Space>
        <span className={props.value === 1 ? 'commonStatusValid' : 'commonStatusInvalid'}></span>
        <span>
          {props.value === 1
            ? intl.formatMessage({ id: 'components.youxiao' })
            : intl.formatMessage({ id: 'components.wuxiao' })}
        </span>
      </Space>
    </>
  )
}

export default CustomStatus
