import React from 'react'
import { Commodity, Progress } from '@apps/design-ui'
import styles from './index.less'

interface Iprops {
  className: string
  onClick: () => void
  onDrag: () => void
  onDragEnd: () => void
  onDragEnter: () => void
  onDragStart: () => void
  onMouseOver: () => void
  draggable?: boolean
  getOperateState: any
  productImgUrl?: string
  productName?: string
  productId?: number
  id?: number
  price?: number
  activityPrice?: number
}

const FlashSale: React.FC<Iprops> = (props: Iprops) => {
  const { className, onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, ...other } = props
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }

  return (
    <div className={styles.item}>
      <div {...divProps} className={className} style={{ height: '100%' }}>
        <Commodity
          name={other.productName}
          image={other.productImgUrl}
          mode="horizontal"
          discountPrice={other.activityPrice}
          price={other.price}
          progress={
            <Progress
              percent={50}
              progressTips={'剩余50%'}
              extra={
                <div style={{ fontSize: '10px', color: '#919598', marginLeft: '12px', minWidth: '80px' }}>
                  已送出<span style={{ color: '#ef3346' }}>312</span>件
                </div>
              }
            />
          }
        />
      </div>
    </div>
  )
}

export default FlashSale
