import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button, Popconfirm } from 'antd'
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
import { DEPENDENT_DOC_PRODUCTION, DOC_TYPE_PROCESS_INVOICE, DOC_TYPE_PROCESS_RECEIPT } from '@/constants/commodity'
import { TO_BE_ADD_STORAGE, TO_BE_EXAM_STORAGE } from '@/constants/handling'
import { getEnhanceSupplierToBeAddStorageList, postEnhanceSupplierToBeAddStorageExam } from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks({
  detail: '/handling/assign/pendingAddProcessing/detail',
  storage: '/commodityAbility/stockSellStorage/bills/detail',
})
const ADD_PROCESS_PATH = '/commodityAbility/stockSellStorage/bills/add'
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
              {record.supplierInnerStatus === TO_BE_EXAM_STORAGE && (
                <AuthButton type="custom" code="shenhe">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'handling.query.processStock.exam.storageNo',
                      storageNo: record.storageNo,
                    })}
                    placement="left"
                    okText={intl.formatMessage({ id: 'common.button.confirm' })}
                    cancelText={intl.formatMessage({ id: 'common.button.cancel' })}
                    onConfirm={() => handleExam({ id: record.id })}
                  >
                    <a>{intl.formatMessage({ id: 'handling.toExamine' })}</a>
                  </Popconfirm>
                </AuthButton>
              )}
              {record.supplierInnerStatus === TO_BE_ADD_STORAGE && (
                <AuthButton type="custom" code="receiptDoc">
                  <Link
                    to={`${ADD_PROCESS_PATH}?relevanceInvoicesId=${record.id}&invoicesTypeId=${DOC_TYPE_PROCESS_RECEIPT}&relevanceInvoices=${DEPENDENT_DOC_PRODUCTION}`}
                  >
                    {intl.formatMessage({ id: 'handling.query.processStock.add.receiptDoc' })}
                  </Link>
                </AuthButton>
              )}
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleExam = async (params: { id: number }) => {
    const { code } = await postEnhanceSupplierToBeAddStorageExam(params)
    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleSearch = useCallback(
    (values: any) => {
      const searchData = onFormatSearchData(values)
      ref.current.reload(searchData)
    },
    [ref],
  )

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.query.tobeAddStock' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceSupplierToBeAddStorageList, params)}
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
