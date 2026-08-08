import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Popconfirm, PopconfirmProps } from '@linkseeks/ui'

const SuperPopConfirm = (props: Partial<PopconfirmProps>) => {
  const intl = useIntl()
  // @fix 0830 当前版本无需控制状态权限
  // 如果需要控制 直接放开注释即可
  // const isAccess = handleAccess(fieldNames)
  const isAccess = true
  return (
    <Popconfirm
      {...props}
      title={intl.formatMessage({ id: 'common.tip.option.confirm', defaultMessage: '确定要执行这个操作?' })}
      okText={intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })}
      cancelText={intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' })}
      disabled={!isAccess}
    ></Popconfirm>
  )
}

export default SuperPopConfirm
