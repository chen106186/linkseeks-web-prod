/*
 * @Author: Bill
 * @Date: 2020-10-20 10:54:00
 * @Description: 积分结算详情页
 */

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button, DatePicker } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import AvatarWrap from '@/components/AvatarWrap'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { logisticsDetailSchema } from '../schema'
import { usePageStatus } from '@/hooks/usePageStatus'
import { logisticsColumn } from '../../../common/columns'
import { priceFormat } from '@/utils/numberFomat'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getSettlementMemberSettlementGetReceivableDetail,
  GetSettlementMemberSettlementGetReceivableDetailResponse,
  getSettlementMemberSettlementPageReceivableLogisticsSettlement,
} from '@apps/apis'
import useBalanceInfo from '../../../hooks/useBalanceInfo'
import CustomizeColumn from '@/components/CustomizeColumn'
import ReturnEle from '@/components/ReturnEle'

const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const logisticsDetail: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<
    GetSettlementMemberSettlementGetReceivableDetailResponse,
    { id: string }
  >(getSettlementMemberSettlementGetReceivableDetail, params)
  const { infoList } = useBalanceInfo(initialValue, { type: 'receive' })

  const fetchListData = async (params) => {
    const postData = {
      ...params,
      settlementId: id,
    }
    const { data } = await getSettlementMemberSettlementPageReceivableLogisticsSettlement(postData)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('day').format(`${format} HH:mm:ss`) : ''
    ref.current.reload({ ...values, startTime, endTime })
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.accountsReceivable.settlementList.logisticsDetail.title',
        data: initialValue?.settlementNo,
      })}
    >
      <div style={{ marginBottom: '16px' }}>
        <CustomizeColumn data={infoList} title="" column={3} />
      </div>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'orderNo',
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
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.logisticsDetail.exportBtn' })}</Button> */}
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
