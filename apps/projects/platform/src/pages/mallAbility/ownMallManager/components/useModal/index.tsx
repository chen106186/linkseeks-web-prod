import React, { useEffect, useState } from 'react'
import { Modal, Form, Select } from 'antd'
import { isEmpty } from 'lodash'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

export interface MallItemType {
  id: number
  name: string
  type: number
  environment: number
  property: number
  self: number
  memberOperate: number
  logoUrl: string
  describe: string
  state: number
  url: string
  isDefault: number
  createTime: number
}

interface UseModalPropsType {
  visible: boolean
  onOk: Function
  onCancel: Function
  title: string
  dataInfo: any
  confirmLoading?: boolean
  mallList: MallItemType[]
}

interface SelectItemType {
  label: string
  value: number
}

const UseModal: React.FC<UseModalPropsType> = (props) => {
  const { visible, onOk, onCancel, title, dataInfo = {}, confirmLoading = false, mallList } = props
  const [selectItem, setSelectItem] = useState<SelectItemType>()
  const intl = useIntl()
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isEmpty(dataInfo)) {
      const item = mallList.filter((item) => item.id === dataInfo.shopId)[0]
      if (item) {
        setSelectItem({
          label: item.name,
          value: item.id,
        })
        form.setFieldsValue({ shopId: item.id })
      }
    }
  }, [dataInfo])

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  }

  const handleSelect = (_, option) => {
    setSelectItem(option)
  }

  return (
    <Modal
      width={576}
      title={title}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => {
        form.validateFields()
        if (selectItem) {
          onOk(selectItem)
        }
      }}
      centered
      onCancel={() => onCancel()}
    >
      <Form {...layout} form={form}>
        <Form.Item
          name="shopId"
          label={intl.formatMessage({ id: 'detail.purchase.selectMall' })}
          rules={[{ required: true }]}
        >
          <Select className={styles.selectBox} onChange={handleSelect}>
            {mallList &&
              mallList.map((mallItem) => (
                <Select.Option value={mallItem.id} label={mallItem.name} key={mallItem.id}>
                  {mallItem.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
      {dataInfo.inUseTemplateName ? (
        <>
          <div className={styles.text_line}>
            <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content1' })}</span>
            <label>
              {dataInfo.siteName}-{dataInfo.shopName}
            </label>
            <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content2' })}</span>
            <label>“{dataInfo.inUseTemplateName}”</label>
            <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content3' })}，</span>
          </div>
          <div className={styles.text_line}>
            <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content4' })}</span>
            <label>“{dataInfo.templateName}”</label>
            <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content5' })}</span>
          </div>
        </>
      ) : (
        <div className={styles.text_line}>
          <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content4' })}</span>
          <label>“{dataInfo.templateName}”</label>
          <span>{intl.formatMessage({ id: 'shop.tempalte.modal.use.content3' })}?</span>
        </div>
      )}
    </Modal>
  )
}

export default UseModal
