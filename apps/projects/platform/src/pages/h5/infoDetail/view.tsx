import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import {
  getCommodityShopListShopByReq,
  getManageMobileMemberInformationMobileDetail,
  getManageMobileInformationMobileDetail,
} from '@apps/apis'
import { getWebIntl } from '@apps/locales'
import ImageBox from '@apps/components/src/web/ImageBox'
import { usePageStatus } from '@/hooks/usePageStatus'
import { MallInfoType } from '../download/view'
import styles from './styles.module.less'

const InformationDetail: React.FC = () => {
  const [appInfo, setAppInfo] = useState<MallInfoType>()
  const [newsDetail, setNewsDetail] = useState<any>()
  const { type, id } = usePageStatus()
  const translate = getWebIntl()
  const [title, setTitle] = useState<string>(translate('web.resource.shop.zixunxiangqing'))

  const getAppInfo = async () => {
    const res = await getCommodityShopListShopByReq({ environment: '4', type: '1' })
    if (res.code === 1000 && res.data && res.data.length > 0) {
      setAppInfo(res.data[0])
    }
  }

  const fetchNewsDetail = async () => {
    let apiFn
    if (type === 'self') {
      apiFn = getManageMobileMemberInformationMobileDetail
    } else {
      apiFn = getManageMobileInformationMobileDetail
    }
    const res = await apiFn({ id })
    if (res.code === 1000 && res.data) {
      setTitle(res.data.title)
      setNewsDetail(res.data)
    }
  }

  useEffect(() => {
    getAppInfo()
    if (id) {
      fetchNewsDetail()
    }
  }, [])

  const judgeExistApp = () => {
    const ifrSrc = 'lingxi://'
    if (navigator.userAgent.match(/android/i)) {
      const ifr = document.createElement('iframe')
      ifr.src = ifrSrc
      ifr.style.display = 'none'
      document.body.appendChild(ifr)

      setTimeout(() => {
        document.body.removeChild(ifr)
        window.location.href = '/h5/download'
      }, 1000)
    }
    // ios判断
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      const ifr = document.createElement('iframe')
      ifr.src = ifrSrc
      ifr.style.display = 'none'

      document.body.appendChild(ifr)
      setTimeout(() => {
        document.body.removeChild(ifr)
        window.location.href = '/h5/download'
      }, 1000)
    }
  }

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <title>{title}</title>
      </Helmet>
      {appInfo && (
        <div className={styles.downloadCard}>
          <div className={styles.downloadCardBody}>
            <ImageBox className={styles.downloadAppIcon} src={appInfo?.logoUrl} />
            <span className={styles.downloadAppName}>{appInfo?.name}</span>
            <button className={styles.downloadBtn} onClick={() => judgeExistApp()}>
              {translate('web.resource.mall.dakai')}
            </button>
          </div>
        </div>
      )}
      {newsDetail && (
        <div className={styles.detailContainer}>
          <div className={styles.title}>{newsDetail.title}</div>
          <div className={styles.informationInfo}>
            <div className={styles.date}>{newsDetail?.createTime}</div>
            <div className={styles.readCount}>
              {newsDetail?.readCount} {translate('web.resource.mall.rekanguo')}
            </div>
          </div>
          <div className={styles.informationDigest}>{newsDetail.digest}</div>
          <div dangerouslySetInnerHTML={{ __html: newsDetail.content }} className={styles.informationContent} />
        </div>
      )}
    </>
  )
}

export default InformationDetail
