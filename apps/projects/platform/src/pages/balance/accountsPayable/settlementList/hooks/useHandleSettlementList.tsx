import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
// import StatusTag from '../components/StatusTag';
// import { TO_BE_RECONCILED, TO_BE_PAY, TO_BE_COLLECTED, COMPLETED, PRODUCT_NOTICE_SETTLEMENT_DETAIL, LOGISTICS_DETAIL, ORDER_DETAIL, CONTRACT_FUND_BILL } from '../common/constants';
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import { STATUS_TEXT } from '@/constants/balance'
import React, { useMemo, useState } from 'react'
// import { payStatus } from '../common';
import moment from 'moment'
import {
  COMPLETED,
  CONTRACT_FUND_BILL,
  LOGISTICS_DETAIL,
  ORDER_DETAIL,
  PRODUCT_NOTICE_SETTLEMENT_DETAIL,
  TO_BE_COLLECTED,
  TO_BE_PAY,
  TO_BE_RECONCILED,
  IS_UNIVERSAL_PAY,
} from '@/pages/balance/common/constants'
import { useCallback } from 'react'
import { GetSettlementMemberSettlementPagePayableSettlementResponseDetail } from '@apps/apis'
import { ColumnsType } from 'antd/lib/table'
import { getIntl } from '@linkseeks/i18n'
// import { getPayAllInPayGetUserInfo, postPayAllInPayGetUserInfo } from '@apps/apis'
import { message } from 'antd'
import { authService } from '@apps/services'
const intl = getIntl()
const format = 'YYYY-MM-DD'
// const URL_MAP = {
//   [PRODUCT_NOTICE_SETTLEMENT_DETAIL]: "productNoticeSettlementDetail",
//   [LOGISTICS_DETAIL]: "logisticsDetail",
//   [ORDER_DETAIL]: "orderDetail",
//   [CONTRACT_FUND_BILL]: '',
// }

const STATUS_COLOR = ['default', 'warning', 'primary', 'danger', 'success']

/** 通联支付 个人会员 */
const USER_MEMBER_TYPE = 3

/** 通联支付企业会员 */
const ENTERPRISE_MERBER_TYPE = 2

/** 通联支付 未认证提示 */
const BALANCE_UNVERIFY_TIPS = {
  [USER_MEMBER_TYPE]: '该结算方会员未进行通联实名认证，暂不可收款',
  [ENTERPRISE_MERBER_TYPE]: '该结算方会员暂未完成企业信息审核，暂不可收款；',
}
/** 付款方 */
const PAY_UNVERIFY_TIPS = {
  [USER_MEMBER_TYPE]: '该会员未进行通联实名认证，暂不可收款',
  [ENTERPRISE_MERBER_TYPE]: '该会员暂未完成企业信息审核，暂不可收款；',
}

type ModalsType = {
  /** 查看付款 */
  viewPay: boolean
  /** 查看通联支付 */
  viewUniversalPay: boolean
  /** 手动结算 */
  manualSettlement: boolean
  /** 上传付款凭证 */
  uploadPayVoucher: boolean
  /** 通联支付付款 */
  universalPay: boolean
  /** 二维码 */
  qrcodeModal: boolean
  /** 获取短信验证码 */
  smsCodeModal: boolean
  /** 网银支付，标志位，没有弹窗 */
  unionPay: boolean
}

function useHandleSettlementList() {
  const auth = authService.getAuth()
  const [itemInfo, setItemInfo] = useState<GetSettlementMemberSettlementPagePayableSettlementResponseDetail | null>(
    null,
  )
  const [modals, setModals] = useState<ModalsType>({
    viewPay: false,
    viewUniversalPay: false,
    manualSettlement: false,
    uploadPayVoucher: false,
    universalPay: false,
    qrcodeModal: false,
    smsCodeModal: false,
    unionPay: false,
  })

  /** 这里不对其他key 做限制，即可存在多个为true的时候 */
  const handleOpen = useCallback((key: keyof ModalsType) => {
    setModals((prev) => ({
      ...prev,
      [key]: true,
    }))
  }, [])

  const handleClose = useCallback((key: keyof ModalsType) => {
    setModals((prev) => ({
      ...prev,
      [key]: false,
      unionPay: false,
    }))
  }, [])

  const valifyUser = async (params: { memberRoleId: number; memberId: number }, mode: 'balance' | 'pay') => {
    // const { code, data, message: msg } = await postPayAllInPayGetUserInfo(params, { ctlType: 'none' })
    // if (code !== 1000) {
    //   message.error(msg)
    //   return false
    // }

    // const tips = mode === 'balance' ? BALANCE_UNVERIFY_TIPS : PAY_UNVERIFY_TIPS
    // if (
    //   !(
    //     (data.memberType === USER_MEMBER_TYPE && data.isIdentityChecked === 1) ||
    //     (data.memberType === ENTERPRISE_MERBER_TYPE && data.status === 2)
    //   )
    // ) {
    //   message.error(tips[data.memberType])
    //   return false
    // }
    return true
  }

  const handleAction = async (
    record: GetSettlementMemberSettlementPagePayableSettlementResponseDetail,
    key: keyof ModalsType,
  ) => {
    setItemInfo(record)
    if (key === 'universalPay') {
      const res = await valifyUser(
        {
          memberId: record.memberId,
          memberRoleId: record.roleId,
        },
        'balance',
      )

      // 结算方没验证
      if (!res) {
        return
      }
      const payRes = await valifyUser(
        {
          memberId: auth.memberId,
          memberRoleId: auth.memberRoleId,
        },
        'pay',
      )
      // 付款方没验证
      if (!payRes) {
        return
      }
    }

    handleOpen(key)
    /** 通联支付 */
    // if (record.payWay === 2 && record.status === COMPLETED) {
    //   handleOpen('viewUniversalPay');
    //   return;
    // }

    // const KEY_MAP = {
    //   [TO_BE_RECONCILED]: 'confirmReconciliation',
    //   [TO_BE_COLLECTED]: 'confirmPay',
    //   [COMPLETED]: 'viewPay'
    // }
    // handleOpen(KEY_MAP[record.status])
  }

  const columns: ColumnsType<GetSettlementMemberSettlementPagePayableSettlementResponseDetail> = [
    {
      title: intl.formatMessage({ id: 'balance.jiesuandanhao' }),
      dataIndex: 'settlementNo',
      render: (text, record) => {
        // const prefix = `/balance/accountsPayable/settlementList/` ;
        // const url = URL_MAP[record.orderType];
        let fullUrl = ``
        switch (record.orderType) {
          // 生产单
          case 1:
            fullUrl = `/balance/accountsPayable/settlementList/productNoticeSettlementDetail?id=${record.id}`
            break
          // 物流单
          case 2:
            fullUrl = `/balance/accountsPayable/settlementList/logisticsDetail?id=${record.id}`
            break
          // 订单
          case 3:
          case 4:
            fullUrl = `/balance/accountsPayable/settlementList/orderDetail?id=${record.id}`
            break
          // 退货
          case 5:
            fullUrl = `/afterAbility/returnManage/returnQuery/detail?id=${record.orderId}`
            break
          // 请款单
          case 6:
          case 7:
            fullUrl = `/balance/businessRequestFunds/search/detail?id=${record.orderId}&no=${record.orderNo}`
            break
          default:
            break
        }
        // if(record.orderType === CONTRACT_FUND_BILL) {
        //   fullUrl = `/contract/funds/bill/detail?applyId=${record.orderId}`;
        // }
        return <EyeAuthButton url={fullUrl}>{record.settlementNo}</EyeAuthButton>
      },
    },
    { title: intl.formatMessage({ id: 'balance.jiesuanfangshi' }), dataIndex: 'settlementWayName' },
    { title: intl.formatMessage({ id: 'balance.jiesuanfang' }), dataIndex: 'settlementName' },
    {
      title: intl.formatMessage({ id: 'balance.jiesuandanju' }),
      dataIndex: 'orderTypeName',
      filters: [
        {
          text: intl.formatMessage({ id: 'balance.shengchantongzhidan' }),
          value: 1,
        },
        {
          text: intl.formatMessage({ id: 'balance.wuliudan' }),
          value: 2,
        },
        {
          text: intl.formatMessage({ id: 'balance.dingdan' }),
          value: 3,
        },
        {
          text: intl.formatMessage({ id: 'balance.qingkuandan' }),
          value: 6,
        },
      ],
      onFilter: (value: number, record: any) => record.orderType === value,
    },
    {
      title: intl.formatMessage({ id: 'balance.jiesuanjine' }),
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (text, record) => {
        return <div>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(record.amount)}`}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.zongdanshu' }),
      dataIndex: 'totalCount',
      sorter: (a, b) => a.totalCount - b.totalCount,
    },
    {
      title: intl.formatMessage({ id: 'balance.jiesuanriqi' }),
      dataIndex: 'settlementDate',
      sorter: (a, b) => moment(a.settlementDate, format).valueOf() - moment(b.settlementDate, format).valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'balance.yujifukuanriqi' }),
      dataIndex: 'prePayTime',
      sorter: (a, b) => moment(a.prePayTime, format).valueOf() - moment(b.prePayTime, format).valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'balance.shijifukuanshijian' }),
      dataIndex: 'payTime',
      sorter: (a, b) =>
        moment(a.payTime, 'YYYY-MM-DD HH:mm:ss').valueOf() - moment(b.payTime, 'YYYY-MM-DD HH:mm:ss').valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'balance.batch.export.btn' }),
      dataIndex: 'exportFlagName',
      filters: [
        {
          text: intl.formatMessage({ id: 'balance.yidaochu' }),
          value: 1,
        },
        {
          text: intl.formatMessage({ id: 'balance.weidaochu' }),
          value: 0,
        },
      ],
      onFilter: (value: number, record: any) => record.exportFlag === value,
    },
    {
      title: intl.formatMessage({ id: 'balance.jiesuanzhuangtai' }),
      dataIndex: 'status',
      // filters: payStatus,
      // onFilter: (value: number, record: any) => record.status == value,
      render: (text: string, record: any) => {
        return <StatusTag type={STATUS_COLOR[record.status] as 'success'} title={record.statusName} />
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.zhifufangshi' }),
      dataIndex: 'payWayName',
      // filters: [
      //   {
      //     text: '线上支付',
      //     value: 1,
      //   },
      //   {
      //     text: '线下转账线上确认',
      //     value: 2,
      //   },
      //   {
      //     text: '授信',
      //     value: 3,
      //   },
      //   {
      //     text: '货到付款',
      //     value: 4
      //   }
      // ],
      // onFilter: (value: number, record: any) => record.payWay === value,
    },
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      render: (text: string, record: any) => {
        const isUniversalPay = record.payWay === IS_UNIVERSAL_PAY
        // 待对账的时候可以手动结算
        if (record.status === TO_BE_RECONCILED) {
          if (record.orderType !== CONTRACT_FUND_BILL) {
            return (
              <a onClick={() => handleAction(record, 'manualSettlement')}>
                {intl.formatMessage({ id: 'balance.shoudongjiesuan' })}
              </a>
            )
          }
          return null
        }
        if (record.status === TO_BE_PAY) {
          return (
            <a onClick={() => handleAction(record, isUniversalPay ? 'universalPay' : 'uploadPayVoucher')}>
              {intl.formatMessage({ id: 'balance.fukuan' })}
            </a>
          )
        }
        return (
          <a onClick={() => handleAction(record, isUniversalPay ? 'viewUniversalPay' : 'viewPay')}>
            {intl.formatMessage({ id: 'balance.zhakanfukuanpingzheng' })}
          </a>
        )
      },
    },
  ]

  const cacheItemInfo = useMemo(() => itemInfo, [itemInfo])

  return {
    columns,
    handleOpen,
    handleClose,
    itemInfo: cacheItemInfo,
    modals,
  }
}

export default useHandleSettlementList
