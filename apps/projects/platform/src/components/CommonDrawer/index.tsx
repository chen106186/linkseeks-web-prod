import React, { useState, useImperativeHandle, forwardRef, memo } from 'react'
import { Drawer, Space, Button, DrawerProps } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

export type HandleType = {
  show: (flag?: boolean, params?: any) => void
}

interface PropsType extends DrawerProps {
  onOk?: () => void
  okText?: string
  onCancel?: (fnClose?: Function) => void
  cancelText?: string
  children?: React.ReactNode
  onShow?: (params: any, flag?: boolean) => void
  specialFooter?: React.ReactNode
  confirmLoading?: boolean
  confirmDisabled?: boolean
}

const CommonDrawer = (props: PropsType, ref: any) => {
  const intl = useIntl()
  const {
    onOk,
    onCancel,
    onShow,
    okText = intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' }),
    cancelText = intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' }),
    specialFooter,
    children,
    confirmLoading,
    confirmDisabled,
    ...rest
  } = props
  const [visible, setVisible] = useState<boolean>(false)

  const _onCancel = () => {
    if (onCancel) {
      onCancel(() => {
        setVisible(false)
      })
    } else {
      setVisible(false)
    }
  }

  useImperativeHandle(ref, () => ({
    show(flag, params = {}) {
      setVisible(flag)
      onShow?.(params, flag)
    },
  }))

  return (
    <Drawer
      className={styles['common-drawer']}
      visible={visible}
      onClose={_onCancel}
      maskClosable={false}
      keyboard={false}
      footer={
        <div>
          <div>{specialFooter}</div>
          <div style={{ textAlign: 'right' }}>
            <Space size={12}>
              {onCancel && <Button onClick={_onCancel}>{cancelText}</Button>}
              {onOk && (
                <Button disabled={confirmDisabled} type="primary" onClick={onOk} loading={confirmLoading}>
                  {okText}
                </Button>
              )}
            </Space>
          </div>
        </div>
      }
      {...rest}
    >
      {children}
    </Drawer>
  )
}

export default memo(forwardRef(CommonDrawer))
