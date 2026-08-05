/**
 * 投诉建议（供应商端） > 我发起的投诉建议
 */
import React, { useRef, useState } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { PlusOutlined } from '@ant-design/icons'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { createListColumns } from '../../complaintsAndSuggests/common/columns'
import { complaintAndSuggestListSchema } from '../../complaintsAndSuggests/common/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import useColumns from '../../complaintsAndSuggests/common/hooks/useColumns'
import {
  getMemberSupplierComplaintSubPage,
  postMemberSupplierComplaintSubDelete,
  postMemberSupplierComplaintSubSubmit,
  GetMemberSupplierComplaintSubPageRequest,
} from '@apps/apis'
import moment from 'moment'

const MyComplaints: React.FC<any> = (props) => {
  const { pathname } = useLocation()

  const { fetchListData } = useFetchList()
  const [currentIdIsInLoading, setCurrentIdIsInLoading] = useState<number[]>([])
  const ref = useRef<any>({})
  const intl = useIntl()
  const queryColumns = createListColumns(
    {
      detail: `${pathname}/detail`,
    },
    true,
  )
  const { columns } = useColumns(queryColumns, [
    {
      title: `${intl.formatMessage({
        id: 'member.memberInspection.common.columns.index.operate',
        defaultMessage: '操作',
      })}`,
      width: 128,
      fixed: 'right',
      render: (text, record) => {
        const loading = currentIdIsInLoading.includes(record.id)
        if (record.submitOrUpdateOrDelete) {
          return (
            <Space>
              <AuthButton type="custom" code="submit">
                <Popconfirm
                  placement="top"
                  title={intl.formatMessage({
                    id: 'member.complaintsAndSuggests.index.isConfirmSubmit',
                  })}
                  onConfirm={() => handleSubmit({ id: record.id }, 'submit')}
                >
                  <Spin spinning={loading}>
                    <a>
                      {intl.formatMessage({
                        id: 'member.complaintsAndSuggests.index.submitComplaintSuggest',
                        defaultMessage: '提交',
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
              <EditAuthButton>
                <Link to={`${pathname}/edit?id=${record.id}`}>
                  {intl.formatMessage({
                    id: 'member.memberEvaluate.createEvaluate.index.edit',
                    defaultMessage: '修改',
                  })}
                </Link>
              </EditAuthButton>
              <AuthButton type="custom" code="delete">
                <Popconfirm
                  placement="top"
                  title={intl.formatMessage({
                    id: 'member.complaintsAndSuggests.index.isConfirmDelete',
                  })}
                  onConfirm={() => handleSubmit({ id: record.id }, 'delete')}
                >
                  <Spin spinning={loading}>
                    <a>
                      {intl.formatMessage({
                        id: 'member.memberInspection.common.columns.index.delete',
                        defaultMessage: '删除',
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
            </Space>
          )
        }
      },
    },
  ])

  const controllerBtns = (
    <div>
      <AddAuthButton>
        <Link to={`${pathname}/add`}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
    </div>
  )

  const handleFetch = async (params: GetMemberSupplierComplaintSubPageRequest) => {
    const { eventTimeEnd, eventTimeStart, ...rest } = params
    let postData: Partial<GetMemberSupplierComplaintSubPageRequest> = {
      ...rest,
    }
    if (typeof eventTimeEnd !== 'undefined') {
      postData = {
        ...rest,
        eventTimeStart: moment(eventTimeStart, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eventTimeEnd: moment(eventTimeEnd, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      }
    }
    const result = fetchListData(getMemberSupplierComplaintSubPage, {
      ...postData,
      complaintType: '1',
    })
    return result
  }

  const handleSubmit = async (params: { id: number }, type: 'submit' | 'delete') => {
    const newList = [...currentIdIsInLoading]
    newList.push(params.id)
    const service = type === 'submit' ? postMemberSupplierComplaintSubSubmit : postMemberSupplierComplaintSubDelete
    setCurrentIdIsInLoading(newList)
    const { data, code } = await service(params)
    setCurrentIdIsInLoading((prev) => prev.filter((_item) => _item !== params.id))
    if (code === 1000) {
      ref.current?.submit()
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          ref={ref}
          columns={columns}
          schema={complaintAndSuggestListSchema}
          fetchListData={handleFetch}
          expressionScope={{
            controllerBtns,
          }}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            // useAsyncSelect('status', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MyComplaints
