/**
 * 详情页审核
 * 用于详情页，一级审核， 二级审核，
 * 这里本来想写根据schema，渲染table的。。。但感觉好像有问题
 */

import React, { useEffect, useMemo } from 'react'
import { createAsyncFormActions, createFormActions, ISchema, FormEffectHooks } from '@apps/formily'
import { Modal } from 'antd'
import NiceForm from '@/components/NiceForm'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const formActions = createFormActions()
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
   * 提交
   */
  onSubmit: (value: { [key: string]: any }) => void
  onCancel: () => void
}

export type SubmitDataTypes = {
  /**
   * @params
   */
  dateTime: string
  /**
   * 当审核不通过时，才有审核不通过原因填写
   */
  reason?: string
}

const StopModal: React.FC<Iprops> = (props: Iprops) => {
  const { title, visible, onSubmit, onCancel, value, showLabel } = props

  const schema: ISchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelCol: showLabel ? 5 : 0,
            full: true,
            labelAlign: 'left',
          },
          properties: {
            dateTime: {
              title: (showLabel && intl.formatMessage({ id: 'handling.zhongzhishijian' })) || '',
              type: 'date',
              default: moment().format('YYYY-MM-DD HH:mm:ss'),
              editable: false,
            },
            reason: {
              title: (showLabel && intl.formatMessage({ id: 'handling.zhongzhiyuanyin' })) || '',
              type: 'textarea',
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'handling.qingtianxieshenhebutongguo' }),
                },
              ],
            },
          },
        },
      },
    }),
    [showLabel],
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
      <NiceForm value={value} actions={formActions} schema={schema} onSubmit={handleFormSubmit} />
    </Modal>
  )
}

StopModal.defaultProps = {
  // schema: defaultSchema,
  value: {},
  showLabel: true,
}

export default StopModal
