import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Tabs, Drawer, Cascader } from 'antd'
import { createFormActions, FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import TableLayout from './table'
import { fetchOrderApi } from '../../apis'
import { materialSupplyColumns, memberColumns } from './columns'
import { createSubMemberSchema, materialSupplySchema, memberModalSchema } from './schema'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getProductSelectGetSelectBrand, getProductSelectGetSelectCustomerCategory } from '@apps/apis'
import { getMemberAbilityMaintenancePageitems } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCreateMemberRegisterBusinessEffects } from '@/formSchema/effects/useCreateMemberRegisterBusinessEffects'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import useRegisterFields from '@/hooks/useRegisterFields'

const { onFormMount$ } = FormEffectHooks

const subMemberActions = createFormActions()
const materialSupplyActions = createFormActions()
export interface MemberModalTableProps {
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
  setLik: any
  mode?: 'checkbox' | 'radio'
  customizeRadio?: boolean
  customKey?: string
  /** 搜索的schema */
  schema?: any
  /** schema搜索第一个的name */
  effects?: string
  /** 是否可选 */
  ctl?: boolean
  rowSelection?: any
}

type drawerType = {
  width?: number | string
  title?: string
}

type SubMemberSearchFormValuesType = {
  name: string
  memberType: string
  roleId: number
  level: number
  status: number
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
  customerCategoryId: number
}

const NewMemberModalTable: React.FC<MemberModalTableProps> = (props: MemberModalTableProps) => {
  const intl = useIntl()
  const { schemaAction, currentRef, confirmModal, productRef, setLik } = props
  const ref = useRef<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [drawer, setDrawer] = useState<drawerType>({
    width: 900,
    title: intl.formatMessage({ id: 'purchaseRequisition.xuanzegongyinghui', defaultMessage: '选择供应会员' }),
  })

  const { registerFields, setRegisterFields } = useRegisterFields()

  const handleConfirm = () => {
    const rowItem = ref.current.RowCtl.selectRow[0]
    console.log(rowItem, 'row')
    if (rowItem) {
      schemaAction.setFieldValue('vendorRoleId', rowItem.roleId || rowItem.memberRoleId)
      schemaAction.setFieldValue('vendorMemberId', rowItem.memberId)
      schemaAction.setFieldValue('vendorMemberName', rowItem.memberName || rowItem.name)
    }
    confirmModal && confirmModal()
    setLik(rowItem)
    setVisible(false)
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }} onClick={() => setVisible(false)}>
        <Button style={{ marginRight: 8 }}>{intl.formatMessage({ id: 'transaction_components.quxiao' })}</Button>
        <Button type="primary" onClick={handleConfirm}>
          {intl.formatMessage({ id: 'transaction_components.tijiao' })}
        </Button>
      </div>
    )
  }

  const otherProps = { footer: renderFooter() }

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
      }
    }
  }, [])

  const handleChange = (e) => {
    const params: drawerType = {}
    switch (e) {
      case '1':
        params.title = intl.formatMessage({
          id: 'purchaseRequisition.xuanzegongyinghui',
          defaultMessage: '选择供应会员',
        })
        params.width = 900

        break
      case '2':
        params.title = intl.formatMessage({
          id: 'contract.xuanzewuliaohuoyuangongyingshang',
          defaultMessage: '选择物料货源清单的供应商',
        })
        params.width = 1000
        break
    }
    setDrawer({ ...params })
  }

  const useStateEffects = ($, actions) => {
    useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
    useAsyncInitSelect(['brandId'], async () => {
      const res = await getProductSelectGetSelectBrand()
      if (res.code === 1000) {
        const { data } = res
        return {
          brandId: data?.map((item) => ({ label: item.name, value: item.id })),
        }
      }
      return {}
    })

    // 初始化品类数据
    useCustomerCategoriesBusinessEffects($, actions, {
      fieldName: 'customerCategoryId',
    })
  }

  const useSubMemberEffects = ($, actions) => {
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
  }

  const handleFormatSubMemberSubmitValues = (values: SubMemberSearchFormValuesType) => {
    return values
  }

  const handleMaterialSupplySubmitValues = (values) => {
    const { customerCategoryId, ...rest } = values
    return {
      ...rest,
      customerCategoryId: customerCategoryId ? +customerCategoryId[customerCategoryId.length - 1] : undefined,
    }
  }

  return (
    <Drawer
      destroyOnClose
      placement="right"
      title={drawer?.title}
      visible={visible}
      onClose={() => setVisible(false)}
      width={drawer?.width}
      {...otherProps}
    >
      <Tabs onChange={handleChange}>
        <Tabs.TabPane tab={intl.formatMessage({ id: 'contract.purchase.member', defaultMessage: '供应会员' })} key={1}>
          <TableLayout
            currRef={ref}
            customKey="memberId"
            effects="name"
            columns={memberColumns}
            fetchdata={(params) => fetchOrderApi.getMemberListByMemberName({ lifeCycleStageRuleId: 3, ...params })}
            searchFormProps={{
              components: {
                MemberRegisterAreaField,
                Cascader,
              },
              actions: subMemberActions,
            }}
            schema={createSubMemberSchema(registerFields)}
            useBusinessEffects={useSubMemberEffects}
            onFormatSubmitValues={handleFormatSubMemberSubmitValues}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'contract.wuliaohuoyuangongyingshang',
            defaultMessage: '物料货源清单的供应商',
          })}
          key={2}
        >
          <TableLayout
            currRef={ref}
            customKey="id"
            tableProps={{
              rowKey: 'id',
            }}
            effects="name"
            columns={materialSupplyColumns}
            scroll={{ x: '100vw' }}
            schema={materialSupplySchema}
            fetchdata={(params) => fetchOrderApi.getProductGoodsGetGoodsSupply({ lifeCycleStageRuleId: 3, ...params })}
            searchFormProps={{
              components: {
                Cascader,
              },
              actions: materialSupplyActions,
            }}
            useBusinessEffects={useStateEffects}
            onFormatSubmitValues={handleMaterialSupplySubmitValues}
          />
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  )
}
export default NewMemberModalTable
