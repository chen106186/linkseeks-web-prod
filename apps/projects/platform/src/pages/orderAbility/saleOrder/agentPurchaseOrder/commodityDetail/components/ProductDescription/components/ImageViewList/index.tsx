import React, { useState } from 'react'
import { VerticalRightOutlined, FullscreenOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface ImageViewListPropsType {
  imgList: string[]
}

const ImageViewList: React.FC<ImageViewListPropsType> = (props) => {
  const { imgList = [] } = props
  const [previewImage, setPreviewImage] = useState<number>(-1)
  const [rotateZ, setRotateZ] = useState<number>(0)
  const intl = useIntl()

  const handlePreviewImg = (index: number) => {
    if (previewImage !== index) {
      setPreviewImage(index)
    } else {
      setPreviewImage(-1)
      setRotateZ(0)
    }
  }

  const handleActions = (action: string) => {
    switch (action) {
      case 'turnLeft':
        setRotateZ(rotateZ - 90)
        break
      case 'turnRight':
        setRotateZ(rotateZ + 90)
        break
      case 'packUp':
        setPreviewImage(-1)
        setRotateZ(0)
        break
      case 'preview':
        const el = document.createElement('a')
        el.href = imgList[previewImage]
        el.target = '_blank'
        el.click()
        break
      default:
        break
    }
  }

  return (
    <div className={styles.image_view_list}>
      <div className={styles.thumb_img_list}>
        {imgList.map((path, index) => (
          <div
            key={`thumb_img_list_item_${index}`}
            className={cx(styles.thumb_img_list_item, previewImage === index ? styles.active : '')}
            onClick={() => handlePreviewImg(index)}
          >
            <img src={path} />
          </div>
        ))}
      </div>
      {(previewImage === 0 || previewImage !== -1) && (
        <div className={styles.image_preview_box}>
          <div className={styles.image_preview_toolbar}>
            <div className={styles.image_preview_toolbar_item} onClick={() => handleActions('packUp')}>
              <VerticalRightOutlined className={styles.icon} rotate={90} />
              <span>{intl.formatMessage({ id: 'order.index.payway.PutAway' })}</span>
            </div>
            <div className={styles.image_preview_toolbar_item} onClick={() => handleActions('preview')}>
              <FullscreenOutlined className={styles.icon} />
              <span>{intl.formatMessage({ id: 'ImageViewList.index.OriginalDrawing' })}</span>
            </div>
            <div className={styles.image_preview_toolbar_item} onClick={() => handleActions('turnLeft')}>
              <UndoOutlined className={styles.icon} />
              <span>{intl.formatMessage({ id: 'ImageViewList.index.Left' })}</span>
            </div>
            <div className={styles.image_preview_toolbar_item} onClick={() => handleActions('turnRight')}>
              <RedoOutlined className={styles.icon} />
              <span>{intl.formatMessage({ id: 'ImageViewList.index.Right' })}</span>
            </div>
          </div>
          <img src={imgList[previewImage]} style={{ transform: `rotateZ(${rotateZ}deg)` }} />
        </div>
      )}
    </div>
  )
}

export default ImageViewList
