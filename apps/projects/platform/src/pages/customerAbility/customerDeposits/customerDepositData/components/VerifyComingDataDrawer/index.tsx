/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 17:47:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 16:40:16
 * @Description: 审核Form抽屉
 */
import React from 'react'
import { Drawer, Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { DatePicker } from '@apps/formily'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'

export type AreaCodesType = {
  /**
   * 省编码
   */
  provinceCode: string
  /**
   * 市编码
   */
  cityCode: string
}

export type ValueType = {
  /**
   * 提交审批的状态：0-不同意；1-同意
   */
  agree: number
  /**
   * 审核原因
   */
  reason: string
  /**
   * 上级id
   */
  upperRelationId: number
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Form 确认事件
   */
  onSubmit: (values: ValueType) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 确认按钮 loading
   */
  submitLoading: boolean
}

const formActions = createAsyncFormActions()
const { onFieldValueChange$ } = FormEffectHooks

const VerifyComingDataDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose, submitLoading } = props

  const intl = useIntl()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ValueType) => {
    if (onSubmit) {
      const { upperRelationId, ...rest } = values
      onSubmit({ upperRelationId: upperRelationId || 0, ...rest })
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.drawer.title' })}
      width={600}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'member.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'member.actions.confirm' })}
          </Button>
        </div>
      }
    >
      <NiceForm
        previewPlaceholder="' '"
        components={{
          DatePicker,
        }}
        effects={($, { setFieldState }) => {
          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('reason', (state) => {
              state.title =
                fieldState.value === 0
                  ? intl.formatMessage({ id: 'member.management.common.form.reason.noPass' })
                  : intl.formatMessage({ id: 'member.management.common.form.reason.pass' })
              state.required = fieldState.value === 0
              // 手动改变一个 value，目的是为了触发 必填校验
              state.value = state.value || ''
              setTimeout(() => {
                formActions.validate('reason')
              }, 0)
            })
          })
        }}
        actions={formActions}
        schema={schema}
        onSubmit={(values) => handleSubmit(values)}
      />
    </Drawer>
  )
}

export default VerifyComingDataDrawer
