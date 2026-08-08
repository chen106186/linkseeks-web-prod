/*
 * @Author: Bill
 * @Date: 2020-10-20 10:54:00
 * @Description: 积分结算详情页
 */

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button, DatePicker } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { detailSchema } from '../schema'
import { usePageStatus } from '@/hooks/usePageStatus'
import { productNoticecolumns } from '../../../common/columns'
import {
  getSettlementMemberSettlementGetReceivableDetail,
  GetSettlementMemberSettlementGetReceivableDetailResponse,
  getSettlementMemberSettlementPageReceivableProductionNoticeSettlement,
} from '@apps/apis'
import useInitialValue from '@/hooks/useInitialValue'
import CustomizeColumn from '@/components/CustomizeColumn'
import useBalanceInfo from '../../../hooks/useBalanceInfo'
import ReturnEle from '@/components/ReturnEle'

const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const ProductNoticeSettlementDetail: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { id } = usePageStatus()
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
      settlementId: id,
      ...params,
    }
    // /settle/accounts/member/settlement/pageReceivableProductionNoticeSettlement
    const { data } = await getSettlementMemberSettlementPageReceivableProductionNoticeSettlement(postData)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    console.log(values)
    const format = 'YYYY-MM-DD'
    const startTime = values.startTime?.format(format)
    const endTime = values.endTime ? values.endTime.endOf('day').format(`${format} HH:mm:ss`) : ''
    const receiveStartTime = values.receiveStartTime?.format(format)
    const receiveEndTime = values.receiveEndTime ? values.receiveEndTime.endOf('day').format(`${format} HH:mm:ss`) : ''
    ref.current.reload({ ...values, startTime, endTime, receiveStartTime, receiveEndTime })
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.accountsReceivable.settlementList.productNoticeSettlementDetail.title',
        data: initialValue?.settlementNo,
      })}
    >
      <div style={{ marginBottom: '16px' }}>
        <CustomizeColumn data={infoList} title="" column={3} />
      </div>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: (record) => `${record.orderNo}-${record.batch}`,
          }}
          keepAlive={false}
          columns={productNoticecolumns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              components={{ RangePicker }}
              actions={formActions}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsReceivable.settlementList.productNoticeSettlementDetail.exportBtn' })}</Button> */}
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
              schema={detailSchema}
              onSubmit={handleSearch}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ProductNoticeSettlementDetail
