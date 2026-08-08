import React from 'react'
import { Carousel } from 'antd'
import classNames from 'classnames'
import styles from './index.less'
import { openLink } from '../../utils'
import emptyImg from './images/floor_banner.svg'

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

interface FloorBannerProps {
  className?: string
  prefixCls?: string
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
  advertList: AdvertItem[]
}

const FloorBanner: React.FC<FloorBannerProps> = (props) => {
  const { className, advertList, linkdisable, ...others } = props
  const classString = classNames(styles['lingxi-floor-line-banner'], className)

  return (
    <section className={classString} {...others}>
      {advertList && advertList.length > 0 ? (
        <Carousel dotPosition="bottom" autoplay>
          {advertList.map((item) => (
            <div className={styles['floor-line-banner-item']} key={item.id}>
              <span
                onClick={() => openLink(item.link, linkdisable)}
                className={!linkdisable ? styles.link : ''}
              >
                <img
                  className={styles['floor-line-banner-item-img']}
                  src={item.picUrl}
                  alt={item.name}
                />
              </span>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className={styles['floor-line-banner-item']}>
          <img
            className={styles['floor-line-banner-item-img']}
            src={emptyImg}
          />
        </div>
      )}
    </section>
  )
}

export default FloorBanner
