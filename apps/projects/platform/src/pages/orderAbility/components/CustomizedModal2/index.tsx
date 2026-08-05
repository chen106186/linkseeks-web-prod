/**
 *  业务定制弹窗
 * @author: Gavin
 * @description:  【Ref 版本】选状态反馈选择结果, 示例应用场景: 详情页面点击提交, 弹窗选择审核状态, 是否需要填写原因。 ～～～！！！！单选模式，暂为不可异步， 待优化。
 */
import { Form, Input, Modal, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  ModalCancelText,
  ModalOkText,
  ReasonPlaceholder,
  ReasonRulesMessage,
  SelectRadioRulesMessage,
} from '../translate'

export interface IRadioGroup {
  /**
   * Radio Label
   */
  label: string
  /**
   * Radio Value (Must be unique)
   */
  value: string | number
  /**
   * Need to fill in the reason
   */
  isReason?: boolean
}

export interface SubmitFeedback {
  /**
   * Radio box checked value
   */
  selectedRadio: string | number
  /**
   * Input content
   */
  reason?: string
}

interface CustomizedModalProps {
  /**
   * (必填) 标题
   */
  title: string
  /**
   * (必填) 是否显示
   */
  visible: boolean
  /**
   * (必填) Radio.Group渲染数组
   */
  radioGroup: IRadioGroup[]
  /**
   * (必填) 内部校验通过返回
   */
  onSubmit: (values: SubmitFeedback) => void
  /**
   *  (必填)  关闭操作反馈 visible 布尔值
   */
  onCancel: (visible: boolean) => void
  /**
   * (非必填) 默认选中 Radio
   */
  defaultRadioValue?: string | number
  /**
   *  (非必填) 确认按钮文字自定义
   */
  okText?: string
  /**
   * (非必填)  取消按钮文字自定义
   */
  cancelText?: string
}

const CustomizedModal: React.FC<CustomizedModalProps> = (props) => {
  const [form] = Form.useForm()
  const [visibleReason, setVisibleReason] = useState<boolean>(false)

  const onOk = () => {
    form.validateFields().then((values) => {
      props.onSubmit(values)
    })
  }

  const onCancel = () => {
    props.onCancel(false)
  }

  const onRadioGroupChange = (val: any) => {
    setVisibleReason(props.radioGroup.find((_f) => _f.value == val)?.isReason)
  }

  useEffect(() => {
    if (!props.visible) {
      form.resetFields()
    } else {
      if (props?.defaultRadioValue) {
        const _visibleReason = props.radioGroup.find((_f) => _f.value === props?.defaultRadioValue)?.isReason
        setVisibleReason(_visibleReason)
      }
    }
  }, [props.visible])

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      okText={props?.okText || ModalOkText}
      cancelText={props?.okText || ModalCancelText}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item
          name="isPass"
          initialValue={props.defaultRadioValue}
          rules={[{ required: true, message: SelectRadioRulesMessage }]}
        >
          <Radio.Group onChange={(e) => onRadioGroupChange(e.target.value)}>
            {props.radioGroup?.map((item: IRadioGroup, index: number) => (
              <Radio value={item.value} key={index}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {visibleReason ? (
          <Form.Item name="reason" rules={[{ required: true, message: ReasonRulesMessage }]}>
            <Input.TextArea allowClear rows={3} maxLength={60} placeholder={ReasonPlaceholder} />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}
CustomizedModal.defaultProps = {
  visible: false,
  radioGroup: [],
  onSubmit: (values) => {},
  onCancel: (visible) => {},
}
export default CustomizedModal
