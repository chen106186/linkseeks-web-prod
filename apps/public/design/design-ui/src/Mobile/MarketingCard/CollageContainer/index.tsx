import React, { useRef, useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'
import styles from './index.less'

import DetailItem from '../DetailItem'

interface CollageContainerProps {
  children?: any
  className?: string
}

const CollageContainer: React.FC<CollageContainerProps> = (
  props: CollageContainerProps,
) => {
  const { children, className, ...other } = props
  const [showList, setShowList] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [detailProps, setDetailProps] = useState<any>(
    children?.length ? children?.[0]?.props?.detail : children?.props?.detail,
  )
  const [translateX, setTrranslateX] = useState(0)
  const carouselRef: any = useRef()

  useEffect(() => {
    if (children) {
      const childComponentList: any = !children.length ? [children] : children
      setShowList(childComponentList)
    }
  }, [children])

  const _tabs = (detail: any) => {
    setDetailProps(detail)
  }

  const fixedDom = document.getElementById('moryeScroll')

  const _onScroll = (e: any) => {
    if (fixedDom?.scrollLeft || fixedDom?.scrollLeft === 0) {
      const _current = Math.ceil(fixedDom?.scrollLeft / 70.19)
      const _left = (fixedDom?.scrollLeft / fixedDom?.scrollWidth) * 48
      let _slideLeft = 0
      if (_left < 0) {
        _slideLeft = 0
      } else if (_left >= 24) {
        _slideLeft = 24
      } else {
        _slideLeft = _left
      }
      setCurrentIndex(_current)
      setTrranslateX(_slideLeft)
    }
  }

  return (
    <div>
      {!isEmpty(detailProps) ? (
        <DetailItem
          detail={detailProps}
          isnull={false}
          detailType="collage"
          containStyle={{
            padding: 12,
            backgroundImage:
              'linear-gradient(90deg, rgba(253,88,0,0.24) 0%, rgba(255,255,255,0.00) 73%)',
          }}
        />
      ) : null}
      <div className={styles[`lingxi-marketingCard-collageContainer-showList`]}>
        <div
          id="moryeScroll"
          style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}
          onScroll={_onScroll}
        >
          <div style={{ width: 70.19 * 2, height: 70, flex: 'none' }}></div>
          {showList.map((child: any, childIndex: any) => {
            const _ele = React.cloneElement(child, {
              active: currentIndex === childIndex,
              tab: _tabs,
            })
            return _ele
          })}
          <div style={{ width: 70.19 * 2, height: 70, flex: 'none' }}></div>
        </div>
      </div>
      <div
        className={styles[`lingxi-marketingCard-collageContainer-pagination`]}
      >
        <div
          className={
            styles[`lingxi-marketingCard-collageContainer-pagination-wrap`]
          }
        >
          <div
            className={
              styles[
                `lingxi-marketingCard-collageContainer-pagination-wrap-item`
              ]
            }
            style={{ transform: `translate(${translateX}px)` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default CollageContainer
