import React, { useState } from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import HonorPicArrowIcon from './honor_pic_arrow.png'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'
import styles from './index.less'

interface HornorPicPropsType {
  honorPics: string[]
  className?: string
  visible?: boolean
  /** 显示控制：商城端控制 */
  visibleControl?: boolean
}

const HornorPic: React.FC<HornorPicPropsType> = (props) => {
  const {
    honorPics,
    className,
    visible = true,
    visibleControl = false,
    ...others
  } = props
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const unitDistance = 408

  const handlePrev = () => {
    if (offSetLeft < 0) {
      setOffSetLeft(offSetLeft + unitDistance)
    }
  }

  const handleNext = () => {
    const imgLength = honorPics ? honorPics.length : 0
    const maxDistance = (imgLength - 3) * unitDistance

    if (maxDistance > Math.abs(offSetLeft)) {
      setOffSetLeft(offSetLeft - unitDistance)
    }
  }

  const renderComponent = (locale: GlobalLocale) =>
    (visibleControl ? visible : true) && (
      <div className={cx(styles.hornor_pic_wrap, className)} {...others}>
        <div className={styles.hornor_pic}>
          <div className={styles.hornor_pic_title}>
            {locale['hornor.pic.title']}
          </div>
          <div className={styles.hornor_pic_body}>
            <div className={styles.exhibition_toolbar}>
              <div
                className={cx(styles.exhibition_tool_item, styles.prev)}
                onClick={() => handlePrev()}
              >
                <img src={HonorPicArrowIcon} />
              </div>
              <div className={styles.exhibition_list_contaner}>
                <div
                  className={styles.exhibition_list}
                  style={{ left: offSetLeft }}
                >
                  {honorPics &&
                    honorPics.length > 0 &&
                    honorPics.map((url, index) => (
                      <div
                        key={`exhibition_list_item_${index}`}
                        className={cx(styles.exhibition_list_item)}
                      >
                        <ImageBox src={url} width={384} height={258} />
                      </div>
                    ))}
                </div>
              </div>
              <div
                className={cx(styles.exhibition_tool_item, styles.next)}
                onClick={() => handleNext()}
              >
                <img src={HonorPicArrowIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  return (
    <LocaleReceiver componentName="global">{renderComponent}</LocaleReceiver>
  )
}

export default HornorPic
