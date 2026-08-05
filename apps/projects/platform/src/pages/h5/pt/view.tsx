import React, { Fragment } from 'react'
import classNames from 'classnames'
import Helmet from 'react-helmet'
import { getEnv } from '@apps/utils'
import { useWebIntl } from '@apps/locales'
import ToApp from './components/ToApp'
import { COLLAGE_FAIL, COLLAGE_SUCCESS } from './constants/collage'
import useGetUrlParams from './hooks/useGetUrlParams'
import ActionStatus from './components/ActionStatus'
import Product from './components/Product'
import InTeamPeople from './components/InTeamPeople'
import useGetData from './hooks/useGetData'
import useGetProductData from './hooks/useGetProductData'
import useGetMarketingCampaign from './hooks/useGetMarketingData'
import styles from './index.module.less'

const APP_DOWNLOAD = `${getEnv('MEMBER_URL')}/h5/download`

type UrlType = {
  /** 拼团id */
  commodityId: string
  shopId: string
  shopType: string
  teamId: string
  skuId?: string
}

const STATUS_ENUM = {
  2: 'success',
  3: 'fail',
} as const

const GroupDetail: React.FC = () => {
  const { params } = useGetUrlParams<UrlType>()
  const translate = useWebIntl()

  const { productInfo, loading } = useGetProductData({
    shopType: +params.shopType,
    commodityId: +params.commodityId,
    shopId: +params.shopId,
  })
  const { info } = useGetData({ id: +params.teamId })
  const { groupPurchasingData, marketingData } = useGetMarketingCampaign({
    shopId: +params.shopId,
    productInfo,
    skuId: params.skuId ? +params.skuId : undefined,
    shopType: +params.shopType,
  })

  const checkAppIsOpen = (cb: () => void) => {
    const initialTime = new Date().valueOf()
    let counter = 0
    let waitTime = 0

    const checkOpen = setInterval(() => {
      // eslint-disable-next-line no-plusplus
      counter++
      waitTime = new Date().valueOf() - initialTime
      if (waitTime > 2500) {
        clearInterval(checkOpen)
        cb()
      }
      if (counter < 100) return
      const hide = document.hidden || (document as any).webkitHidden
      if (!hide) {
        cb() // 唤端失败的回调函数
      }
    }, 20)
  }

  /**
   * TODO
   * 后续改成callapp 或者是 https://github.com/jawidx/web-launch-app
   * https://suanmei.github.io/2018/08/23/h5_call_app/
   */
  const handleJumpToApp = (url: string) => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1) {
      // eslint-disable-next-line no-alert
      alert('请用默认浏览器打开')
    } else {
      window.location.href = url
      checkAppIsOpen(() => {
        window.location.href = APP_DOWNLOAD
      })
    }
  }

  const handleOnJoinTeam = () => {
    handleJumpToApp(
      `lingxi://detail/${params.commodityId}/${params.shopId}/${params.skuId || marketingData?.preferentialSkuId}/${
        params.teamId
      }`,
    )
  }

  const hanleOnJumpHome = () => {
    handleJumpToApp(`lingxi://home`)
  }

  const handleRelanchTeam = () => {
    handleJumpToApp(
      `lingxi://detail/${params.commodityId}/${params.shopId}/${params.skuId || marketingData?.preferentialSkuId}`,
    )
  }

  return (
    <Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <title>{translate('web.common.pintuanxiangqing')}</title>
      </Helmet>
      <div className={styles.page}>
        <ToApp onJump={handleOnJoinTeam} />
        <div
          className={classNames(
            styles['page-background'],
            (info?.status ?? 1) === 3 ? styles['page-background-error'] : styles['page-background-success'],
          )}
        >
          {(info?.status === COLLAGE_SUCCESS || info?.status === COLLAGE_FAIL) && (
            <ActionStatus status={STATUS_ENUM[info?.status as 2 | 3] as 'success' | 'fail'} />
          )}
        </div>
        {productInfo && (
          <div className={styles.product}>
            <Product
              loading={loading}
              productImage={productInfo?.mainPic}
              productName={productInfo?.name}
              slogan={productInfo?.slogan}
              price={productInfo?.max}
              activityPrice={groupPurchasingData?.groupPurchasingPrice!}
            />
          </div>
        )}
        {info && (
          <div className={styles.team}>
            <InTeamPeople
              isJoin={info.isJoin}
              status={info?.status as 1}
              assembleNum={info?.assembleNum}
              itemList={info?.itemList}
              onJoinTeam={handleOnJoinTeam}
              onJumpHome={hanleOnJumpHome}
              onRelauchTeam={handleRelanchTeam}
              endTime={info?.endTime}
            />
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default GroupDetail
