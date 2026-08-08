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

const ProcessHome: React.FC = () => {
  const { mallInfo, userInfo, mallUrl, pathname } = useGlobalConext()
  const { seoInfo } = useLoaderData() as HomeLayoutLoaderReturn
  const [jumpUrl, setJumpUrl] = useState<string>('')
  const [bannerLeftList, setBannerLeftList] = useState<any>([])
  const { REGISTER_DOMAIN, LOGIN_DOMAIN } = useDomainPath(pathname)

  const fnGetBannerList = () => {
    const data = {
      columnType: '10',
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
                hi，欢迎使用加工服务
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
          <div className={styles['service-title-second']}>优选全国500+家加工企业展开协作，</div>
          <div className={styles['service-title-second']}>
            为客户提供加工费报价、加工要求审核、费用结算、加工进程跟踪等个性化服务。
          </div>
        </div>
        <div className={styles['service-project-main']}>
          <div className={styles['service-project-warp']}>
            <ServiceProject
              serviceTitle="加工方案优选"
              serviceScondTitle="根据加工要求为客户推荐优质加工厂，"
              serviceScondTitleT="加工费报价、排产交期精准反馈。"
            />
            <ServiceProject
              serviceTitle="专人全程跟单"
              serviceScondTitle="专业跟单人员对加工进度"
              serviceScondTitleT="全程跟踪，加工完成后便捷的短信通知。"
            />
            <ServiceProject
              serviceTitle="费用结算便捷"
              serviceScondTitle="自动结算对账、全流程支持，"
              serviceScondTitleT="支持月结、账期等结算方式"
            />
            <ServiceProject
              serviceTitle="加工质量保障"
              serviceScondTitle="拥有丰富经验加工经理"
              serviceScondTitleT="全程协助判断质量问题。"
            />
          </div>
        </div>
        <Settle />
        <div className={`${styles['service-warp']} ${styles['commoney-bg']}`}>
          <div className={styles['service-title']}>入驻流程</div>
          <div className={styles['service-title-second']}>
            平台提供加工需求精准匹配推送，线上线下推广团队助加工企业精准获取海量商机，
          </div>
          <div className={styles['service-title-second']}>提供优质线上运营服务，欢迎实力加工企业入驻。</div>
        </div>
        <div className={styles['commoney-bg']}>
          <Process />
        </div>
      </div>
    </HelmetProvider>
  )
}

export default ProcessHome
