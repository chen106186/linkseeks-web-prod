import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import useGetInfo from './hooks/useGetInfo'
import NiceForm from '@/components/NiceForm'
import { usePageStatus } from '@/hooks/usePageStatus'
import { createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { PlusOutlined } from '@ant-design/icons'
import { infoSchema, memberSchema } from './schema'
import SettleMethod from '../../components/SettleMethod'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOptions } from '../../common'
import {
  getSettlementCommonGetStrategySettlementOrderType,
  getSettlementPlatformSettlementTypeList,
  postSettlementPlatformConfigAddMemberSettlementStrategy,
  postSettlementPlatformConfigUpdateMemberSettlementStrategy,
} from '@apps/apis'
import ModalTable from '@/components/ModalTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getMemberManageLowerPageBynamerole, getMemberManageRoleSubList, getMemberManageUpperPage } from '@apps/apis'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getOrderPlatformSettlementCategoryList } from '@apps/apis'

// const intl = getIntl();
const anchorColumn = [
  {
    key: 'basicInfo',
    label: getIntl().formatMessage({
      id: 'balance.settleRules.memberSettle.info.schema.addSchema.basicTab',
      defaultMessage: '基本信息',
    }),
  },
  {
    key: 'member',
    label: getIntl().formatMessage({
      id: 'balance.settleRules.memberSettle.info.schema.addSchema.memberTab',
      defaultMessage: '适用会员',
    }),
  },
]

const common_columns: any = [
  {
    title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.info.commonColumns.memberId' }),
    dataIndex: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.info.commonColumns.name' }),
    dataIndex: 'name',
    render: (text: string, record: any) => {
      return record.name || record.memberName
    },
  },
  {
    title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.info.commonColumns.memberTypeName' }),
    dataIndex: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.info.commonColumns.roleName' }),
    dataIndex: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.settleRules.memberSettle.info.commonColumns.levelTag' }),
    dataIndex: 'levelTag',
    render: (text: string, record: any) => {
      return record.levelTag || record.levelName
    },
  },
]

const formActions = createFormActions()

const Info = () => {
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const { initialValue } = useGetInfo({ id: +id })
  const [visible, setVisible] = useState(false)
  const [memberRowSelection, memberRowCtl] = useRowSelectionTable({ customKey: 'uniqueId' })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const isAdd = !id && !preview
  const { pathname } = useLocation()
  const isEdit = pathname.includes('edit')
  usePrompt({
    when: unsaved && (isAdd || isEdit),
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const handleVisible = () => {
    setVisible(true)
  }

  const handleRemove = (id: number) => {
    const string = 'memberCard.someLists'
    const chooseList = formActions.getFieldValue(string)
    const res = chooseList.filter((item) => item.uniqueId !== id)
    formActions.setFieldValue(string, res)
    // 必须设置key
    memberRowCtl.setSelectRow(res)
    memberRowCtl.setSelectedRowKeys(res.map((item) => item.uniqueId))
  }

  const columns = common_columns.concat(
    isAdd || isEdit
      ? [
          {
            title: intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.columns.operation' }),
            render: (text, record) => {
              return (
                <a onClick={() => handleRemove(record.uniqueId)}>
                  {intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.columns.operation.button' })}
                </a>
              )
            },
          },
        ]
      : [],
  )

  const tableAddButton = () => {
    return (
      <div>
        {isAdd || isEdit ? (
          <Button onClick={handleVisible} style={{ marginBottom: 16 }} block icon={<PlusOutlined />} type="dashed">
            {intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.tableAddButton' })}
          </Button>
        ) : null}
      </div>
    )
  }

  const fetchPaymentType = async () => {
    const { data, code } = await getSettlementPlatformSettlementTypeList()
    if (code === 1000) {
      return data.map((_item) => ({ value: _item.methodCode, label: _item.methodName }))
    }
    return []
  }

  // 获取适用会员下拉搜索框
  const fetchMemberSearchFilter = async () => {
    const { data } = await getMemberManageRoleSubList({}, { method: 'GET', ctlType: 'none' })
    // console.log(data);
    return data
  }

  // 使用会员弹框确认
  const handleOkAddMember = () => {
    formActions.setFieldValue('memberCard.someLists', memberRowCtl.selectRow)
    setVisible(false)
  }

  const handleCancelAddMember = () => {
    setVisible(false)
  }

  // 获取适用会员
  const fetchMemberData = async (params: any) => {
    // 如果单据类型是订单，获取当前会员的上级会员，如果是生产通知单和物流单那么获取他的下级
    const isOrderType = formActions.getFieldValue('card.layout.rightLayout.settlementOrderType') === 3
    const service = isOrderType ? getMemberManageUpperPage : getMemberManageLowerPageBynamerole
    const { data } = await service(params)
    return {
      ...data,
      data: data.data.map((v) => ({ ...v, uniqueId: v.memberId + '_' + v.roleId })),
      totalCount: data.totalCount,
    }
  }

  // 从PAAS平台--规则配置--平台规则配置取已勾选的结算方式决定是否显示结算方式
  const fetchBalancedMethods = async () => {
    const { data, code } = await getOrderPlatformSettlementCategoryList()
    // const length = data.length
    let config = {
      days: false,
      month: false,
    }

    if (code !== 1000) {
      return config
    }
    const codeToMap = ['', 'days', 'month']
    data.forEach((_item) => {
      config[codeToMap[_item.methodCode]] = true
    })
    return config
  }

  // 从PAAS平台--规则配置--平台规则配置取已勾选的结算方式决定是否显示结算方式
  useEffect(() => {
    fetchBalancedMethods().then((data) => {
      formActions.setFieldState('card.layout.leftLayout.settlementWay', (state) => {
        state.props['x-component-props']['options'] = data
      })
    })
  }, [])

  useEffect(() => {
    if (!initialValue) {
      return
    }

    const list = initialValue.memberList.map((item) => ({
      ...item,
      uniqueId: item.memberId + '_' + item.roleId,
      name: item.memberName,
      levelTag: item.levelName,
    }))
    formActions.setFieldValue('memberCard.someLists', list)
    // 必须设置key
    memberRowCtl.setSelectRow(list)
    memberRowCtl.setSelectedRowKeys(list.map((item) => item.uniqueId))
  }, [initialValue])

  // 提交
  const handleSubmit = async (value) => {
    const memberList = value.someLists.map((item) => ({
      memberId: item.memberId,
      roleId: item.roleId,
      memberName: item.name,
      memberTypeName: item.memberTypeName,
      roleName: item.roleName,
      levelName: item.levelTag,
    }))
    const tempData = {
      name: value.name,
      settlementOrderType: value.settlementOrderType,
      memberList: memberList,
      settlementWay: value.settlementWay.active,
      settlementDays: value.settlementWay.otherValues[0],
      settlementDate: value.settlementWay.otherValues[1],
      settlementPaymentType: value.settlementPaymentType,
      estimatedPaymentDate: value.settlementWay.payDay,
    }
    console.log('tempData', tempData)
    const serviceActions = isAdd
      ? postSettlementPlatformConfigAddMemberSettlementStrategy
      : postSettlementPlatformConfigUpdateMemberSettlementStrategy

    let postData: any = tempData
    if (!isAdd) {
      postData = { ...postData, id: id }
    }
    try {
      setSubmitLoading(true)
      setUnsaved(false)
      const { data, code, message: msg } = await serviceActions(postData)
      if (code !== 1000) {
        message.error(msg)
        return
      }
      history.push('/balance/settleRules/memberSettle')
    } finally {
      setSubmitLoading(false)
    }
  }
  // 提交
  const handleClick = () => {
    formActions.submit()
  }

  const renderTitle = () => {
    if (isAdd) {
      return intl.formatMessage({ id: 'balance.memberSettle.add', defaultMessage: '新增会员策略' })
    }
    if (isEdit) {
      return intl.formatMessage({ id: 'balance.memberSettle.edit', defaultMessage: '编辑会员策略' })
    }
    return intl.formatMessage({ id: 'balance.memberSettle.view', defaultMessage: '查看会员策略' })
  }

  return (
    <PageHeaderWrapper
      title={renderTitle()}
      items={anchorColumn}
      extra={
        <Button
          type="primary"
          loading={submitLoading}
          onClick={handleClick}
          style={{ display: isAdd || isEdit ? 'block' : 'none' }}
        >
          {intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.extra' })}
        </Button>
      }
    >
      <NiceForm
        editable={isAdd || isEdit}
        actions={formActions}
        initialValues={
          isAdd
            ? {
                settlementWay: {
                  active: 1,
                  otherValues: [30, 1],
                  payDay: null,
                },
              }
            : initialValue
        }
        expressionScope={{
          tableAddButton: tableAddButton(),
          tableColumns: columns,
        }}
        components={{ SettleMethod }}
        onSubmit={handleSubmit}
        schema={infoSchema}
        effects={() => {
          useAsyncSelect('settlementOrderType', fetchOptions(getSettlementCommonGetStrategySettlementOrderType)),
            useAsyncSelect('settlementPaymentType', fetchPaymentType)
        }}
      />
      <ModalTable
        modalTitle={intl.formatMessage({ id: 'balance.settleRules.memberSettle.info.modalTitle' })}
        confirm={handleOkAddMember}
        cancel={handleCancelAddMember}
        forceRender
        visible={visible}
        columns={common_columns}
        rowSelection={memberRowSelection}
        fetchTableData={(params) => fetchMemberData(params)}
        tableProps={{
          rowKey: 'uniqueId',
        }}
        formilyProps={{
          ctx: {
            schema: memberSchema,
            actions: formActions,
            components: { ModalSearch: Search, SearchSelect, Submit },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncSelect('roleId', fetchMemberSearchFilter, ['roleName', 'roleId'])
            },
          },
        }}
      />
    </PageHeaderWrapper>
  )
}

export default Info
