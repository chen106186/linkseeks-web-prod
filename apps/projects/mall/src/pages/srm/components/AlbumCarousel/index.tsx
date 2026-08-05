/**
 * 图片相册
 */
import React, { useState, useMemo, useRef } from 'react'
import { Carousel } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import styles from './index.module.less'

interface Props {
  albumTitle: string
  albumImg: Array<any>
  cuttingNumber: number // 一次显示多少张
  albumWidth?: any
}

const AlbumCarousel: React.FC<Props> = (props) => {
  const { albumTitle, albumImg, cuttingNumber, albumWidth } = props
  const [newList, setNewList] = useState<any>([])
  const CarouselName = useRef<any>()

  useMemo(() => {
    let list: any[] = [[]]
    let keyIndex = 0
    if (!albumImg) {
      return
    }
    albumImg.map((item: any, index: number) => {
      const cuttingIndex = list.length * cuttingNumber
      if (index == cuttingIndex) {
        keyIndex = keyIndex + 1
        list[keyIndex] = []
      }
      list[keyIndex].push(item)
    })
    setNewList(list)
  }, [albumImg])

  return (
    <ul className={styles['album-main']} style={{ width: albumWidth ? albumWidth : '944px' }}>
      <li className={styles['album-title']}>{albumTitle}</li>
      <li className={styles['carousel-warp']}>
        <ArrowLeftOutlined
          onClick={() => {
            CarouselName.current.prev()
          }}
          translate={undefined}
          className={`${styles['direction-icon']} ${styles['direction-icon-left']}`}
        />
        <ArrowRightOutlined
          onClick={() => {
            CarouselName.current.next()
          }}
          translate={undefined}
          className={`${styles['direction-icon']} ${styles['direction-icon-right']}`}
        />
        <Carousel ref={CarouselName}>
          {newList.map((item: any, index: number) => {
            return (
              <div key={index + 'title'}>
                <div className={styles['img-warp']}>
                  {item &&
                    item.map((second: any, secondNum: number) => {
                      return (
                        <img
                          key={secondNum + 'img'}
                          style={{ marginRight: item.right ? second.right : '25px' }}
                          width={second.width ? second.width : ''}
                          height={second.height ? second.height : ''}
                          className={styles['album-img-item']}
                          src={second.url}
                          alt=""
                        />
                      )
                    })}
                </div>
              </div>
            )
          })}
        </Carousel>
      </li>
    </ul>
  )
}

export default AlbumCarousel
