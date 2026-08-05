import React, { useMemo, useState } from 'react'
import { EyeAuthButton, AuthButton } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import { useCallback } from 'react'
import type { GetSettlementPlatformSettlementPagePayableSettlementResponseDetail } from '@apps/apis'

const STATUS_COLOR = ['default', 'warning', 'primary', 'danger', 'success']

const STATUS_TEXT = {
  1: '待对账',
  2: '待付款',
  3: '待收款',
  4: '已完成',
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
}

function useHandleSettlementList() {
  const [itemInfo, setItemInfo] = useState<GetSettlementPlatformSettlementPagePayableSettlementResponseDetail | null>(
    null,
  )
  const [modals, setModals] = useState<ModalsType>({
    viewPay: false,
    viewUniversalPay: false,
    manualSettlement: false,
    uploadPayVoucher: false,
    universalPay: false,
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

  const handleAction = (
    record: GetSettlementPlatformSettlementPagePayableSettlementResponseDetail,
    key: keyof ModalsType,
  ) => {
    setItemInfo(record)
    console.log('key', key)
    handleOpen(key)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '结算单号',
      key: 'settlementNo',
      fixed: 'left',
      width: 180,
      searchField: {
        type: 'Input',
        title: '结算单号',
        name: 'settlementNo',
        placeholder: '请输入结算单号',
      },
      render: (text, record) => {
        const url = `/settlementManage/platformSettlement/accountPayable/detail?id=${record.id}`
        return <EyeAuthButton url={url}>{text}</EyeAuthButton>
      },
    },
    {
      title: '结算日期',
      key: 'settlementDate',
      searchField: {
        type: 'DateRange',
        title: '结算日期',
        name: ['startTime', 'endTime'],
        placeholder: ['结算日期（开始时间）', '结算日期（结束时间）'],
      },
    },
    { title: '结算方式', key: 'settlementWayName' },
    {
      title: '结算方',
      key: 'settlementName',
      searchField: {
        main: true,
      },
    },
    { title: '总单数', key: 'totalCount' },
    {
      title: '代收金额',
      key: 'collectAmount',
      render: (text) => `￥${priceFormat(text)}`,
    },
    {
      title: '佣金',
      key: 'brokerage',
      render: (text) => `￥${priceFormat(text)}`,
    },
    {
      title: '分销订单佣金',
      key: 'socialDistributionAmount',
      render: (text) => `￥${priceFormat(text)}`,
    },
    {
      title: '团购订单佣金',
      key: 'communityGroupBuyingAmount',
      render: (text) => `￥${priceFormat(text)}`,
    },
    {
      title: '结算金额',
      key: 'amount',
      render: (text) => `￥${priceFormat(text)}`,
    },
    { title: '支付方式', key: 'payWayName' },
    { title: '预计付款日期', key: 'estimatedPaymentDate' },
    { title: '实际付款时间', key: 'payTime' },
    {
      title: '结算状态',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          { label: '结算状态（所有）', value: 0 },
          { label: '待对账', value: 1 },
          { label: '待付款', value: 2 },
          { label: '待收款', value: 3 },
          { label: '已完成', value: 4 },
        ],
      },
      // filters: payStatus,
      // onFilter: (value: number, record: any) => record.status == value,
      fixed: 'right',
      render: (text: string, record: any) => {
        return <StatusTag type={STATUS_COLOR[record.status] as 'success'} title={STATUS_TEXT[record.status]} />
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: string, record: any) => {
        const isUniversalPay = record.payWay === 2
        // 待对账的时候可以手动结算
        // if (record.status === 1) {
        //   return (
        //     <AuthButton type="custom" code="manualSettlement">
        //       <a onClick={() => handleAction(record, 'manualSettlement')}>手动结算</a>
        //     </AuthButton>
        //   )
        // }
        if (record.status === 2) {
          return (
            <AuthButton type="custom" code="pay">
              <a onClick={() => handleAction(record, isUniversalPay ? 'universalPay' : 'uploadPayVoucher')}>付款</a>
            </AuthButton>
          )
        }
        if (record.status === 3 || record.status === 4) {
          return (
            <AuthButton type="custom" code="viewPay">
              <a onClick={() => handleAction(record, isUniversalPay ? 'viewUniversalPay' : 'viewPay')}>查看付款凭证</a>
            </AuthButton>
          )
        }
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
