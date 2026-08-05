import NiceForm from '@/components/NiceForm'
import { useToggle } from '@linkseeks/hooks'
import { Modal } from '@linkseeks/ui'
import { auditModalSchema } from './schema'
import { FormEffectHooks, createAsyncFormActions } from '@apps/formily'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const { onFieldValueChange$ } = FormEffectHooks

const ApprovedModal = forwardRef<any, any>(({ loading, handleSubmit }, ref) => {
  const modalFormActions = useRef(createAsyncFormActions())
  const [visible, toggle] = useToggle(false)

  useImperativeHandle(ref, () => ({
    toggle,
  }))
  return (
    <Modal
      title="提交审核"
      open={visible}
      confirmLoading={loading}
      onOk={() => modalFormActions.current.submit()}
      onCancel={() => toggle(false)}
      destroyOnClose
    >
      <NiceForm
        effects={($, { setFieldState }) => {
          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('reason', (state) => {
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

export default ApprovedModal
