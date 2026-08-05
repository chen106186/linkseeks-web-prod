import React, { useState, useEffect, useRef } from 'react'
import { message } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import QRCode from 'qrcode'
import { getMemberLoginAuthCode, postMemberLoginInfo } from '@apps/apis'
import defaultHomePath from '@/utils/defaultHomePath'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import { encryptedByAES } from '@linkseeks/crypto'
import { authService } from '@apps/services'
import styles from './index.less'
import { history } from '@linkseeks/router-manager'
const intl = getIntl()
const ScanLoginWrap: React.FC = () => {
  const { redirect } = usePageStatus()
  const [qrCode, setQrCode] = useState('')
  const timer = useRef<any>(null)

  let time = 60 * 5
  const hanleCountdown = (authCode) => {
    if (time > 0 && time <= 60 * 5) {
      time -= 2
      timer.current = setTimeout(() => {
        const code = getUrlParam(authCode, 'authCode')
        loginInfo(code)
        hanleCountdown(authCode)
      }, 2000)
      return
    } else {
      AuthCode()
      time = 60 * 5
    }
  }
  const getUrlParam = (url: string, name: string) => {
    const paraString: any = url.substring(url.indexOf('?') + 1, url.length).split('&')
    const paraObj: any = {}
    let j: any
    // eslint-disable-next-line no-cond-assign
    // eslint-disable-next-line no-plusplus
    for (let i = 0; (j = paraString[i]); i++) {
      paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
    }
    const returnValue: any = paraObj[name.toLowerCase()]
    if (typeof returnValue === 'undefined') {
      return ''
    }
    return returnValue
  }
  const AuthCode = () => {
    getMemberLoginAuthCode({}, { ctlType: 'none' }).then((res) => {
      const scanUrl = `scanLogin?codeSign=${res.data.codeSign}&authCode=${res.data.authCode}`
      hanleCountdown(scanUrl)
      QRCode.toDataURL(scanUrl)
        .then((url: any) => {
          setQrCode(url)
          console.log(url)
        })
        .catch((err: any) => {
          console.error(err)
        })
    })
  }
  /* 获取登录信息 */
  const loginInfo = (authCode) => {
    postMemberLoginInfo({ authCode: encryptedByAES(authCode, false) }, { ctlType: 'none' }).then((res) => {
      console.log(res)
      const { data, code } = res
      if (code === 1000) {
        message.destroy()
        message.success(intl.formatMessage({ id: 'user.dengluchenggong' }))
        authService.setAuth(data)
        recentVisitLocalStorage.removeItem()
        // 此处需使用href跳转， 否则无法触发app.ts中的路由初始化校验
        if (redirect) {
          history.redirect(decodeURIComponent(atob(redirect)))
        } else {
          history.goHome()
        }
        clearTimeout(timer.current)
        timer.current = null
      }
    })
  }

  useEffect(() => {
    AuthCode()
    return () => {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  return (
    <div className={styles['scanLoginWrap']}>
      <h2 className={styles['scanLoginWrap-title']}>{intl.formatMessage({ id: 'user.saomadenglu' })}</h2>
      <div className={styles['qrCodeImage']}>{qrCode && <img src={qrCode} alt="" />}</div>
    </div>
  )
}

export default ScanLoginWrap
