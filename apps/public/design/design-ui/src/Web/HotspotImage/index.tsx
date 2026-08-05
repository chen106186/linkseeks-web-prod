import React from 'react'
import cx from 'classnames'
import { NAV_TYPE } from '@apps/design-ui/constants'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'
import { jumpByType } from '../../utils'
import styles from './index.less'

export interface HotspotItemType {
  shortid: string
  x: number
  y: number
  width: number
  height: number
  type?: NAV_TYPE
  value?: string
  valueText?: string
  id?: any
  zIndex?: number
}

interface IProps {
  /** 上下边距 */
  verticalMargin?: number
  /** 热区图片 */
  imgUrl?: string
  className?: string
  /** 热点信息 */
  hotspotList?: HotspotItemType[]
  linkdisable?: boolean
}

const HotspotImage: React.FC<IProps> = (props) => {
  const {
    verticalMargin = 8,
    imgUrl,
    linkdisable = false,
    hotspotList,
    className,
    ...others
  } = props

  const classNameString = cx(styles['hotspot-image'], className)

  const returnEmpty = (locale: GlobalLocale) =>
    linkdisable ? (
      <div className={styles['hotspot-image-empty']}>
        {locale['hotspotimage-empty']}
      </div>
    ) : null

  // px 单位
  const pxCal = (pxValue: number) => {
    const windowWidth = 1200
    // 630 为能力中心图片热区图片的像素宽
    const ratio = windowWidth / 630
    return pxValue * ratio
  }

  const handleJump = (info: HotspotItemType) => {
    jumpByType({ type: info.type, value: info.value }, linkdisable, '_blank')
  }

  return (
    <LocaleReceiver componentName="global">
      {(locale: GlobalLocale) => {
        return (
          <div
            className={classNameString}
            style={{
              marginTop: verticalMargin,
              marginBottom: verticalMargin,
            }}
            {...others}
          >
            {imgUrl ? (
              <img className={styles['hotspot-image-img']} src={imgUrl} />
            ) : (
              returnEmpty(locale)
            )}
            {hotspotList &&
              hotspotList.length > 0 &&
              hotspotList.map((hotspotItem) => {
                const { width, height, zIndex, x, y } = hotspotItem
                return (
                  <div
                    key={hotspotItem.shortid}
                    className={styles['hotspot-item']}
                    style={{
                      width: `${pxCal(width)}px`,
                      height: `${pxCal(height)}px`,
                      zIndex: zIndex,
                      top: `${pxCal(y)}px`,
                      left: `${pxCal(x)}px`,
                    }}
                    onClick={() => handleJump(hotspotItem)}
                  />
                )
              })}
          </div>
        )
      }}
    </LocaleReceiver>
  )
}

export default HotspotImage
