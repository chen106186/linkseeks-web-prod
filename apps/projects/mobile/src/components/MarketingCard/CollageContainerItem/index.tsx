import React, { useEffect } from 'react'
import { Image, View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'

import './index.scss'

interface CollageContainerItemProps {
  detail?: any
  isAct?: boolean
  clientWidth: number
  setReocrd?: (record: any) => void
}

const CollageContainerItem: React.FC<CollageContainerItemProps> = (props: CollageContainerItemProps) => {
  const { detail, isAct, clientWidth, setReocrd } = props
  const _exStyle = {
    width: pxTransform(isAct ? clientWidth + 8 : clientWidth),
    height: pxTransform(isAct ? clientWidth + 8 : clientWidth),
    borderWidth: isAct ? 1 : 0,
    borderColor: '#E8CBB1',
  }
  useEffect(() => {
    if (isAct) {
      setReocrd?.(detail)
    }
  }, [isAct])
  return (
    <View className="marketingCard-collageContainer-item-container" style={_exStyle}>
      <Image
        className="marketingCard-collageContainer-item-container-image"
        src={detail?.img}
        style={{
          width: pxTransform(isAct ? clientWidth - 8 : clientWidth - 16),
          height: pxTransform(isAct ? clientWidth - 8 : clientWidth - 16),
        }}
      />
    </View>
  )
}

CollageContainerItem.defaultProps = {
  detail: {},
  isAct: undefined,
  setReocrd: () => {},
}

export default CollageContainerItem
