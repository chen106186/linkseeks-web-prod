import React, { useRef } from 'react'
import { Carousel } from 'antd'
import classNames from 'classnames'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.less'
import { AdvertItemType } from '../index'
import { openLink } from '../../../utils'

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
  type?:
    | 'top'
    | 'banner'
    | 'interact'
    | 'service'
    | 'nav'
    | 'purchase'
    | (string & {})
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
  advertList: AdvertItemType[]
  /**
   * 是否显示
   */
  visible?: boolean
  tabType?: number
}

const PlatformAdvert: React.FC<AdvertPropsType> = (props) => {
  const {
    type = 'top',
    linkdisable = false,
    tabType = 1,
    visible = true,
    advertList,
    className,
    ...others
  } = props
  const bannerRef = useRef<any>()

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
                advertList.map((item, index) => (
                  <div
                    className={styles['topAdvert_list_item']}
                    key={`${item.id}_${index}`}
                  >
                    <span onClick={() => openLink(item.link, linkdisable)}>
                      <img src={item.imgUrl} alt={item.name} />
                    </span>
                  </div>
                ))}
            </Carousel>
          </div>
        ) : null
      case 'banner':
        const bannerClassString = classNames(styles['lingxi-banner'], className)
        return visible ? (
          <div className={bannerClassString} {...others}>
            {advertList && advertList?.length > 0 ? (
              <>
                <Carousel
                  ref={bannerRef}
                  className={styles['banner_list']}
                  autoplay
                  pauseOnDotsHover
                >
                  {advertList.map((item, index) => (
                    <div
                      key={`${item.id}_${index}`}
                      className={styles['banner_list_item']}
                    >
                      <div className={styles['banner_list_item_body']}>
                        <div
                          className={styles.link}
                          onClick={() => openLink(item.link, linkdisable)}
                          title={item.name}
                        >
                          <ImageBox
                            resizeMode="cover"
                            width={520}
                            height={292}
                            src={item.imgUrl}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
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
              </>
            ) : (
              <div className={styles.banner_null}>轮播广告图</div>
            )}
          </div>
        ) : null
      case 'bannerRight':
        const bannerRightClassString = classNames(
          styles['lingxi-banner-right'],
          className,
        )
        return (
          <div className={bannerRightClassString} {...others}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item: any, index: number) =>
                  index === 0 && (
                    <div
                      className={styles.link}
                      title={item.name}
                      key={`bannerRight_${index}`}
                    >
                      <ImageBox width={200} height={292} src={item.imgUrl} />
                    </div>
                  ),
              )
            ) : (
              <div className={styles['lingxi-banner-right-null']}>广告图</div>
            )}
          </div>
        )
      case 'bannerBottom':
        const bannerBottomClassString = classNames(
          styles['lingxi-banner-bottom'],
          className,
        )
        return (
          <div className={bannerBottomClassString} {...others}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              {advertList?.length > 0 ? (
                advertList.map(
                  (item: any, index: number) =>
                    index < 3 && (
                      <div
                        className={styles.link}
                        key={`bannerBottom_${index}`}
                        title={item.name}
                      >
                        <ImageBox
                          width={index === 2 ? 200 : 252}
                          height={204}
                          src={item.imgUrl}
                        />
                      </div>
                    ),
                )
              ) : (
                <>
                  <div className={styles['lingxi-banner-bottom-null']}>
                    广告图
                  </div>
                  <div className={styles['lingxi-banner-bottom-null']}>
                    广告图
                  </div>
                  <div
                    className={styles['lingxi-banner-bottom-null']}
                    style={{ width: 200 }}
                  >
                    广告图
                  </div>
                </>
              )}
            </div>
          </div>
        )
      case 'floorBanner':
        const floorBannerClassString = classNames(
          styles['lingxi-floor_banner'],
          className,
        )
        return visible ? (
          <div className={floorBannerClassString} {...others}>
            {advertList &&
              advertList.map(
                (item, index: number) =>
                  index === 0 && (
                    <div key={item.id} className={styles['floor_banner_item']}>
                      <span onClick={() => openLink(item.link, linkdisable)}>
                        <img src={item.imgUrl} alt={item.name} />
                      </span>
                    </div>
                  ),
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
            {advertList?.length > 0 ? (
              advertList.map((item, index) => (
                <div
                  key={`${item.id}_${index}`}
                  className={styles['service_list_item']}
                >
                  <span onClick={() => openLink(item.link, linkdisable)}>
                    <img src={item.imgUrl} />
                  </span>
                </div>
              ))
            ) : (
              <>
                <div
                  className={styles['service_list_item_null']}
                  style={{ marginRight: 24 }}
                >
                  广告图
                </div>
                <div className={styles['service_list_item_null']}>广告图</div>
              </>
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
            {advertList &&
              advertList.length > 0 &&
              advertList.map(
                (item: any, index: number) =>
                  item.sort === tabType && (
                    <div
                      className={styles.nav_banner_item}
                      key={`interact_advert_${index}`}
                    >
                      <div
                        className={styles.link}
                        onClick={() => openLink(item.link, linkdisable)}
                      >
                        <ImageBox width={320} height={96} src={item.imgUrl} />
                      </div>
                    </div>
                  ),
              )}
          </div>
        )
      case 'purchase':
        const purchaseClassString = classNames(
          styles['lingxi-purchase'],
          className,
        )
        return (
          <div className={purchaseClassString} {...others}>
            {advertList &&
              advertList.length > 0 &&
              advertList.map(
                (item: any, index: number) =>
                  index === 0 && (
                    <ImageBox
                      key={`purchase_${index}`}
                      width={340}
                      height={100}
                      src={item.imgUrl}
                    />
                  ),
              )}
          </div>
        )
      default:
        return null
    }
  }
  return renderAdvert()
}

export default PlatformAdvert
