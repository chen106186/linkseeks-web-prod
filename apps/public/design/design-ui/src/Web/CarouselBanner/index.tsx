import React, { Fragment, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { Carousel } from 'antd'
import ImageBox from '@apps/components/src/web/ImageBox'
import { GlobalLocale } from '@apps/design-ui/locale/types/global'
import { AdvertItem } from '../../constants/advert'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { getFileTypeFromExtension, jumpByType } from '../../utils'
import { isCurrentTimeInRange } from '../../utils/date'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from './index.less'

interface IProps {
  className?: string
  linkdisable?: boolean
  /** 展示样式 fullscreen：全屏宽度；standard：标准宽度 */
  showType: 'fullscreen' | 'standard'
  /** 组件高度 */
  componentHeight?: number
  /** 上下边距 */
  verticalMargin?: number
  timeLimit?: boolean
  dataList: AdvertItem[]
  target?: '_blank' | '_self' | '_parent' | '_top'
}

const CarouselBanner: React.FC<IProps> = (props) => {
  const {
    className,
    linkdisable = false,
    showType = 'standard',
    componentHeight = 200,
    verticalMargin = 0,
    timeLimit = false,
    dataList,
    target = '_blank',
    ...others
  } = props
  const [showList, setShowList] = useState<AdvertItem[]>([])
  const carouselRef = useRef<any>()

  const classNameString = cx(
    styles.carousel_banner,
    showType === 'fullscreen' ? styles.fullscreen : styles.standard,
    className,
  )

  useEffect(() => {
    if (dataList && dataList.length >= 0) {
      if (timeLimit) {
        setShowList(
          dataList.filter((item) => {
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
        setShowList(dataList)
      }
    }
  }, [dataList])

  const renderImgOrVideo = (url: string) => {
    const fileType = getFileTypeFromExtension(url)
    if (fileType === 'image') {
      return (
        <ImageBox
          width={showType === 'fullscreen' ? '100%' : 'auto'}
          height={componentHeight}
          src={url}
          resizeMode="cover"
        />
      )
    } else if (fileType === 'video') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            height={componentHeight}
            src={url}
          />
        </div>
      )
    }
    return null
  }

  return (!linkdisable ? showList.length > 0 : true) ? (
    <LocaleReceiver componentName="global">
      {(locale: GlobalLocale) => {
        return (
          <div
            className={classNameString}
            style={{
              marginTop: verticalMargin,
              marginBottom: verticalMargin,
              height: componentHeight,
            }}
            {...others}
          >
            {showList?.length > 0 ? (
              <Carousel
                autoplay
                pauseOnDotsHover
                pauseOnHover
                ref={carouselRef}
              >
                {showList.map((item) => (
                  <div
                    className={styles['banner-item']}
                    key={item.picUrl}
                    onClick={() => jumpByType(item, linkdisable, target)}
                  >
                    {renderImgOrVideo(item.picUrl)}
                  </div>
                ))}
              </Carousel>
            ) : linkdisable ? (
              <div
                className={styles['list-null']}
                style={{
                  width: showType === 'standard' ? 1200 : '100%',
                  height: componentHeight,
                  lineHeight: `${componentHeight}px`,
                }}
              >
                {locale['advert.banner.swiper']}
              </div>
            ) : null}
            {showList.length > 1 && (
              <Fragment>
                <div
                  className={styles.banner_prev}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    carouselRef.current.prev()
                  }}
                >
                  <LeftOutlined className={styles.banner_prev_icon} />
                </div>
                <div
                  className={styles.banner_next}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    carouselRef.current.next()
                  }}
                >
                  <RightOutlined className={styles.banner_next_icon} />
                </div>
              </Fragment>
            )}
          </div>
        )
      }}
    </LocaleReceiver>
  ) : null
}

export default CarouselBanner
