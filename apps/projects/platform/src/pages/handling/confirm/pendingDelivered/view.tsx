import React, { useCallback, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space } from 'antd'
import { basicSchema } from '../../common/schemas/confirmQuery'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/comfrimOtherQuery'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { getEnhanceProcessToBeDeliveryList } from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks({
  detail: '/handling/confirm/pendingDelivered/detail',
  delivery: '/commodityAbility/stockSellStorage/bills/detail',
})
const PENDING_DELIVERD_PATH = '/handling/confirm/pendingDelivered/detail'

const AllQuery = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { fetchListData, onFormatSearchData } = useFetchData()
  const { filterRes, fetchSelectOptions } = useFetchFilterData()
  const { columns } = useColumnWithFilter(
    queryColumns,
    [
      {
        title: intl.formatMessage({ id: 'common.table.action' }),
        render: (text, record) => {
          return (
            <Space>
              <AuthButton type="custom" code="good">
                <Link to={`${PENDING_DELIVERD_PATH}?id=${record.id}`}>
                  {intl.formatMessage({ id: 'handling.query.processStock.deliver.goods' })}
                </Link>
              </AuthButton>
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleSearch = useCallback(
    (values: any) => {
      const searchData = onFormatSearchData(values)
      ref.current.reload(searchData)
    },
    [ref],
  )

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.confirm.query.pendingDelivered' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceProcessToBeDeliveryList, params)}
          controlRender={
            <NiceForm
              schema={basicSchema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
