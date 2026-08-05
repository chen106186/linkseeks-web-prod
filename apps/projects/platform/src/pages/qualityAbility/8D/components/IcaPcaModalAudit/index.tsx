import React, { MutableRefObject, useImperativeHandle } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Modal, Form, Radio, Input, ModalProps } from 'antd'
import { validatorByte } from '@/utils/regExp'

interface IcaPcaModalAuditProps {
  formref?: MutableRefObject<any>
  modalTypes: ModalProps
  canAdopt?: boolean
  initialValue?: number
}

const IcaPcaModalAudit: React.FC<IcaPcaModalAuditProps> = (props: any) => {
  const intl = getIntl()
  const { formref, modalTypes, canAdopt = true, initialValue = 1 } = props
  const [form] = Form.useForm()

  useImperativeHandle(formref, () => ({
    formref: () => form,
  }))

  return (
    <Modal {...modalTypes}>
      <Form form={form} layout="vertical">
        <Form.Item name="state" initialValue={initialValue}>
          <Radio.Group>
            {canAdopt && (
              <>
                <Radio value={1}>确认通过并继续PCA反馈</Radio>
                <Radio value={2}>确认通过并完成8D</Radio>
              </>
            )}
            <Radio value={0}>确认不通过</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.state !== curValues.state}>
          {({ getFieldValue }) => {
            form.resetFields(['auditOpinion'])
            return getFieldValue('state') === 2 || getFieldValue('state') === 1 || getFieldValue('state') === 0 ? (
              <Form.Item
                name="auditOpinion"
                label={getFieldValue('state') === 0 ? '确认不通过原因' : '确认通过原因'}
                rules={[
                  {
                    required: getFieldValue('state') === 0 ? true : false,
                    message: intl.formatMessage({
                      id: 'transaction_components.qingshurushenhebutongguo',
                      defaultMessage: '请输入审核不通过原因',
                    }),
                  },
                  { validator: (rule, value, callback) => validatorByte(rule, value, callback, 120) },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={intl.formatMessage({
                    id: 'componnets.maxTextLength',
                    defaultMessage: '在此输入您的原因, 最长{char}个字符,{hanzi}个汉字',
                    hanzi: 60,
                    char: 120,
                  })}
                />
              </Form.Item>
            ) : null
          }}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IcaPcaModalAudit
