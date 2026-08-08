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
import AvatarWrap from '@/components/AvatarWrap'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { detailSchema } from '../schema'
import { usePageStatus } from '@/hooks/usePageStatus'
import { productNoticecolumns } from '../../../common/columns'
import { priceFormat } from '@/utils/numberFomat'
import useInitialValue from '@/hooks/useInitialValue'
import useBalanceInfo from '../../../hooks/useBalanceInfo'
import {
  getSettlementMemberSettlementGetPayableDetail,
  GetSettlementMemberSettlementGetPayableDetailResponse,
  getSettlementMemberSettlementPagePayableProductionNoticeSettlement,
} from '@apps/apis'
import CustomizeColumn from '@/components/CustomizeColumn'
import ReturnEle from '@/components/ReturnEle'

const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const ProductNoticeSettlementDetail: React.FC = () => {
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
    const { data } = await getSettlementMemberSettlementPagePayableProductionNoticeSettlement(postData)
    return data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
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
        id: 'balance.accountsPayable.settlementList.productNoticeSettlementDetail.title',
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
          columns={productNoticecolumns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ RangePicker }}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsPayable.settlementList.productNoticeSettlementDetail.exportBtn' })}</Button> */}
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
