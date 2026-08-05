/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 14:34:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 16:26:23
 * @Description: 待入库分类
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { getMemberSupplierDepositClassifyPage, getMemberSupplierDepositPageConditions } from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { GlobalConfig } from '@/global/config'
import comingSchema from '../../common/schames/comingSchema'
import verifyComingColumn from '../../common/columns/verifyComingColumn'
import { useQueryComingEffects } from '../../common/effects/useQueryComingEffects'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const formActions = createFormActions()

const MemberPrComingClassify: React.FC<{}> = (props) => {
  const ref = useRef<any>({})

  const intl = useIntl()

  const handleJumpAudit = (record) => {
    history.push(`/supplierAbility/manage/memberPrComingClassify/edit?validateId=${record.validateId}`)
  }

  const defaultColumns = verifyComingColumn('/supplierAbility/manage/memberPrComingClassify/detail').concat([
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

    const res = await getMemberSupplierDepositClassifyPage(payload)

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getMemberSupplierDepositPageConditions()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [], sources = [] } = data

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

export default MemberPrComingClassify
