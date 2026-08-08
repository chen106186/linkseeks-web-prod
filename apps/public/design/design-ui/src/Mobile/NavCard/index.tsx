import React, { useState, useRef, useEffect } from 'react'
import { Carousel } from 'antd'
import chunk from 'lodash/chunk'
import cx from 'classnames'
import styles from './index.less'

interface DataItemType {
  name: string
  /** 跳转类型：1-找现货 2-找供应 3-发布求购 4求购列表 5-换积分 6-找店铺 7-看资讯 8-授信申请 9-人气店铺 10-求购动态 11-最新成交 12-外部链接 */
  type: number
  url: string
  icon: string
}

export interface MobilekNavCardPropsType {
  className?: string
  style?: React.CSSProperties
  visible?: boolean
}

export interface MobileNavItemType {
  name: string
  /** 跳转类型：1-找现货 2-找供应 3-发布求购 4求购列表 5-换积分 6-找店铺 7-看资讯 8-授信申请 9-人气店铺 10-求购动态 11-最新成交 12-外部链接 */
  type: number
  url: string
  icon: string
  className?: string
  empty?: boolean
  key: string
  visible?: boolean
}

const NavItem = (props: MobileNavItemType) => {
  const {
    name,
    icon,
    url,
    type,
    className,
    empty = true,
    visible = true,
    ...others
  } = props

  if (!visible) return null

  return !empty ? (
    <div
      className={cx(styles['lingxi-quick-nav-list-item'], className)}
      {...others}
    >
      {icon && (
        <img
          className={styles['lingxi-quick-nav-list-item-navIcon']}
          src={icon}
        />
      )}
      <span className={styles['lingxi-quick-nav-list-item-navText']}>
        {name}
      </span>
    </div>
  ) : (
    <div
      className={cx(styles['lingxi-quick-nav-list-item'], className)}
      {...others}
    >
      <div className={styles['lingxi-quick-nav-list-item-navIcon-skeleton']} />
      <div
        className={styles['lingxi-quick-nav-list-item-navText-skeleton']}
      ></div>
    </div>
  )
}

const MobileNavCard: React.FC<MobilekNavCardPropsType> & {
  NavItem: typeof NavItem
} = (props) => {
  const { children, className, style, visible, ...others } = props
  const [navList, setNavList] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const carouselRef: any = useRef()

  useEffect(() => {
    if (children) {
      const childComponentList: any = children
      if (Array.isArray(children)) {
        setNavList(chunk(childComponentList, 10))
      } else {
        setNavList([[children]])
      }
    }
  }, [children])

  const renderChildren = () => {
    const classNameString = cx(
      styles[`lingxi-quick-nav`],
      className,
      !visible ? styles.hide : null,
    )

    const handleCarouselChange = (current: number) => {
      setCurrentIndex(current)
    }

    const handleGoSlide = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number,
    ) => {
      e.stopPropagation()
      carouselRef.current.goTo(index, false)
    }

    return (
      <div className={classNameString} style={style} {...others}>
        <Carousel
          ref={carouselRef}
          dots={false}
          afterChange={handleCarouselChange}
        >
          {navList.map((_, listItemIndex) => (
            <div key={`nav_item_wrap_${listItemIndex}`}>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', padding: '4px 0' }}
              >
                {navList[listItemIndex]}
              </div>
            </div>
          ))}
        </Carousel>
        {navList.length > 1 && (
          <div
            className={styles['lingxi-quick-nav-list-pagination']}
            style={{ justifyContent: 'center' }}
          >
            <div className={styles['lingxi-quick-nav-list-pagination-wrap']}>
              {navList.map((_: any, listIndex: number) => (
                <div
                  key={`lingxi-quick-nav-list-pagination-item-${listIndex}`}
                  className={cx(
                    styles['lingxi-quick-nav-list-pagination-item'],
                    currentIndex === listIndex ? styles.active : {},
                  )}
                  onClick={(e) => handleGoSlide(e, listIndex)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return renderChildren()
}

MobileNavCard.NavItem = NavItem

MobileNavCard.defaultProps = {
  visible: true,
}

export default MobileNavCard
