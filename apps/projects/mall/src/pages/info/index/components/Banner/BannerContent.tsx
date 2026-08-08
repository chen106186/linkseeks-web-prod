import React, { useState, useEffect, useRef } from 'react'
import { Carousel } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import {
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

const BannerContent: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const CarouselName = useRef<any>()
  const [bannerList, setBannerList] = useState<any>([])
  const [bannerRightList, setBannerRightList] = useState<any>([])
  const { linkPrefix } = useLink()

  const fnGetBanner = (type: string) => {
    const data: any = {
      recommendLabel: type,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindAllByRecommendLabel
      : getManageContentInformationFindAllByRecommendLabel
    requestApi(data).then((res) => {
      if (type === '2') {
        setBannerList(res.data)
      } else if (type === '3') {
        const arrList = res.data.splice(0, 2)
        setBannerRightList(arrList)
      }
    })
  }

  useEffect(() => {
    fnGetBanner('2')
    fnGetBanner('3')
  }, [])

  return (
    <div className={styles['banner-content-warp']}>
      <div className={styles['banner-roll']}>
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
        <Carousel ref={CarouselName} autoplay={true}>
          {bannerList.map((item: any) => {
            return (
              <div className={styles['banner-item-warp']} key={item.id}>
                <img src={item.imageUrl} alt={item.title} />
                <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
                <div className={styles['banner-item-text']}>{item.digest}</div>
              </div>
            )
          })}
        </Carousel>
      </div>
      <div className={styles['banner-nav']}>
        {bannerRightList.map((item: any) => {
          return (
            <div className={styles['banner-nav-item']} key={item.id}>
              <img src={item.imageUrl} alt={item.title} />
              <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BannerContent
