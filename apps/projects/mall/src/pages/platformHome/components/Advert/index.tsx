import React, { useRef } from 'react'
import { Carousel, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { LinkTo } from '@/utils'
import styles from './index.module.less'

interface AdvertPropsType {
  className?: string
  prefixCls?: string
  advertList: any
  type?: 'banner' | 'bannerRight' | 'bannerBottom' | 'interact' | 'service' | 'nav' | 'floorBanner' | (string & {})
  tabType?: number
}

const Advert: React.FC<AdvertPropsType> = (props) => {
  const { advertList, tabType } = props
  const bannerRef = useRef<any>()

  const handleLink = (link: string) => {
    if (link) {
      // if (__isBrowser__) {
      //   LinkTo(link, 'blank')
      // }
    }
  }

  const renderAdvert = () => {
    const { type = 'top', children, className, ...others } = props

    switch (type) {
      case 'banner':
        return (
          <div className={styles['lingxi-banner']}>
            {advertList && advertList.length > 0 ? (
              <Carousel ref={bannerRef} className={styles.banner_list} autoplay pauseOnDotsHover>
                {advertList.map((item: any, index: number) => (
                  <div className={styles.banner_list_item} key={`banner_advert_${index}`}>
                    <div className={styles.banner_list_item_body}>
                      <div className={styles.link} onClick={() => handleLink(item.link)} title={item.name || ''}>
                        <ImageBox width={520} height={292} src={item.imgUrl} />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Skeleton.Button style={{ width: '520px', height: '292px' }} active />
            )}
            <div className={styles.banner_prev} onClick={() => bannerRef.current.prev()}>
              <LeftOutlined translate={undefined} />
            </div>
            <div className={styles.banner_next} onClick={() => bannerRef.current.next()}>
              <RightOutlined translate={undefined} />
            </div>
          </div>
        )
      case 'bannerRight':
        return (
          <div className={styles['lingxi-banner-right']}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item: any, index: number) =>
                  index === 0 && (
                    <div className={styles.link} key={`banner_right_${index}`} onClick={() => handleLink(item.link)}>
                      <ImageBox width={200} height={292} src={item.imgUrl} />
                    </div>
                  ),
              )
            ) : (
              <Skeleton.Button style={{ width: '200px', height: '292px', marginLeft: 16 }} active />
            )}
          </div>
        )
      case 'bannerBottom':
        return (
          <div className={styles['lingxi-banner-right']}>
            {advertList && advertList.length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                {advertList.map(
                  (item: any, index: number) =>
                    index < 3 && (
                      <div className={styles.link} key={`banner_bottom_${index}`} onClick={() => handleLink(item.link)}>
                        <ImageBox width={index === 2 ? 200 : 252} height={204} src={item.imgUrl} />
                      </div>
                    ),
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                <Skeleton.Button style={{ width: '252px', height: '204px' }} active />
                <Skeleton.Button style={{ width: '252px', height: '204px' }} active />
                <Skeleton.Button style={{ width: '200px', height: '204px' }} active />
              </div>
            )}
          </div>
        )
      case 'service':
        const serviceClassString = classNames(styles['lingxi-service_list'], className)

        if (!advertList || (advertList && advertList.length === 0)) {
          return null
        }

        return (
          <div className={serviceClassString} {...others}>
            {advertList &&
              advertList.map((item: any, index: number) => (
                <div
                  key={`service_banner_${index}`}
                  className={styles['service_list_item']}
                  onClick={() => handleLink(item.link)}
                >
                  <div className={styles.link}>
                    <img src={item.imgUrl} />
                  </div>
                </div>
              ))}
          </div>
        )
      case 'floorBanner':
        const floorBannerClassString = classNames(styles['lingxi-floor_banner'], className)

        if (!advertList || (advertList && advertList.length === 0)) {
          return null
        }

        return (
          <div className={floorBannerClassString} {...others}>
            {advertList &&
              advertList.map(
                (item: any, index: number) =>
                  index === 0 && (
                    <div
                      key={`floor_banner_${index}`}
                      onClick={() => handleLink(item.link)}
                      className={styles['floor_banner_item']}
                    >
                      <div className={styles.link}>
                        <img src={item.imgUrl} />
                      </div>
                    </div>
                  ),
              )}
          </div>
        )
      case 'nav':
        return (
          <div className={styles['lingxi-nav_banner']}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item: any, index: number) =>
                  item.sort === tabType && (
                    <div className={styles.nav_banner_item} key={`interact_advert_${index}`}>
                      <div className={styles.link} onClick={() => handleLink(item.link)}>
                        <ImageBox width={320} height={96} src={item.imgUrl} />
                      </div>
                    </div>
                  ),
              )
            ) : (
              <Skeleton.Button style={{ width: '320px', height: '96px' }} active />
            )}
          </div>
        )
      default:
        return null
    }
  }
  return renderAdvert()
}

export default Advert
