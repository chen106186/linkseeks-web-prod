import React, { useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { createFormActions, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../model/useModalTable'
// import { columnsSetMember } from '../../constant'
import { usePageStatus } from '@/hooks/usePageStatus'
import { clearModalParams, omit } from '@/utils'
import { createSubMemberSchema, formSearch } from '../../schema/modal'
import { inviteMemberModalColumns } from '../../constant'
import DrawerTable from '@/components/DrawerTable'
import { getMemberAbilityMaintenancePageitems, postMemberManageLowerProviderPage } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import NiceForm from '@/components/NiceForm'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCreateMemberRegisterBusinessEffects } from '@/formSchema/effects/useCreateMemberRegisterBusinessEffects'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import useRegisterFields from '@/hooks/useRegisterFields'
import { Cascader } from 'antd'

const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  memberType: string
  roleId: number
  level: number
  status: number
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
}
export interface MemberModalProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const MemberModal: React.FC<MemberModalProps> = (props) => {
  const { type = 'checkbox', schemaAction, currentRef, ...restProps } = props

  const intl = useIntl()

  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'memberId' })

  const { id, preview, pageStatus } = usePageStatus()

  const { registerFields, setRegisterFields } = useRegisterFields()

  const ref = useRef<any>({})

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  // 添加会员
  const handleOkAddMember = () => {
    setVisible(false)
    let processedData = rowSelectionCtl.selectRow.map((item) => {
      delete item['id']
      return { ...item, isSubMember: true, isSend: true }
    })
    schemaAction.setFieldValue('memberList', [])
    setTimeout(() => {
      schemaAction.setFieldValue('memberList', processedData)
    }, 300)
    clearModalParams()
  }

  const handleCancelAddMember = () => {
    setVisible(false)
    clearModalParams()
  }

  const fetchMemberList = async (params) => {
    try {
      const { data } = await postMemberManageLowerProviderPage(
        { lifeCycleStageRuleId: 1, ...params },
        { ctlType: 'none' },
      )
      return data
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
  }

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  return (
    <DrawerTable
      confirm={handleOkAddMember}
      cancel={handleCancelAddMember}
      visible={visible}
      columns={inviteMemberModalColumns}
      rowSelection={rowSelection}
      fetchTableData={(params) => fetchMemberList(params)}
      resetDrawer={{
        destroyOnClose: true,
      }}
      tableProps={{
        rowKey: 'memberId',
      }}
      drawerTitle={intl.formatMessage({ id: 'detail.purchase.selectMenber' })}
      currentRef={ref}
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
            useAsyncInitSelect(['memberType', 'roleId', 'level', 'status', 'currencyType'], async () => {
              const res = await getMemberAbilityMaintenancePageitems()
              if (res.code === 1000) {
                const { data } = res
                const { status, memberTypes, roles, levels, currencyType } = data || {}
                return {
                  memberType: memberTypes?.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
                  roleId: roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
                  level: levels?.map((item) => ({ label: item.levelTag, value: item.level })),
                  status: status?.map((item) => ({ label: item.text, value: item.id })),
                  currencyType: currencyType?.map((item) => ({ label: item.text, value: item.id })),
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
          schema={createSubMemberSchema(registerFields)}
        />
      }
      keepAlive={false}
    />
  )
}

MemberModal.defaultProps = {}

export default MemberModal
