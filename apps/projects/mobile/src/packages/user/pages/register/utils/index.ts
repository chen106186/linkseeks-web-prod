import { Toast } from '@apps/mobile-ui'
import { setAsyncStorage, getAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { encryptedByAES } from '@linkseeks/crypto'
import { getIntl } from '@linkseeks/i18n'
import { getMemberMobileRegisterDetail, getMemberMobileRegisterType, postMemberMobileRegister } from '@apps/apis'
import { IS_WEB } from '@/constants'
import { REGISTER_SOURCE_TYPE } from '@/constants'
import {
  ROLE_LIST,
  REGISTER_DATA,
  IDS_DATA,
  BUSINESS_TYPES,
  REGISTER_STORE_DATA,
  DISTRIBUTION_INVITER_ACCOUNT,
} from '@/constants/storage'
import { getStorageSync } from '@apps/mobile-services/utils/taro'

export const onSubmit = async (data: any, extraForm?: any) => {
  const param = { ...data }
  param.detail = extraForm || {}
  param.registerSource = IS_WEB
    ? REGISTER_SOURCE_TYPE.FROM_ENTERPRISE_H5_WEB_SHOP
    : REGISTER_SOURCE_TYPE.FROM_ENTERPRISE_MINI_APP
  param.password = encryptedByAES(param.password)
  param.phone = encryptedByAES(param.phone)
  param.smsCode = encryptedByAES(param.smsCode)
  if (param.email) {
    param.email = encryptedByAES(param.email, false)
  }
  // 邀请人账号
  const inviterAccount = getStorageSync(DISTRIBUTION_INVITER_ACCOUNT)
  if (inviterAccount) {
    param.inviterAccount = inviterAccount
  }
  const res = await postMemberMobileRegister(param)
  if (res.code === 1000) {
    removeAsyncStorage(REGISTER_STORE_DATA)
    // 存在邀请人账号，删除邀请人账号缓存
    if (inviterAccount) {
      removeAsyncStorage(DISTRIBUTION_INVITER_ACCOUNT)
    }
    Router.navigateTo('user/complete', { isNeedAudit: !res.data.verify })
  } else {
    Toast.show({
      title: getIntl().formatMessage({ id: `${res.code}`, defaultMessage: res.message }),
      icon: 'none',
    })
  }
}
/* 返回注册跳转路街 */
export const JumpLike = async (step: number) => {
  const res: any = await getMemberMobileRegisterType()
  let goUrl: any = ['', 'user/Identity', 'user/businessTypes', 'user/store']
  const ids = {
    memberType: '',
    memberRoleId: '',
  }
  if (res.code === 1000) {
    if (step === 1) {
      /* 注册第一步 第一种情况，选择身份只有一个 和选中业务 只有一个 注册表是空 */
      if (res.data.length === 1) {
        ids.memberType = res.data[0].memberType
        if (res.data[0].memberRoleVOList.length === 1) {
          ids.memberRoleId = res.data[0].memberRoleVOList[0].memberRoleId
          const resj: any = await getMemberMobileRegisterDetail({ roleId: ids.memberRoleId })
          if (resj.code === 1000) {
            /* 直接调用注册资料接口 */
            if (resj.data.length === 0) {
              const param = await getAsyncStorage(REGISTER_DATA)
              onSubmit({ ...param, ...ids })
            } else {
              setAsyncStorage(IDS_DATA, ids)
              /* 如果不是就直接跳过注册资料表单填写页面 */
              Router.navigateTo('user/store')
            }
          }
        } else {
          setAsyncStorage(ROLE_LIST, res.data[0])
          /* 如果选择身份是一个 选择业务是多多个 直接跳过选择页面 */
          Router.navigateTo('user/businessTypes')
        }
      } else {
        /* 正常流程走下去 */
        // url = goUrl[step]
        Router.navigateTo(goUrl[step])
      }
    }
    /* 注册第二步.若果选择业务只有一个 或者注册表单是空 直接调用注册 */
    if (step === 2) {
      const { memberType, memberRoleVOList } = await getAsyncStorage(BUSINESS_TYPES)
      /* 如果查询出来选择角色 只有一个 的时候 直接跳过去 Store 没有 的话 就 直接调用注册接口 */
      if (memberRoleVOList.length === 1) {
        ids.memberRoleId = memberRoleVOList[0].memberRoleId
        ids.memberType = memberType
        const resj: any = await getMemberMobileRegisterDetail({ roleId: ids.memberRoleId })

        if (resj.code === 1000) {
          /* 直接调用注册资料接口 */
          if (resj.data.length === 0) {
            const param = await getAsyncStorage(REGISTER_DATA)
            onSubmit({ ...param, ...ids })
          } else {
            setAsyncStorage(IDS_DATA, ids)
            /* 如果不是就直接跳过注册资料表单填写页面 */
            Router.navigateTo('user/store')
          }
        }
      } else {
        /* 正常流程走下去 */
        // url = goUrl[step]
        setAsyncStorage(ROLE_LIST, { memberType, memberRoleVOList })
        Router.navigateTo(goUrl[step])
      }
    }
    /* 注册第三步 如果注册表单是空的 直接注册 */
    if (step === 3) {
      const param = await getAsyncStorage(IDS_DATA)
      const resj: any = await getMemberMobileRegisterDetail({ roleId: param?.memberRoleId })
      if (resj.data.length === 0) {
        const params = await getAsyncStorage(REGISTER_DATA)
        onSubmit({ ...params, ...param })
      } else {
        /* 如果不是就直接跳过注册资料表单填写页面 */
        Router.navigateTo('user/store')
      }
    }
  }
  // return url;
}
