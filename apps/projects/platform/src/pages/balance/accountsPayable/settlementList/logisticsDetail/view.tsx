/*
 * @Author: Bill
 * @Date: 2020-10-20 10:54:00
 * @Description: 积分结算详情页
 */

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button, DatePicker } from 'antd'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { logisticsDetailSchema } from '../schema'
import { usePageStatus } from '@/hooks/usePageStatus'
import { logisticsColumn } from '../../../common/columns'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getSettlementMemberSettlementGetPayableDetail,
  GetSettlementMemberSettlementGetPayableDetailResponse,
  getSettlementMemberSettlementPagePayableLogisticsSettlement,
} from '@apps/apis'
import useBalanceInfo from '../../../hooks/useBalanceInfo'
import CustomizeColumn from '@/components/CustomizeColumn'
import ReturnEle from '@/components/ReturnEle'
const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

interface infoType {
  id: number // 会员结算id
  settlementNo: string // 结算单号
  settlementDate: string // 结算日期
  settlementWayName: string // 结算方式名称
  settlementName: string // 结算方
  payName: string // 付款方
  orderTypeName: string // 结算单据类型名称
  totalCount: number // 总单数
  amount: number // 结算金额
  statusName: string // 结算状态名称
}

const logisticsDetail: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const { id, preview } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<
    GetSettlementMemberSettlementGetPayableDetailResponse,
    { id: string }
  >(getSettlementMemberSettlementGetPayableDetail, params)
  const { infoList } = useBalanceInfo(initialValue, { type: 'pay' })

  const fetchListData = async (params) => {
    const postData = {
      settlementId: id,
      ...params,
    }
    ///settle/accounts/member/settlement/pagePayableLogisticsSettlement
    const { data } = await getSettlementMemberSettlementPagePayableLogisticsSettlement(postData)
    return data
  }
  /**
   * 搜索
   */
  const handleSearch = (values) => {
    console.log(values)
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('day').format(format) : ''
    ref.current.reload({ ...values, startTime, endTime })
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.accountsPayable.settlementList.logisticsDetail.title',
        data: initialValue?.settlementNo,
      })}
    >
      <div style={{ marginBottom: '16px' }}>
        <CustomizeColumn data={infoList} title="" column={3} />
      </div>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          keepAlive={false}
          columns={logisticsColumn}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{ RangePicker }}
              actions={formActions}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsPayable.settlementList.logisticsDetail.exportBtn' })}</Button> */}
                  </div>
                ),
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.topLayout.orderNo', FORM_FILTER_PATH)
                // useAsyncInitSelect(
                //   ['innerStatus', 'outerStatus'],
                //   fetchSelectOptions,
                // );
              }}
              schema={logisticsDetailSchema}
              onSubmit={handleSearch}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default logisticsDetail
