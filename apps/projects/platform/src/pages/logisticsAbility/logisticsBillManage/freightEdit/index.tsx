import React from 'react'
import { Modal, Form, Input, Checkbox } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
interface FreightEditProps {
  /** 显示隐藏 */
  visible: boolean
  /** 回显数据 */
  effect?: any
  /** 关闭 */
  onClose?: () => void
  /** 确定 */
  onConfirm?: (e: any) => void
}

const FreightEdit: React.FC<FreightEditProps> = (props: any) => {
  const { visible, onClose, effect, onConfirm } = props
  const [form] = Form.useForm<any>()
  const handleSubmit = async () => {
    await form
      .validateFields()
      .then((res) => {
        onConfirm(res)
      })
      .catch((error) => {
        console.warn(error)
      })
  }
  return (
    <Modal visible={visible} onCancel={onClose} onOk={handleSubmit}>
      <Form layout="vertical" form={form}>
        <Form.Item label={intl.formatMessage({ id: 'logistics.shifouhanshui' })} required name="taxInclusive">
          <Checkbox checked value={1}>
            {intl.formatMessage({ id: 'logistics.shi' })}
          </Checkbox>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'logistics.shuil' })}
          name="taxRate"
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshurushuil' }) }]}
          initialValue={effect.taxRate}
        >
          <Input type="number" addonAfter={<div style={{ width: 40 }}>%</div>} maxLength={25} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'logistics.yunfei' })}
          name="freightPrice"
          rules={[{ required: true, message: intl.formatMessage({ id: 'logistics.qingshuruyunfei' }) }]}
          initialValue={effect.freightPrice}
        >
          <Input
            type="number"
            addonBefore={<div style={{ width: 40 }}>{intl.formatMessage({ id: 'common.money' })}</div>}
            maxLength={25}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'logistics.jiesuanfangshi' })}
          name="settlement"
          required
          initialValue={effect.settlementWay}
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default FreightEdit
