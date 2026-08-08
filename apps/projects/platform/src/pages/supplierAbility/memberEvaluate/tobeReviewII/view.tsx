import React, { useRef, useState } from 'react'
import { Card, Space, Button, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { evaluationListSchema } from '../schema'
import useFetchList from '../hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import {
  getMemberSupplierAppraisalWaitAuditTwoPage,
  GetMemberAppraisalWaitAuditTwoPageRequest,
  GetMemberAppraisalWaitAuditTwoPageResponseDetail,
  postMemberSupplierAppraisalWaitAuditTwoAuditBatch,
} from '@apps/apis'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const defaultColumns = setColumnsByLinks({
  detail: '/supplierAbility/memberEvaluate/tobeReviewII/detail',
})

interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const ref = useRef<any>({})
  const { fetchListData } = useFetchList()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [rowSelection, rowController] = useRowSelectionTable()

  const intl = useIntl()
  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalWaitAuditTwoPageResponseDetail>(
    defaultColumns,
    [
      {
        title: `${intl.formatMessage({
          id: 'member.memberInspection.common.columns.index.operate',
        })}`,
        render: (_text, _record) => (
          <DetailAuthButton>
            <Space>
              <Link to={`/supplierAbility/memberEvaluate/tobeReviewII/detail?id=${_record.id}`}>
                {intl.formatMessage({
                  id: 'member.memberEvaluate.tobeReviewI.detail.audit',
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
      <Button loading={submitLoading} onClick={() => handleBatchUpdate(rowController.selectedRowKeys)}>
        {intl.formatMessage({ id: 'member.memberEvaluate.tobeReviewI.index.batchAuditPass' })}
      </Button>
    </Space>
  )

  const handleBatchUpdate = async (ids: number[]) => {
    if (ids.length) {
      try {
        setSubmitLoading(true)
        const { code, data } = await postMemberSupplierAppraisalWaitAuditTwoAuditBatch({ idList: ids })
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
  }

  const handleFetch = async (params: GetMemberAppraisalWaitAuditTwoPageRequest) => {
    const result = fetchListData(getMemberSupplierAppraisalWaitAuditTwoPage, params)
    return result
  }

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
