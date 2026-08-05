import React, { useEffect, useState, useRef } from 'react'
import { Modal, Form, Button, Select } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { IAntdSchemaFormProps } from '@apps/formily'
const Option = Select.Option

const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  ModalVisible: boolean
  payType: any
  selectRowList: any
  contractId: any
  basics: any
  setDrawerPopModal: Function
}
const PopModal: React.FC<Iprops> = ({
  ModalVisible,
  payType,
  selectRowList,
  contractId,
  basics,
  setDrawerPopModal,
}) => {
  const [form] = Form.useForm()
  /* 选中 */
  const [paymentId, setpaymentId] = useState<any>()
  /* 确定 */
  const onFinish = (values: any) => {
    sessionStorage.setItem('basics', JSON.stringify(basics))
    sessionStorage.setItem('list', JSON.stringify(selectRowList))
    let payid = paymentId ? paymentId : payType[0].id
    history.push('/contract/funds/addbill/Add?applyId=' + contractId + '&sourceType=' + 2 + '&paymentId=' + payid)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Modal
      footer={null}
      title={intl.formatMessage({ id: 'contract.tijiaoqingkuandan' })}
      visible={ModalVisible}
      onOk={() => setDrawerPopModal()}
      onCancel={() => setDrawerPopModal()}
    >
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={intl.formatMessage({ id: 'contract.xuanzefukuanjieduan' })}
          initialValue={payType.length != 0 ? payType[0].id : ''}
          name="opinion"
          rules={[{ required: true, message: intl.formatMessage({ id: 'contract.xuanzefukuanjieduan' }) }]}
        >
          <Select
            style={{
              width: '290px',
            }}
            onChange={(value) => {
              setpaymentId(value)
            }}
          >
            {payType.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.payStage}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{ marginRight: 10 }} onClick={() => setDrawerPopModal()}>
            {intl.formatMessage({ id: 'contract.quxiao' })}
          </Button>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'contract.queding' })}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default PopModal
