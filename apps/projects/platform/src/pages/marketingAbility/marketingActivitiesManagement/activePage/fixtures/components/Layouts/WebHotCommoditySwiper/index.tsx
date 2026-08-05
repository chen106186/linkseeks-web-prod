import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import React from 'react'
import styles from './index.less'
import useSwiper from './useSwiper'
import HotCommodity from './hotCommodityItem'
import WebCard from '../WebCard'
import classNames from 'classnames'

interface Iprops {
  title: string
  children: React.ReactNode
  /** 控制显示隐藏 */
  visible: boolean
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

/** 当前屏幕的swiper 一页的宽度 */
const SCREEN_WIDTH = 1200
/** 每个 HotCommodityItem 间隔看度 */
const OFFSET_WIDTH = 16

const HotCommoditySwiper: React.FC<Iprops> = (props: Iprops) => {
  const { title, children, className, onMouseOver, onClick, visible } = props
  const count = React.Children.count(children)

  const { current, onPrev, onNext } = useSwiper({ count: count })
  const designProps = {
    onMouseOver,
    onClick,
  }

  if (!visible) {
    return null
  }

  const renderChildren = () => {
    return React.Children.map(children, (_child: any, _index) => {
      return (
        <div className={styles['commodity-item']} key={_index}>
          {React.cloneElement(_child, { ..._child.props })}
        </div>
      )
    })
  }

  return (
    <div className={classNames(styles.container, className)} {...designProps}>
      <WebCard title={<div className={styles['container-title']}>{title}</div>}>
        <div className={styles.swiper}>
          <div className={classNames(styles['swiper-prev'], { [styles.hidden]: current === 0 })} onClick={onPrev}>
            <LeftOutlined style={{ fontSize: '20px', color: 'red' }} />
          </div>
          <div className={styles['swiper-view']}>
            <div
              className={styles.commodityList}
              style={{ transform: `translateX(${-current * SCREEN_WIDTH + -(current * OFFSET_WIDTH)}px)` }}
            >
              {renderChildren()}
            </div>
          </div>
          <div
            className={classNames(styles['swiper-next'], { [styles.hidden]: (current + 1) * 3 >= count })}
            onClick={onNext}
          >
            <RightOutlined style={{ fontSize: '20px', color: 'red' }} />
          </div>
        </div>
      </WebCard>
    </div>
  )
}

export default HotCommoditySwiper
