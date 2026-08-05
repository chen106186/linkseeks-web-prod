import React, { useState, useImperativeHandle, useRef, forwardRef, RefObject, useEffect } from 'react'
import { Modal, Drawer, ModalProps, Button, DrawerProps } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { TableContainer as StandardFormTable, StandardFormTableProps } from './standardFormTable'
import { ActionType } from './types'
import './index.less'

export interface ModalFormTableProps extends StandardFormTableProps<any> {
  modalType?: 'Modal' | 'Drawer'
  onClose?: () => void
  onOk?: (selectedRows: Record<string, any>[], selectRow: number[] | string[]) => void
  /** 弹窗标题 */
  modalTitle?: string
  width?: number
  modalProps?: ModalProps
  drawerProps?: DrawerProps
  actionRef: RefObject<ModalFormTableRef>
  /**
   * 切换显示隐藏的时候会触发
   */
  onVisible?(visible: boolean): void
}

export interface ModalFormTableRef extends ActionType {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalFormTable = (props: ModalFormTableProps) => {
  const {
    modalType = 'Modal',
    width = 700,
    modalTitle,
    modalProps,
    drawerProps,
    onOk,
    onClose,
    actionRef,
    loading,
    onVisible,
    ...resetProps
  } = props
  const [visible, setVisible] = useState<boolean>(false)
  const tableRef = useRef({} as ActionType)
  const intl = useIntl()

  useEffect(() => {
    if (onVisible) {
      onVisible(visible)
    }
  }, [visible])
  useImperativeHandle(
    actionRef,
    () =>
      new Proxy(
        {
          visible,
          setVisible,
          ...tableRef.current,
        },
        {
          get(target, key) {
            if (key === 'visible' || key === 'setVisible') {
              return target[key]
            } else {
              return tableRef.current[key]
            }
          },
        },
      ),
  )

  const handleConfirm = () => {
    // 是否需要关闭弹窗, 默认关闭
    onOk && onOk(tableRef.current.getSelectionItems(), tableRef.current.selectionKeys)
  }

  const handleCancel = () => {
    setVisible(false)
    onClose && onClose()
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          {intl.formatMessage({ id: 'member.actions.cancel', defaultMessage: '取消' })}
        </Button>
        <Button onClick={handleConfirm} type="primary">
          {intl.formatMessage({ id: 'member.actions.confirm', defaultMessage: '确定' })}
        </Button>
      </div>
    )
  }

  const Component = (modalType === 'Modal' ? Modal : Drawer) as unknown as React.ElementType

  const otherProps =
    modalType === 'Modal'
      ? {
          onOk: handleConfirm,
          onCancel: handleCancel,
          centered: true,
          forceRender: true,
          ...modalProps,
        }
      : {
          onClose: handleCancel,
          footer: renderFooter(),
          forceRender: true,
          ...drawerProps,
        }
  return (
    <Component
      className="standard-form-table-modal"
      width={width}
      title={modalTitle}
      open={visible}
      // forceRender
      confirmLoading={loading}
      {...otherProps}
    >
      <StandardFormTable
        {...resetProps}
        actionRef={tableRef}
        tableProps={
          modalType === 'Modal'
            ? {
                pagination: false,
                scroll: {
                  // /systemManage/platformRule/payStrategy/edit 选择适用会员样式 有问题关闭先
                  // y: 450,
                },
              }
            : {}
        }
        type={modalType === 'Modal' ? 'modal' : 'table'}
      />
    </Component>
  )
}

ModalFormTable.useTableRef = () => useRef<ModalFormTableRef>({} as any)

export default ModalFormTable
