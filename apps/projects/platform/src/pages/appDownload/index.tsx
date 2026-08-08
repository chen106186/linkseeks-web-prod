import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { Helmet } from 'react-helmet'
import { getIntl } from '@linkseeks/i18n'
import { GlobalConfig } from '@/global/config'
import styles from './styles.less'
import { getManageAppDownloadLinkFind } from '@apps/apis'
const intl = getIntl()
const AppDownload = () => {
  const shopInfo = GlobalConfig.web.shopInfo.filter((item) => item.type === 1 && item.environment === 4)

  const appInfo: any = shopInfo ? shopInfo[0] : {}

  const [appLink, setAppLink] = useState<{ ios: string; android: string }>()

  const [maskVisble, setMaskVisible] = useState<boolean>(false)

  const getDownLoadUrl = () => {
    getManageAppDownloadLinkFind({ status: '1' }).then((res) => {
      if (res.code === 1000 && res.data) {
        const temp: any = {}
        res.data.forEach((item) => {
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
    })
  }

  useEffect(() => {
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
        <title>{appInfo.name}</title>
      </Helmet>
      <div className={styles.downloadContaiern}>
        <div className={styles.logoWrap}>
          <img className={styles.appLogo} src={appInfo.logoUrl} />
        </div>
        <div className={styles.appName}>{appInfo.name}</div>
        <div className={styles.descrip}>{intl.formatMessage({ id: 'components.shangyeshuzihuayoulingxi' })}</div>
        <Button className={styles.downloadBtn} type="primary" onClick={() => handleDownload()}>
          {intl.formatMessage({ id: 'components.dianjixiazaishoujikehu' })}
        </Button>
      </div>
      {maskVisble && (
        <div className={styles.mask}>
          <div className={styles.maskBody}>
            <span>{intl.formatMessage({ id: 'components.dianjiyoushangjiaoxuanzeliu' })}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default AppDownload
