import React, { useEffect, useMemo } from 'react'
import { createFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { Modal, Cascader } from 'antd'
import NiceForm from '@/components/NiceForm'
import { useIntl } from '@linkseeks/i18n'

const formActions = createFormActions()
export type AddressOptionType = {
  label: string
  value: string | number
}
interface Iprops {
  /**
   * 显示/隐藏
   */
  visible: boolean
  /**
   * 模态框标题
   */
  title: string
  /**
   * value, 表单值
   */
  value?: { [key: string]: any }
  /**
   * 是否显示label
   */
  showLabel?: boolean
  /**
   * align: label 显示方式
   */
  align?: 'left' | 'top'
  /**
   * 提交
   */
  onSubmit: (value: { [key: string]: any }) => void
  onCancel: () => void
  confirmLoading?: boolean
}

export type SubmitDataTypes = {
  /**
   * 当审核不通过时，才有审核不通过原因填写
   */
  reason?: string
}

const FrozonMadal: React.FC<Iprops> = (props: Iprops) => {
  const { title, visible, onSubmit, onCancel, value, showLabel, align, confirmLoading } = props
  const intl = useIntl()

  const schema: ISchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            // labelCol: showLabel ? 5 : 0,
            labelAlign: align,
            full: true,
            // labelAlign: 'left'
          },
          properties: {
            reason: {
              title: intl.formatMessage({ id: 'material.frozon.reason', defaultMessage: '冻结原因' }),
              type: 'textarea',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'components.qingtianxieshenhebutongguo' }),
                },
                {
                  limitByte: true,
                  maxByte: 40,
                },
              ],
            },
          },
        },
      },
    }),
    [showLabel, align],
  )

  const handleOk = () => {
    formActions.submit()
  }

  const handleFormSubmit = (values: SubmitDataTypes) => {
    const { ...res } = values
    const postData = values
    onSubmit?.(postData)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
      <NiceForm value={value} actions={formActions} schema={schema} onSubmit={handleFormSubmit} />
    </Modal>
  )
}

FrozonMadal.defaultProps = {
  // schema: defaultSchema,
  value: {},
  showLabel: true,
  align: 'top',
  confirmLoading: false,
}

export default FrozonMadal
