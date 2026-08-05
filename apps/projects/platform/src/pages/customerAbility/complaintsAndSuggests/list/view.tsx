import React, { useRef, useState } from 'react'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { createListColumns } from '../common/columns'
import { complaintAndSuggestListSchema } from '../common/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import useColumns from '../../common/hooks/useColumns'
import {
  getMemberCustomerComplaintUpperPage,
  GetMemberCustomerComplaintUpperPageRequest,
  postMemberCustomerComplaintUpperDelete,
  postMemberCustomerComplaintUpperSubmit,
} from '@apps/apis'
import moment from 'moment'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

interface Iprops {}

const queryColumns = createListColumns({
  detail: '/supplierAbility/complaintsAndSuggests/list/detail',
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
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
              <EditAuthButton>
                <Link to={`/supplierAbility/complaintsAndSuggests/list/edit?id=${record.id}`}>
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
        }
        if (record.handle) {
          return (
            <DetailAuthButton>
              <Link to={`/supplierAbility/complaintsAndSuggests/list/detail?id=${record.id}`}>
                {intl.formatMessage({
                  id: 'member.complaintsAndSuggests.index.dealComplainResult',
                })}
              </Link>
            </DetailAuthButton>
          )
        }
        return null
      },
    },
  ])

  const controllerBtns = (
    <div>
      <AddAuthButton>
        <Link to={'/supplierAbility/complaintsAndSuggests/list/add'}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
    </div>
  )

  const handleFetch = async (params: GetMemberCustomerComplaintUpperPageRequest) => {
    // const { eventTimeEnd, eventTimeStart, ...rest } = params;
    // let postData: Partial<GetMemberCustomerComplaintUpperPageRequest> = rest;
    // if (typeof eventTimeEnd !== 'undefined') {
    //   postData = {
    //     ...rest,
    //     // eventTimeStart: moment(eventTimeStart, 'YYYY-MM-DD').startOf("day").format('YYYY-MM-DD HH:mm:ss'),
    //     // eventTimeEnd: moment(eventTimeEnd, 'YYYY-MM-DD').endOf("day").format('YYYY-MM-DD HH:mm:ss'),
    //   }
    // }
    // const result = fetchListData(getMemberCustomerComplaintUpperPage, postData);
    // return result
  }

  const handleSubmit = async (params: { id: number }, type: 'submit' | 'delete') => {
    const newList = [...currentIdIsInLoading]
    newList.push(params.id)
    const service = type === 'submit' ? postMemberCustomerComplaintUpperSubmit : postMemberCustomerComplaintUpperDelete
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
            // useAsyncSelect('status', fetchStatusOptions);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
