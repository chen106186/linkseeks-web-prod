import React, { useState } from 'react'
import { Modal, Form, Select } from 'antd'
import { GetCommodityShopAllResponse, postCommodityManagePageTemplateSetSuitShop } from '@apps/apis'
import styles from './index.less'

interface UseModalPropsType {
  visible: boolean
  onOk: Function
  onCancel: Function
  title: string
  type: string
  mallList: GetCommodityShopAllResponse
}

const UseModal: React.FC<UseModalPropsType> = (props) => {
  const { visible, templateId, onOk, onCancel, title, mallList } = props
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  }
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const filterItem = mallList.find((item) => item.id === values?.shopId)
      const params = {
        id: templateId,
        shopId: filterItem?.id,
        shopName: filterItem?.name,
        shopType: filterItem?.type,
        property: filterItem?.property,
      }
      setConfirmLoading(true)
      const res = await postCommodityManagePageTemplateSetSuitShop(params)
      if (!res.code === 1000) {
        message.Error(res.message)
      }
      onOk()
      setConfirmLoading(false)
    })
  }

  return (
    <Modal
      width={576}
      title={title}
      open={visible}
      onOk={handleOk}
      centered
      onCancel={() => onCancel()}
      confirmLoading={confirmLoading}
    >
      <Form {...layout} form={form}>
        <Form.Item name="shopId" label="选择适用商城" rules={[{ required: true }]}>
          <Select className={styles.selectBox}>
            {mallList.map((item) => (
              <Select.Option value={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UseModal
