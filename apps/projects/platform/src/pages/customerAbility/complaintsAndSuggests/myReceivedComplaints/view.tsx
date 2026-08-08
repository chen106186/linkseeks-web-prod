/**
 * 投诉建议 > 我收到的投诉建议
 */
import React, { useRef, useState } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { createListColumns } from '../common/columns'
import { complaintAndSuggestListSchema } from '../common/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import useColumns from '../common/hooks/useColumns'
import { getMemberCustomerComplaintUpperPage, GetMemberCustomerComplaintUpperPageRequest } from '@apps/apis'
import moment from 'moment'

const MyReceivedComplaints: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const { fetchListData } = useFetchList()
  const ref = useRef<any>({})
  const intl = useIntl()
  const queryColumns = createListColumns({
    detail: `${pathname}/detail`,
  })
  const { columns } = useColumns(queryColumns, [
    {
      title: `${intl.formatMessage({
        id: 'member.memberInspection.common.columns.index.operate',
        defaultMessage: '操作',
      })}`,
      width: 128,
      fixed: 'right',
      render: (text, record) => {
        if (record.handle) {
          return (
            <DetailAuthButton>
              <Link to={`${pathname}/detail?id=${record.id}`}>
                {intl.formatMessage({
                  id: 'member.complaintsAndSuggests.index.dealComplainResult',
                  defaultMessage: '处理',
                })}
              </Link>
            </DetailAuthButton>
          )
        }
      },
    },
  ])

  const controllerBtns = <></>

  const handleFetch = async (params: GetMemberCustomerComplaintUpperPageRequest) => {
    const { eventTimeEnd, eventTimeStart, ...rest } = params
    let postData: Partial<GetMemberCustomerComplaintUpperPageRequest> = {
      ...rest,
    }
    if (typeof eventTimeEnd !== 'undefined') {
      postData = {
        ...rest,
        eventTimeStart: moment(eventTimeStart, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        eventTimeEnd: moment(eventTimeEnd, 'YYYY-MM-DD').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      }
    }
    const result = fetchListData(getMemberCustomerComplaintUpperPage, {
      ...postData,
      complaintType: '2',
    })
    return result
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

export default MyReceivedComplaints
