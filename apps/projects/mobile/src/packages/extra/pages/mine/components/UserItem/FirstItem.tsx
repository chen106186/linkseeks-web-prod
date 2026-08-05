import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Text, View, Image, Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { login, getStorageSync, useDidShow, showToast } from '@apps/mobile-services/utils/taro'
import { requestSubscribeMessage } from '@tarojs/taro'
import { useIntl } from '@linkseeks/i18n'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import { USER_INFO } from '@/constants/storage'
import {
  getContractSignatureAuthGetSignatureDetail,
  getPayMobileAssetAccountGetPlatFormAssetAccount,
  getPayMobileAssetAccountGetUserAssetAccount,
  getMarketingMobileSocialDistributionStaffStatus,
  getMarketingMobileCbgTeamLeaderCheckIsTeamLeader,
  getMarketingMobileSocialDistributionEnableStatus,
  getMemberMobileInfoUpdateOpenid,
} from '@apps/apis'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'
import { IS_WEB } from '@/constants'
import { THEME_COLORS } from '@/constants/theme'

const member = getOssUrlPath('/Images/member.svg')
const balance = getOssUrlPath('/Images/balance.svg')
const signature = getOssUrlPath('/Images/signature.svg')
const inquiry = getOssUrlPath('/Images/inquiry.svg')
const offer = getOssUrlPath('/Images/offer.svg')
const e = getOssUrlPath('/Images/e.svg')
const channel = getOssUrlPath('/Images/channel.svg')
const fenxiaozhongxinIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/fxzx.png'
const tuanzhangzhongxinIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/tzzx.png'

const FirstItem: React.FC<{}> = () => {
  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const translate = useMobileIntl()

  /** 是否服务提供者角色 */
  const isBusiness = useMemo(() => {
    if (userInfo && userInfo.roles && userInfo.roles.length > 0) {
      const currentRole: any = userInfo.roles.find((item) => item.roleId === userInfo.memberRoleId)
      if (currentRole) {
        return currentRole.roleType === 1
      }
    }
    return false
  }, [userInfo])

  const [userData, setUserData] = useState<any>([])
  const { memberInfo, isFinishProcess, isEnterprise, isSelf, refreshPayMemberInfo } = useEAccountMemberInfo({
    isRefresh: false,
  })

  const intl = useIntl()

  const isNavigatingDistribution = useRef(false)
  const isNavigatingTeamLeader = useRef(false)

  useDidShow(() => {
    if (userInfo) {
      refreshPayMemberInfo()
    }
  })
  const goJump = async (url, infos?: {}) => {
    const { accessToken, memberType } = (await getAsyncStorage(USER_INFO)) || ''
    if (accessToken) {
      if (url === 'Promotion') {
        getContractSignatureAuthGetSignatureDetail().then((res) => {
          if (res.code === 1000) {
            if (res.data.organization) {
              Router.navigateTo('contract/signatureDetail', infos)
            } else {
              Router.navigateTo('contract/signatureAuth', infos)
            }
          }
        })
      }
      if (url === 'e') {
        goEAccount(memberType)

        return
      }

      if (url === 'Distribution') {
        if (isNavigatingDistribution.current) return
        saveMemberOpenid()
        isNavigatingDistribution.current = true
        // 是否为分销员
        const res = await getMarketingMobileSocialDistributionStaffStatus()
        if (res.code !== 1000) {
          isNavigatingDistribution.current = false
          return
        }
        const data = res.data
        // 是否是分销员
        const ifStaff = data.ifStaff
        // 是否已禁用申请入口 0-已禁用 1-开启
        const showApplicationEntry = data.showApplicationEntry
        if (showApplicationEntry === 0 && !ifStaff) {
          showToast({
            title: intl.formatMessage({
              id: 'distribution.zanweikaifangshenqingruko',
              defaultMessage: '暂未开放申请入口',
            }),
            icon: 'none',
          })
          isNavigatingDistribution.current = false
          return
        }

        if (ifStaff) {
          // 小程序授权订阅消息-账户余额发生变动通知
          await requestSubscribeMessage({
            tmplIds: ['B16zfQjHGBRTn4kGZCI6tv49EEM1ETeTsWyCpK14hys'],
            entityIds: [],
          }).catch(() => {})
          Router.navigateTo('distribution/mine')
        } else {
          // 成为分销员
          Router.navigateTo('distribution/apply')
        }
        isNavigatingDistribution.current = false
        return
      }

      if (url === 'TeamLeader') {
        if (isNavigatingTeamLeader.current) return
        saveMemberOpenid()
        isNavigatingTeamLeader.current = true
        // 是否已申请团长
        const res = await getMarketingMobileCbgTeamLeaderCheckIsTeamLeader()
        if (res.code !== 1000) {
          isNavigatingTeamLeader.current = false
          return
        }

        // 0：未申请，1：待审核，2：审核通过，3：审核不通过，4：已禁用
        const applyStatus = res.data
        if (applyStatus === 2 || applyStatus === 4) {
          // 小程序授权订阅消息-账户余额发生变动通知
          await requestSubscribeMessage({
            tmplIds: ['B16zfQjHGBRTn4kGZCI6tv49EEM1ETeTsWyCpK14hys'],
            entityIds: [],
          }).catch(() => {})
          Router.navigateTo('teamLeader/mine')
        } else {
          Router.navigateTo('teamLeader/apply')
        }
        isNavigatingTeamLeader.current = false
        return
      }

      if (url) {
        Router.navigateTo(url, infos)
      }
    } else {
      Router.navigateTo('user/login')
    }
  }

  const saveMemberOpenid = async () => {
    const weChatCode = IS_WEB ? '' : (await login()).code
    if (!weChatCode) {
      return
    }

    getMemberMobileInfoUpdateOpenid({ wxJsCode: weChatCode })
  }

  const firstFn = async () => {
    let fn: any
    const isSelfMall = shopAndSite?.isSelf
    const userInfo = (await getAsyncStorage(USER_INFO)) || ''
    const memberInfo: any = {
      upperMemberId: '',
      upperRoleId: '',
    }
    if (isSelfMall) {
      memberInfo.upperMemberId = shopAndSite?.memberId
      memberInfo.upperRoleId = shopAndSite?.memberRoleId
    }

    // 1-开启 0-关闭
    let distributionEnableStatus = 0
    try {
      // 获取分销活动状态
      const res = await getMarketingMobileSocialDistributionEnableStatus()
      if (res.code === 1000) {
        distributionEnableStatus = res.data
      }
    } catch (err) {
      console.warn('获取分销状态失败', err)
    }

    if (userInfo) {
      if (isSelfMall) {
        fn = getPayMobileAssetAccountGetUserAssetAccount
      } else {
        fn = getPayMobileAssetAccountGetPlatFormAssetAccount
      }
      const obj = {
        parentMemberId: shopAndSite?.memberId,
        parentMemberRoleId: shopAndSite?.memberRoleId,
      }

      fn(obj, { showError: false }).then((res: any) => {
        if (res.code === 1000) {
          const data: any[] = [
            {
              title: intl.formatMessage({ id: 'mine.huiyuanzhongxin', defaultMessage: '会员中心' }),
              url: 'members/my',
              icon: member,
              infos: memberInfo,
            },
            {
              title: intl.formatMessage({ id: 'mine.yuezhanghu', defaultMessage: '余额账户' }),
              url: 'basicSetting/normalAccountDetail',
              icon: balance,
              infos: { acccountId: userData?.id },
            },
            // {
            //   title: intl.formatMessage({ id: 'mine.dianziqianzhang', defaultMessage: '电子签章' }),
            //   url: 'Promotion',
            //   icon: signature,
            // },
            {
              title: intl.formatMessage({ id: 'mine.xunjiadan', defaultMessage: '询价单' }),
              url: 'order/inquiry',
              icon: inquiry,
            },
            {
              title: intl.formatMessage({ id: 'mine.baojiadan', defaultMessage: '报价单' }),
              url: 'order/inquiryQuotation',
              icon: offer,
            },
            memberInfo && {
              title: intl.formatMessage({ id: 'mine.ezhanghu', defaultMessage: 'e账户' }),
              url: 'e',
              icon: e,
            },
            memberInfo &&
              distributionEnableStatus === 1 && {
                title: intl.formatMessage({ id: 'mine.fenxiaozhongxin', defaultMessage: '分销中心' }),
                url: 'Distribution',
                icon: fenxiaozhongxinIcon,
              },
            memberInfo && {
              title: intl.formatMessage({ id: 'mine.tuanzhangzhongxin', defaultMessage: '团长中心' }),
              url: 'TeamLeader',
              icon: tuanzhangzhongxinIcon,
            },
          ].filter(Boolean)
          if (shopAndSite?.property === SHOP_PROPERTY.CUSTOMER_SELF_SUPPORT) {
            data.splice(2, 4)
          }

          if (isBusiness) {
            data.push(
              ...[
                {
                  title: translate('mobile.resource.askPurchase.xunyuanguanli'),
                  url: 'askPurchase/merchants/list',
                  icon: inquiry,
                },
                {
                  title: translate('mobile.resource.askPurchase.baojiaguanli'),
                  url: 'askPurchase/merchants/quoteList',
                  icon: offer,
                },
              ],
            )
          } else {
            data.push({
              title: translate('mobile.resource.askPurchase.xunyuanxuqiu'),
              url: 'askPurchase/buyer/list',
              icon: inquiry,
            })
          }

          setUserData(data)
        } else {
          const data: any[] = [
            {
              title: intl.formatMessage({ id: 'mine.huiyuanzhongxin', defaultMessage: '会员中心' }),
              url: 'members/my',
              icon: member,
              infos: memberInfo,
            },
            {
              title: intl.formatMessage({ id: 'mine.dianziqianzhang', defaultMessage: '电子签章' }),
              url: 'Promotion',
              icon: signature,
            },
            {
              title: intl.formatMessage({ id: 'mine.xunjiadan', defaultMessage: '询价单' }),
              url: 'order/inquiry',
              icon: inquiry,
            },
            {
              title: intl.formatMessage({ id: 'mine.baojiadan', defaultMessage: '报价单' }),
              url: 'order/inquiryQuotation',
              icon: offer,
            },
            memberInfo && {
              title: intl.formatMessage({ id: 'mine.ezhanghu', defaultMessage: 'e账户' }),
              url: 'e',
              icon: e,
            },
            memberInfo &&
              distributionEnableStatus === 1 && {
                title: intl.formatMessage({ id: 'mine.fenxiaozhongxin', defaultMessage: '分销中心' }),
                url: 'Distribution',
                icon: fenxiaozhongxinIcon,
              },
            memberInfo && {
              title: intl.formatMessage({ id: 'mine.tuanzhangzhongxin', defaultMessage: '团长中心' }),
              url: 'TeamLeader',
              icon: tuanzhangzhongxinIcon,
            },
          ].filter(Boolean)
          if (isBusiness) {
            data.push(
              ...[
                {
                  title: translate('mobile.resource.askPurchase.xunyuanguanli'),
                  url: 'askPurchase/merchants/list',
                  icon: inquiry,
                },
                {
                  title: translate('mobile.resource.askPurchase.baojiaguanli'),
                  url: 'askPurchase/merchants/quoteList',
                  icon: offer,
                },
              ],
            )
          } else {
            data.push({
              title: translate('mobile.resource.askPurchase.xunyuanxuqiu'),
              url: 'askPurchase/buyer/list',
              icon: inquiry,
            })
          }

          setUserData(data)
        }
      })
    } else {
      const data: any[] = [
        {
          title: intl.formatMessage({ id: 'mine.huiyuanzhongxin', defaultMessage: '会员中心' }),
          url: 'members/my',
          icon: member,
          infos: memberInfo,
        },
        {
          title: intl.formatMessage({ id: 'mine.dianziqianzhang', defaultMessage: '电子签章' }),
          url: 'Promotion',
          icon: signature,
        },
        {
          title: intl.formatMessage({ id: 'mine.xunjiadan', defaultMessage: '询价单' }),
          url: 'order/inquiry',
          icon: inquiry,
        },
        {
          title: intl.formatMessage({ id: 'mine.baojiadan', defaultMessage: '报价单' }),
          url: 'order/inquiryQuotation',
          icon: offer,
        },
        memberInfo && {
          title: intl.formatMessage({ id: 'mine.ezhanghu', defaultMessage: 'e账户' }),
          url: 'e',
          icon: e,
        },
        // { title: intl.formatMessage({id: 'mine.qudaojiameng', defaultMessage: '渠道加盟}), url: "order/inquiryQuotation", icon: channel }
        memberInfo &&
          distributionEnableStatus === 1 && {
            title: intl.formatMessage({ id: 'mine.fenxiaozhongxin', defaultMessage: '分销中心' }),
            url: 'Distribution',
            icon: fenxiaozhongxinIcon,
          },
        memberInfo && {
          title: intl.formatMessage({ id: 'mine.tuanzhangzhongxin', defaultMessage: '团长中心' }),
          url: 'TeamLeader',
          icon: tuanzhangzhongxinIcon,
        },
      ].filter(Boolean)
      if (isBusiness) {
        data.push(
          ...[
            {
              title: translate('mobile.resource.askPurchase.xunyuanguanli'),
              url: 'askPurchase/merchants/list',
              icon: inquiry,
            },
            {
              title: translate('mobile.resource.askPurchase.baojiaguanli'),
              url: 'askPurchase/merchants/quoteList',
              icon: offer,
            },
          ],
        )
      } else {
        data.push({
          title: translate('mobile.resource.askPurchase.xunyuanxuqiu'),
          url: 'askPurchase/buyer/list',
          icon: inquiry,
        })
      }

      setUserData(data)
    }
  }

  const goEAccount = async (memberType) => {
    if (isSelf) {
      if (memberInfo?.isPhoneChecked) {
        // 已绑定手机
        Router.navigateTo('basicSetting/accountHome')
      } else {
        // 未绑定手机，并且是个人用户,前往绑定
        Router.navigateTo('basicSetting/bindphone')
      }
    } else if (isEnterprise) {
      if (isFinishProcess) {
        // 已经完成绑定
        Router.navigateTo('basicSetting/accountHome')
      } else {
        Router.navigateTo('basicSetting/entErpriseAuth')
      }
      console.log(memberInfo)
      console.log('企业类型')
    }
  }
  useDidShow(() => {
    firstFn()
  })

  return (
    <View className={styles['userItem-card']}>
      <View className={styles['userItem-card-header']}>
        <Text className={styles['userItem-card-title']}>
          {intl.formatMessage({ id: 'mine.gongnengfuwu', defaultMessage: '功能服务' })}
        </Text>
      </View>
      <View className={styles['userItem-card-content']}>
        {userData.map((item) => {
          const xmlSvg = item.icon.replace(/#C0C4CC/g, THEME_COLORS.primary)
          return (
            <View
              className={styles['userItem-card-item']}
              key={item.title}
              onClick={() => goJump(item.url, item.infos)}
            >
              <Image src={xmlSvg} className={styles['userItem-card-svg']} />
              <Text className={styles['userItem-card-text']}>{item.title}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
export default FirstItem
