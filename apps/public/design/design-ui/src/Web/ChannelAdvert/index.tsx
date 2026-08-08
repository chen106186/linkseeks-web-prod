import React, { useRef } from 'react'
import { Carousel, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import styles from './index.less'
import ImageBox from '@apps/components/src/web/ImageBox'
import { openLink } from '../../utils'

interface AdvertPropsType {
  className?: string
  prefixCls?: string
  advertList: any
  type?: 'top' | 'banner' | 'interact' | 'service' | 'nav' | (string & {}) // top: 顶部广告；banner:轮播广告;interact:banner下的广告;nav:快速导航广告
  tabType?: number
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
}

const Advert: React.FC<AdvertPropsType> = (props) => {
  const { advertList, linkdisable = false } = props
  const bannerRef = useRef<any>()

  const renderAdvert = () => {
    const { type = 'top', className, ...others } = props

    switch (type) {
      case 'banner':
        const bannerClassString = classNames(styles['lingxi-banner'], className)
        return (
          <div className={bannerClassString} {...others}>
            {advertList && advertList.length > 0 ? (
              <Carousel
                ref={bannerRef}
                className={styles.banner_list}
                autoplay
                pauseOnDotsHover
              >
                {advertList.map((item: any, index: number) => (
                  <div
                    className={styles.banner_list_item}
                    key={`banner_advert_${index}`}
                  >
                    <div className={styles.banner_list_item_body}>
                      <div
                        className={styles.link}
                        onClick={() => openLink(item.link, linkdisable)}
                      >
                        <ImageBox
                          resizeMode="cover"
                          width={736}
                          height={288}
                          src={item.picUrl}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Skeleton.Button
                style={{ width: '656px', height: '336px' }}
                active
              />
            )}
            <div
              className={styles.banner_prev}
              onClick={() => bannerRef.current.prev()}
            >
              <LeftOutlined />
            </div>
            <div
              className={styles.banner_next}
              onClick={() => bannerRef.current.next()}
            >
              <RightOutlined />
            </div>
          </div>
        )
      case 'interact':
        const interactClassString = classNames(
          styles['lingxi-interact_list'],
          className,
        )
        return (
          <div className={interactClassString} {...others}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item: any, index: number) =>
                  index < 4 && (
                    <div
                      className={styles.interact_list_item}
                      key={`interact_advert_${index}`}
                    >
                      <div
                        className={styles.link}
                        onClick={() => openLink(item.link, linkdisable)}
                      >
                        <ImageBox
                          width={172}
                          resizeMode="cover"
                          height={96}
                          src={item.picUrl}
                        />
                      </div>
                    </div>
                  ),
              )
            ) : (
              <div>
                <Skeleton.Button
                  style={{ width: '172px', height: '96px', marginRight: 16 }}
                  active
                />
                <Skeleton.Button
                  style={{ width: '172px', height: '96px', marginRight: 16 }}
                  active
                />
                <Skeleton.Button
                  style={{ width: '172px', height: '96px', marginRight: 16 }}
                  active
                />
                <Skeleton.Button
                  style={{ width: '172px', height: '96px' }}
                  active
                />
              </div>
            )}
          </div>
        )
      case 'service':
        const serviceClassString = classNames(
          styles['lingxi-service_list'],
          className,
        )
        return (
          <div className={serviceClassString} {...others}>
            {advertList &&
              advertList.map((item: any) => (
                <div
                  key={item.id}
                  className={styles['service_list_item']}
                  onClick={() => openLink(item.link, linkdisable)}
                >
                  <span>
                    <img src={item.picUrl} />
                  </span>
                </div>
              ))}
          </div>
        )
      default:
        return null
    }
  }
  return renderAdvert()
}

export default Advert
