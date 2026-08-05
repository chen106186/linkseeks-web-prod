import React, { useState, useEffect, useRef } from 'react'
import { Carousel, Image, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getManageMemberAdvertFindAllByColumnType, getManageContentAdvertFindAllByColumnType } from '@apps/apis'
import styles from './index.module.less'

interface Props {
  shopId?: number
}

const Banner: React.FC<Props> = (props) => {
  const { shopId } = props
  const CarouselName = useRef<any>()
  const onChange = () => {}

  const [bannerLeftList, setBannerLeftList] = useState<any>([])
  const [bannerLeftAdvertList, setBannerLeftAdvertList] = useState<any>([])
  /**
   * 获取banner
   */
  const fnGetBannerList = (type: string) => {
    const SrmDataSource: any = {} // getCookie('SrmDataSource')
    const data = {
      columnType: type,
      memberId: SrmDataSource?.memberId,
      memberRoleId: SrmDataSource?.memberRoleId,
    }
    if (shopId && SrmDataSource?.type === 'self') {
      getManageMemberAdvertFindAllByColumnType(data).then((res) => {
        if (type === '4') {
          setBannerLeftList(res.data)
        } else if (type === '5') {
          setBannerLeftAdvertList(res.data)
        }
      })
    } else {
      getManageContentAdvertFindAllByColumnType(data).then((res) => {
        if (type === '4') {
          setBannerLeftList(res.data)
        } else if (type === '5') {
          setBannerLeftAdvertList(res.data)
        }
      })
    }
  }
  const bannerLeftAdvertListDesc = [1, 2, 3, 4]

  useEffect(() => {
    fnGetBannerList('4')
    fnGetBannerList('5')
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      {/* <LeftOutlined onClick={() => { CarouselName.current.prev() }} className={`${styles['direction-icon']} ${styles['direction-icon-left']}`} />
			<RightOutlined onClick={() => { CarouselName.current.next() }} className={`${styles['direction-icon']} ${styles['direction-icon-right']}`} /> */}
      {bannerLeftList.length != 0 ? (
        <Carousel afterChange={onChange} ref={CarouselName} autoplay={true} style={{ height: '288px' }}>
          {bannerLeftList.map((item: any) => {
            return (
              <div className={styles['carousel-item']} key={item.id + 'banner'}>
                <Image
                  src={item.imageUrl}
                  className={styles['banner-img']}
                  placeholder={true}
                  preview={false}
                  alt={item.title}
                />
                {/* {
                    item.link &&
                    <a href={`${REQUEST_HEADER}${item.link}`} className='all-jump'></a>
                  } */}
              </div>
            )
          })}
        </Carousel>
      ) : (
        <Skeleton.Image style={{ width: '736px', height: '288px' }} />
      )}
      <ul className={styles['banner-img-warp']}>
        {bannerLeftAdvertList.length > 0
          ? bannerLeftAdvertList.map((item: any) => {
              return (
                <li className={styles['banner-img-item']} key={item.id + 'adver'}>
                  <Image
                    src={item.imageUrl}
                    className={styles['banner-img-small']}
                    placeholder={true}
                    preview={false}
                  />
                  <a href={item.link} className="all-jump"></a>
                </li>
              )
            })
          : bannerLeftAdvertListDesc.map((item: number) => {
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
