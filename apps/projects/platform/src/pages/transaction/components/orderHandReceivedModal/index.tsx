import React, { useContext, useState, useEffect } from 'react'
import { Modal, Row, Col } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'

export interface OrderHandReceivedModalProps {
  currentRef: any
}
const intl = getIntl()
const OrderHandReceivedModal: React.FC<OrderHandReceivedModalProps> = ({ currentRef }) => {
  const {
    formContext: { data },
  } = useContext(OrderDetailContext)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const formData = data || {}
  // const { run, loading } = useHttpRequest(postOrderManualConfirmReceipt)
  const handleConfirm = async () => {
    // const { code } = await run({
    //   orderId: formData.id
    // })
    // if (code === 1000) {
    //   history.goBack()
    // }
  }

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible: confirmVisible,
        setVisible: setConfirmVisible,
      }
    }
  }, [])

  return (
    <Modal
      title={intl.formatMessage({ id: 'transaction_components.shouhuoxinxi' })}
      onOk={handleConfirm}
      onCancel={() => setConfirmVisible(false)}
      visible={confirmVisible}
      // confirmLoading={loading}
    >
      {formData && (
        <>
          <Row>
            <Col span={6}>
              <p>{intl.formatMessage({ id: 'transaction_components.fahuodizhi' })}: </p>
            </Col>
            <Col>
              <p>{formData.name}</p>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <p>{intl.formatMessage({ id: 'transaction_components.fahuoshijian' })}: </p>
            </Col>
            <Col>
              <p>{moment(formData.deliverTime).format('YYYY-MM-DD')}</p>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <p>{intl.formatMessage({ id: 'transaction_components.wuliudanhao' })}: </p>
            </Col>
            <Col>
              <p>
                <a href={`https://www.kuaidi100.com/chaxun?nu=${formData.deliverNo}`} target="_blank" rel="noreferrer">
                  {formData.deliverNo}
                </a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <p>{intl.formatMessage({ id: 'transaction_components.wuliugongsi' })}: </p>
            </Col>
            <Col>
              <p>{formData.logisticsCompany}</p>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  )
}

OrderHandReceivedModal.defaultProps = {}

export default OrderHandReceivedModal
