import React, { useRef, useState, useMemo, useEffect } from 'react'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { Card, Radio } from 'antd'

import {
  getProductCommodityPlatformGetCommodityCheckRecordList,
  getTradeGetInquiryExternalRecordList,
  getTradeGetInquiryInteriorRecordList,
  getPurchasePurchaseInquiryGetInquiryExternalRecordList,
  getPurchasePurchaseInquiryGetInquiryInteriorRecordList,
  getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecordList,
  getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecordList,
  postAftersalesOperateLogOuterPage,
  postAftersalesOperateLogInnerPage,
  getOrderPlatformHistoryOuterPage,
  getOrderPlatformHistoryInnerPage,
  getMemberHistoryOuterPage,
  getMemberHistoryInnerPage,
  postContractOperateLogOuterPage,
  postContractOperateLogInnerPage,
  postMarketingOperateLogOuterPage,
  postMarketingOperateLogInnerPage,
} from '@apps/apis'

import { formatTimeString } from '@/utils/index'
import { StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import * as tableColumns from './columns'

import ButtonRadio from './components/buttonRadio'

const typeList = [
  { value: 1, label: '订单' },
  { value: 2, label: '售后' },
  { value: 3, label: '商品' },
  { value: 4, label: '会员' },
  { value: 5, label: '商品询价' },
  { value: 6, label: '采购' },
  { value: 7, label: '合同' },
  { value: 8, label: '营销' },
]

const dataMap_2 = [
  { value: 2, label: '退货' },
  { value: 1, label: '换货' },
  { value: 3, label: '维修' },
]

const dataMap_4 = [
  { value: 0, label: '平台后台' },
  { value: 1, label: '会员中心' },
]

const dataMap_6 = [
  { value: 1, label: '采购询价' },
  { value: 2, label: '招投标' },
  // { value: 3, label: '采购竞价' },
]

const dataMap_8 = [
  { value: 1, label: '平台后台' },
  { value: 2, label: '商家活动' },
  { value: 3, label: '平台优惠券' },
  { value: 4, label: '商家优惠券' },
]

const dataMap = {
  2: dataMap_2,
  4: dataMap_4,
  6: dataMap_6,
  8: dataMap_8,
}

const OperationLog: React.FC = () => {
  const [typeState, setTypeState] = useState<number>(1)
  const [statusState, setStatusState] = useState<number>(1)
  const [extraState, setExtraState] = useState<number>(1)
  const ref = useRef({} as ActionType)

  const _columns = useMemo(() => {
    switch (typeState) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 7:
      case 8:
        return tableColumns[`columns_${statusState === 1 ? 'outer' : 'inner'}_${typeState}`]
      default:
        return tableColumns[`columns_${statusState === 1 ? 'outer' : 'inner'}_${typeState}_${extraState}`]
    }
  }, [typeState, statusState, extraState])

  const _actionKey = useMemo(() => {
    let _type = ''
    switch (typeState) {
      case 1:
        _type = 'orderNo'
        break
      case 2:
        _type = 'applyNo'
        break
      case 3:
        _type = 'commodityId'
        break
      case 4:
        _type = 'memberId'
        break
      case 5:
        _type = 'inquiryListId'
        break
      case 6:
        if (extraState === 1) {
          _type = 'purchaseInquiryId'
        } else if (extraState === 2) {
          _type = 'inviteTenderId'
        }
        break
      case 7:
        _type = 'contractNo'
        break
      case 8:
        _type = 'id'
        break
      default:
        break
    }
    return _type
  }, [typeState, extraState])

  const setExtraStateFunc = (type) => {
    batchedUpdates(() => {
      setStatusState(typeState === 8 && (type === 3 || type === 4) ? 2 : 1)
      setExtraState(type)
    })
  }

  const _extraDom = useMemo(() => {
    switch (typeState) {
      case 2:
      case 4:
      case 6:
      case 8:
        const _data = dataMap[typeState]
        return (
          <div style={{ marginBottom: 10 }}>
            <ButtonRadio data={_data} actValue={extraState} onTab={setExtraStateFunc} />
          </div>
        )
      default:
        return null
    }
  }, [typeState, extraState])

  useEffect(() => {
    batchedUpdates(() => {
      setStatusState(1)
      setExtraState(dataMap[typeState]?.[0].value ?? 1)
    })
  }, [typeState])

  const _tableKey = useMemo(() => {
    return `table_${_actionKey}_${extraState}_${statusState}`
  }, [_actionKey, extraState, statusState])

  const _hideOutStatus = useMemo(() => {
    return typeState === 8 && (extraState === 3 || extraState === 4)
  }, [typeState, extraState])

  const _hideInStatus = useMemo(() => {
    return typeState === 3
  }, [typeState])

  const fetchTableData = async (params: any) => {
    let _fetch: any
    const _params = { ...params }
    switch (typeState) {
      case 1:
        if (_params.startDate) {
          _params.startDate = formatTimeString(Number(_params.startDate), 'YYYY-MM-DD')
        }
        if (_params.endDate) {
          _params.endDate = formatTimeString(Number(_params.endDate), 'YYYY-MM-DD')
        }
        if (statusState === 1) {
          _fetch = getOrderPlatformHistoryOuterPage
        } else {
          _fetch = getOrderPlatformHistoryInnerPage
        }
        break
      case 2:
        _params.afterSaleType = extraState
        if (statusState === 1) {
          _fetch = postAftersalesOperateLogOuterPage
        } else {
          _fetch = postAftersalesOperateLogInnerPage
        }
        break
      case 3:
        if (statusState === 1) {
          _fetch = getProductCommodityPlatformGetCommodityCheckRecordList
        }
        break
      case 4:
        _params.type = extraState
        if (_params.startDate) {
          _params.startDate = formatTimeString(Number(_params.startDate), 'YYYY-MM-DD')
        }
        if (_params.endDate) {
          _params.endDate = formatTimeString(Number(_params.endDate), 'YYYY-MM-DD')
        }
        if (statusState === 1) {
          _fetch = getMemberHistoryOuterPage
        } else {
          _fetch = getMemberHistoryInnerPage
        }
        break
      case 5:
        if (statusState === 1) {
          _fetch = getTradeGetInquiryExternalRecordList
        } else {
          _fetch = getTradeGetInquiryInteriorRecordList
        }
        break
      case 6:
        if (extraState === 1) {
          if (statusState === 1) {
            _fetch = getPurchasePurchaseInquiryGetInquiryExternalRecordList
          } else {
            _fetch = getPurchasePurchaseInquiryGetInquiryInteriorRecordList
          }
        } else if (extraState === 2) {
          if (statusState === 1) {
            _fetch = getPurchaseTenderOutCheckRecordGetInviteTenderOutCheckRecordList
          } else {
            _fetch = getPurchaseInviteTenderInCheckRecordGetInviteTenderInCheckRecordList
          }
        }
        break
      case 7:
        if (statusState === 1) {
          _fetch = postContractOperateLogOuterPage
        } else {
          _fetch = postContractOperateLogInnerPage
        }
        break
      case 8:
        _params.operateType = extraState
        if (statusState === 1) {
          _fetch = postMarketingOperateLogOuterPage
        } else {
          _fetch = postMarketingOperateLogInnerPage
        }
        break

      default:
        break
    }
    if (_fetch) {
      const { data } = await _fetch(_params, { ctlType: 'none' })
      return data
    }
    return { data: [], totalCount: 0 }
  }

  return (
    <PageHeaderWrapper
      extra={
        <Radio.Group
          defaultValue={statusState}
          onChange={(e) => {
            setStatusState(e.target.value)
          }}
        >
          {!_hideOutStatus && <Radio.Button value={1}>外部流转</Radio.Button>}
          {!_hideInStatus && <Radio.Button value={2}>内部流转</Radio.Button>}
        </Radio.Group>
      }
    >
      <div style={{ marginBottom: 16, paddingLeft: 24, paddingRight: 24, backgroundColor: '#fff' }}>
        <ButtonRadio data={typeList} actValue={typeState} onTab={setTypeState} />
      </div>
      <Card>
        {_extraDom}
        <StandardFormTable
          key={_tableKey}
          actionRef={ref}
          columns={_columns}
          rowKey="id"
          request={fetchTableData}
          autoScrollX
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default OperationLog
