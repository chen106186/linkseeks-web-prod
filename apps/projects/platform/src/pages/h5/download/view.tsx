import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { getCommodityShopListShopByReq, getManageAppDownloadLinkFind } from '@apps/apis'
import ImageBox from '@apps/components/src/web/ImageBox'
import { getWebIntl } from '@apps/locales'
import styles from './index.module.less'

export interface MallInfoType {
  adornId: number
  id: number
  name: string
  logoUrl: string
  url: string
  describe: string
  memberId?: number
  memberName?: string
  memberRoleId?: number
  /**
   * 商城类型
   * 1 :ENTERPRISE
   * 2 :PURCHASE
   * 3 :LOGISTICS
   * 4 :PROCESS
   * 5 :INFORMATION
   * 6 :MAIN_PORTAL
   * 7 :SCORE
   */
  type: number
  /** 商城环境:1.web2.H53.小程序4.APP */
  environment: number
  /** 是否开放商城MRO搜索权限：0.否；1.是； */
  isOpenMro?: boolean
  /** 是否会员自营 */
  isMemberOperate?: boolean
  /** 是否默认 */
  isDefault?: boolean
  /** 启用状态 */
  state?: number
  /** 商城属性 */
  property?: number
  /** 是否自营商城 */
  isSelf?: boolean
}

const AppDownload: React.FC = () => {
  const [appLink, setAppLink] = useState<{ ios: string; android: string }>({ ios: '', android: '' })
  const [appInfo, setAppInfo] = useState<MallInfoType>()
  const [maskVisble, setMaskVisible] = useState<boolean>(false)
  const translate = getWebIntl()

  const getAppInfo = async () => {
    const res = await getCommodityShopListShopByReq({ environment: '4', type: '1' })
    if (res.code === 1000 && res.data && res.data.length > 0) {
      setAppInfo(res.data[0])
    }
  }

  const getDownLoadUrl = async () => {
    const res = await getManageAppDownloadLinkFind({ status: '1' })
    if (res.code === 1000 && res.data) {
      const temp: any = {}
      res.data.forEach((item: any) => {
        switch (item.title) {
          case 1:
            temp.ios = item.link
            break
          case 2:
            temp.android = item.link
            break
          default:
            break
        }
      })
      setAppLink(temp)
    }
  }

  useEffect(() => {
    getAppInfo()
    getDownLoadUrl()
  }, [])

  const judegeIsWeiXin = (): boolean => {
    const ua = navigator.userAgent.toLowerCase()
    if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
      return true
    }
    return false
  }

  const handleDownload = () => {
    // 如果是在微信
    if (judegeIsWeiXin()) {
      console.log('isweixin')
      setMaskVisible(true)
    } else {
      if (navigator.userAgent.match(/android/i)) {
        if (appLink.android) {
          window.location.href = appLink.android
        }
      }
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        if (appLink.ios) {
          window.location.href = appLink.ios
        }
      }
    }
  }

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <title>{appInfo?.name}</title>
      </Helmet>
      {appInfo && (
        <div className={styles.downloadContaiern}>
          <div className={styles.logoWrap}>
            <ImageBox className={styles.appLogo} src={appInfo?.logoUrl} />
          </div>
          <div className={styles.appName}>{appInfo?.name}</div>
          <div className={styles.descrip}></div>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            {translate('web.resource.mall.dianjixiazaishoujikehuduan')}
          </button>
        </div>
      )}
      {maskVisble && (
        <div className={styles.mask}>
          <div className={styles.maskBody}>
            <span>{translate('web.resource.mall.dianjiyoushangjiaoxuanzeliulanqidakai')}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default AppDownload
