import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import { basicSchema } from '../../common/schemas/confirmQuery'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/confirmQuery'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import StopModal, { SubmitDataTypes } from './components/StopModal'
import useModal from '@/pages/customerAbility/memberEvaluate/hooks/useModal'
import moment from 'moment'
import { getEnhanceProcessAllList, postEnhanceProcessAllDiscontinue } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks('/handling/confirm/query/detail')
/**
 * 内部状态为 【已确认】 到 【已完成】 且不是 【不接受生产通知单那】
 */
const inRangeStatus = [3, 4, 5, 6, 7, 8]

const AllQuery = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { visible, toggle } = useModal()
  const { fetchListData, onFormatSearchData } = useFetchData()
  const { filterRes, fetchSelectOptions } = useFetchFilterData()
  const [activeData, setActiveData] = useState<number | null>(null)
  const { columns } = useColumnWithFilter(
    queryColumns,
    [
      {
        title: intl.formatMessage({ id: 'common.table.action' }),
        dataIndex: 'action',
        render: (text, record) => {
          if (!inRangeStatus.includes(record.outerStatus)) {
            return
          }
          return (
            <a onClick={() => handleShow({ id: record.id })}>
              {intl.formatMessage({ id: 'handling.confirm.query.stop' })}
            </a>
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

  const handleShow = (params: { id: number }) => {
    setActiveData(params.id)
    toggle(true)
  }

  const onExamVerifySubmit = async (value: SubmitDataTypes) => {
    const { code, data } = await postEnhanceProcessAllDiscontinue({
      id: activeData,
      discontinueTime: moment().valueOf(),
      cause: value.reason,
    })
    if (code === 1000) {
      toggle(false)
      formActions.submit()
      setActiveData(null)
    }
  }

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.confirm.query.query' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceProcessAllList, params)}
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
        <StopModal
          visible={visible}
          title={intl.formatMessage({ id: 'handling.confirm.query.stop.reason' })}
          onSubmit={onExamVerifySubmit}
          onCancel={() => toggle(false)}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
