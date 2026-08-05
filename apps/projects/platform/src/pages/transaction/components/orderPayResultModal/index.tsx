import React, { useState, useEffect, useContext, useRef } from 'react'
import { Modal, List, Button, Space } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { OrderDetailContext } from '../../_public/order/context'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import OverflowText from '@/components/OverflowText'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import ImagePreview from '@/components/ImagePreview'
import { postOrderVendorValidatePayConfirm } from '@apps/apis'
const intl = getIntl()
export interface OrderPayResultModalProps {
  type: 'default' | 'preview'
  currentRef: any
}

const OrderPayResultModal: React.FC<OrderPayResultModalProps> = ({ type, currentRef }) => {
  const imgRef = useRef<any>({})
  const {
    formContext: { data },
  } = useContext(OrderDetailContext)
  const { id } = usePageStatus()
  const [visible, setVisible] = useState(false)
  const canCtlData = data?.payments.find((v) => v.showConfirm) || {}
  const { run, loading } = useHttpRequest(postOrderVendorValidatePayConfirm)
  const transData = canCtlData.vouchers?.length ? canCtlData.vouchers : []
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

  const handleConfirm = async (isReady) => {
    const params = {
      agree: isReady,
      orderId: Number(id),
      batchNo: canCtlData.batchNo,
    }

    const { code } = await run(params)
    if (code === 1000) {
      history.goBack()
    }
  }

  return (
    <Modal
      title={
        type === 'default'
          ? intl.formatMessage({ id: 'transaction_components.querenzhifujieguo' })
          : intl.formatMessage({ id: 'transaction_components.zhakanzhifujieguo' })
      }
      visible={visible}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={
        type === 'default' && transData ? (
          <Space>
            <Button onClick={handleCancel}>{intl.formatMessage({ id: 'transaction_components.quxiao' })}</Button>
            <Button onClick={() => handleConfirm(0)} type="dashed">
              {intl.formatMessage({ id: 'transaction_components.querenweidaozhang' })}
            </Button>
            <Button onClick={() => handleConfirm(1)} type="primary">
              {intl.formatMessage({ id: 'transaction_components.querendaozhang' })}
            </Button>
          </Space>
        ) : null
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={transData || []}
        renderItem={(item: string) => (
          // <List.Item  style={{fontSize: 12}} extra={<Button type='link' onClick={() => imgRef.current.toggle(index)}>预览</Button>}>
          <List.Item
            style={{ fontSize: 12 }}
            extra={
              <Button type="link" href={item} target="_blank">
                {intl.formatMessage({ id: 'transaction_components.yulan' })}
              </Button>
            }
          >
            <OverflowText style={{ flex: '.9' }}>{item}</OverflowText>
            <ImagePreview src={transData || []} currentRef={imgRef} />
          </List.Item>
        )}
      />
    </Modal>
  )
}

OrderPayResultModal.defaultProps = {}

export default OrderPayResultModal
