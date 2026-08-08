import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button } from 'antd'
import { querySchema } from '../../common/schemas/query'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/stockQuery'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { DEPENDENT_DOC_PRODUCTION, DOC_TYPE_PROCESS_INVOICE } from '@/constants/commodity'
import { ASSIGN_PENDING_RECEIVE } from '../../common'
import { getEnhanceSupplierToBeReceiveList } from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks({
  detail: '/handling/assign/pendingAddProcessing/detail',
  storage: '/commodityAbility/stockSellStorage/bills/detail',
})
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
              <AuthButton type="custom" code="receiveGoods">
                <Link to={`${ASSIGN_PENDING_RECEIVE}/detail?id=${record.id}`}>
                  {intl.formatMessage({ id: 'handling.query.action.receiveGoods' })}
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
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.query.tobeReceive' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceSupplierToBeReceiveList, params)}
          controlRender={
            <NiceForm
              actions={formActions}
              // expressionScope={{controllerBtns: controllerBtns()}}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)
              }}
              schema={querySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
