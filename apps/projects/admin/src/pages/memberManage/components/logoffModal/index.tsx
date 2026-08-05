import NiceForm from '@/components/NiceForm'
import { useToggle } from '@linkseeks/hooks'
import { Modal } from '@linkseeks/ui'
import { auditModalSchema } from './schema'
import { FormEffectHooks, createAsyncFormActions } from '@apps/formily'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useMemberInfo } from '../../services/contexts/memberContext'

const { onFieldValueChange$ } = FormEffectHooks

const LogoffModal = forwardRef<any, any>(({ loading, handleSubmit }, ref) => {
  const modalFormActions = useRef(createAsyncFormActions())
  const [visible, toggle] = useToggle(false)
  const { memberMaintainInfo } = useMemberInfo()
  useImperativeHandle(ref, () => ({
    toggle,
  }))
  return (
    <Modal
      title="注销审核"
      open={visible}
      confirmLoading={loading}
      onOk={() => modalFormActions.current.submit()}
      onCancel={() => toggle(false)}
      destroyOnClose
    >
      <p>注销原因: {memberMaintainInfo?.cancellationReason}</p>
      <NiceForm
        effects={($, { setFieldState }) => {
          onFieldValueChange$('verify').subscribe((fieldState) => {
            setFieldState('cancellationComments', (state) => {
              state.visible = !fieldState.value
            })
          })
        }}
        actions={modalFormActions.current}
        schema={auditModalSchema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
})

export default LogoffModal
