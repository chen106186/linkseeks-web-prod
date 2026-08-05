import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button, Spin, Popconfirm } from 'antd'
import { tobeAddQuerySchema } from '../../common/schemas/query'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createFormActions } from '@apps/formily'
import { timeRange } from '@/utils'
import setColumnsByLinks from '../../common/columns/query'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { PlusOutlined } from '@ant-design/icons'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import {
  PostEnhanceSupplierToBeAddBatchDeleteResponse,
  PostEnhanceSupplierToBeAddBatchSubmitExamResponse,
  PostEnhanceSupplierToBeAddDeleteResponse,
  PostEnhanceSupplierToBeAddSubmitExamResponse,
} from '@apps/apis'
import useBatchSubmit from '../../common/hooks/useBatchSubmit'
import useSingleActionSubmit from '../../common/hooks/useSingleAction'
import {
  getEnhanceSupplierToBeAddList,
  postEnhanceSupplierToBeAddBatchDelete,
  postEnhanceSupplierToBeAddBatchSubmitExam,
  postEnhanceSupplierToBeAddDelete,
  postEnhanceSupplierToBeAddSubmitExam,
} from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks('/handling/assign/tobeAddQuery/detail')

const TobeAddQuery = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { batchLoading, handleAction } = useBatchSubmit()
  const { submitLoadingID, onSingleAction } = useSingleActionSubmit()

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
          const loading = submitLoadingID.includes(record.id)
          const IS_TO_BE_SUBMIT_EXAM = record.supplierInnerStatus === 1
          return (
            <Space>
              {(IS_TO_BE_SUBMIT_EXAM && (
                <AuthButton type="custom" code="submit">
                  <Spin spinning={loading}>
                    <a onClick={() => handleSingleReviewOrDelete('exam', { id: record.id })}>
                      {intl.formatMessage({ id: 'handling.submit' })}
                    </a>
                  </Spin>
                </AuthButton>
              )) ||
                null}

              <AuthButton type="edit" code="edit">
                <Link to={`/handling/assign/tobeAddQuery/edit?id=${record.id}`}>
                  {intl.formatMessage({ id: 'common.button.edit' })}
                </Link>
              </AuthButton>
              {(IS_TO_BE_SUBMIT_EXAM && (
                <AuthButton type="custom" code="del">
                  <Popconfirm
                    title={intl.formatMessage({ id: 'common.tip.option.confirm' })}
                    onConfirm={() => handleSingleReviewOrDelete('delete', { id: record.id })}
                  >
                    <Button type="link" loading={loading}>
                      {intl.formatMessage({ id: 'common.button.delete' })}
                    </Button>
                  </Popconfirm>
                </AuthButton>
              )) ||
                null}
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleSingleReviewOrDelete = async (type: 'exam' | 'delete', postData: { id: number }) => {
    const service = type === 'exam' ? postEnhanceSupplierToBeAddSubmitExam : postEnhanceSupplierToBeAddDelete
    const { code } = await onSingleAction<
      PostEnhanceSupplierToBeAddSubmitExamResponse | PostEnhanceSupplierToBeAddDeleteResponse
    >(service, postData)
    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleSubmitToReviewOrDelete = async (type: 'exam' | 'delete') => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    const service = type === 'exam' ? postEnhanceSupplierToBeAddBatchSubmitExam : postEnhanceSupplierToBeAddBatchDelete
    const { code } = await handleAction<
      PostEnhanceSupplierToBeAddBatchSubmitExamResponse | PostEnhanceSupplierToBeAddBatchDeleteResponse
    >(selectedRowKeys, service)
    if (code === 1000) {
      selectRowFns.setSelectedRowKeys([])
      formActions.submit()
    }
  }

  const controllerBtns = () => (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          history.push('/handling/assign/tobeAddQuery/add')
        }}
        icon={<PlusOutlined />}
      >
        {intl.formatMessage({ id: 'common.button.add' })}
      </Button>
      <Button loading={batchLoading} onClick={() => handleSubmitToReviewOrDelete('exam')}>
        {intl.formatMessage({ id: 'common.button.batchSubmit' })}
      </Button>
      <Button loading={batchLoading} onClick={() => handleSubmitToReviewOrDelete('delete')}>
        {intl.formatMessage({ id: 'common.button.batchDelete' })}
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
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.assign.tobeAddQuery' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            rowSelection: selectRow,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceSupplierToBeAddList, params)}
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

export default TobeAddQuery
