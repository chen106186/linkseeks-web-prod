import React, { useState, useEffect, useContext } from 'react'
import { Modal, List, Button, Space } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { OrderDetailContext } from '../../context'
import { history } from '@linkseeks/router-manager'
import OverflowText from '@/components/OverflowText'
import { postOrderPlatformManagePayConfirm } from '@apps/apis'

export interface OrderPayResultModalProps {
  /** default: 确认模式，preview: 预览模式 */
  type: 'default' | 'preview'
  currentRef: any
}

const OrderPayResultModal: React.FC<OrderPayResultModalProps> = ({ type, currentRef }) => {
  const { data } = useContext(OrderDetailContext)
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const [isReady, setIsReady] = useState<any>()
  const canCtlData = data.payments.find((v) => (type === 'preview' ? v.showView : v.showConfirm)) || {}

  // const transData = canCtlData.vouchers?.split(',') || []

  const transData = canCtlData.vouchers || []

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible,
        setVisible,
      }
    }
  }, [])

  const handleCancel = () => {
    setVisible(false)
  }

  const handleConfirm = (isReady) => {
    setIsReady(isReady)
    const params = {
      agree: isReady,
      orderId: Number(id),
      batchNo: canCtlData.batchNo,
    }

    postOrderPlatformManagePayConfirm(params).then((res) => {
      if (res.code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 1000)
      } else {
        setIsReady(null)
      }
    })
  }

  return (
    <Modal
      title={type === 'default' ? '确认支付结果' : '查看支付结果'}
      visible={visible}
      onCancel={handleCancel}
      footer={
        type === 'default' && transData ? (
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button loading={isReady === 0} onClick={() => handleConfirm(0)} type="dashed">
              确认未到账
            </Button>
            <Button loading={isReady === 1} onClick={() => handleConfirm(1)} type="primary">
              确认到账
            </Button>
          </Space>
        ) : null
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={transData || []}
        renderItem={(item: string) => (
          <List.Item
            style={{ fontSize: 12 }}
            extra={
              <a href={item} target="_blank">
                预览
              </a>
            }
          >
            <OverflowText style={{ flex: '.9' }}>{item}</OverflowText>
          </List.Item>
        )}
      />
    </Modal>
  )
}

OrderPayResultModal.defaultProps = {}

export default OrderPayResultModal
