import React, { PropsWithChildren, useRef } from 'react'
import { Carousel, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { ConfigConsumer } from '../Generator'
import styles from './index.module.less'

interface AdvertPropsType {
  className?: string
  prefixCls?: string
  advertList: any
  type?: 'top' | 'banner' | 'interact' | 'service' | 'nav' | (string & {}) // top: 顶部广告；banner:轮播广告;interact:banner下的广告;nav:快速导航广告
  tabType?: number
  getPrefixCls?: any
}

const Advert: React.FC<PropsWithChildren<AdvertPropsType>> = (props) => {
  const { advertList, tabType } = props
  const bannerRef = useRef<any>()

  const handleLink = (link: string) => {
    if (link) {
      const urlRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
      if (!import.meta.env.SSR && urlRegex.test(link)) {
        window.open(link)
      }
    }
  }

  const renderAdvert = () => {
    const { type = 'top', children, className, getPrefixCls, ...others } = props

    switch (type) {
      case 'banner':
        return (
          <div className={styles['lingxi-banner']}>
            {advertList && advertList.length > 0 ? (
              <Carousel ref={bannerRef} className={styles.banner_list} autoplay pauseOnDotsHover>
                {advertList.map((item: any, index: number) => (
                  <div className={styles.banner_list_item} key={`banner_advert_${index}`}>
                    <div className={styles.banner_list_item_body}>
                      <div className={styles.link} onClick={() => handleLink(item.link)}>
                        <ImageBox width={656} height={336} src={item.picUrl} alt={item.name} />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Skeleton.Button style={{ width: '656px', height: '336px' }} active />
            )}
            <div className={styles.banner_prev} onClick={() => bannerRef.current.prev()}>
              <LeftOutlined translate={undefined} />
            </div>
            <div className={styles.banner_next} onClick={() => bannerRef.current.next()}>
              <RightOutlined translate={undefined} />
            </div>
          </div>
        )
      case 'interact':
        return (
          <div className={styles['lingxi-interact_list']}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item: any, index: number) =>
                  index < 2 && (
                    <div className={styles.interact_list_item} key={`interact_advert_${index}`}>
                      <div className={styles.link} onClick={() => handleLink(item.link)}>
                        <ImageBox width={320} height={160} src={item.picUrl} alt={item.name} />
                      </div>
                    </div>
                  ),
              )
            ) : (
              <div>
                <Skeleton.Button style={{ width: '320px', height: '160px', marginRight: 16 }} active />
                <Skeleton.Button style={{ width: '320px', height: '160px' }} active />
              </div>
            )}
          </div>
        )
      case 'service':
        const serviceClassString = classNames(styles['lingxi-service_list'], className)
        return (
          <div className={serviceClassString} {...others}>
            {advertList &&
              advertList.map((item: any) => (
                <div key={item.id} className={styles['service_list_item']}>
                  <span>
                    <img src={item.picUrl} alt={item.name} />
                  </span>
                </div>
              ))}
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
                        <img width={320} height={96} src={item.picUrl} alt={item.name} />
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
  return <ConfigConsumer>{renderAdvert}</ConfigConsumer>
}

export default Advert
