import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { View, NoticeBar, Image, Text, Toast, Button, Modal } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { ScrollView } from '@tarojs/components'
import {
  useRouter,
  setNavigationBarTitle,
  preload,
  pxTransform,
  showModal,
  showToast,
  navigateToMiniProgram,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import { checkMore } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'
// import Loading from '@/components/Loading';
import {
  getPayMobileAssetAccountGetPlatFormAssetAccount,
  getPayMobileAssetAccountGetUserAssetAccount,
  getPayMobileEAccountAllInPayGetAccountDetail,
  GetPayMobileEAccountAllInPayGetAccountDetailResponse,
  getPayMobileEAccountAllInPayGetEAccountTradeRecord,
  GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail,
  postPayAllInPayRegisterCompanyMember,
  postPayAllInPaySendVerificationCode,
  postPayAllInPaySignContract,
  // postPayAllInPayUnbindPhone,
} from '@apps/apis'
import { getTypeImg } from '../../../../utils'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useGetAuthMember } from '../../useGetAuthMember'
import { useRequestApi } from '@linkseeks/hooks'
import { IS_WEB } from '@/constants'
interface accountDetailProps {
  // 账户余额
  accountBalance: number
  // 账户状态:1-正常,2-已冻结
  accountStatus: number
  // 创建时间
  createTime: number
  // id
  id: number
  // 锁定余额
  lockBalance: number
  // 可用余额
  usableBalance: number
  // 会员id
  memberId: number
  // 会员等级类型:1-平台会员;2-商户会员;3-渠道会员
  memberLevelType: number
  // 会员logo
  memberLogo: number
  // 会员名称
  memberName: string
  // 会员角色id
  memberRoleId: number
  // 会员角色名称
  memberRoleName: string
  // 会员状态:1-正常,2-已冻结
  memberStatus: number
  // 会员类型:1-企业会员;2-企业个人会员;3-渠道会员;4-渠道个人会员
  memberType: number
  // 父级会员id
  parentMemberId: number
  // 父级会员名称
  parentMemberName: string
  // 父级会员角色id
  parentMemberRoleId: number
  // 父级会员角色名称
  parentMemberRoleName: string
  phone: string
}
const AccountDetail = () => {
  const { upperMemberId, upperRoleId } = useRouter().params
  const {
    userStore: { shopAndSite },
  } = useStores()
  const { memberInfo, isFinishProcess, isFinishMoneyProcess, isSelf, isEnterprise, refreshPayMemberInfo } =
    useEAccountMemberInfo({
      isRefresh: true,
    })
  const { bizUserId } = memberInfo || {}
  const intl = useIntl()
  const {
    data: accountDetail,
    refresh: refreshAccountDetail,
    loading: accountDetailLoading,
  } = useRequestApi<GetPayMobileEAccountAllInPayGetAccountDetailResponse, any>(
    getPayMobileEAccountAllInPayGetAccountDetail,
  )
  const list = [
    {
      name: intl.formatMessage({
        id: 'pay.jiaoyijilu',
        defaultMessage: '交易记录',
      }),
      icon: getOssUrlPath('/Images/Icon%402x.png'),
      rightIcon: getOssUrlPath('/Images/%26%23127912%20Icon%20%D0%A1olor%402x%20(1).png'),
    },
    // {
    // 	name: intl.formatMessage({ id: 'pay.chongzhijilu', defaultMessage: '充值记录' }),
    // 	icon: getOssUrlPath('/Images/Icon%402x(2).png'),
    // 	rightIcon:
    // 		getOssUrlPath('/Images/%26%23127912%20Icon%20%D0%A1olor%402x%20(1).png'),
    // },
    // {
    // 	name: intl.formatMessage({ id: 'pay.tixianjilu', defaultMessage: '提现记录' }),
    // 	icon: getOssUrlPath('/Images/Icon%402x(1).png'),
    // 	rightIcon:
    // 		getOssUrlPath('/Images/%26%23127912%20Icon%20%D0%A1olor%402x%20(1).png'),
    // },
  ]
  const [recordList, setRecordList] = useState<GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail[]>([])
  const currentPage = useRef<number>(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGESIZE = 8
  const replenishZero = (count: number) => {
    if (count < 10) {
      return `0${count}`
    }
    return count
  }
  usePageInit()

  /**
   * 通联支付交易记录
   */
  const getEAccountTradeRecord = (): Promise<GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const date = new Date()
      const startTime = `${date.getFullYear()}-${replenishZero(date.getMonth() + 1)}-01 00:00:00`
      const endTime = dateFormat(date)
      const param: any = {
        current: currentPage.current,
        pageSize: PAGESIZE,
        startTime,
        endTime,
      }
      getPayMobileEAccountAllInPayGetEAccountTradeRecord(param)
        .then((res) => {
          if (res.code === 1000 && res.data.data) {
            setHasMore(checkMore(currentPage.current, PAGESIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  useEffect(() => {
    if (bizUserId) {
      currentPage.current = 1
      getEAccountTradeRecord().then((res) => {
        setRecordList(res)
      })
    }
  }, [])

  /* 获取资金账户详情 */
  const AccountGet = async () => {
    refreshAccountDetail()
    // if (bizUserId) {
    // 	getPayMobileEAccountAllInPayGetAccountDetail().then((res: any) => {
    // 		if (res.code === 1000) {
    // 			// setAccountDetail({ ...res.data })
    // 		}
    // 	})
    // 	return
    // } else {
    // 	const isSelfMall = shopAndSite?.isSelf
    // 	let fn: any
    // 	if (isSelfMall || (upperMemberId && upperRoleId)) {
    // 		fn = await getPayMobileAssetAccountGetUserAssetAccount
    // 	} else {
    // 		fn = await getPayMobileAssetAccountGetPlatFormAssetAccount
    // 	}
    // 	const data = {
    // 		parentMemberId: upperMemberId || shopAndSite?.memberId,
    // 		parentMemberRoleId: upperRoleId || shopAndSite?.memberRoleId,
    // 	}
    // 	const res = await fn(data)
    // 	if (res.code === 1000) {
    // 		// setAccountDetail({ ...res.data })
    // 	}
    // 	console.log(res, 'res')
    // }
  }
  /* 锁定余额提示 */
  const tip = () => {
    Toast.show({
      title: bizUserId
        ? intl.formatMessage({
            id: 'pay.suodingyueweipingtaidong',
            defaultMessage: '锁定余额为平台冻结金额',
          })
        : intl.formatMessage({
            id: 'pay.suodingyueweiyishenqing',
            defaultMessage: '锁定余额为已申请提现还未到账的金额',
          }),
      icon: 'none',
    })
  }
  /* 跳转过去充值 */
  const handleCharge = () => {
    preload('params', {
      onConfirm: onConfirm,
      bizUserId,
      memberAssetAccountId: accountDetail?.id,
      upperMemberId: upperMemberId ? upperMemberId : '',
      upperRoleId: upperRoleId ? upperRoleId : '',
    })
    Router.navigateTo('basicSetting/accountRecharge')
  }
  const handleOpenBlance = () => {
    showModal({
      title: '请到网页版开通余额账户',
      content: 'www.yuanxiaozhixianfang.com',
      success: (res) => {
        if (res.confirm) {
        }
      },
    })
    // Router.navigateTo('basicSetting/Authentication')
  }
  /* 跳转交易记录 */
  const jumpRecord = (index: number) => {
    Router.navigateTo('basicSetting/tradingRecord', {
      acccountId: accountDetail?.id,
      index,
      upperMemberId: upperMemberId ? upperMemberId : '',
      upperRoleId: upperRoleId ? upperRoleId : '',
    })
  }
  const onConfirm = () => {
    AccountGet()
    if (bizUserId) {
      currentPage.current = 1
      getEAccountTradeRecord().then((res) => {
        setRecordList(res)
      })
    }
  }
  const jumpWithdraw = (isReAuth = false) => {
    if (accountDetail) {
      if (isFinishProcess) {
        preload('params', {
          onConfirm: onConfirm,
          acccountId: accountDetail?.id,
          bizUserId,
          memberId: accountDetail?.memberId,
          memberRoleId: accountDetail?.memberRoleId,
          accountBalance: bizUserId
            ? accountDetail?.usableBalance
            : Number(accountDetail?.accountBalance - accountDetail?.lockBalance).toFixed(2),
          lockBalance: accountDetail?.lockBalance,
          upperMemberId: upperMemberId ? upperMemberId : '',
          upperRoleId: upperRoleId ? upperRoleId : '',
        })
        Router.navigateTo('basicSetting/accountWithdraw')
      } else {
        showModal({
          title: '提示',
          confirmText: '签署协议',
          cancelText: '取消',
          content: '您的账号还没完成账户提现协议签约，请先完成签署。',
          success: async ({ confirm }) => {
            if (!confirm) {
              return
            }
            if (isSelf) {
              const res = await postPayAllInPaySignContract({
                jumpPageType: IS_WEB ? 1 : 2,
                source: 1,
                jumpUrl: 'packages/basicSetting/pages/captialAccount/universal/accountHome/index',
              })

              const signUrl = res.data

              if (IS_WEB) {
                preload('params', {
                  onConfirm: refreshPayMemberInfo,
                  url: signUrl,
                })
                Router.navigateTo('basicSetting/webInfo')
              } else {
                // 小程序环境
                navigateToMiniProgram({
                  appId: 'wxc46c6d2eed27ca0a',
                  path: 'pages/merchantAddress/merchantAddress',
                  extraData: {
                    targetUrl: signUrl,
                  },
                  envVersion: 'release',
                })
              }
            }
            if (isEnterprise) {
              if (memberInfo?.companyName) {
                const result = await postPayAllInPayRegisterCompanyMember({
                  companyName: memberInfo?.companyName,
                  jumpUrl: 'packages/basicSetting/pages/captialAccount/universal/accountHome/index',
                  isReAuth,
                })
                if (result.code === 1000) {
                  preload('params', {
                    onConfirm: refreshPayMemberInfo,
                    url: result.data.regInviteLink,
                  })
                  Router.navigateTo('basicSetting/webInfo')
                } else {
                  showToast({
                    title: result.message,
                    icon: 'error',
                  })
                }
              } else {
                showToast({
                  title: '公司名称不存在',
                  icon: 'error',
                })
              }
            }
          },
        })
      }
    }

    // Router.navigateTo('basicSetting/accountWithdraw', {
    //   acccountId: accountDetail?.id,
    //   memberId: accountDetail?.memberId,
    //   memberRoleId: accountDetail?.memberRoleId,
    //   // accountBalance: accountDetail?.accountBalance,
    //   accountBalance: Number(accountDetail?.accountBalance - accountDetail?.lockBalance).toFixed(2),
    //   lockBalance: accountDetail?.lockBalance,
    //   upperMemberId: upperMemberId ? upperMemberId : '',
    //   upperRoleId: upperRoleId ? upperRoleId : ''
    // });
  }
  const handleLoadMore = () => {
    console.log('handleLoadMore')
    if (loading || !hasMore || !bizUserId) {
      return
    }
    currentPage.current += 1
    getEAccountTradeRecord()
      .then((res) => {
        setRecordList(recordList.concat(res))
      })
      .catch(() => {})
  }

  // const unBindPhone = async () => {
  // 	await postPayAllInPaySendVerificationCode({
  // 		phone: accountDetail?.phone,
  // 		verificationCodeType: 6,
  // 	})
  // 	const { } = await postPayAllInPayUnbindPhone({
  // 		phone: accountDetail?.phone,
  // 		verificationCode: '111111',
  // 	})
  // }
  const renderRecordItem = ({ item }: { item: GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail }) => (
    <View
      className={styles['recordItem']}
      key={item.bizOrderNo}
      onClick={() => {
        preload({
          ...item,
        })
        Router.navigateTo('basicSetting/eAccountRecordDetail')
      }}
    >
      <Image className={styles['recordIcon']} src={getTypeImg(item.tradeType)} />
      <View className={styles['recordInfoWrap']}>
        <View className={styles['recordLine']}>
          <Text className={styles['recordLine_tradeType']}>{item.tradeType}</Text>
          <Text className={styles['recordLine_chgAmount']}>{item.chgAmount}</Text>
        </View>
        <View className={styles['recordLine']}>
          <Text className={styles['recordLine_changeTime']}>{item.changeTime}</Text>
          <Text className={styles['recordLine_type']}>{item.type}</Text>
        </View>
      </View>
    </View>
  )
  const goDetail = () => {
    Router.navigateTo('basicSetting/accountDetail')
  }
  return (
    <ScrollView onScrollToLower={handleLoadMore} scrollY className={styles['AccountDetail']}>
      {accountDetail?.accountStatus === 2 && (
        <NoticeBar>
          {intl.formatMessage({
            id: 'pay.nindezijinzhanghuyibei',
            defaultMessage: '您的资金账户已被所属会员冻结，如有疑问请及时沟通反馈',
          })}
        </NoticeBar>
      )}
      {accountDetail && (
        <View className={styles['warp']}>
          <View className={styles['head']}>
            <View className={styles['head-title']}>
              <View className={styles['head-title-left']} onClick={goDetail}>
                账户信息 &gt;
              </View>
              {/* {isFinishMoneyProcess && (
                <View className={styles['head-title-right']} onClick={() => jumpWithdraw(false)}>
                  {intl.formatMessage({
                    id: 'pay.tixian',
                    defaultMessage: '提现',
                  })}{' '}
                  &gt;
                </View>
              )} */}
            </View>
            <View className={styles['amountContent']}>
              <View className={styles['leftContent']}>
                <View className={styles['leftContentTitle']}>
                  {intl.formatMessage({
                    id: 'pay.shengyukeyongyuan',
                    defaultMessage: '剩余可用(元)',
                  })}
                </View>
                <View className={styles['leftContentAmount']}>
                  {bizUserId
                    ? Number(accountDetail?.usableBalance)
                    : Number(accountDetail?.accountBalance - accountDetail?.lockBalance).toFixed(2)}
                  {/* {`${accountDetail?.accountBalance.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} */}
                </View>
              </View>
              {isFinishMoneyProcess ? (
                <View className={styles['chargeAction']} onClick={handleCharge}>
                  充值
                </View>
              ) : (
                <View className={styles['chargeAction']} onClick={handleOpenBlance}>
                  开通余额账户
                </View>
              )}
            </View>
            <View className={styles['amountBottom']}>
              <View className={styles['bottomCol']}>
                <View className={styles['bottomText']}>
                  {intl.formatMessage({
                    id: 'pay.zhanghuyueyuan',
                    defaultMessage: '账户余额(元)：',
                  })}
                </View>
                <View className={styles['bottomText']}>
                  {`${accountDetail?.accountBalance.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </View>
              </View>
              <View className={styles['bottomCol']}>
                <View className={styles['bottomText']} onClick={tip}>
                  冻结余额(元)：
                  <Image src={getOssUrlPath(`/Images/err%402x.png`)} />
                </View>
                <View className={styles['bottomText']}>
                  {`${accountDetail?.lockBalance.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </View>
              </View>
            </View>
          </View>
          <View className={styles['List']}>
            {
              isFinishMoneyProcess ? (
                <>
                  {/* <View
                   className={styles['List-item']}
                   style={{ marginBottom: pxTransform(8) }}
                   onClick={() => Router.navigateTo('basicSetting/accountInfo')}
                   >
                   <View className={styles['List-item-left']}>
                   <Text>{intl.formatMessage({ id: 'pay.zhanghuxinxi', defaultMessage: '账户信息' })}</Text>
                   </View>
                   <Image
                   className={styles['rightIcon']}
                   src={getOssUrlPath(`/Images/%26%23127912%20Icon%20%D0%A1olor%402x%20(1).png`)}
                   />
                   </View> */}
                  <View className={styles['List-item']}>
                    <View className={styles['List-item-left']}>
                      <Text>
                        {intl.formatMessage({
                          id: 'pay.jiaoyijilu',
                          defaultMessage: '交易记录',
                        })}
                      </Text>
                    </View>
                    <View onClick={() => Router.navigateTo('basicSetting/eAccountRecord')}>
                      <Text className={styles['rightAllText']}>
                        {intl.formatMessage({
                          id: 'pay.quanbu',
                          defaultMessage: '全部',
                        })}
                      </Text>
                      <Image
                        className={styles['rightIcon']}
                        src={getOssUrlPath(`/Images/%26%23127912%20Icon%20%D0%A1olor%402x%20(1).png`)}
                      />
                    </View>
                  </View>
                  <View className={styles['record-scrollView']}>
                    {recordList &&
                      recordList.map((item) =>
                        renderRecordItem({
                          item,
                        }),
                      )}
                  </View>
                </>
              ) : null
              // (
              //   list.map((item: any, index: number) => (
              //     <View className={styles['List-item']} key={index} onClick={() => jumpRecord(index)}>
              //       <View className={styles['List-item-left']}>
              //         <Image className={styles['List-item-left-icon']} src={item.icon} />
              //         <Text>{item.name}</Text>
              //       </View>
              //       <Image className={styles['rightIcon']} src={item.rightIcon} />
              //     </View>
              //   ))
              // )
            }
          </View>
        </View>
      )}
    </ScrollView>
  )
}
export default GlobalWrapper(AccountDetail)
