/*
 * @Description: 待确认入库审查
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, Modal, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import {
  getMemberCustomerDepositConfirmPage,
  getMemberCustomerModifyPageConditions,
  postMemberCustomerDepositConfirmBatch,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { GlobalConfig } from '@/global/config'
import verifyComingSchema from '../../common/schames/verifyComingSchema'
import verifyComingColumn from '../../common/columns/verifyComingColumn'
import { useQueryComingEffects } from '../../common/effects/useQueryComingEffects'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const { confirm } = Modal

const formActions = createFormActions()

const CustomerDepositConfirmIndex: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  const ref = useRef<any>({})

  const intl = useIntl()

  const handleJumpAudit = (record) => {
    history.push(`${pathname}/edit?validateId=${record.validateId}`)
  }

  const defaultColumns = verifyComingColumn(`${pathname}/detail`).concat([
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      render: (_, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleJumpAudit(record)}>
            {intl.formatMessage({ id: 'member.actions.verify' })}
          </Button>
        </EditAuthButton>
      ),
    },
  ])

  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const rowSelection = {
    onChange: (keys: number[]) => {
      setSelectedRowKeys(keys)
    },
    selectedRowKeys: selectedRowKeys,
  }

  const fetchListData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }

    const res = await getMemberCustomerDepositConfirmPage(payload)

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleBatch = () => {
    if (!selectedRowKeys.length) {
      message.warning(intl.formatMessage({ id: 'customerAbility.actions.batch.nothing' }))
      return
    }
    confirm({
      title: intl.formatMessage({ id: 'member.actions.verify-tip' }),
      icon: <QuestionCircleOutlined />,
      content: intl.formatMessage({ id: 'customerAbility.deposits.batch.tip' }),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMemberCustomerDepositConfirmBatch({
            validateIds: selectedRowKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
                setSelectedRowKeys([])
                resolve()
              }
              reject()
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getMemberCustomerModifyPageConditions()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [] } = data

      const rolendex = columns.findIndex((item) => item.dataIndex === 'roleName')

      if (rolendex) {
        columnsHandle.replace(rolendex, {
          ...columns[rolendex],
          filters: roles
            ?.map((item) => ({ text: item.roleName, value: item.roleId }))
            .filter((item) => item.value !== 0),
        })
      }

      return {
        memberType: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
        roleId: roles.map((item) => ({ label: item.roleName, value: item.roleId })),
      }
    }
    return {}
  }

  const ControllerBtns = () => (
    <Space>
      <Button onClick={handleBatch}>{intl.formatMessage({ id: 'member.actions.verify-batch' })}</Button>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          rowSelection={rowSelection}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              components={{
                ControllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                if (!GlobalConfig.global.siteInfo.enableMultiTenancy) {
                  useAsyncInitSelect(['memberType', 'roleId', 'source'], fetchSearchItems)
                }
                useQueryComingEffects($, actions)
              }}
              schema={verifyComingSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CustomerDepositConfirmIndex
