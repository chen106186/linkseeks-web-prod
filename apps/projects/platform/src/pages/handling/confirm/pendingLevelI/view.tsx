import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Space, Card, Button } from 'antd'
import { pendingFirstQuerySchema } from '../../common/schemas/confirmQuery'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/confirmQuery'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import useBatchSubmit from '../../common/hooks/useBatchSubmit'
import {
  getEnhanceProcessToBeFirstExamList,
  postEnhanceProcessToBeFirstExamBatchExamPass,
  PostEnhanceProcessToBeFirstExamBatchExamPassResponse,
  PostEnhanceProcessToBeFirstExamExamResponse,
} from '@apps/apis'
import useSingleActionSubmit from '../../common/hooks/useSingleAction'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { AuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks('/handling/confirm/pendingFirst/detail')

const AllQuery = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()
  const { batchLoading, handleAction } = useBatchSubmit()
  // const { submitLoadingID, onSingleAction } = useSingleActionSubmit()
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
        title: translate('web.common.control'),
        render: (text, record) => {
          return (
            <Space>
              <AuthButton type="custom" code="shenhe">
                <Link to={`/handling/confirm/pendingLevelI/detail?id=${record.id}`}>
                  {translate('web.common.tijiaoshenhe')}
                </Link>
              </AuthButton>
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleSubmitToReviewOrDelete = async () => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    const { code } = await handleAction<PostEnhanceProcessToBeFirstExamBatchExamPassResponse>(
      selectedRowKeys,
      postEnhanceProcessToBeFirstExamBatchExamPass,
    )
    if (code === 1000) {
      selectRowFns.setSelectedRowKeys([])
      formActions.submit()
    }
  }

  const controllerBtns = () => (
    <Space>
      <AuthButton type="custom" code="pilianshenhe">
        <Button loading={batchLoading} onClick={handleSubmitToReviewOrDelete}>
          {intl.formatMessage({ id: 'handling.confirm.submit.exam.batch' })}
        </Button>
      </AuthButton>
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
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.confirm.query.pendingLevelI' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            rowSelection: selectRow,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceProcessToBeFirstExamList, params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{ controllerBtns }}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)
              }}
              schema={pendingFirstQuerySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
