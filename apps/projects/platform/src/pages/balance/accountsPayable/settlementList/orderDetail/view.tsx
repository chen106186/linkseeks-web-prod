/*
 * @Author: Bill
 * @Date: 2020-10-20 10:54:00
 * @Description: 积分结算详情页
 */

import React, { useRef, useState, useEffect } from 'react'
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
// import StatusTag from '../../components/StatusTag'
import { orderColumns, productNoticecolumns } from '../../../common/columns'
import { priceFormat } from '@/utils/numberFomat'
import useFetchBillData from '../../../hooks/useFetchBillData'
import useBalanceInfo from '../../../hooks/useBalanceInfo'
import CustomizeColumn from '@/components/CustomizeColumn'
import {
  getSettlementMemberSettlementGetPayableDetail,
  getSettlementMemberSettlementPagePayableOrderSettlement,
} from '@apps/apis'
import ReturnEle from '@/components/ReturnEle'

const RangePicker = DatePicker.RangePicker
const formActions = createFormActions()

const OrderDetail: React.FC = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { ref, infoDetail, fetchListData, handleSearch } = useFetchBillData(
    getSettlementMemberSettlementGetPayableDetail,
  )
  const { infoList } = useBalanceInfo(infoDetail, { type: 'pay' })

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.accountsPayable.settlementList.orderDetail.title',
        data: infoDetail?.settlementNo,
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
          columns={orderColumns}
          currentRef={ref}
          fetchTableData={(params: any) =>
            fetchListData(getSettlementMemberSettlementPagePayableOrderSettlement, { settlementId: id, ...params })
          }
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ RangePicker }}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.accountsPayable.settlementList.orderDetail.exportBtn' })}</Button> */}
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

export default OrderDetail
