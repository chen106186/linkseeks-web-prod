/**
 * 详情页审核
 * 用于详情页，一级审核， 二级审核，
 * 这里本来想写根据schema，渲染table的。。。但感觉好像有问题
 */

import React, { useEffect, useMemo } from 'react'
import { createAsyncFormActions, createFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { Modal, Cascader } from 'antd'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
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
  companyOptions: AddressOptionType[]
  /**
   * 提交
   */
  onSubmit: (value: { [key: string]: any }) => void
  onCancel: () => void
}

export type SubmitDataTypes = {
  address?: number | string
  deliveryTime: string
  deliveryNo: string
  company: string | number
}

const DeliveryHandle: React.FC<Iprops> = (props: Iprops) => {
  const { title, visible, onSubmit, onCancel, align, addressOptions, companyOptions } = props

  const schema: ISchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: 5,
            labelAlign: 'left',
            full: true,
            // labelAlign: 'left'
          },
          properties: {
            address: {
              title: intl.formatMessage({ id: 'handling.fahuodizhi' }),
              type: 'string',
              enum: addressOptions,
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingxuanzefahuodizhi' }),
                },
              ],
            },

            deliveryTime: {
              title: intl.formatMessage({ id: 'handling.fahuoshijian' }),
              type: 'date',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingtianxiefahuoshijian' }),
                },
              ],
            },
            deliveryNo: {
              title: intl.formatMessage({ id: 'handling.fahuodanhao' }),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingtianxiefahuodanhao' }),
                },
              ],
            },
            company: {
              title: intl.formatMessage({ id: 'handling.wuliugongsi' }),
              type: 'string',
              enum: companyOptions,
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingxuanzewuliugongsi' }),
                },
              ],
            },
          },
        },
      },
    }),
    [addressOptions, companyOptions],
  )

  const handleOk = () => {
    formActions.submit()
  }

  const handleFormSubmit = (values: SubmitDataTypes) => {
    onSubmit?.(values)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  //  useEffect(() => {
  //    if (!visible) {
  //      return ;
  //    }
  //    if (!value) {
  //      return ;
  //    }
  //    if (value.status === 0) {
  //      formActions.setFieldState('status', state => {
  //        state.editable = false;
  //      })
  //    }

  //  }, [visible, value])

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <NiceForm components={{ Cascader }} actions={formActions} schema={schema} onSubmit={handleFormSubmit} />
    </Modal>
  )
}

DeliveryHandle.defaultProps = {
  // schema: defaultSchema,
  value: {},
  align: 'top',
  withAddress: false,
  addressOptions: [],
  addressTitle: '',
}

export default DeliveryHandle
