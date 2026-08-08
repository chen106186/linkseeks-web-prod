import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Radio, Input, Tooltip } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { postOrderBuyerValidateConfirmElectronicContract } from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { QuestionCircleOutlined } from '@ant-design/icons'

export interface OrderElectronModalProps {
  currentRef: any
  type?: 'purchaseOrder' | 'saleOrder'
  ctx?: any
}
const intl = getIntl()
//@todo 尚未完成
const OrderElectronModal: React.FC<OrderElectronModalProps> = (props) => {
  const { currentRef, type } = props
  const {
    formContext: { data },
  } = useContext(OrderDetailContext)
  // @ts-ignore
  // 采购过来确认先调用 ContractContractSignProcurementSign 在执行 postContractElectronicContractsAffirm
  // 销售过来确认先调用 ContractContractSignSaleSign 在执行 postOrderConfirmedOrder
  // const { run, loading } = useHttpRequest(type === 'saleOrder' ? ContractContractSignSaleSign : postContractElectronicContractsAffirm)
  // const { run, loading } = useHttpRequest(type === 'saleOrder' ? postContractContractSignSaleSign : postContractContractSignProcurementSign)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [auditStatus, setAuditStatus] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    currentRef.current = {
      visible,
      setVisible,
    }
  }, [currentRef, visible])

  const onRadioGroupChange = (val: any) => {
    setAuditStatus(val)
  }

  const handleSubmit = async () => {
    form.validateFields().then((values) => {
      const params: any = {}
      if (type === 'saleOrder') {
        params.contractName = data.electronicContractName
        params.contractUrl = data.electronicContractUrl
        params.memberId = data.createMemberId
      } else {
        params.orderId = data.orderId
      }
      setLoading(true)
      postOrderBuyerValidateConfirmElectronicContract({
        ...values,
        ...params,
      })
        .then((res) => {
          setLoading(false)
          if (res.code === 1000) {
            history.goBack()
          }
        })
        .catch((err) => {
          setLoading(false)
          console.log('err :>> ', err)
        })
    })
  }

  return (
    <Modal
      width={1000}
      style={{ maxHeight: 600 }}
      title={intl.formatMessage({ id: 'transaction_components.qianshudianzihetong' })}
      okText={intl.formatMessage({ id: 'transaction_components.queding' })}
      cancelText={intl.formatMessage({ id: 'transaction_components.quxiao' })}
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={loading}
      onCancel={() => setVisible(false)}
    >
      <Form form={form}>
        <Form.Item name="agree" initialValue={auditStatus}>
          <Radio.Group onChange={(e) => onRadioGroupChange(e.target.value)}>
            <Radio value={1}>
              {intl.formatMessage({
                id: 'transaction_components.tongyiqianding',
                defaultMessage: '同意签订',
              })}
              <Tooltip title={intl.formatMessage({ id: 'transaction_components.zhugouxuanzebiaoshitong' })}>
                <QuestionCircleOutlined />
              </Tooltip>
            </Radio>
            <Radio value={0}>
              {intl.formatMessage({
                id: 'transaction_components.butongyiqianding',
                defaultMessage: '不同意签订',
              })}
            </Radio>
          </Radio.Group>
        </Form.Item>
        {auditStatus === 1 && data && (
          <div style={{ height: 600, position: 'relative' }}>
            <iframe
              src={data.contract?.contractUrl}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
          </div>
        )}
        {auditStatus === 0 ? (
          <Form.Item
            label={intl.formatMessage({
              id: 'transaction_components.butongyiqiandingyuanyin',
              defaultMessage: '不同意签订原因',
            })}
            name="reason"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'transaction_components.qingtianxiebutongyiqiandingyuanyin',
                  defaultMessage: '请填写不同意签订原因',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 120) },
            ]}
          >
            <Input.TextArea
              allowClear
              rows={3}
              maxLength={300}
              placeholder={intl.formatMessage({
                id: 'transaction_components.qingtianxiebutongyiqiandingyuanyin',
                defaultMessage: '请填写不同意签订原因',
              })}
            />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}

OrderElectronModal.defaultProps = {}

export default OrderElectronModal
