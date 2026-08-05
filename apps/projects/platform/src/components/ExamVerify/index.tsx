/**
 * 详情页审核
 * 用于详情页，一级审核， 二级审核，
 * 这里本来想写根据schema，渲染table的。。。但感觉好像有问题
 */

import React, { useEffect, useMemo } from 'react'
import { createAsyncFormActions, createFormActions, ISchema, FormEffectHooks } from '@apps/formily'
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
   * 是否带有地址栏
   */
  withAddress?: boolean
  /**
   * 地址选择
   */
  addressOptions?: AddressOptionType[]
  addressTitle?: string
  /**
   * 提交
   */
  onSubmit: (value: { [key: string]: any }) => void
  onCancel: () => void
  /** 提交loading */
  comfirmLoading?: boolean
}

export type SubmitDataTypes = {
  /**
   * @params 0 => 审核不通过， 1 => 审核通过
   */
  status: 0 | 1
  /**
   * 当审核不通过时，才有审核不通过原因填写
   */
  reason?: string
  address?: number | string
}

const ExamVerify: React.FC<Iprops> = (props: Iprops) => {
  const {
    title,
    visible,
    onSubmit,
    onCancel,
    value,
    showLabel,
    align,
    withAddress,
    addressOptions,
    addressTitle,
    comfirmLoading,
  } = props
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
            address: {
              title: addressTitle,
              type: 'string',
              display: withAddress,
              enum: addressOptions,
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'components.qingxuanzeshenhezhuangtai' }),
                },
              ],
            },
            status: {
              title: (showLabel && intl.formatMessage({ id: 'components.shenhezhuangtai' })) || '',
              type: 'string',
              'x-component': 'RadioGroup',
              default: 1,
              enum: [
                { label: intl.formatMessage({ id: 'components.shenhetongguo' }), value: 1 },
                { label: intl.formatMessage({ id: 'components.shenhebutongguo' }), value: 0 },
              ],
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'components.qingxuanzeshenhezhuangtai' }),
                },
              ],
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: '*(reason)',
                  condition: '{{$value === 0}}',
                },
              ],
            },
            reason: {
              title: intl.formatMessage({ id: 'components.butongguoyuanyin' }),
              type: 'textarea',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'components.qingtianxieshenhebutongguo' }),
                },
                {
                  limitByte: true,
                  maxByte: 120,
                },
              ],
            },
          },
        },
      },
    }),
    [showLabel, align, withAddress, addressOptions, addressTitle],
  )

  const handleOk = () => {
    formActions.submit()
  }

  const handleFormSubmit = (values: SubmitDataTypes) => {
    const { address, ...res } = values
    const postData = !withAddress ? res : values
    onSubmit?.(postData)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  useEffect(() => {
    if (!visible) {
      return
    }
    if (!value) {
      return
    }
    if (value.status === 0) {
      formActions.setFieldState('status', (state) => {
        state.editable = false
      })
    }
  }, [visible, value])

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel} confirmLoading={comfirmLoading}>
      <NiceForm
        value={value}
        components={{ Cascader }}
        actions={formActions}
        schema={schema}
        onSubmit={handleFormSubmit}
      />
    </Modal>
  )
}

ExamVerify.defaultProps = {
  // schema: defaultSchema,
  value: {},
  showLabel: true,
  align: 'top',
  withAddress: false,
  addressOptions: [],
  addressTitle: '',
  comfirmLoading: false,
}

export default ExamVerify
