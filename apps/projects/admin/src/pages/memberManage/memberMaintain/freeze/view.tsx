import React, { useRef } from 'react'
import DetailInfo from '../../components/memberDetail'
import useFreeze from '../../services/hooks/useFreeze'
import { Button } from '@linkseeks/ui'
import FreezeModal from '../../components/freezeModal'
import { StopIcon } from '@linkseeks/icons'
import { StopOutlined } from '@ant-design/icons'

const Detail: React.FC = () => {
  const modalRef = useRef<any>({})

  const ExtraButton = () => {
    return (
      <Button
        onClick={() => {
          modalRef.current.toggle(true)
        }}
        icon={<StopIcon />}
      >
        冻结
      </Button>
    )
  }

  return (
    <DetailInfo extraButton={<ExtraButton />}>
      <FreezeModal ref={modalRef} />
    </DetailInfo>
  )
}

export default Detail
