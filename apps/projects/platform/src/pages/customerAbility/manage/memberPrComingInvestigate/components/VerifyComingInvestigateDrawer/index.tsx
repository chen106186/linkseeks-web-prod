/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 17:47:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 16:08:38
 * @Description: 审核Form抽屉
 */
import React from 'react'
import { Drawer, Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { DatePicker } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { schema } from './schema'

export type FileType = {
  /**
   * 文件名
   */
  name: string
  /**
   * 状态
   */
  status: string
  /**
   * 缩略图
   */
  thumbUrl: string
  /**
   * uid
   */
  uid: string
  /**
   * 地址
   */
  url: string
}

export type ValueType = {
  /**
   * 考察日期
   */
  inspectDay: string
  /**
   * 考察评分
   */
  score: number
  /**
   * 考察结果
   */
  result: string
  /**
   * 考察报告
   */
  reports: FileType[]
  /**
   * 提交审批的状态：0-不同意；1-同意
   */
  agree: number
  /**
   * 审核原因
   */
  reason: string
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

const formActions = createFormActions()
const { onFieldValueChange$ } = FormEffectHooks

const VerifyComingInvestigateDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose, submitLoading } = props

  const intl = useIntl()

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ValueType) => {
    if (onSubmit) {
      const { score, ...rest } = values
      onSubmit({ score: +score, ...rest })
    }
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'customerAbility.management.memberPrComingInvestigate.drawer.title' })}
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
            {intl.formatMessage({ id: 'customerAbility.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'customerAbility.actions.confirm' })}
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
                  ? intl.formatMessage({ id: 'customerAbility.management.common.form.reason.noPass' })
                  : intl.formatMessage({ id: 'customerAbility.management.common.form.reason.pass' })
              state.required = fieldState.value === 0
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

export default VerifyComingInvestigateDrawer
