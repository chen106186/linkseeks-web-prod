import { FormEffectHooks, createAsyncFormActions } from '@apps/formily'
import { useToggle } from '@linkseeks/hooks'
import { Modal } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useMemberInfo } from '../../services/contexts/memberContext'
import { MEMBER_STATUS_NORMAL } from '@/constants/const/member'
import NiceForm from '@/components/NiceForm'
import { freezeModalSchema } from './schema'
import useFreeze from '../../services/hooks/useFreeze'

const FreezeModal = forwardRef<any, any>(({}, ref) => {
  const modalFormActions = useRef(createAsyncFormActions())
  const [visible, toggle] = useToggle(false)
  const { handleSubmit, loading } = useFreeze()
  const { memberMaintainInfo } = useMemberInfo()

  useImperativeHandle(ref, () => ({
    toggle,
  }))
  return (
    <Modal
      title={memberMaintainInfo ? (memberMaintainInfo.status === MEMBER_STATUS_NORMAL ? '会员冻结' : '会员解冻') : ''}
      open={visible}
      confirmLoading={loading}
      onOk={() => modalFormActions.current.submit()}
      onCancel={() => toggle(false)}
      destroyOnClose
    >
      <NiceForm
        previewPlaceholder="' '"
        effects={($, { setFieldState }) => {
          FormEffectHooks.onFieldInit$('reason').subscribe((state) => {
            setFieldState('reason', (fieldState) => {
              fieldState.props.title = memberMaintainInfo
                ? `会员${memberMaintainInfo.status === MEMBER_STATUS_NORMAL ? '冻结' : '解冻'}原因`
                : ''
            })
          })
        }}
        actions={modalFormActions.current}
        schema={freezeModalSchema}
        onSubmit={(value) => handleSubmit(value)}
      />
    </Modal>
  )
})

export default FreezeModal
