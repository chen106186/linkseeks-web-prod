import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { openLink } from '../../utils'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { AlbumLocale } from '../../locale/types/album'
import styles from './index.less'

interface AlbumProps {
  workshopPics: string[]
  moreImgLink?: string
  className?: string
  visible?: boolean
  /** 显示控制：商城端控制 */
  visibleControl?: boolean
}

const Album: React.FC<AlbumProps> = (props) => {
  const {
    workshopPics,
    className,
    visible = true,
    visibleControl = false,
    moreImgLink,
    ...others
  } = props

  const renderComponent = (locale: AlbumLocale) => {
    return (
      (visibleControl ? visible : true) && (
        <div className={cx(styles.album, className)} {...others}>
          <div className={styles.album_title}>{locale['album.title']}</div>
          <div className={styles.album_box}>
            <div className={styles.box_left}>
              {workshopPics && workshopPics.length > 0 && (
                <ImageBox width={686} height={458} src={workshopPics[0]} />
              )}
            </div>
            <div className={styles.box_right}>
              <div className={styles.second_img}>
                {workshopPics && workshopPics.length > 1 && (
                  <ImageBox width={492} height={276} src={workshopPics[1]} />
                )}
              </div>
              <div className={styles.box_right_bottom}>
                {workshopPics && workshopPics.length > 2 && (
                  <div className={styles.third_img}>
                    <ImageBox width={237} height={158} src={workshopPics[2]} />
                  </div>
                )}
                <div
                  className={styles.more_img}
                  onClick={() => moreImgLink && openLink(moreImgLink, false)}
                >
                  {locale['more.btn']}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <LocaleReceiver componentName="Album">{renderComponent}</LocaleReceiver>
  )
}

export default Album
