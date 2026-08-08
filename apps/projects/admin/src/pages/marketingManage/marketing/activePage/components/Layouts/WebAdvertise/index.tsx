import React from 'react'

interface Iprops {
  /** 广告图 */
  imageUrl: string
  visible: boolean
}

/** WEB装修页 广告图 */
const WebAdvertise: React.FC<Iprops> = (props: Iprops) => {
  const { imageUrl, visible, ...other } = props
  const { onClick, onMouseOver, className, getOperateState } = other as any
  const divProps = {
    onClick,
    onMouseOver,
  }
  return visible ? (
    <div style={{ height: '460px', width: '1920px' }} className={className} {...divProps}>
      <img src={imageUrl} style={{ width: '100%', height: '100%' }} />
    </div>
  ) : null
}

export default WebAdvertise
