/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-28 17:29:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-18 11:30:49
 * @Description: 提交审核 Modal
 */
import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { auditModalSchema } from './schema'

const modalFormActions = createAsyncFormActions()
const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

interface VerifyModalProps {
  visible: boolean
  confirmLoading: boolean
  onSubmit: (values: { agree: 0 | 1; reason: string }) => void
  onVisible: (flag: boolean) => void
  /**
   * 是否只可以选择 不接受申请
   */
  rejected?: boolean
}

const VerifyModal: React.FC<VerifyModalProps> = ({
  visible,
  confirmLoading,
  onSubmit,
  onVisible,
  rejected = false,
}) => {
  const intl = useIntl()

  useEffect(() => {
    // 内部状态为 审核通过 才能选择 审核通过选项
    if (rejected) {
      modalFormActions.setFieldState('agree', (state) => {
        const newMenu = state.props.enum.map((item: { label: string; value: any }) => ({
          ...item,
          disabled: item.value === 1,
        }))
        FormPath.setIn(state, 'props.enum', newMenu)
        FormPath.setIn(state, 'value', 0)
      })
    }
  }, [rejected])

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'payandSettle.creditManage.components.verifyModal.title' })}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => modalFormActions.submit()}
      onCancel={() => onVisible(false)}
    >
      <NiceForm
        effects={($, { setFieldState }) => {
          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('opinion', (state) => {
              state.visible = !fieldState.value
            })
          })
        }}
        actions={modalFormActions}
        schema={auditModalSchema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

export default VerifyModal
