import { useIntl } from '@linkseeks/i18n'
import React, { useState } from 'react'
import { Card, Space, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import tobeHandleColumns from '../common/columns/tobeHandleColumns'
import querySchema, { handleFormSchema } from '../common/schema/tobeHandleQuerySchema'
import useFetchList from '../../memberEvaluate/hooks/useFetchList'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import CustomizeQueryList from '../../components/CustomizeQueryList'
import { Link } from '@linkseeks/router-core'
import useColumns from '../../memberRectification/common/hooks/useColumns'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useToggle } from '@linkseeks/hooks'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
interface Iprops {}
type submitType = {
  name: string
  project: string
  tips: string
  date: string
  level: string
  solution: string
}

const actions = createFormActions()

const List: React.FC<Iprops> = (props: Iprops) => {
  const { fetchListData } = useFetchList()
  const [visible, toggle] = useToggle()
  const [recordData, setRecordData] = useState<null>(null)

  const intl = useIntl()

  const { columns } = useColumns(tobeHandleColumns, [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
      render: (text, record, index) => {
        return (
          <AuthButton type="custom" code="deal">
            <div>
              <a onClick={() => handleClick(record)}>
                {intl.formatMessage({
                  id: 'member.memberWarning.tobeHandleWarning.index.deal',
                })}
              </a>
            </div>
          </AuthButton>
        )
      },
    },
  ])

  const handleClick = (record: any) => {
    setRecordData(record)
    toggle(true)
  }

  const handleFetch = async (params) => {
    // const result = fetchListData(getMemberSupplierAbilitySubPage, params);
    return {
      totalCount: 0,
      data: [],
    }
  }

  const onSubmit = (value: submitType) => {
    console.log(value)
    toggle(false)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <CustomizeQueryList
          columns={columns}
          schema={querySchema}
          fetchListData={handleFetch}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          }}
        />
      </Card>
      <Drawer
        visible={visible}
        title={intl.formatMessage({ id: 'member.memberWarning.tobeHandleWarning.index.warnDeal' })}
        width={600}
        onClose={() => toggle(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Space align="end">
              <Button onClick={() => toggle(false)}>
                {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel' })}
              </Button>
              <Button onClick={() => actions.submit()} type="primary">
                {intl.formatMessage({ id: 'member.memberWarning.tobeHandleWarning.index.confirm' })}
              </Button>
            </Space>
          </div>
        }
      >
        <NiceForm schema={handleFormSchema} actions={actions} value={recordData} />
      </Drawer>
    </PageHeaderWrapper>
  )
}
export default List
