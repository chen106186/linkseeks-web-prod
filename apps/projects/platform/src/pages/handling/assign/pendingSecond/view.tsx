import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button } from 'antd'
import { tobeAddQuerySchema } from '../../common/schemas/query'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/query'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import useBatchSubmit from '../../common/hooks/useBatchSubmit'
import {
  getEnhanceSupplierToBeSecondExamList,
  postEnhanceSupplierToBeSecondExamBatchExamPass,
  PostEnhanceSupplierToBeSecondExamBatchExamPassResponse,
} from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks('/handling/assign/pendingSecond/detail')

const AllQuery = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  // const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const { batchLoading, handleAction } = useBatchSubmit()

  const { fetchListData, onFormatSearchData } = useFetchData()
  const { filterRes, fetchSelectOptions } = useFetchFilterData()
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
    extendsSelection: {
      getCheckboxProps: (record: any) => ({
        disabled: record.outerStatus === 0,
      }),
    },
  })
  const { columns } = useColumnWithFilter(
    queryColumns,
    [
      {
        title: intl.formatMessage({ id: 'common.table.action' }),
        render: (text, record) => {
          return (
            <Space>
              <AuthButton type="custom" code="shenhe">
                <Link to={`/handling/assign/pendingSecond/detail?id=${record.id}`}>
                  {intl.formatMessage({ id: 'handling.toExamine' })}
                </Link>
              </AuthButton>

              {/* <Button type="text" loading={loading} onClick={() => handleVerify({id: record.id})}>审核</Button> */}
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleSubmitToReviewOrDelete = async () => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    const service = postEnhanceSupplierToBeSecondExamBatchExamPass
    const { code } = await handleAction<PostEnhanceSupplierToBeSecondExamBatchExamPassResponse>(
      selectedRowKeys,
      service,
    )
    if (code === 1000) {
      selectRowFns.setSelectedRowKeys([])
      formActions.submit()
    }
  }

  const controllerBtns = () => (
    <Space>
      <Button loading={batchLoading} onClick={handleSubmitToReviewOrDelete}>
        {intl.formatMessage({ id: 'handling.toExamine.batch' })}
      </Button>
    </Space>
  )

  const handleSearch = useCallback(
    (values: any) => {
      const searchData = onFormatSearchData(values)
      ref.current.reload(searchData)
    },
    [ref],
  )

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.query.tobeReviewII' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            rowSelection: selectRow,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceSupplierToBeSecondExamList, params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ controllerBtns }}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)
              }}
              schema={tobeAddQuerySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
