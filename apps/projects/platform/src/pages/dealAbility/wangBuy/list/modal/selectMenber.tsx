import React, { useEffect, useRef, useState } from 'react'
import { Drawer, Button, Cascader } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
// import { createSubMemberSchema } from '../../../schema'
import { getMemberAbilityMaintenancePageitems, getMemberManagePlatformProviderPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCreateMemberRegisterBusinessEffects } from '@/formSchema/effects/useCreateMemberRegisterBusinessEffects'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import { createSubMemberSchema } from './schema'
import { lifecyclePhaseRules } from '@/constants/order'

const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  memberTypeId: string
  roleId: number
  level: number
  status: number
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
}

interface Iprops {
  rowCtl?: any
  visible: boolean
  onclose?()
  confirm?(e: any)
}
const intl = getIntl()
const SelectMenber: React.FC<Iprops> = ({ visible, onclose, confirm, rowCtl }) => {
  const [registerFields, setRegisterFields] = useState([])
  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'id' })
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberId' }),
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.memberName' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]
  const fetchGoodsData = async (params) => {
    try {
      const { data } = await getMemberManagePlatformProviderPage(
        { lifeCycleStageRuleId: lifecyclePhaseRules.SUPPLIER_SOURCE, ...params },
        { ctlType: 'none' },
      )
      return data
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
  }

  useEffect(() => {
    if (rowCtl) {
      RowCtl.setSelectRow(rowCtl)
      RowCtl.setSelectedRowKeys(rowCtl.map((v) => v.id))
    }
  }, [visible])

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  return (
    <Drawer
      visible={visible}
      onClose={onclose}
      title={intl.formatMessage({ id: 'detail.purchase.selectMenber' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onclose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'detail.purchase.cancel' })}
          </Button>
          <Button onClick={() => confirm(RowCtl)} type="primary">
            {intl.formatMessage({ id: 'detail.purchase.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        currentRef={ref}
        columns={columns}
        tableProps={{ rowKey: 'id' }}
        rowSelection={rowSelection}
        fetchTableData={(params) => fetchGoodsData(params)}
        controlRender={
          <NiceForm
            actions={formActions}
            components={{
              MemberRegisterAreaField,
              Cascader,
            }}
            onSubmit={handleReloadList}
            effects={($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncInitSelect(['memberTypeId', 'roleId', 'level', 'status', 'currencyType'], async () => {
                const res = await getMemberAbilityMaintenancePageitems()
                if (res.code === 1000) {
                  const { data } = res
                  const { status, memberTypes, roles, levels, currencyType } = data || {}
                  return {
                    memberTypeId: memberTypes?.map((item) => ({
                      label: item.memberTypeName,
                      value: item.memberTypeId,
                    })),
                    roleId: roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
                    level: levels?.map((item) => ({ label: item.levelTag, value: item.level })),
                    status: status?.map((item) => ({ label: item.text, value: item.id })),
                    currencyType: currencyType?.map((item) => ({
                      label: item.text,
                      value: item.id,
                    })),
                  }
                }
                return {}
              })

              // 会员角色改变联动
              useCreateMemberRegisterBusinessEffects($, actions, {
                fieldName: 'roleId',
                setRegisterFields,
              })

              // 初始化品类数据
              useCustomerCategoriesBusinessEffects($, actions, {
                fieldName: 'categoryId',
              })
            }}
            // 需要替换掉schema
            schema={createSubMemberSchema(registerFields)}
          />
        }
        keepAlive={false}
      />
    </Drawer>
  )
}
export default SelectMenber
