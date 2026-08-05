import React, { useCallback, useMemo } from 'react'
import { useIntl, getIntl } from '@linkseeks/i18n'
import settlement_platformCollection from '@/assets/imgs/settlement_platformCollection.png'
import settlement_integrate from '@/assets/imgs/settlement_integrate.png'
import settlement_accountReceive from '@/assets/imgs/settlement_accountReceive.png'
import settlement_accountPayable from '@/assets/imgs/settlement_accountPayable.png'
import settlement_invoice from '@/assets/imgs/settlement_invoice.png'
import settlement_invoiceCoordination from '@/assets/imgs/settlement_integrate.png'
import settlement_businessRequest from '@/assets/imgs/settlement_invoice.png'
import settlement_businessReconciliation from '@/assets/imgs/settlement_accountReceive.png'
import settlement_coordination from '@/assets/imgs/settlement_accountPayable.png'
import useViewRequest from '../../hooks/useViewRequest'
import { getSettlementReportGetSettlement, GetSettlementReportGetSettlementResponse } from '@apps/apis'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'
import { getEnableMultiTenancy } from '@/utils/auth'
import useCovert from '../../hooks/useCovert'
import { useWebIntl } from '@apps/locales'

interface Iprops {}

const KEY_TITLE = {
  payableList: getIntl().formatMessage({ id: 'home.settlementCenter.payableList', defaultMessage: '应付账款结算' }),
  platformList: getIntl().formatMessage({
    id: 'home.settlementCenter.platformList',
    defaultMessage: '平台代收账款结算',
  }),
  platformScoreList: getIntl().formatMessage({
    id: 'home.settlementCenter.platformScoreList',
    defaultMessage: '平台积分结算',
  }),
  receivableList: getIntl().formatMessage({
    id: 'home.settlementCenter.receivableList',
    defaultMessage: '应收账款结算',
  }),
  billingManagementList: getIntl().formatMessage({ id: 'home.kaipiaoguanli', defaultMessage: '开票管理' }),
  invoiceCoordinationList: getIntl().formatMessage({ id: 'home.fapiaoxietong', defaultMessage: '发票协同' }),
  businessReconciliationList: getIntl().formatMessage({ id: 'home.yewuduizhang', defaultMessage: '业务对账' }),
  businessReconciliationCollaborationList: getIntl().formatMessage({
    id: 'home.yewuduizhangxietong',
    defaultMessage: '业务对账协同',
  }),
  businessRequestList: getIntl().formatMessage({ id: 'home.yewuqingkuan', defaultMessage: '业务请款' }),
  platformCouponSettlementList: getIntl().formatMessage({
    id: 'home.pingtaiyouhuiquanjiesuan',
    defaultMessage: '平台优惠券结算',
  }),
}

// 结算中心：根据当前用户+当前角色是否有此结算能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 1、平台代收款结算：判断当前用户是否有平台代收账款结算权限，有则显示平台代收款结算按钮与图标，点击跳转支付能力-平台结算管理-平台代收账款结算
// 2、平台积分结算：判断当前用户是否有平台积分结算权限，有则显示平台积分结算按钮与图标，点击跳转支付能力-平台结算管理--平台积分结算
// 3、应收账款结算：判断当前用户是否有应收账款结算权限，有则显示应收账款结算按钮与图标，点击跳转支付能力-应收账款管理-应收账款结算
// 4、应付账款结算：判断当前用户是否有应付账款结算权限，有则显示应付账款结算按钮与图标，点击跳转支付能力-应付账款管理-应付账款结算
// 5、开票管理：判断当前用户是否有开票管理权限，有则显示开票管理按钮与图标，点击跳转支付能力-应收账款管理-开票管理

export enum RoleEnum {
  /** 1： 供应商 */
  Supplier = 1,
  /** 2： 采购商 */
  Purchaser = 2,
}

const SettlementCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref } = useViewRequest<
    GetSettlementReportGetSettlementResponse,
    any
  >(getSettlementReportGetSettlement as any, {})
  const intl = useIntl()
  const { hasAbilityFunc, userAuth, authUrlList } = useGetAuth()
  const { convertUrl } = useCovert()
  const { memberRoleType } = userAuth
  const hasAbility = hasAbilityFunc('balance')
  const enableMultiTenancy = useMemo(() => getEnableMultiTenancy(), [])
  const translate = useWebIntl()
  /** 如果开启了多用户， 那么过滤掉平台积分结算， 平台代收账款结算 */
  const tagsList = useMemo(() => {
    return [
      {
        icon: settlement_platformCollection,
        title: intl.formatMessage({ id: 'home.settlementCenter.title1' }),
        url: '/balance/platformSettlement/accountReceivable',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_integrate,
        title: intl.formatMessage({ id: 'home.settlementCenter.title2' }),
        url: '/balance/platformSettlement/integral',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_businessReconciliation,
        title: intl.formatMessage({ id: 'home.yewuduizhang' }),
        url: '/balance/businessReconciliation/readyReconciliation',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_coordination,
        title: intl.formatMessage({ id: 'home.yewuduizhangxietong' }),
        url: '/balance/businessReconciliationCollaboration/search',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_businessRequest,
        title: intl.formatMessage({ id: 'home.yewuqingkuan' }),
        url: '/balance/businessRequestFunds/search',
        enableMulti: enableMultiTenancy ?? false,
      },
      ...(memberRoleType === RoleEnum.Purchaser
        ? [
            {
              icon: settlement_invoice,
              title: translate('web.resource.invoice.invoiceManager'),
              url: '/balance/invoice/ready',
              enableMulti: enableMultiTenancy ?? false,
            },
          ]
        : [
            {
              icon: settlement_invoice,
              title: translate('web.resource.invoice.invoiceManager'),
              url: '/balance/invoice/list',
              enableMulti: enableMultiTenancy ?? false,
            },
          ]),
      {
        icon: settlement_invoiceCoordination,
        title: translate('web.resource.invoice.xietong'),
        url: '/balance/invoiceJoint/list',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_accountReceive,
        title: translate('web.resource.invoice.yinshouzhangkuangjiesuan'),
        url: '/balance/accountsReceivable/settlementList',
        enableMulti: enableMultiTenancy ?? false,
      },
      {
        icon: settlement_accountPayable,
        title: intl.formatMessage({ id: 'home.settlementCenter.title4' }),
        url: '/balance/accountsPayable/settlementList',
        enableMulti: enableMultiTenancy ?? false,
      },
    ].filter((_item) => authUrlList?.includes(_item.url) && !_item.enableMulti)
  }, [userAuth, memberRoleType])

  /** @review 搜索状态值拼接到链接上，后端不做交给了前端。坑啊 */
  const withParamsList = useMemo(() => {
    const status = {
      待对账: 'status=1',
      待付款: 'status=2',
      待收款: 'status=3',
      已完成: 'status=4',
    }
    return {
      platformList: status,
      platformScoreList: status,
      payableList: status,
      receivableList: {
        ...status,
        待开票: 'invoiceStatus=0',
      },
    }
  }, [])

  const linkMap = {
    platformList: {
      待对账: '/balance/platformSettlement/accountReceivable',
      待付款: '/balance/platformSettlement/accountReceivable',
      待收款: '/balance/platformSettlement/accountReceivable',
      已完成: '/balance/platformSettlement/accountReceivable',
    },
    platformScoreList: {
      待对账: '/balance/platformSettlement/integral',
      待付款: '/balance/platformSettlement/integral',
      待收款: '/balance/platformSettlement/integral',
      已完成: '/balance/platformSettlement/integral',
    },
    payableList: {
      待对账: '/balance/accountsPayable/settlementList',
      待付款: '/balance/accountsPayable/settlementList',
      待收款: '/balance/accountsPayable/settlementList',
      已完成: '/balance/accountsPayable/settlementList',
    },
    receivableList: {
      待对账: '/balance/accountsReceivable/settlementList',
      待付款: '/balance/accountsReceivable/settlementList',
      待收款: '/balance/accountsReceivable/settlementList',
      已完成: '/balance/accountsReceivable/settlementList',
      待开票: '/balance/accountsReceivable/settlementList',
    },
    billingManagementList: {
      '待开票（SRM）': '/balance/invoice/ready',
      '待开票（B2B）': '/balance/invoice/list',
      待提交开票: '/balance/invoice/manage',
    },
    invoiceCoordinationList: {
      待确认发票: '/balance/invoiceJoint/list',
    },
    businessReconciliationList: {
      待对账: '/balance/businessReconciliation/readyReconciliation',
      待提交对账单: '/balance/businessReconciliation/readyAdd',
    },
    businessReconciliationCollaborationList: {
      待确认对账: '/balance/businessReconciliationCollaboration/readyConfirm',
      待请款: '/balance/businessReconciliationCollaboration/readyPay',
    },
    businessRequestList: {
      待处理请款单: '/balance/businessRequestFunds/admin',
      '待审核请款单 (一级)': '/balance/businessRequestFunds/one',
      '待审核请款单 (二级)': '/balance/businessRequestFunds/two',
      待提交请款单: '/balance/businessRequestFunds/submit',
    },
    platformCouponSettlementList: {
      待确认对账: '/balance/platformSettlement/couponSettlement',
      待确认收款: '/balance/platformSettlement/couponSettlement',
    },
  }

  const withQueryParams = useCallback(() => {
    if (!responseData) return {}
    const newData = responseData
    Object.keys(withParamsList).forEach((_item) => {
      const target = newData?.[_item]
      if (target) {
        newData[_item] = target.map((_row) => {
          if (withParamsList?.[_item]?.[_row.name]) {
            return {
              ..._row,
              link: `${_row.link}?${withParamsList[_item][_row.name]}`,
            }
          }

          return _row
        })
      }
    })

    return newData
  }, [responseData])

  const withSearchStatusData = useMemo(() => withQueryParams(), [responseData])
  /** 如果开启了多用户， 那么过滤掉平台积分结算， 平台代收账款结算 */
  const filterMultiTenancy = enableMultiTenancy
    ? { payableList: withSearchStatusData['payableList'], receivableList: withSearchStatusData['receivableList'] }
    : withSearchStatusData

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.settlementCenter.layoutTitle', defaultMessage: '结算中心' })}
      tips={intl.formatMessage({
        id: 'home.settlementCenter.layoutTips',
        defaultMessage: '提供资资金结算、发票管理等功能',
      })}
      loading={loading}
      isError={isError}
    >
      <>
        <Layout.Tag tagList={tagsList} />
        <Layout.StaticsDataList title={KEY_TITLE} dataSource={filterMultiTenancy} />
      </>
    </Layout>
  )
}

export default SettlementCenter
