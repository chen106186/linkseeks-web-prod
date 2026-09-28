import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import cx from 'classnames'
import { View, ScrollView, Text, Button, Input, Toast, Icons } from '@apps/mobile-ui'
import { getCurrentInstance, preload, useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import {
  getPayMobileEAccountAllInPayGetAccountDetail,
  postPayMobileAssetAccountCashOut,
  postPayMobileEAccountAllInPayCashOut,
} from '@apps/apis'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
import { useEAccountMemberInfo } from '@apps/services/eAccount/hooks/useEAccountMemberInfo'
interface RouteParams {
  acccountId: string
  memberId: string
  memberRoleId: string
  accountBalance: number
  lockBalance: number
}
const MAX_WITHDRAW_AMOUNT = 50000
const AccountWithdraw = () => {
  // const { acccountId, memberId, memberRoleId, accountBalance, lockBalance, upperMemberId, upperRoleId }: RouteParams = getCurrentInstance()?.router?.params;
  const {
    params: { acccountId, memberId, memberRoleId, accountBalance, bizUserId, onConfirm },
  }: any = getCurrentInstance()?.preloadData
  const [blankInfo, setBlankInfo] = useState<any>({})
  const [accountDetail, setAccountDetail] = useState<any>()
  const [value, setValue] = useState<string>('')
  const btnState = useRef<boolean>(true)
  const [blank, setBlank] = useState<boolean>(false) // 是否有银行卡数据
  const [disabled, setDisabled] = useState<boolean>(false) // 是否有银行卡数据
  const intl = useIntl()
  const translate = useMobileIntl()
  const { memberInfo } = useEAccountMemberInfo({
    isRefresh: bizUserId ? true : false,
  })

  const bankNo = useMemo(() => {
    return memberInfo?.bankNo || memberInfo?.accountNo || ''
  }, [memberInfo])

  const getAccountInfo = () => {
    FullScreenLoading.show()
    getPayMobileEAccountAllInPayGetAccountDetail().then((res: any) => {
      if (res.code === 1000) {
        setAccountDetail(res.data)
        setBlank(true)
        FullScreenLoading.hide()
      }
    })
  }

  /* 获取提现信息 */
  const getSettleAccount = async () => {
    if (memberId && memberRoleId) {
      FullScreenLoading.show()
      const res = await getSettlementGetMemberAccountConfig({
        memberId,
        roleId: memberRoleId,
      })
      if (res.code === 1000) {
        setBlankInfo(res.data)
        setBlank(true)
        FullScreenLoading.hide()
      } else {
        FullScreenLoading.hide()
      }
    }
  }
  /* 提现 */
  const Withdrawal = async () => {
    if (bizUserId ? !memberInfo : !blankInfo) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingxianbangdingyinhangka',
          defaultMessage: '请先绑定银行卡',
        }),
        icon: 'none',
      })
      return
    }
    if (!value) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshurutixianjine',
          defaultMessage: '请输入提现金额',
        }),
        icon: 'none',
      })
      return
    }
    if (value === '0.00') {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.zanwutixianjine',
          defaultMessage: '暂无提现金额',
        }),
        icon: 'none',
      })
      return
    }
    if (Number(value) > MAX_WITHDRAW_AMOUNT) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.tixianzuidajine',
          defaultMessage: '单笔提现金额最高为50000元',
        }),
        icon: 'none',
      })
      return
    }
    if (Number(value) > Number(accountBalance)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.chaochuzuidajine',
          defaultMessage: '超出最大金额',
        }),
        icon: 'none',
      })
      return
    } else {
      if (!btnState.current) {
        return
      }
      if (bizUserId) {
        if (!bankNo) {
          return
        }
        btnState.current = false
        const data: any = {
          money: value,
          // bankCardNo: bankNo,
        }
        postPayMobileEAccountAllInPayCashOut(data)
          .then((res: any) => {
            if (res.code === 1000) {
              Toast.show({
                title: intl.formatMessage({
                  id: 'pay.tixianchenggong',
                  defaultMessage: '提现成功',
                }),
              })
              if (onConfirm) {
                setTimeout(() => {
                  onConfirm()
                  Router.navigateBack()
                }, 1000)
              }
            } else {
              Toast.show({
                title: intl.formatMessage({
                  id: `${res.code}`,
                  defaultMessage: res.message,
                }),
              })
            }
            btnState.current = true
          })
          .catch(() => {
            btnState.current = true
          })
      } else {
        const data: any = {
          memberAssetAccountId: acccountId,
          money: value,
          bankAccountName: blankInfo?.name,
          bankAccount: blankInfo?.bankAccount,
          bankName: blankInfo?.bankDeposit,
        }
        const res: any = await postPayMobileAssetAccountCashOut(data)
        if (res.code === 1000) {
          Toast.show({
            title: translate('mobile.resource.user.shenqingtixianchenggong'),
          })
          if (onConfirm) {
            onConfirm()
            Router.navigateBack()
          }
        } else {
          Toast.show({
            icon: 'none',
            title: res.message,
          })
        }
      }
    }
  }
  const handleAllWithdraw = () => {
    // const amount = `${(accountBalance * 100 - lockBalance * 100) / 100}`
    setValue(accountBalance)
    setDisabled(Number(accountBalance) > MAX_WITHDRAW_AMOUNT)
  }
  const handleGetBlamkInfo = () => {
    if (bizUserId) {
      getAccountInfo()
    } else {
      getSettleAccount()
    }
  }
  const handleRefresh = () => {
    handleGetBlamkInfo()
  }
  usePageInit()
  const handleBindBlank = () => {
    const param = {
      _id: bizUserId ? accountDetail?.id : blankInfo?.id,
      _name: bizUserId ? accountDetail?.name : blankInfo?.name,
      _bankAccount: bizUserId ? accountDetail?.bankAccount : blankInfo?.bankAccount,
      _bankDeposit: bizUserId ? accountDetail?.bankDeposit : blankInfo?.bankDeposit,
    }
    Router.navigateTo('basicSetting/accountBindBlamk', {
      ...param,
    })
  }
  useDidShow(() => {
    handleRefresh()
  })
  const handleChange = (e) => {
    if (e && (Number(e) > MAX_WITHDRAW_AMOUNT || Number(e) > Number(accountBalance))) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
    setValue(e)
  }
  return (
    <View className={styles['AccountWithdrawWarp']}>
      <FullScreenLoading />
      {/* {!blank && (
        <View className={styles['AccountWithdraw']}>
          <View className={styles['AccountWithdraw-title']}>
            <Text>{intl.formatMessage({ id: 'pay.daozhangyinhangka', defaultMessage: '到账银行卡' })}</Text>
            <Text style={{ color: '#C8CACD' }} onClick={() => handleBindBlank()}>
              {intl.formatMessage({ id: 'pay.dianjibangdingyinhangka', defaultMessage: '点击绑定银行卡' })}{' '}
              <Icons name="ChevronRight" size={10} color="#C8CACD" />
            </Text>
          </View>
        </View>
       )} */}
      <View className={styles['AccountWithdraw']}>
        <View className={styles['AccountWithdraw-title']}>
          <Text>
            {intl.formatMessage({
              id: 'pay.daozhangyinhangka',
              defaultMessage: '到账银行卡',
            })}
          </Text>
          {!bizUserId && (
            <Text className={styles['AccountWithdraw-color']} onClick={() => handleBindBlank()}>
              {intl.formatMessage({
                id: 'pay.modify',
                defaultMessage: '修改',
              })}
            </Text>
          )}
        </View>
        <View className={styles['AccountWithdraw-List']}>
          <View className={styles['AccountWithdraw-List-item']}>
            <View className={styles['AccountWithdraw-List-item-left']}>
              {intl.formatMessage({
                id: 'pay.shoukuanhuming',
                defaultMessage: '收款户名',
              })}
            </View>
            <View className={styles['AccountWithdraw-List-item-right']}>
              {blankInfo?.name || memberInfo?.name || memberInfo?.companyName}
            </View>
          </View>
          <View className={styles['AccountWithdraw-List-item']}>
            <View className={styles['AccountWithdraw-List-item-left']}>
              {intl.formatMessage({
                id: 'pay.shoukuankahao',
                defaultMessage: '收款卡号',
              })}
            </View>
            <View className={styles['AccountWithdraw-List-item-right']}>{blankInfo?.bankAccount || bankNo}</View>
          </View>
          <View className={cx(styles['AccountWithdraw-List-item'], styles['boderNode'])}>
            <View className={styles['AccountWithdraw-List-item-left']}>
              {intl.formatMessage({
                id: 'pay.kaihuyinhang',
                defaultMessage: '开户银行',
              })}
            </View>
            <View className={styles['AccountWithdraw-List-item-right']}>
              {blankInfo?.bankDeposit || memberInfo?.bankName || memberInfo?.accountNo}
            </View>
          </View>
        </View>
      </View>
      <View className={styles['AccountWithdraw']}>
        <View className={styles['AccountWithdraw-title']}>
          {intl.formatMessage({
            id: 'pay.tixianjineyuan',
            defaultMessage: ' 提现金额(元)',
          })}
        </View>
        <View className={styles['AccountWithdraw-List']}>
          <View className={styles['AccountWithdraw-List-item']}>
            <Input
              placeholder={intl.formatMessage({
                id: 'pay.qingshurutixianjine',
                defaultMessage: '请输入提现金额',
              })}
              type="digit"
              value={value}
              onChange={(e: string) => handleChange(e)}
            />
          </View>
          <View className={cx(styles['AccountWithdraw-List-item'], styles['boderNode'])}>
            <View className={styles['AccountWithdraw-List-item-Payleft']}>
              {intl.formatMessage({
                id: 'pay.ketixianyue',
                defaultMessage: ' 可提现余额(元):',
              })}{' '}
              {accountBalance}
            </View>
            <View className={styles['AccountWithdraw-List-item-Payright']} onClick={() => handleAllWithdraw()}>
              {intl.formatMessage({
                id: 'pay.quanbutixian',
                defaultMessage: '全部提现',
              })}
            </View>
          </View>
        </View>
      </View>
      <View className={styles['withdraw-rule']}>
        <Text className={styles['withdraw-rule-title']}>提现规则</Text>
        <ScrollView scrollY className={styles['withdraw-rule-content']}>
          <Text className={styles['withdraw-rule-item']}>
            1. 提现条件：用户需完成账户认证并绑定本人银行卡或企业对公账户。通联电子账户还需完成提现协议签约。
          </Text>
          <Text className={styles['withdraw-rule-item']}>
            2. 提现金额：提现金额须大于0元，单笔提现金额不得超过当前页面显示的可提现余额。单笔最高金额为50000元。
          </Text>
          <Text className={styles['withdraw-rule-item']}>
            3. 提现次数：每日最多可提现20次，具体以平台及支付机构风控限制为准。
          </Text>
          <Text className={styles['withdraw-rule-item']}>4. 提现时间：每日00:00—24:00均可提交提现申请。</Text>
          <Text className={styles['withdraw-rule-item']}>
            5. 审核处理：普通资金账户提交申请后进入平台审核，平台将在3个工作日内完成审核。
          </Text>
          <Text className={styles['withdraw-rule-item']}>
            6.
            到账时间：普通资金账户审核通过后预计7个工作日到账；通联电子账户默认采用D0方式，通常当日发起到账处理。实际到账时间以银行处理结果为准。
          </Text>
          <Text className={styles['withdraw-rule-item']}>
            7. 提现手续费：当前平台不收取提现手续费，银行或支付机构产生的费用以实际提示为准。
          </Text>
          <Text className={styles['withdraw-rule-item']}>
            8.
            温馨提示：提现申请提交成功仅代表申请已受理，不代表资金已经到账。审核不通过或支付失败时，请以系统通知及页面处理结果为准。
          </Text>
        </ScrollView>
      </View>
      <Button type="primary" disabled={!blank || disabled} className={styles['action']} onClick={() => Withdrawal()}>
        {intl.formatMessage({
          id: 'pay.querentixian',
          defaultMessage: '确认提现',
        })}{' '}
      </Button>
    </View>
  )
}
export default GlobalWrapper(AccountWithdraw)
