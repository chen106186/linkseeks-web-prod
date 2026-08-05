import React, { useRef } from 'react'
import DetailInfo from '../components/memberDetail'
import { Button, Modal } from '@linkseeks/ui'
import ApprovedModal from '../components/approvedModal'
import useApproved, { ApprovedType } from '../services/hooks/useApproved'

const Detail: React.FC = () => {
  const extraButton = (
    <Button
      type="primary"
      onClick={() => {
        modalRef.current.toggle(true)
      }}
    >
      提交审核
    </Button>
  )

  const { handleSubmit, loading, modalRef } = useApproved({ type: ApprovedType.confirm })
  return (
    <DetailInfo type="approved" extraButton={extraButton}>
      <ApprovedModal ref={modalRef} handleSubmit={handleSubmit} loading={loading} />
    </DetailInfo>
  )
}

export default Detail
