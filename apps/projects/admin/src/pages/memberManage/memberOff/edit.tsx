import React, { useRef } from 'react'
import DetailInfo from '../components/memberDetail'
import { Button, Modal } from '@linkseeks/ui'
import { useRequestApi } from '@linkseeks/hooks'
import { postMemberMaintenanceCancellationAuth } from '@apps/apis'
import LogoffModal from '../components/logoffModal'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'

const Detail: React.FC = () => {
  const modalRef = useRef<any>({})
  const { id } = usePageStatus()
  const extraButton = (
    <Button
      type="primary"
      onClick={() => {
        modalRef.current.toggle(true)
      }}
    >
      注销审核
    </Button>
  )
  const { run, loading } = useRequestApi(postMemberMaintenanceCancellationAuth, {
    manual: true,
    onSuccess() {
      modalRef.current.toggle(false)
      history.goBack()
    },
  })
  const handleSubmit = (params) => {
    run({
      ...params,
      memberId: id,
    })
  }
  return (
    <DetailInfo extraButton={extraButton}>
      <LogoffModal ref={modalRef} handleSubmit={handleSubmit} loading={loading} />
    </DetailInfo>
  )
}

export default Detail
