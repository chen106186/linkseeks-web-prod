import React, { useCallback, useRef, useState } from 'react'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { querySchema } from './schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  getMemberSupplierRectifyManageStatusList,
  getMemberSupplierRectifyManagePage,
  postMemberSupplierRectifyManageRectify,
} from '@apps/apis'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import useColumns from '../../memberRectification/common/hooks/useColumns'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { commonColumns } from './common/columns'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface Iprops {}

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const ref = useRef<any>({})
  const [currentIdIsInLoading, setCurrentIdIsInLoading] = useState<number[]>([])
  const intl = useIntl()
  const { columns, fetchStatusOptions } = useColumns(
    commonColumns,
    [
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
        render: (text, record) => {
          const isloading = currentIdIsInLoading.includes(record.id)
          const rectifyOrUpdate = record.rectifyOrUpdate
          if (!rectifyOrUpdate) {
            return
          }
          return (
            <Space>
              <EditAuthButton>
                <Link to={`/supplierAbility/profile/rectificationQuery/edit?id=${record.id}`}>
                  {intl.formatMessage({
                    id: 'member.memberQuery.rectificationQuery.index.rectifing',
                  })}
                </Link>
              </EditAuthButton>
              <AuthButton type="custom" code="isConfirmRectify">
                <Popconfirm
                  placement="top"
                  title={intl.formatMessage({
                    id: 'member.memberQuery.rectificationQuery.index.isConfirmRectify',
                  })}
                  onConfirm={() => handleSendNotice(record.id)}
                >
                  <Spin spinning={isloading}>
                    <a>
                      {intl.formatMessage({
                        id: 'member.memberQuery.rectificationQuery.index.submitRectify',
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
            </Space>
          )
        },
      },
    ],
    { fetchStatusListApi: getMemberSupplierRectifyManageStatusList, key: 'outerStatus' },
  )

  const handleFetch = async (params) => {
    const result = fetchListData(getMemberSupplierRectifyManagePage, params)
    return result
  }

  const handleSendNotice = useCallback(async (id: number) => {
    try {
      setCurrentIdIsInLoading((prev) => prev.concat(id))
      const { data, code } = await postMemberSupplierRectifyManageRectify({ id: id })
      if (code === 1000) {
        ref.current?.submit()
      }
    } catch (error) {
    } finally {
      setCurrentIdIsInLoading((prev) => prev.filter((_item) => _item !== id))
    }
  }, [])

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          ref={ref}
          columns={columns}
          schema={querySchema}
          fetchListData={handleFetch}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            useAsyncSelect('outerStatus', fetchStatusOptions)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default List
