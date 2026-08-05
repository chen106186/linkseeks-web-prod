import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberForm from '../components/MemberForm'

const EditMySelf: React.FC = () => {
  const { id, validateId } = usePageStatus()

  return <MemberForm id={+id} validateId={+validateId} isEdit={true} mode="myself" />
}

export default EditMySelf
