import React, { useCallback, useRef, useState } from 'react'
import { Card, Space, Button, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { evaluationListSchema } from '../schema'
import useFetchList from '../hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import {
  getMemberSupplierAppraisalWaitNotificationPage,
  GetMemberAppraisalWaitNotificationPageRequest,
  GetMemberAppraisalWaitNotificationPageResponseDetail,
  postMemberSupplierAppraisalWaitNotificationNotification,
} from '@apps/apis'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const defaultColumns = setColumnsByLinks({
  detail: '/supplierAbility/memberEvaluate/tobeInformed/detail',
})

interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const ref = useRef<any>({})
  const { fetchListData } = useFetchList()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [rowSelection, rowController] = useRowSelectionTable()
  const intl = useIntl()
  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalWaitNotificationPageResponseDetail>(
    defaultColumns,
    [
      {
        title: `${intl.formatMessage({
          id: 'member.memberInspection.common.columns.index.operate',
        })}`,
        render: (_text, _record) => (
          <DetailAuthButton>
            <Space>
              <Link to={`/supplierAbility/memberEvaluate/tobeInformed/detail?id=${_record.id}`}>
                {intl.formatMessage({
                  id: 'member.memberEvaluate.tobeInformed.index.notify',
                })}
              </Link>
            </Space>
          </DetailAuthButton>
        ),
      },
    ],
  )

  const controllerBtns = () => (
    <Space>
      <Button loading={submitLoading} onClick={() => handleBatchNotice(rowController.selectedRowKeys)}>
        {intl.formatMessage({ id: 'member.memberEvaluate.tobeInformed.index.batchNotify' })}
      </Button>
    </Space>
  )

  const handleBatchNotice = useCallback(
    async (ids: number[]) => {
      if (ids.length) {
        try {
          setSubmitLoading(true)
          const { code, data } = await postMemberSupplierAppraisalWaitNotificationNotification({ idList: ids })
          if (code === 1000) {
            rowController.setSelectedRowKeys([])
            ref.current?.submit()
          }
        } catch (error) {
        } finally {
          setSubmitLoading(false)
        }
      } else {
        message.warn('未选择任何考评单')
      }
    },
    [ref],
  )

  const handleFetch = useCallback(async (params: GetMemberAppraisalWaitNotificationPageRequest) => {
    const result = fetchListData(getMemberSupplierAppraisalWaitNotificationPage, params)
    return result
  }, [])

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          ref={ref}
          columns={columns}
          rowSelection={rowSelection as any}
          schema={evaluationListSchema}
          fetchListData={handleFetch}
          components={{ controllerBtns }}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            useAsyncSelect('status', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
