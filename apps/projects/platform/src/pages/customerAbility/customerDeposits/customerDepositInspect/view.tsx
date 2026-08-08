/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 10:12:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:06:28
 * @Description: 待审核入库考察
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  getMemberCustomerAbilitySubPageitemsRole,
  getMemberCustomerDepositInspectPage,
  getMemberCustomerDepositPageConditions,
} from '@apps/apis'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import useSpliceArray from '@/hooks/useSpliceArray'
import { GlobalConfig } from '@/global/config'
import comingSchema from '../../common/schames/comingSchema'
import verifyComingColumn from '../../common/columns/verifyComingColumn'
import { useQueryComingEffects } from '../../common/effects/useQueryComingEffects'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const formActions = createFormActions()

const CustomerDepositInspectIndex: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

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

  const fetchListData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }

    const res = await getMemberCustomerDepositInspectPage(payload)

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getMemberCustomerDepositPageConditions()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [], sources = [] } = data

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
        source: sources.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

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
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                if (!GlobalConfig.global.siteInfo.enableMultiTenancy) {
                  useAsyncInitSelect(['memberType', 'roleId', 'source'], fetchSearchItems)
                }
                useQueryComingEffects($, actions)
              }}
              schema={comingSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CustomerDepositInspectIndex
