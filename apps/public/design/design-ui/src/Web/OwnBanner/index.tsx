import React, { useEffect, useState } from 'react'
import { Carousel } from 'antd'
import classNames from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { jumpByType } from '../../utils'
import { isCurrentTimeInRange } from '../../utils/date'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'
import { AdvertItem } from '../../constants/advert'
import styles from './index.less'

interface OwnBannerPropsType {
  className?: string
  type?: 1 | 2 | 3 | 4
  linkdisable?: boolean
  advertList: AdvertItem[]
  visible?: boolean
  target?: '_blank' | '_self' | '_parent' | '_top'
  /** 是否根据有效期显示广告图 */
  timeLimit?: boolean
}

const OwnBanner: React.FC<React.PropsWithChildren<OwnBannerPropsType>> = (
  props,
) => {
  const {
    children,
    type = 1,
    linkdisable = false,
    timeLimit = false,
    advertList,
    className,
    target = '_blank',
    ...others
  } = props
  const [showList, setShowList] = useState<AdvertItem[]>([])

  useEffect(() => {
    if (advertList && advertList.length > 0) {
      if (timeLimit) {
        setShowList(
          advertList.filter((item) => {
            if (item.effectiveStartTime && item.effectiveEndTime) {
              return isCurrentTimeInRange(
                new Date(item.effectiveStartTime).getTime(),
                new Date(item.effectiveEndTime).getTime(),
              )
            }
            return true
          }),
        )
      } else {
        setShowList(advertList)
      }
    }
  }, [advertList])

  const renderAdvert = (locale: GlobalLocale) => {
    switch (type) {
      case 1:
        return (
          <div
            className={classNames(styles['lingxi-own-banner'], className)}
            {...others}
          >
            {showList?.length > 0 ? (
              <Carousel autoplay pauseOnDotsHover pauseOnHover>
                {showList.map((item) => (
                  <div
                    className={styles['lingxi-own-banner-item']}
                    key={item.picUrl}
                  >
                    <span onClick={() => jumpByType(item, linkdisable, target)}>
                      <ImageBox
                        width={496}
                        height={496}
                        round={8}
                        src={item.picUrl}
                        resizeMode="cover"
                      />
                    </span>
                  </div>
                ))}
              </Carousel>
            ) : linkdisable ? (
              <div className={styles['lingxi-own-banner-null']}>
                {locale['advert.banner.swiper']}
              </div>
            ) : null}
          </div>
        )
      case 2:
        return (
          <div
            className={classNames(
              styles['lingxi-own-banner'],
              styles['two'],
              className,
            )}
            {...others}
          >
            {showList?.length > 0 ? (
              <Carousel autoplay pauseOnDotsHover pauseOnHover>
                {showList &&
                  showList.map((item) => (
                    <div
                      className={styles['lingxi-own-banner-item']}
                      key={item.picUrl}
                    >
                      <span
                        onClick={() => jumpByType(item, linkdisable, target)}
                      >
                        <ImageBox
                          width={480}
                          height={248}
                          round={8}
                          src={item.picUrl}
                          resizeMode="cover"
                        />
                      </span>
                    </div>
                  ))}
              </Carousel>
            ) : linkdisable ? (
              <div className={styles['lingxi-own-banner-two-null']}>
                {' '}
                {locale['advert.banner']}
              </div>
            ) : null}
          </div>
        )
      case 3:
        return (
          <div
            className={classNames(
              styles['lingxi-own-banner'],
              styles['three'],
              className,
            )}
            {...others}
          >
            {showList?.length > 0 ? (
              showList.map(
                (item, index) =>
                  index < 2 && (
                    <div
                      className={styles['lingxi-own-banner-item']}
                      key={item.picUrl}
                    >
                      <span
                        onClick={() => jumpByType(item, linkdisable, target)}
                      >
                        <ImageBox
                          width={232}
                          height={232}
                          round={8}
                          src={item.picUrl}
                          resizeMode="cover"
                        />
                      </span>
                    </div>
                  ),
              )
            ) : linkdisable ? (
              <>
                <div
                  className={styles['lingxi-own-banner-three-null']}
                  style={{ marginRight: 16 }}
                >
                  {' '}
                  {locale['advert.banner']}
                </div>
                <div className={styles['lingxi-own-banner-three-null']}>
                  {' '}
                  {locale['advert.banner']}
                </div>
              </>
            ) : null}
          </div>
        )
      case 4:
        return (
          <div
            className={classNames(
              styles['lingxi-own-banner'],
              styles['four'],
              className,
            )}
            {...others}
          >
            {showList?.length > 0 ? (
              showList.map(
                (item, index) =>
                  index < 2 && (
                    <div
                      className={styles['lingxi-own-banner-item']}
                      key={item.picUrl}
                    >
                      <span
                        onClick={() => jumpByType(item, linkdisable, target)}
                      >
                        <ImageBox
                          width="100%"
                          height={90}
                          round={8}
                          src={item.picUrl}
                        />
                      </span>
                    </div>
                  ),
              )
            ) : linkdisable ? (
              <>
                <div
                  className={styles['lingxi-own-banner-four-null']}
                  style={{ marginRight: 24 }}
                >
                  {' '}
                  {locale['advert.banner']}
                </div>
                <div className={styles['lingxi-own-banner-four-null']}>
                  {' '}
                  {locale['advert.banner']}
                </div>
              </>
            ) : null}
          </div>
        )
      default:
        return null
    }
  }

  return <LocaleReceiver componentName="global">{renderAdvert}</LocaleReceiver>
}

export default OwnBanner
