import React, { CSSProperties, useMemo } from 'react'
import { Popconfirm, Button } from '@linkseeks/ui'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import useAccess from '@apps/services/auth/useAccess'
import './status.global.less'
import SuperPopConfirm from '../SuperPopConfirm'

export interface StatusAuthButtonProps {
  record: any
  fieldNames?: string // 自定义字段名称 默认'status'
  expectTrueValue?: boolean | number | string //期望为ture(有效)的值 默认1
  handleConfirm?(e: any)
  handleCancel?()
  customStyle?: CSSProperties
}

const StatusAuthButton: React.FC<StatusAuthButtonProps> = (props) => {
  const intl = useIntl()
  const { handleAccess } = useAccess()
  const { record, fieldNames = 'status', customStyle } = props

  // @fix 0830 当前版本无需控制状态权限
  // 如果需要控制 直接放开注释即可
  // const isAccess = handleAccess(fieldNames)
  const isAccess = true

  const isSuccess = useMemo(() => {
    return !!record[fieldNames]
  }, [fieldNames, record])
  const renderIcon = isSuccess ? <PlayCircleOutlined /> : <PauseCircleOutlined />
  return (
    <SuperPopConfirm onConfirm={props.handleConfirm} onCancel={props.handleCancel}>
      <Button style={customStyle} className={isSuccess ? 'cp-status-success' : 'cp-status-error'} type="link-compact">
        {isSuccess
          ? intl.formatMessage({ id: 'common.status.effective', defaultMessage: '有效' })
          : intl.formatMessage({ id: 'common.status.invalid', defaultMessage: '无效' })}
        {isAccess && renderIcon}
      </Button>
    </SuperPopConfirm>
  )
}

StatusAuthButton.defaultProps = {}

export default StatusAuthButton
