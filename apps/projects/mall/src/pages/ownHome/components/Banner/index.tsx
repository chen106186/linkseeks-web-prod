import React from 'react'
import { Carousel, Skeleton } from 'antd'
import classNames from 'classnames'
import { openLink } from '@/utils'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'

export interface AdvertItem {
  /**
   * 是否删除(逻辑删除标志:1代表已删除)
   */
  isDeleted: number
  /**
   * 版本号(乐观锁)
   */
  version: number
  /**
   * 创建时间(自动填充)
   */
  createTime: number
  /**
   * 修改时间(自动填充)
   */
  updateTime: number
  id: number
  /**
   * 装修ID
   */
  adornId: number
  /**
   * 平台品类ID 当广告类型为三号广告时才有ID值
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
   * 会员ID
   */
  memberId: number
  /**
   * 角色ID
   */
  roleId: number
}

interface OwnBannerPropsType {
  className?: string
  prefixCls?: string
  hasQuickNav?: boolean
  type?: 1 | 2 | 3 | 4
  linkdisable?: boolean
  advertList: AdvertItem[]
  visible?: boolean
  tabType?: number
}

const Banner: React.FC<React.PropsWithChildren<OwnBannerPropsType>> = (props) => {
  const { children, type = 1, linkdisable = false, tabType = 1, advertList, className, ...others } = props

  const handleLink = (link: string) => {
    if (link) {
      openLink(link)
    }
  }

  const renderAdvert = () => {
    switch (type) {
      case 1:
        return (
          <div className={classNames(styles['lingxi-own-banner'], className)} {...others}>
            {advertList && advertList.length > 0 ? (
              <Carousel autoplay pauseOnDotsHover pauseOnHover>
                {advertList.map((item) => (
                  <div className={styles['lingxi-own-banner-item']} key={item.id}>
                    <span onClick={() => openLink(item.link)}>
                      <ImageBox width={496} height={496} src={item.picUrl} />
                    </span>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Skeleton.Button style={{ width: 496, height: 496 }} active />
            )}
          </div>
        )
      case 2:
        return (
          <div className={classNames(styles['lingxi-own-banner'], styles['two'], className)} {...others}>
            {advertList && advertList.length > 0 ? (
              <Carousel autoplay pauseOnDotsHover pauseOnHover>
                {advertList.map((item) => (
                  <div className={styles['lingxi-own-banner-item']} key={item.id}>
                    <span onClick={() => handleLink(item.link)}>
                      <ImageBox width={480} height={248} src={item.picUrl} />
                    </span>
                  </div>
                ))}
              </Carousel>
            ) : (
              <Skeleton.Button style={{ width: 480, height: 248 }} active />
            )}
          </div>
        )
      case 3:
        return (
          <div className={classNames(styles['lingxi-own-banner'], styles['three'], className)} {...others}>
            {advertList && advertList.length > 0 ? (
              advertList.map(
                (item, index) =>
                  index < 2 && (
                    <div className={styles['lingxi-own-banner-item']} key={item.id}>
                      <span onClick={() => handleLink(item.link)}>
                        <ImageBox width={232} height={232} src={item.picUrl} />
                      </span>
                    </div>
                  ),
              )
            ) : (
              <>
                <Skeleton.Button style={{ width: 232, height: 232 }} active />
                <Skeleton.Button style={{ width: 232, height: 232 }} active />
              </>
            )}
          </div>
        )
      case 4:
        return (
          <div className={classNames(styles['lingxi-own-banner'], styles['four'], className)} {...others}>
            {advertList &&
              advertList.map(
                (item, index) =>
                  index < 2 && (
                    <div className={styles['lingxi-own-banner-item']} key={item.id}>
                      <span onClick={() => handleLink(item.link)}>
                        <ImageBox width="100%" height={90} src={item.picUrl} />
                      </span>
                    </div>
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

export default Banner
