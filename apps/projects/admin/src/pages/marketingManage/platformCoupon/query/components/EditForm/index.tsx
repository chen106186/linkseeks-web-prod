/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 17:53:01
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 18:08:51
 * @Description: 修改的表单
 */
import React, { useImperativeHandle } from 'react'
import { createFormActions, DatePicker } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import moment from 'moment'

const formActions = createFormActions()

export type EditValueType = {
  /**
   * 领取开始时间
   */
  releaseTimeStart: string
  /**
   * 领取截止时间
   */
  releaseTimeEnd: string
  /**
   * 原因
   */
  quantity: string
}

export type EditSubmitValueType = Omit<EditValueType, 'quantity' | 'releaseTimeStart' | 'releaseTimeEnd'> & {
  quantity: number
  releaseTimeStart: number
  releaseTimeEnd: number
}

interface IProps {
  /**
   * 提交触发事件
   */
  onSubmit: (values: EditSubmitValueType) => void
  /**
   * 值
   */
  value: EditValueType
}

export interface EditFormRefHandle {
  submit: () => void
}

const EditForm: React.ForwardRefRenderFunction<EditFormRefHandle, IProps> = (props, ref) => {
  const { onSubmit, value } = props

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  const handleSubmit = (values: EditValueType) => {
    const { quantity, releaseTimeStart, releaseTimeEnd, ...rest } = values
    if (onSubmit) {
      onSubmit({
        ...rest,
        quantity: +quantity,
        releaseTimeStart: moment(releaseTimeStart).valueOf(),
        releaseTimeEnd: moment(releaseTimeEnd).valueOf(),
      })
    }
  }

  return (
    <NiceForm
      components={{
        DatePicker,
      }}
      value={value}
      effects={($, { setFieldState }) => {}}
      actions={formActions}
      schema={schema}
      onSubmit={handleSubmit}
    />
  )
}

const EditFormForward = React.forwardRef<EditFormRefHandle, IProps>(EditForm)

export default EditFormForward
