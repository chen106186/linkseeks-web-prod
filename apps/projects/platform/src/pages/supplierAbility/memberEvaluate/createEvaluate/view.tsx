import { useIntl } from '@linkseeks/i18n'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import useEvaluateColumn, { setColumnsByLinks } from '../hooks/useEvaluateColumn'
import { evaluationListSchema } from '../schema'
import useFetchList from '../hooks/useFetchList'
import { createFormActions } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import {
  getMemberSupplierAppraisalWaitPublishPage,
  GetMemberAppraisalWaitPublishPageRequest,
  GetMemberAppraisalWaitPublishPageResponse,
  GetMemberAppraisalWaitPublishPageResponseDetail,
  postMemberSupplierAppraisalDelete,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const defaultColumns = setColumnsByLinks(
  {
    detail: '/supplierAbility/memberEvaluate/createEvaluate/detail',
  },
  ['totalScore'],
)
interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const ref = useRef<any>({})
  const [rowSelection, rowController] = useRowSelectionTable()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { fetchListData } = useFetchList()
  const intl = useIntl()
  const { columns, fetchStatusOptions } = useEvaluateColumn<GetMemberAppraisalWaitPublishPageResponseDetail>(
    defaultColumns,
    [
      {
        title: `${intl.formatMessage({
          id: 'member.memberInspection.common.columns.index.operate',
        })}`,
        render: (_text, _record) => (
          <Space>
            {_record.publish && (
              <AuthButton type="custom" code="publish">
                <Popconfirm
                  placement="top"
                  title={intl.formatMessage({
                    id: 'member.memberEvaluate.createEvaluate.index.isConfirmRelease',
                  })}
                  // onConfirm={() => handlePublic([_record.id])}
                >
                  <Spin spinning={submitLoading}>
                    <a>
                      {intl.formatMessage({
                        id: 'member.memberEvaluate.createEvaluate.index.release',
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
            )}
            {_record.updateOrDel && (
              <>
                <EditAuthButton>
                  <Link to={`/supplierAbility/memberEvaluate/createEvaluate/edit?id=${_record.id}`}>
                    {intl.formatMessage({
                      id: 'member.memberEvaluate.createEvaluate.index.edit',
                    })}
                  </Link>
                </EditAuthButton>

                <AuthButton type="custom" code="delete">
                  <Popconfirm
                    placement="top"
                    title={intl.formatMessage({
                      id: 'member.complaintsAndSuggests.index.isConfirmDelete',
                    })}
                    onConfirm={() => handleBatchRemove([_record.id])}
                  >
                    <Spin spinning={submitLoading}>
                      <a>
                        {intl.formatMessage({
                          id: 'member.memberInspection.common.columns.index.delete',
                        })}
                      </a>
                    </Spin>
                  </Popconfirm>
                </AuthButton>
              </>
            )}
          </Space>
        ),
      },
    ],
  )

  const controllerBtns = () => (
    <Space>
      <AddAuthButton>
        <Link to={'/supplierAbility/memberEvaluate/createEvaluate/add'}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
      {/* <AuthButton btnCode="supplierCreateEvaluate.batchdel">
        <Button
          loading={submitLoading}
          onClick={() => handleBatchRemove(rowController.selectedRowKeys)}
          type="ghost"
        >
          {intl.formatMessage({
            id: 'member.memberEvaluate.createEvaluate.index.batchDelete',
          })}
        </Button>
      </AuthButton>
      <AuthButton btnCode="supplierCreateEvaluate.batchPublic">
        <Button
          loading={submitLoading}
          onClick={() => handlePublic(rowController.selectedRowKeys)}
        >
          {intl.formatMessage({
            id: 'member.memberEvaluate.createEvaluate.index.batchRelease',
          })}
        </Button>
      </AuthButton> */}
    </Space>
  )

  const handleFetch = async (params: Partial<GetMemberAppraisalWaitPublishPageRequest>) => {
    const result = fetchListData<
      Partial<GetMemberAppraisalWaitPublishPageRequest>,
      GetMemberAppraisalWaitPublishPageResponse
    >(getMemberSupplierAppraisalWaitPublishPage, params)
    return result
  }

  const handlePublic = useCallback(
    async (ids: number[]) => {
      // try {
      //   setSubmitLoading(() => true)
      //   const { code, data } = await postMemberSupplierAppraisalWaitPublishPublish({ ids: ids });
      //   if (code === 1000) {
      //     rowController.setSelectedRowKeys((prev: string[]) => []);
      //     ref.current?.submit();
      //   }
      // } catch (error) {
      // } finally {
      //   setSubmitLoading(() => false)
      // }
    },
    [ref],
  )

  const handleBatchRemove = useCallback(
    async (ids: number[]) => {
      try {
        setSubmitLoading(() => true)
        const { code, data } = await postMemberSupplierAppraisalDelete({ idList: ids })
        if (code === 1000) {
          ref.current?.submit()
        }
      } catch (error) {
      } finally {
        setSubmitLoading(() => false)
      }
    },
    [ref],
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={columns}
          ref={ref}
          schema={evaluationListSchema}
          rowSelection={rowSelection as any}
          fetchListData={handleFetch}
          components={{
            controllerBtns: controllerBtns,
          }}
          // expressionScope={{}}
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
