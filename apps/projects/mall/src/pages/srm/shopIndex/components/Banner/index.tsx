import React, { useRef } from 'react'
import { Carousel, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { REQUEST_HEADER } from '@apps/constants/domain'
import styles from './index.module.less'

interface Props {
  slideshowBOList?: Array<any>
  companyPics?: Array<any>
}

const Banner: React.FC<Props> = (props) => {
  const CarouselName = useRef<any>()
  const { slideshowBOList = [], companyPics = [] } = props

  const bannerLeftAdvertListDesc = [1, 2, 3, 4]

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <LeftOutlined
          onClick={() => {
            CarouselName.current.prev()
          }}
          translate={undefined}
          className={`${styles['direction-icon']} ${styles['direction-icon-left']}`}
        />
        <RightOutlined
          onClick={() => {
            CarouselName.current.next()
          }}
          translate={undefined}
          className={`${styles['direction-icon']} ${styles['direction-icon-right']}`}
        />
        {slideshowBOList.length != 0 ? (
          <Carousel ref={CarouselName} autoplay={true}>
            {slideshowBOList.map((item: any, index: number) => {
              return (
                <div className={styles['banner-warp']} style={{ position: 'relative' }} key={index + 'banner'}>
                  <img src={item.imgPath} alt="" />
                  <a href={`${REQUEST_HEADER}${item.link}`} className="all-jump"></a>
                </div>
              )
            })}
          </Carousel>
        ) : (
          <Skeleton.Image style={{ width: '736px', height: '288px' }} />
        )}
      </div>
      <ul className={styles['banner-img-warp']}>
        {companyPics.length != 0
          ? companyPics.map((item: any, index: number) => {
              if (index > 3) {
                return ''
              }
              return (
                <li className={styles['banner-img-item']} key={index + 'company'}>
                  <img src={item} alt="" />
                </li>
              )
            })
          : bannerLeftAdvertListDesc.map((item: number, index: number) => {
              return (
                <li className={styles['banner-img-item']} key={item + 'adverDesc'}>
                  <Skeleton.Image style={{ width: '172px', height: '96px' }} />
                </li>
              )
            })}
      </ul>
    </div>
  )
}

export default Banner
