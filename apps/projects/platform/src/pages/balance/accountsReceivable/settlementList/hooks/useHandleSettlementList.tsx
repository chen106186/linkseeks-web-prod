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
  TO_BE_RECONCILED,
} from '@/pages/balance/common/constants'
import { useCallback } from 'react'
import { GetSettlementMemberSettlementPageReceivableSettlementResponseDetail } from '@apps/apis'
import { ColumnsType } from 'antd/lib/table'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const format = 'YYYY-MM-DD'
// const URL_MAP = {
//   [PRODUCT_NOTICE_SETTLEMENT_DETAIL]: "productNoticeSettlementDetail",
//   [LOGISTICS_DETAIL]: "logisticsDetail",
//   [ORDER_DETAIL]: "orderDetail",
//   [CONTRACT_FUND_BILL]: '',
// }

const KEY_MAP_TEXT = {
  [TO_BE_RECONCILED]: intl.formatMessage({ id: 'balance.querenduizhangwancheng' }),
  [TO_BE_COLLECTED]: intl.formatMessage({ id: 'balance.querenfukuanpingzheng' }),
  [COMPLETED]: intl.formatMessage({ id: 'balance.zhakanfukuanpingzheng' }),
}

const STATUS_COLOR = ['default', 'warning', 'primary', 'danger', 'success']

type ModalsType = {
  /**确认对账 */
  confirmReconciliation: boolean
  /** 确认付款凭证 */
  confirmPay: boolean
  /** 查看付款 */
  viewPay: boolean
  /** 查看通联支付 */
  viewUniversalPay: boolean
}

function useHandleSettlementList() {
  const [itemInfo, setItemInfo] = useState<GetSettlementMemberSettlementPageReceivableSettlementResponseDetail>([])
  const [modals, setModals] = useState<ModalsType>({
    confirmReconciliation: false,
    confirmPay: false,
    viewPay: false,
    viewUniversalPay: false,
  })

  const handleOpen = useCallback((key: keyof ModalsType) => {
    setModals({
      ...modals,
      [key]: true,
    })
  }, [])

  const handleClose = useCallback((key: keyof ModalsType) => {
    setModals({
      ...modals,
      [key]: false,
    })
  }, [])

  const handleAction = (record: GetSettlementMemberSettlementPageReceivableSettlementResponseDetail) => {
    setItemInfo(record)
    /** 通联支付 */
    if (record.payWay === 2 && record.status === COMPLETED) {
      handleOpen('viewUniversalPay')
      return
    }

    const KEY_MAP = {
      [TO_BE_RECONCILED]: 'confirmReconciliation',
      [TO_BE_COLLECTED]: 'confirmPay',
      [COMPLETED]: 'viewPay',
    }
    handleOpen(KEY_MAP[record.status])
  }

  const columns: ColumnsType<GetSettlementMemberSettlementPageReceivableSettlementResponseDetail> = [
    {
      title: intl.formatMessage({ id: 'balance.jiesuandanhao' }),
      dataIndex: 'settlementNo',
      width: 200,
      render: (text, record) => {
        // const prefix = '/balance/accountsReceivable/settlementList/';
        // const url = URL_MAP[record.orderType];
        let fullUrl = ``
        switch (record.orderType) {
          // 生产单
          case 1:
            fullUrl = `/balance/accountsReceivable/settlementList/productNoticeSettlementDetail?id=${record.id}`
            break
          // 物流单
          case 2:
            fullUrl = `/balance/accountsReceivable/settlementList/logisticsDetail?id=${record.id}`
            break
          // 订单
          case 3:
          case 4:
            fullUrl = `/balance/accountsReceivable/settlementList/orderDetail?id=${record.id}`
            break
          // 退货
          case 5:
            fullUrl = `/afterAbility/returnManage/returnQuery/detail?id=${record.orderId}`
            break
          // 请款单
          case 6:
          case 7:
            fullUrl = `/balance/businessRequestFundsCollaboration/search/detail?id=${record.orderId}&no=${record.orderNo}`
            break
          default:
            break
        }
        // if(record.orderType === CONTRACT_FUND_BILL) {
        //   fullUrl = `/contract/funds/bill/detail?applyId=${record.orderId}`;
        // }
        console.log(fullUrl, 'fullUrl')
        return <EyeAuthButton url={fullUrl}>{record.settlementNo}</EyeAuthButton>
      },
    },
    { title: intl.formatMessage({ id: 'balance.jiesuanfangshi' }), dataIndex: 'settlementWayName' },
    { title: intl.formatMessage({ id: 'balance.fukuanfang' }), dataIndex: 'payName' },
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
      render: (text: string, record: GetSettlementMemberSettlementPageReceivableSettlementResponseDetail) => {
        return <StatusTag type={STATUS_COLOR[record.status] as 'success'} title={record.statusName} />
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.zhifufangshi' }),
      dataIndex: 'payWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      fixed: 'right',
      render: (text: string, record: GetSettlementMemberSettlementPageReceivableSettlementResponseDetail) => {
        const keyText = KEY_MAP_TEXT[record.status]
        return <a onClick={() => handleAction(record)}>{keyText}</a>
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
