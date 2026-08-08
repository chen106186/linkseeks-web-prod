import { useToggle } from '@linkseeks/hooks'
import { FormItemProps, Modal, ModalProps, FormProps, Form, FormInstance } from '@linkseeks/ui'
import React, { RefObject, useRef } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { FormItemWrapper, FormLayoutWrapper, StandardForm } from '../StandardForm'
import { isEmpty } from 'lodash'

export interface StandardModalProps extends ModalProps {
  /**
   * 弹窗显示时触发
   */
  onShow?(): void

  /**
   * 弹窗隐藏时触发
   */
  onHide?(): void

  /**
   * 弹窗显示隐藏状态发生变更时触发
   */
  onVisible?(visible: boolean): void

  /**
   * 提交表单操作触发的按钮
   * 对应的value是表单提交后获得的数据
   * 如果不需要走这个逻辑可以通过传入onOk覆盖
   */
  onSubmit?(value: any): void
  /**
   * 给表单的属性
   */
  formProps?: FormProps
  /**
   * 表单项
   */
  formItemList?: FormItemProps[]

  actionRef?: RefObject<StandardModalRefProps>
}

export interface StandardModalRefProps {
  visible: boolean
  toggle(record?: any): void
  form: FormInstance
}
export const StandardModal = (props: StandardModalProps) => {
  const { onHide, onShow, onVisible, onSubmit, children, formProps, formItemList, actionRef, ...resetProps } = props
  const [visible, toggle] = useToggle()
  const [form] = Form.useForm()
  const dataRef = useRef<any>({})
  const handleToggle = (record?: any) => {
    if (record) {
      dataRef.current = record
      if (isEmpty(record)) {
        form.resetFields()
      } else {
        form.setFieldsValue(record)
      }
    }
    if (visible) {
      dataRef.current = {}
      onHide && onHide()
    } else {
      onShow && onShow()
    }
    onVisible && onVisible(!visible)
    toggle()
  }

  useImperativeHandle(actionRef, () => {
    return {
      visible,
      toggle(record?: any) {
        handleToggle(record)
      },
      form,
    }
  })

  const handleSubmit = async () => {
    const values = await form.validateFields()
    onSubmit &&
      onSubmit({
        ...dataRef.current,
        ...values,
      })
  }
  const defaultFormProps: FormProps = {
    form,
  }
  return (
    <Modal onCancel={handleToggle} open={visible} closable onOk={handleSubmit} {...resetProps}>
      <StandardForm {...defaultFormProps} {...formProps}>
        {formItemList ? (
          <FormLayoutWrapper>
            {formItemList.map((v) => {
              return <FormItemWrapper {...v}></FormItemWrapper>
            })}
          </FormLayoutWrapper>
        ) : (
          children
        )}
      </StandardForm>
    </Modal>
  )
}

StandardModal.useRef = () => {
  const ref = useRef<StandardModalRefProps>({} as any)

  return ref
}
