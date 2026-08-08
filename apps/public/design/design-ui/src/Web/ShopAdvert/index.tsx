import React from 'react'
import { Carousel } from 'antd'
import classNames from 'classnames'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'
import styles from './index.less'
import { openLink } from '../../utils'

interface AdvertItem {
  /**
   * ID
   */
  id: number
  /**
   * 模板ID
   */
  templateId: number
  /**
   * 分类ID 当广告类型为四号广告时才有ID值
   */
  categoryId: number
  /**
   * 广告类型: 1.一号广告 2.二号广告 3.三号广告 4.四号广告
   */
  type: number
  /**
   * 广告名称
   */
  name: string
  /**
   * 广告图片
   */
  picUrl: string
  /**
   * 链接
   */
  link: string
  /**
   * 排序
   */
  sort: number
  /**
   * 创建时间
   */
  createTime: number
  bgColor?: string
}

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
  type?: 'banner' | 'service' | (string & {})
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
}

const ShopAdvert: React.FC<AdvertPropsType> = (props) => {
  const {
    type = 'banner',
    linkdisable = false,
    visible = true,
    advertList,
    className,
    ...others
  } = props

  const renderAdvert = (locale: GlobalLocale) => {
    switch (type) {
      case 'banner':
        const bannerClassString = classNames(styles['lingxi-banner'], className)

        return (
          <div className={bannerClassString} {...others}>
            <Carousel
              className={styles['banner_list']}
              autoplay
              pauseOnDotsHover
            >
              {advertList?.length > 0 ? (
                advertList.map((item, index) => (
                  <div
                    className={styles['banner_list_item']}
                    key={`lingxi-banner_${index}`}
                  >
                    <div onClick={() => openLink(item.link, linkdisable)}>
                      <img
                        className={styles['banner_list_item_img']}
                        src={item.picUrl}
                        alt={item.name}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles['banner_list_null']}>
                  {locale['advert.banner.swiper']}
                </div>
              )}
            </Carousel>
          </div>
        )
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
                  key={`lingxi-service_${index}`}
                  className={styles['service_list_item']}
                >
                  <span onClick={() => openLink(item.link, linkdisable)}>
                    <img src={item.picUrl} />
                  </span>
                </div>
              ))
            ) : (
              <>
                <div
                  className={styles['service_list_item_null']}
                  style={{ marginRight: 24 }}
                >
                  {' '}
                  {locale['advert.banner']}
                </div>
                <div className={styles['service_list_item_null']}>
                  {locale['advert.banner']}
                </div>
              </>
            )}
          </div>
        ) : null
      default:
        return null
    }
  }

  return <LocaleReceiver componentName="global">{renderAdvert}</LocaleReceiver>
}

export default ShopAdvert
