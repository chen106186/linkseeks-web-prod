import React, { Fragment, useRef } from 'react'
import { Carousel } from 'antd'
import classNames from 'classnames'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import emptyImg1 from './images/advert_1.svg'
import emptyImg2 from './images/advert_2.svg'
import emptyImg3 from './images/advert_3.svg'
import { jumpByType } from '../../utils'
import { AdvertItem } from '../../constants/advert'
import styles from './index.less'

interface AdvertPropsType {
  className?: string
  prefixCls?: string
  hasQuickNav?: boolean
  /**
   * top: 顶部广告；
   * banner:轮播广告;
   * interact:商品推荐广告
   * service:售后广告
   */
  type?: 'top' | 'banner' | 'interact' | 'service' | 'nav' | (string & {})
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
  advertList: AdvertItem[]
  /**
   * 是否显示
   */
  visible?: boolean
  tabType?: number
  target?: '_blank' | '_self' | '_parent' | '_top'
  timeLimit?: boolean
}

const Advert: React.FC<AdvertPropsType> = (props) => {
  const {
    type = 'top',
    linkdisable = false,
    tabType = 1,
    visible = true,
    advertList,
    className,
    target = '_blank',
    timeLimit = false,
    ...others
  } = props
  const bannerRef = useRef<any>()

  /** 判断广告图是否有效期 */
  const judegeIsValidity = (banner: any) => {
    if (!timeLimit) return true
    if (
      banner.effectiveTime &&
      Array.isArray(banner.effectiveTime) &&
      banner.effectiveTime.length >= 2
    ) {
      const effectiveTime = banner.effectiveTime
      const now = Date.now()
      const start = Date.parse(effectiveTime[0])
      const end = Date.parse(effectiveTime[1])

      // 处理无效时间戳
      if (isNaN(start) || isNaN(end)) return true

      // 当前时间在有效期范围内返回 true
      return now > start && now < end
    }
    return true
  }

  const renderAdvert = () => {
    switch (type) {
      case 'top':
        const topClassString = classNames(styles['lingxi-advert'], className)
        return visible ? (
          <div className={topClassString} {...others}>
            <Carousel
              className={styles['topAdvert_list']}
              autoplay
              pauseOnDotsHover
              pauseOnHover
            >
              {advertList &&
                advertList.map(
                  (item) =>
                    judegeIsValidity(item) && (
                      <div
                        className={styles['topAdvert_list_item']}
                        key={item.picUrl}
                      >
                        <span
                          onClick={() => jumpByType(item, linkdisable, target)}
                        >
                          <img src={item.picUrl} />
                        </span>
                      </div>
                    ),
                )}
            </Carousel>
          </div>
        ) : null
      case 'banner':
        const bannerClassString = classNames(styles['lingxi-banner'], className)
        return visible ? (
          <div className={bannerClassString} {...others}>
            {(advertList && advertList.length) > 0 ? (
              <Fragment>
                <Carousel
                  ref={bannerRef}
                  className={styles['banner_list']}
                  autoplay
                  pauseOnDotsHover
                >
                  {advertList.map(
                    (item) =>
                      judegeIsValidity(item) && (
                        <div
                          key={item.picUrl}
                          className={styles['banner_list_item']}
                        >
                          <div className={styles['banner_list_item_body']}>
                            <div
                              className={styles.link}
                              onClick={() =>
                                jumpByType(item, linkdisable, target)
                              }
                            >
                              <ImageBox
                                resizeMode="cover"
                                width={656}
                                height={336}
                                src={item.picUrl}
                              />
                            </div>
                          </div>
                        </div>
                      ),
                  )}
                </Carousel>
                {advertList && advertList.length > 1 && (
                  <Fragment>
                    <div
                      className={styles.banner_prev}
                      onClick={(e) => {
                        e.preventDefault()
                        bannerRef.current.prev()
                      }}
                    >
                      <LeftOutlined />
                    </div>
                    <div
                      className={styles.banner_next}
                      onClick={(e) => {
                        e.preventDefault()
                        bannerRef.current.next()
                      }}
                    >
                      <RightOutlined />
                    </div>
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <img src={emptyImg1} />
            )}
          </div>
        ) : null
      case 'interact':
        const interactClassString = classNames(
          styles['lingxi-interact_list'],
          className,
        )
        return visible ? (
          <div className={interactClassString} {...others}>
            {advertList && advertList.length > 0 ? (
              <Fragment>
                {advertList.map(
                  (item, index) =>
                    index < 2 &&
                    judegeIsValidity(item) && (
                      <div
                        key={item.picUrl}
                        className={styles['interact_list_item']}
                      >
                        <div
                          className={styles.link}
                          onClick={() => jumpByType(item, linkdisable, target)}
                        >
                          <ImageBox
                            width={320}
                            height={160}
                            src={item.picUrl}
                            resizeMode="cover"
                          />
                        </div>
                      </div>
                    ),
                )}
                {advertList.length === 1 && (
                  <div className={styles['interact_list_item']}>
                    <div className={styles.link}>
                      <img src={emptyImg2} />
                    </div>
                  </div>
                )}
              </Fragment>
            ) : (
              <Fragment>
                <div className={styles['interact_list_item']}>
                  <div className={styles.link}>
                    <img src={emptyImg2} />
                  </div>
                </div>
                <div className={styles['interact_list_item']}>
                  <div className={styles.link}>
                    <img src={emptyImg2} />
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        ) : null
      case 'service':
        const serviceClassString = classNames(
          styles['lingxi-service_list'],
          className,
        )
        return visible ? (
          <div className={serviceClassString} {...others}>
            {advertList &&
              advertList.map(
                (item) =>
                  judegeIsValidity(item) && (
                    <div
                      key={item.picUrl}
                      className={styles['service_list_item']}
                    >
                      <span
                        onClick={() => jumpByType(item, linkdisable, target)}
                      >
                        <img src={item.picUrl} />
                      </span>
                    </div>
                  ),
              )}
          </div>
        ) : null
      case 'nav':
        const navClassString = classNames(
          styles['lingxi-nav_banner'],
          className,
        )

        return (
          <div className={navClassString} {...others}>
            <Carousel
              className={styles['topAdvert_list']}
              autoplay
              pauseOnDotsHover
              pauseOnHover
              dots={false}
            >
              {advertList && advertList.length > 0 ? (
                advertList.map(
                  (item, index) =>
                    judegeIsValidity(item) && (
                      <div
                        className={styles.nav_banner_item}
                        key={`interact_advert_${index}`}
                      >
                        <div
                          className={styles.link}
                          onClick={() => jumpByType(item, linkdisable, target)}
                        >
                          <ImageBox
                            width={320}
                            height={370}
                            src={item.picUrl}
                            resizeMode="cover"
                          />
                        </div>
                      </div>
                    ),
                )
              ) : (
                <img src={emptyImg3} />
              )}
            </Carousel>
          </div>
        )
      default:
        return null
    }
  }
  return renderAdvert()
}

export default Advert
