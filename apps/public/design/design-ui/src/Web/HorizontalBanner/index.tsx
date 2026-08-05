import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { GlobalLocale } from '@apps/design-ui/locale/types/global'
import { AdvertItem } from '../../constants/advert'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { jumpByType } from '../../utils'
import { isCurrentTimeInRange } from '../../utils/date'
import styles from './index.less'

interface IProps {
  className?: string
  linkdisable?: boolean
  /** 组件高度 */
  componentHeight?: number
  /** 上下边距 */
  verticalMargin?: number
  timeLimit?: boolean
  dataList: AdvertItem[]
  target?: '_blank' | '_self' | '_parent' | '_top'
}

const HorizontalBanner: React.FC<IProps> = (props) => {
  const {
    className,
    linkdisable = false,
    componentHeight = 200,
    verticalMargin = 8,
    timeLimit = false,
    dataList,
    target = '_blank',
    ...others
  } = props
  const [showList, setShowList] = useState<AdvertItem[]>([])

  const classNameString = cx(styles['horizontal-banner'], className)

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
              <div className={styles['horizontal-banner-list']}>
                {showList.map((item) => (
                  <div
                    className={styles['horizontal-banner-list-item']}
                    key={item.picUrl}
                    onClick={() => jumpByType(item, linkdisable, target)}
                  >
                    <ImageBox
                      width={'auto'}
                      height={componentHeight}
                      src={item.picUrl}
                      resizeMode="cover"
                    />
                  </div>
                ))}
              </div>
            ) : linkdisable ? (
              <div
                className={styles['list-null']}
                style={{
                  width: '100%',
                  height: componentHeight,
                  lineHeight: `${componentHeight}px`,
                }}
              >
                {locale['advert.banner']}
              </div>
            ) : null}
          </div>
        )
      }}
    </LocaleReceiver>
  ) : null
}

export default HorizontalBanner
