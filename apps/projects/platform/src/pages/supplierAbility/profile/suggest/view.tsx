import React, { useRef, useState } from 'react'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { setColumnsByLinks } from './common/columns'
import { complaintAndSuggestListSchema } from './common/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  getMemberSupplierComplaintSubPage,
  GetMemberComplaintSubPageRequest,
  GetMemberComplaintUpperPageRequest,
  postMemberSupplierComplaintSubDelete,
  postMemberSupplierComplaintSubSubmit,
} from '@apps/apis'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import useColumns from '../../memberRectification/common/hooks/useColumns'
import moment from 'moment'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface Iprops {}

const queryColumns = setColumnsByLinks({
  detail: '/supplierAbility/profile/suggest/detail',
})

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const [currentIdIsInLoading, setCurrentIdIsInLoading] = useState<number[]>([])
  const ref = useRef<any>({})
  const intl = useIntl()
  const { columns } = useColumns(queryColumns, [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
      render: (text, record) => {
        if (!record.submitOrUpdateOrDelete) {
          return null
        }
        const loading = currentIdIsInLoading.includes(record.id)
        return (
          <Space>
            {/* <Spin spinning={loading}>
              <a onClick={() => handleSubmit({id: record.id}, "submit")}>{ intl.formatMessage({ id: 'member.complaintsAndSuggests.index.submitComplaintSuggest'}) }</a>
            </Spin> */}

            <AuthButton type="custom" code="submitComplaintSuggest">
              <Link to={`/supplierAbility/profile/suggest/detail?id=${record.id}`}>
                {intl.formatMessage({
                  id: 'member.complaintsAndSuggests.index.submitComplaintSuggest',
                })}
              </Link>
            </AuthButton>
            <EditAuthButton>
              <Link to={`/supplierAbility/profile/suggest/edit?id=${record.id}`}>
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
                onConfirm={() => handleSubmit({ id: record.id }, 'delete')}
              >
                <Spin spinning={loading}>
                  <a>
                    {intl.formatMessage({
                      id: 'member.memberInspection.common.columns.index.delete',
                    })}
                  </a>
                </Spin>
              </Popconfirm>
            </AuthButton>
          </Space>
        )
      },
    },
  ])

  const controllerBtns = (
    <div>
      <AddAuthButton>
        <Link to={'/supplierAbility/profile/suggest/add'}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
    </div>
  )

  const handleFetch = async (params: GetMemberComplaintSubPageRequest) => {
    const result = fetchListData(getMemberSupplierComplaintSubPage, params)
    return result
  }

  const handleSubmit = async (params: { id: number }, type: 'submit' | 'delete') => {
    const service = type === 'submit' ? postMemberSupplierComplaintSubSubmit : postMemberSupplierComplaintSubDelete
    const { data, code } = await service(params)
    setCurrentIdIsInLoading((prev) => prev.filter((_item) => _item !== params.id))
    if (code === 1000) {
      ref.current?.submit()
    }
  }

  const formatData = (value) => {
    const { eventTimeStart, eventTimeEnd, ...rest } = value
    const newData = {
      ...rest,
      eventTimeStart:
        eventTimeStart && moment(eventTimeStart, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      eventTimeEnd: eventTimeEnd && moment(eventTimeEnd, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    }
    return newData
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          ref={ref}
          columns={columns}
          formatData={formatData}
          schema={complaintAndSuggestListSchema}
          fetchListData={handleFetch}
          expressionScope={{
            controllerBtns,
          }}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            // useAsyncSelect('status', fetchStatusOptions);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
