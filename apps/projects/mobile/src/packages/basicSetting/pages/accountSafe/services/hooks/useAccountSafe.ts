import React, { useEffect, useState } from 'react'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { SECURITY_GET, USER_INFO } from '@/constants/storage'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileSecurityGet } from '@apps/apis'
import { decryptedByAES } from '@linkseeks/crypto'
import Router from '@/utils/router'

const password = getOssUrlPath('/miniprogram/assets/images/password.png')
const email = getOssUrlPath('/miniprogram/assets/images/email.png')
const phone = getOssUrlPath('/miniprogram/assets/images/phone.png')
const paycode = getOssUrlPath('/miniprogram/assets/images/paycode.png')
const realName = getOssUrlPath('/miniprogram/assets/images/realName.png')
const LOGOFFICON = getOssUrlPath('/miniprogram/assets/images/logOff.svg')

type RouteType = 'password' | 'email' | 'phone' | 'paycode' | 'realNameLayout' | 'logOff'

const useAccountSafe = () => {
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [name, setName] = useState<string>('')
  const [data, setData] = useState<any>([])
  const [dataIndex, setDataIndex] = useState<string>('password')
  const [fraction, setFraction] = useState<number>(25)
  const [star, setStar] = useState<number>()
  const [end, setEnd] = useState<number>(3)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const intl = useIntl()
  const passScore = 75

  const TipMsg: any = {
    password: intl.formatMessage({
      id: 'user.ninweishezhiyouxiangqing',
      defaultMessage: '您未设置邮箱，请先设置后再操作',
    }),
    paycode: intl.formatMessage({
      id: 'user.ninweishezhizhifumima',
      defaultMessage: '您未设置支付密码，请先设置后再操作',
    }),
    email: intl.formatMessage({
      id: 'user.ninweishezhiyouxiangqing',
      defaultMessage: '您未设置邮箱，请先设置后再操作',
    }),
  }

  const handleJump = (type: RouteType, val: string) => {
    if (val === intl.formatMessage({ id: 'user.weishezhi', defaultMessage: '未设置' })) {
      setDataIndex(type)
      setToggle(!toggle)
    } else {
      switch (type) {
        case 'paycode':
          Router.navigateTo('basicSetting/phone', { type: 'paycode' })
          break
        case 'realNameLayout':
          Router.navigateTo(!isAuth ? 'basicSetting/realChange' : 'basicSetting/realLayout')
          break
        case 'logOff':
          Router.navigateTo('basicSetting/logOff')
          break
        default:
          Router.navigateTo('basicSetting/verifys', { type })
          break
      }
    }
  }
  /* 隐藏姓名 */
  const formatName = (changeName: string) => {
    let newStr = ''
    if (changeName?.length === 2) {
      newStr = changeName.substr(0, 1) + '*'
    } else if (changeName?.length > 2) {
      let char = ''
      for (let i = 0, len = changeName.length - 2; i < len; i++) {
        char += '*'
      }
      newStr = changeName.substr(0, 1) + char + changeName.substr(-1, 1)
    } else {
      newStr = changeName
    }
    return newStr
  }
  /* 获取用户信息 */
  const getUserInfo = async () => {
    await getAsyncStorage(USER_INFO).then((res: any) => {
      if (res == null) {
        Router.navigateTo('user/login')
      }
      setName(formatName(res.name))
    })
  }

  const decryptedParams = (value: string) => {
    try {
      if (value) {
        return decryptedByAES(value)
      }
      return undefined
    } catch (error) {
      return undefined
    }
  }

  /* 查询用户的手机号码和邮箱 */
  const getSecurity = () => {
    getMemberMobileSecurityGet().then((res: any) => {
      const data = {
        ...res.data,
        phone: decryptedParams(res.data?.phone),
        email: decryptedParams(res.data?.email),
      }
      setFraction(data.rate)
      let rate = data.rate / 25
      rate = Math.floor(rate)
      setStar(rate)
      const end = (100 - data.rate) / 25
      setEnd(Math.ceil(end))
      if (res.code === 1000) {
        const iconData = [
          {
            icon: realName,
            title: intl.formatMessage({ id: 'user.shimingrenzheng', defaultMessage: '实名认证' }),
            value: data.isAuth
              ? intl.formatMessage({ id: 'user.yirenzheng', defaultMessage: '已认证' })
              : intl.formatMessage({ id: 'user.weirenzheng', defaultMessage: '未认证' }),
            dataIndex: 'realNameLayout',
          },
          {
            icon: password,
            title: intl.formatMessage({ id: 'user.denglumimaxiugai', defaultMessage: '登录密码修改' }),
            value: intl.formatMessage({ id: 'user.yishezhi', defaultMessage: '已设置' }),
            dataIndex: 'password',
          },
          {
            icon: email,
            title: intl.formatMessage({ id: 'user.youxiangxiugai', defaultMessage: '邮箱修改' }),
            value: data.email ? data.email : intl.formatMessage({ id: 'user.weishezhi', defaultMessage: '未设置' }),
            dataIndex: 'email',
          },
          {
            icon: phone,
            title: intl.formatMessage({ id: 'user.shoujihaoxiugai', defaultMessage: '手机号修改' }),
            value: data.phone ? data.phone : intl.formatMessage({ id: 'user.weishezhi', defaultMessage: '未设置' }),
            dataIndex: 'phone',
          },
          {
            icon: paycode,
            title: intl.formatMessage({ id: 'user.zhifumimaxiugai', defaultMessage: '支付密码修改' }),
            value:
              data.hasPayPassword === 0
                ? intl.formatMessage({ id: 'user.weishezhi', defaultMessage: '未设置' })
                : intl.formatMessage({ id: 'user.yishezhi', defaultMessage: '已设置' }),
            dataIndex: 'paycode',
          },
          {
            icon: LOGOFFICON,
            title: intl.formatMessage({ id: 'user.logOff', defaultMessage: '账户注销' }),
            value: intl.formatMessage({ id: 'user.logOff.to', defaultMessage: '去注销' }),
            dataIndex: 'logOff',
          },
        ]
        setIsAuth(data.isAuth)
        setData(iconData)
        setAsyncStorage(SECURITY_GET, data)
      }
    })
  }
  const setConfirm = () => {
    setToggle(!toggle)
    if (dataIndex === 'password' || dataIndex === 'email') {
      Router.navigateTo('basicSetting/verifys', { type: dataIndex })
    } else {
      Router.navigateTo('basicSetting/phone', { type: 'paycode' })
    }
  }

  return {
    toggle,
    name,
    fraction,
    passScore,
    star,
    end,
    data,
    tips: TipMsg[dataIndex],
    handleJump,
    getUserInfo,
    getSecurity,
    setToggle,
    setConfirm,
  }
}

export default useAccountSafe
