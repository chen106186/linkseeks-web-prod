import React, { Suspense } from 'react'
import { Modal } from 'antd'
import { useIntl } from '@linkseeks/i18n'

const Balance = React.lazy(() => import('./Balance'))
const Credit = React.lazy(() => import('./Credit'))
const COD = React.lazy(() => import('./COD'))
const MonthlyStatement = React.lazy(() => import('./MonthlyStatement'))
const PaymentDays = React.lazy(() => import('./PaymentDays'))

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

  const intl = useIntl()

  const tempMap = {
    balance: {
      width: 600,
      title: intl.formatMessage({ id: 'afterService.components.RefundModal.title', defaultMessage: '退款处理' }),
      render: () => (
        <Suspense fallback={null}>
          <Balance value={rest} purchaserId={purchaserId} purchaserRoleId={purchaserRoleId} />
        </Suspense>
      ),
    },
    credit: {
      width: 600,
      title: intl.formatMessage({ id: 'afterService.components.RefundModal.title', defaultMessage: '退款处理' }),
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
      title: intl.formatMessage({ id: 'afterService.components.COD.title', defaultMessage: '货到付款退款确认' }),
      render: () => (
        <Suspense fallback={null}>
          <COD value={rest} />
        </Suspense>
      ),
    },
    monthlyStatement: {
      width: 600,
      title: intl.formatMessage({
        id: 'afterService.components.MonthlyStatement.title',
        defaultMessage: '月结支付退款确认',
      }),
      render: () => (
        <Suspense fallback={null}>
          <MonthlyStatement value={rest as any} />
        </Suspense>
      ),
    },
    paymentDays: {
      width: 600,
      title: intl.formatMessage({
        id: 'afterService.components.PaymentDays.title',
        defaultMessage: '账期支付退款确认',
      }),
      render: () => (
        <Suspense fallback={null}>
          <PaymentDays value={rest as any} />
        </Suspense>
      ),
    },
  }

  const template = tempMap[modalName] || {
    width: 640,
    title: intl.formatMessage({ id: 'afterService.components.RefundModal.default', defaultMessage: '标题' }),
    render: () =>
      intl.formatMessage({ id: 'afterService.components.RefundModal.nothing', defaultMessage: '没有找到 modal 模板' }),
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
      okText={intl.formatMessage({ id: 'afterService.components.RefundModal.okText', defaultMessage: '退款' })}
      destroyOnClose
    >
      {template.render()}
    </Modal>
  )
}

export default RefundModal
