import React, { Suspense } from 'react'
import { Modal } from 'antd'

const Balance = React.lazy(() => import('./Balance'))
const Credit = React.lazy(() => import('./Credit'))
const COD = React.lazy(() => import('./COD'))

export interface RefundModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 对应的弹窗名称
   */
  modalName: string
  /**
   * 关闭事件
   */
  handleModalVisible: () => void
  /**
   * 弹窗内确认事件
   */
  handleConfirm: (values: { [key: string]: any }, modalName: string) => void
  /**
   * 弹窗需要的数据值
   */
  value: { [key: string]: any }
  /**
   * 弹窗提交 loading
   */
  submitLoading: boolean
}

const RefundModal: React.FC<RefundModalProps> = ({
  visible = false,
  modalName = 'uploadVoucher',
  handleModalVisible,
  handleConfirm,
  value,
  submitLoading,
}) => {
  const { purchaserId, purchaserRoleId, supplierId, supplierRoleId, ...rest } = value

  const tempMap = {
    balance: {
      width: 600,
      title: '退款处理',
      render: () => (
        <Suspense fallback={null}>
          <Balance value={rest} purchaserId={purchaserId} purchaserRoleId={purchaserRoleId} />
        </Suspense>
      ),
    },
    credit: {
      width: 600,
      title: '退款处理',
      render: () => (
        <Suspense fallback={null}>
          <Credit
            value={rest}
            purchaserId={purchaserId}
            purchaserRoleId={purchaserRoleId}
            supplierId={supplierId}
            supplierRoleId={supplierRoleId}
          />
        </Suspense>
      ),
    },
    COD: {
      width: 600,
      title: '货到付款退款确认',
      render: () => (
        <Suspense fallback={null}>
          <COD value={rest} />
        </Suspense>
      ),
    },
  }

  const template = tempMap[modalName] || {
    width: 640,
    title: '标题',
    render: () => '没有找到 modal 模板',
  }

  return (
    <Modal
      width={template.width}
      title={template.title}
      visible={visible}
      onCancel={() => handleModalVisible()}
      onOk={() => handleConfirm(value, modalName)}
      okButtonProps={{
        loading: submitLoading,
      }}
      okText="退款"
      destroyOnClose
    >
      {template.render()}
    </Modal>
  )
}

export default RefundModal
