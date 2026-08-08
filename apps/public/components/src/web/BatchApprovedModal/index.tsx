import { useWebIntl } from '@apps/locales'
import { Form, Input, Modal, ModalProps, Radio } from '@linkseeks/ui'
import React from 'react'

export interface BatchApprovedModalProps extends Omit<ModalProps, 'onOk'> {
  onOk(value: any, e: any): void
  /**
   * 审核状态
   *
   * 第一项为审核通过的枚举状态
   * 第二项为审核不通过的枚举状态
   */
  approvedStatus: [number, number]
}
/**
 * 批量审核弹窗
 */
export const BatchApprovedModal = (props: BatchApprovedModalProps) => {
  const { onOk, approvedStatus, ...resetProps } = props
  const translate = useWebIntl()
  const [form] = Form.useForm()
  const [passKey, noPassKey] = approvedStatus
  const statusValue = Form.useWatch('status', form)

  const handleSubmit = async (e) => {
    const value = await form.validateFields()

    if (onOk) {
      onOk(value, e)
    }
  }
  return (
    <Modal onOk={handleSubmit} {...resetProps}>
      <Form form={form} labelAlign="left" labelCol={{ span: 4 }}>
        <Form.Item name="status" label={translate('web.common.status')} initialValue={passKey}>
          <Radio.Group
            options={[
              { label: translate('web.resource.order.verifySuccess'), value: passKey },
              { label: translate('web.resource.order.verifyFailed'), value: noPassKey },
            ]}
          ></Radio.Group>
        </Form.Item>
        {statusValue !== passKey && (
          <Form.Item name="checkRemark" rules={[{ required: true }]} label={translate('web.common.butongguoyuanyin')}>
            <Input.TextArea
              rows={3}
              maxLength={120}
              placeholder={translate.formatFormInputTip(translate('web.common.butongguoyuanyin'))}
            ></Input.TextArea>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default BatchApprovedModal
