import React, { useCallback, useRef } from 'react'
import { Card, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { inspectionListSchema } from '../common/schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import useColumns from '../../memberRectification/common/hooks/useColumns'
import queryColumns from '../common/columns'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import {
  getMemberSupplierInspectPage,
  GetMemberInspectPageRequest,
  GetMemberInspectPageResponse,
  getMemberSupplierInspectTypes,
  postMemberSupplierInspectDelete,
} from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
/**
 * 会员咔嚓
 */
interface Iprops {}

const MemberInspection: React.FC<Iprops> = (props: Iprops) => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { columns } = useColumns(queryColumns, [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
      render: (text, record, index) => {
        if (!record.updateOrDel) {
          return null
        }
        return (
          <Space>
            <EditAuthButton>
              <Link to={`/supplierAbility/memberInspection/inspection/edit?id=${record.id}`}>
                {intl.formatMessage({
                  id: 'member.memberInspection.common.columns.index.edit',
                })}
              </Link>
            </EditAuthButton>
            <AuthButton type="custom" code="delete">
              <a onClick={() => handleDelete({ id: record.id })}>
                {intl.formatMessage({
                  id: 'member.memberInspection.common.columns.index.delete',
                })}
              </a>
            </AuthButton>
          </Space>
        )
      },
    },
  ])

  const handleDelete = async (params: { id: number }) => {
    const { data, code } = await postMemberSupplierInspectDelete(params)
    if (code === 1000) {
      ref.current?.submit()
    }
  }

  const controllerBtns = (
    <div>
      <AddAuthButton>
        <Link to={`/supplierAbility/memberInspection/inspection/add`}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
    </div>
  )

  const fetchListData = async (params: GetMemberInspectPageRequest): Promise<GetMemberInspectPageResponse> => {
    const { data, code } = await getMemberSupplierInspectPage(params)
    if (code === 1000) {
      return data
    }
    return {
      totalCount: 0,
      data: [] as GetMemberInspectPageResponse['data'],
    }
  }

  const fetchInspectType = useCallback(async () => {
    const { code, data } = await getMemberSupplierInspectTypes()
    if (code === 1000) {
      return data.map((_item) => ({ label: _item.text, value: _item.id }))
    }
    return []
  }, [])

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={columns}
          ref={ref}
          schema={inspectionListSchema}
          fetchListData={fetchListData}
          expressionScope={{
            controllerBtns,
          }}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            useAsyncSelect('inspectType', fetchInspectType)
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberInspection
