import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberForm from './components/MemberForm'

const EditMember: React.FC = () => {
  const { id, validateId } = usePageStatus()
  return <MemberForm id={+id} validateId={+validateId} isEdit />
}

export default EditMember
