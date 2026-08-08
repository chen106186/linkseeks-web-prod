import React, { useCallback, useRef, useState } from 'react'
import { Card, Space, Button, Spin, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { setColumnsByLinks } from '../common/columns/queryColumns'
import { rectificationListSchema } from '../common/schema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { PlusOutlined } from '@ant-design/icons'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  postMemberSupplierRectifyWaitAddSend,
  postMemberSupplierRectifyWaitAddDelete,
  getMemberSupplierRectifyWaitAddPage,
} from '@apps/apis'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import useColumns from '../common/hooks/useColumns'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface Iprops {}

const queryColumns = setColumnsByLinks(
  {
    detail: '/supplierAbility/memberRectification/rectificationAdd/detail',
  },
  ['agreeResultName'],
)

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const ref = useRef<any>({})
  const intl = useIntl()
  const [currentIdIsInLoading, setCurrentIdIsInLoading] = useState<number[]>([])
  const { columns, fetchStatusOptions } = useColumns(
    queryColumns,
    [
      {
        title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
        render: (text, record) => {
          const { sendOrUpdateOrDel } = record
          const loading = currentIdIsInLoading.includes(record.id)
          return (
            <Space>
              <AuthButton type="custom" code="sendRectifyNotice">
                <Popconfirm
                  placement="top"
                  title={intl.formatMessage({
                    id: 'member.memberRectification.rectificationAdd.add.isConfirmSendNotify',
                  })}
                  onConfirm={() => handleSendNotice(record.id, 'send')}
                >
                  <Spin spinning={loading}>
                    <a>
                      {intl.formatMessage({
                        id: 'member.memberRectification.rectificationAdd.index.sendRectifyNotice',
                      })}
                    </a>
                  </Spin>
                </Popconfirm>
              </AuthButton>
              <EditAuthButton>
                <Link to={`/supplierAbility/memberRectification/rectificationAdd/edit?id=${record.id}`}>
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
                  onConfirm={() => handleSendNotice(record.id, 'remove')}
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
    ],
    { key: 'outerStatus' },
  )

  const controllerBtns = (
    <div>
      <AddAuthButton>
        <Link to={'/supplierAbility/memberRectification/rectificationAdd/add'}>
          <Button type="primary" icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'member.memberInspection.index.new' })}
          </Button>
        </Link>
      </AddAuthButton>
    </div>
  )

  const handleSendNotice = useCallback(async (id: number, type: 'send' | 'remove') => {
    setCurrentIdIsInLoading((prev) => prev.concat(id))
    const service = type === 'send' ? postMemberSupplierRectifyWaitAddSend : postMemberSupplierRectifyWaitAddDelete
    const { data, code } = await service({ id: id })
    setCurrentIdIsInLoading((prev) => prev.filter((_item) => _item !== id))
    if (code === 1000) {
      ref.current?.submit()
    }
  }, [])

  const handleFetch = async (params) => {
    const result = fetchListData(getMemberSupplierRectifyWaitAddPage, params)
    return result
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          ref={ref}
          columns={columns}
          schema={rectificationListSchema}
          fetchListData={handleFetch}
          expressionScope={{
            controllerBtns,
          }}
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
