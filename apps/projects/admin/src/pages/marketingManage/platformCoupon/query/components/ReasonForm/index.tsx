/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 15:52:40
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-02 17:32:33
 * @Description: 带原因的表单
 */
import React, { useImperativeHandle } from 'react'
import { createFormActions, FormEffectHooks, DatePicker } from '@apps/formily'
import moment from 'moment'
import NiceForm from '@/components/NiceForm'
import schema from './schema'

const formActions = createFormActions()
const { onFormInit$ } = FormEffectHooks

export type ReasonValueType = {
  /**
   * 时间
   */
  date: number
  /**
   * 原因
   */
  reason: string
}

interface IProps {
  /**
   * 类型
   */
  type: 'stop' | 'cancel' | 'startUp' | (string & {})
  /**
   * 提交触发事件
   */
  onSubmit: (values: ReasonValueType) => void
}

export interface ReasonFormRefHandle {
  submit: () => void
}

const TYPE_NAME_MAP = {
  stop: '终止',
  cancel: '取消',
  startUp: '启动',
}

const ReasonForm: React.ForwardRefRenderFunction<ReasonFormRefHandle, IProps> = (props, ref) => {
  const { type, onSubmit } = props

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  const handleSubmit = (values: ReasonValueType) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <NiceForm
      initialValues={{
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
      }}
      components={{
        DatePicker,
      }}
      effects={($, { setFieldState }) => {
        onFormInit$().subscribe(() => {
          setFieldState('date', (state) => {
            state.title = `${TYPE_NAME_MAP[type]}时间`
          })
          setFieldState('reason', (state) => {
            state.title = `${TYPE_NAME_MAP[type]}原因`
          })
        })
      }}
      actions={formActions}
      schema={schema}
      onSubmit={handleSubmit}
    />
  )
}

const ReasonFormForward = React.forwardRef<ReasonFormRefHandle, IProps>(ReasonForm)

export default ReasonFormForward
