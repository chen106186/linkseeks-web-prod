import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import styles from './index.less'
import { CommodityDetailType } from '../../view'
import { LAYOUT_TYPE, COMMODITY_TYPE } from '@/constants'

interface ImgItemType {
  id: string
  commodityPic: string
}

interface ExhibitionPropsType {
  imgList: ImgItemType[]
}

const Exhibition: React.FC<ExhibitionPropsType> = (props) => {
  const { imgList = [] } = props
  const [previewImg, setPreviewImg] = useState<any>()
  const [offSetLeft, setOffSetLeft] = useState<number>(0)

  useEffect(() => {
    if (imgList.length > 0) {
      setPreviewImg(imgList[0])
    }
  }, [imgList])

  const handlePrev = () => {
    if (offSetLeft < 0) {
      setOffSetLeft(offSetLeft + 70)
    }
  }

  const handleNext = () => {
    const imgLength = imgList.length
    const maxDistance = (imgLength - 5) * 70

    if (maxDistance > Math.abs(offSetLeft)) {
      setOffSetLeft(offSetLeft - 70)
    }
  }

  return (
    <div className={styles.exhibition}>
      <div className={styles.exhibition_img_container}>
        <img src={previewImg?.commodityPic} />
      </div>
      <div className={styles.exhibition_toolbar}>
        <div className={cx(styles.exhibition_tool_item, styles.prev)} onClick={() => handlePrev()}>
          <LeftOutlined translate={undefined} />
        </div>
        <div className={styles.exhibition_list_contaner}>
          <div className={styles.exhibition_list} style={{ left: offSetLeft }}>
            {imgList.map((item, index) => (
              <div
                key={index}
                className={cx(styles.exhibition_list_item, previewImg?.id === item.id ? styles.active : '')}
                onClick={() => setPreviewImg(item)}
              >
                <img src={item.commodityPic} />
              </div>
            ))}
          </div>
        </div>
        <div className={cx(styles.exhibition_tool_item, styles.next)} onClick={() => handleNext()}>
          <RightOutlined translate={undefined} />
        </div>
      </div>
    </div>
  )
}

export default Exhibition
