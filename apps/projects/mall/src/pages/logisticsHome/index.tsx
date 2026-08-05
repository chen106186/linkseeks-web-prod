import React, { useEffect, useState } from 'react'
import { useGlobalConext } from '@/context/globalProvider'
import { useLoaderData } from 'react-router-dom'
import { HomeLayoutLoaderReturn } from '@/loaders/homeLayoutLoader'
import HelmetProvider from '@/context/helmetProvider'
import { LinkTo } from '@/utils'
import { getManageContentAdvertFindAllByColumnType } from '@apps/apis'
import { Carousel, Skeleton } from 'antd'
import useDomainPath from '@/hooks/useDomainPath'
import Sigin from './components/Sigin'
import Settle from './components/Settle'
import ServiceProject from './components/ServiceProject'
import Process from './components/Process'
import styles from './index.module.less'

const LogisticsHome: React.FC = () => {
  const { mallInfo, userInfo, mallUrl, pathname } = useGlobalConext()
  const { seoInfo } = useLoaderData() as HomeLayoutLoaderReturn
  const [jumpUrl, setJumpUrl] = useState<string>('')
  const [bannerLeftList, setBannerLeftList] = useState<any>([])
  const { REGISTER_DOMAIN, LOGIN_DOMAIN } = useDomainPath(pathname)

  const fnGetBannerList = () => {
    const data = {
      columnType: '9',
    }
    getManageContentAdvertFindAllByColumnType(data).then((res) => {
      setBannerLeftList(res.data)
      if (res.data) {
        setJumpUrl(res.data[0].link)
      }
    })
  }

  /**
   *
   * @param key 当前banner
   * 切换当前的跳转链接
   */
  const fnChangeUrl = (key: any) => {
    if (bannerLeftList[key]) {
      setJumpUrl(bannerLeftList[key].link)
    } else {
      setJumpUrl('')
    }
  }

  useEffect(() => {
    fnGetBannerList()
  }, [])

  return (
    <HelmetProvider
      title={seoInfo?.title || mallInfo?.name || ''}
      keyword={seoInfo?.keywords || mallInfo?.name || ''}
      description={seoInfo?.description || mallInfo?.name || ''}
    >
      <div className={styles['logistucs-main']}>
        <div className={styles['login-warp']}>
          <a href="/" style={{ display: 'inlineBlock' }}>
            <img src={mallInfo?.logoUrl || mallUrl?.defaultEnterprise?.logoUrl} alt="" />
          </a>
        </div>
        <div className={styles['carousel-warp']} onClick={() => LinkTo(jumpUrl, 'open')}>
          {bannerLeftList.length > 0 ? (
            <Carousel afterChange={fnChangeUrl} autoplay={true}>
              {bannerLeftList.map((item: any) => {
                return (
                  <div className={styles['carousel-item']} key={item.id + 'carousel'}>
                    <div
                      className={styles['carousel-item']}
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        color: 'red',
                      }}
                    ></div>
                    <img src="./" alt={item.title} style={{ opacity: '0' }} />
                  </div>
                )
              })}
            </Carousel>
          ) : (
            <div>
              <Skeleton.Image style={{ width: '100vw', height: '480px' }} />
            </div>
          )}
        </div>
        <div className={styles['banner-warp']}>
          <div className={styles['banner-first']} onClick={() => LinkTo(jumpUrl, 'open')}>
            <div
              className={styles['banner-search-main']}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div className={styles['banner-search-title']}>
                <div className={styles['banner-search-logon']}></div>
                hi，欢迎来到商城
              </div>
              {!userInfo?.userId && (
                <div className={styles['sign-mian']}>
                  <div className={styles['sign-item']}>
                    <a href={LOGIN_DOMAIN} className={styles['sign-item-span']}>
                      登录
                    </a>
                  </div>
                  <div className={styles['sign-item']}>
                    <a href={REGISTER_DOMAIN} className={styles['sign-item-span']}>
                      注册
                    </a>
                  </div>
                </div>
              )}
              {userInfo?.userId && (
                <div className={styles['sign-mian']}>
                  <div>{userInfo?.memberName}</div>
                </div>
              )}
              <Sigin />
            </div>
          </div>
        </div>

        <div className={styles['service-warp']}>
          <div className={styles['service-title']}>服务介绍</div>
          <div className={styles['service-title-second']}>
            运输业务辐射全国，已整合1000+家优质承运商、8000+运输车辆资源。
          </div>
          <div className={styles['service-title-second']}>
            运营超过2500条优势公路线路，并已开通数条水运、空运、铁路运输线路，综合运输实力强大。
          </div>
        </div>
        <div className={styles['service-project-main']}>
          <div className={styles['service-project-warp']}>
            <ServiceProject
              serviceTitle="服务多样"
              serviceScondTitle="汽运、水运、水陆联运、"
              serviceScondTitleT="专线运输、小吨位拼车、多装多卸配送。"
            />
            <ServiceProject
              serviceTitle="安全可靠"
              serviceScondTitle="对物流商线上实名认证，"
              serviceScondTitleT="严格的准入、评分、淘汰机制。"
            />
            <ServiceProject
              serviceTitle="运输监控"
              serviceScondTitle="专业跟单人员结合GPS"
              serviceScondTitleT="全程跟踪运输状态，货物安全有保"
            />
            <ServiceProject
              serviceTitle="货损理赔"
              serviceScondTitle="运输出现货损，"
              serviceScondTitleT="及时赔付，减少客户损失"
            />
          </div>
        </div>
        <Settle />
        <div className={`${styles['service-warp']} ${styles['commoney-bg']}`}>
          <div className={styles['service-title']}>入驻流程</div>
          <div className={styles['service-title-second']}>
            运随着数字经济的高速发展，物流企业也需要通过线上线下结合的方式，
          </div>
          <div className={styles['service-title-second']}>
            实现线下生意的线上化，平台提供优质线上运营服务，欢迎优质物流商入驻。
          </div>
        </div>
        <div className={styles['commoney-bg']}>
          <Process />
        </div>
      </div>
    </HelmetProvider>
  )
}

export default LogisticsHome
