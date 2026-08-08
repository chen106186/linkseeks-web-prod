import React, { useMemo } from 'react'
import settlement_platformCollection from '@/assets/imgs/settlement_platformCollection.png'
import settlement_integrate from '@/assets/imgs/settlement_integrate.png'
import settlement_accountReceive from '@/assets/imgs/settlement_accountReceive.png'
import settlement_accountPayable from '@/assets/imgs/settlement_accountPayable.png'
import { useIntl, getIntl } from '@linkseeks/i18n'
import useViewRequest from '../../hooks/useViewRequest'
import Layout, { IDataListProps } from './layout'
import { getPayReportGetPay, GetPayReportGetPayResponse } from '@apps/apis'
import useGetAuth from '../../hooks/useGetAuth'
import useCovert from '../../hooks/useCovert'
interface Iprops {}

const KEY_TO_TITLE = {
  creditList: getIntl().formatMessage({ id: 'home.fundCenter.creditList' }),
  accountList: getIntl().formatMessage({ id: 'home.fundCenter.accountList' }),
}
// 资金账户管理中心：根据当前用户+当前角色是否有此支付能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 1、资金账户：判断当前用户是否有账户管理权限，有则显示资金账户按钮与图标，点击跳转能力中心-支付能力-资金账户-账户管理
// 2、授信账户：判断当前用户是否有授信额度管理权限，有则显示授信账户按钮与图标，点击跳转能力中心-支付能力-授信申请-授信额度管理
// 3、资金账户管理：判断当前用户是否有资金账户管理权限，有则显示资金账户管理按钮与图标，点击跳转能力中心-支付能力-资金账户管理-会员账户管理
// 4、授信管理：判断当前用户是否有授信额度管理权限，有则显示授信管理按钮与图标，点击跳转能力中心-支付能力-授信处理-授信额度管理

const FundCenter: React.FC<Iprops> = () => {
  const { loading, filterEmptyList, responseData, ref } = useViewRequest<GetPayReportGetPayResponse, any>(
    getPayReportGetPay as any,
    {},
  )
  const { convertUrl } = useCovert()
  const intl = useIntl()
  const { hasAbilityFunc, userAuth, authUrlList } = useGetAuth()
  const hasAbility = hasAbilityFunc('payandSettle')
  // 在tagList 做修改过滤
  const tagsList = useMemo(() => {
    const list = [
      {
        icon: settlement_platformCollection,
        title: intl.formatMessage({ id: 'home.fundCenter.title1', defaultMessage: '资金账户' }),
        url: '/payandSettle/capitalAccounts/accountLists',
      },
      {
        icon: settlement_integrate,
        title: intl.formatMessage({ id: 'home.fundCenter.title2', defaultMessage: '授信账户' }),
        url: '/payandSettle/creditApplication/quotaMenage',
      },
      {
        icon: settlement_accountReceive,
        title: intl.formatMessage({ id: 'home.fundCenter.title3', defaultMessage: '资金账户管理' }),
        url: '/payandSettle/amountAccountManage/memberAccountManage',
      },
      {
        icon: settlement_accountPayable,
        title: intl.formatMessage({ id: 'home.fundCenter.title4', defaultMessage: '授信管理' }),
        url: '/payandSettle/creditManage/quotaMenage',
      },
    ].filter((_item) => authUrlList?.includes(_item.url))
    return list
  }, [userAuth])

  const linkMap = {
    待审核提现: '/payandSettle/amountAccountManage/checkWithdraw',
    待支付提现: '/payandSettle/amountAccountManage/paymentWithdraw',
    待提交审核授信申请单: '/payandSettle/creditApplication/quotaPrSubmit',
    '待审核授信申请单（一级）': '/payandSettle/creditManage/quotaPr1',
    '待审核授信申请单（二级）': '/payandSettle/creditManage/quotaPr2',
    '待审核授信申请单（三级）': '/payandSettle/creditManage/quotaPr3',
    待确认授信申请单: '/payandSettle/creditManage/quotaPrConfirm',
  }

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.fundCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.fundCenter.layoutTips' })}
      loading={loading}
    >
      <>
        <Layout.Tag tagList={tagsList} />
        <Layout.StaticsDataList
          title={KEY_TO_TITLE}
          dataSource={responseData as unknown as IDataListProps['dataSource']}
        />
      </>
    </Layout>
  )
}

export default FundCenter
