import React, { useCallback, useState } from 'react'
import { Modal, Form, Radio, Tooltip, Typography, Input, Space } from 'antd'
import { postTradeNotarizeEnquiryQuotedPriceAffirm } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

interface AutditLayoutProps {
  /** 显示/隐藏 */
  visible?: boolean
  /** 关闭 */
  onCancel?: Function
  /** 确定 */
  onOk?: Function
  id: number
}
const intl = getIntl()
const AuditLayout: React.FC<AutditLayoutProps> = (props: any) => {
  const { visible, onCancel, onOk, id } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = useCallback(async () => {
    await form.validateFields().then((res) => {
      postTradeNotarizeEnquiryQuotedPriceAffirm({ id, state: res.state, auditOpinion: res.audit }).then((res) => {
        if (res.code !== 1000) {
          setLoading(false)
          return
        }
        onOk()
      })
    })
  }, [id])

  return (
    <Modal
      width={600}
      title={intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="state" initialValue={1}>
          <Radio.Group>
            <Tooltip
              placement="topLeft"
              title={
                <Space direction="vertical">
                  <Typography.Text style={{ color: '#FFF' }}>
                    {intl.formatMessage({ id: 'dealAbility.jieshouhuiyuanbaojiahouze' })}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#FFF' }}>
                    1.{intl.formatMessage({ id: 'dealAbility.baojiadanchaxunliebiao' })}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#FFF' }}>
                    2.{intl.formatMessage({ id: 'dealAbility.xinzengcaigoudingdanxuan' })}
                  </Typography.Text>
                </Space>
              }
            >
              <Radio value={1}>{intl.formatMessage({ id: 'dealAbility.jieshoubaojia' })}</Radio>
            </Tooltip>
            <Tooltip
              placement="topLeft"
              title={
                <Space direction="vertical">
                  <Typography.Text style={{ color: '#FFF' }}>
                    1.{intl.formatMessage({ id: 'dealAbility.bujieshouhuiyuanbaojia' })}
                  </Typography.Text>
                  <Typography.Text style={{ color: '#FFF' }}>
                    2.{intl.formatMessage({ id: 'dealAbility.bujieshoubaojiahoubao' })}
                  </Typography.Text>
                </Space>
              }
            >
              <Radio value={0}>{intl.formatMessage({ id: 'dealAbility.bujieshoubaojia' })}</Radio>
            </Tooltip>
          </Radio.Group>
        </Form.Item>
        <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.state !== curValues.state}>
          {({ getFieldValue }) =>
            getFieldValue('state') !== 1 && (
              <Form.Item
                label={intl.formatMessage({ id: 'dealAbility.bujieshoubaojiayuanyin' })}
                name="audit"
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'dealAbility.qingshurubujieshoubaojia' }) },
                ]}
              >
                <Input.TextArea maxLength={100} rows={2} />
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AuditLayout
