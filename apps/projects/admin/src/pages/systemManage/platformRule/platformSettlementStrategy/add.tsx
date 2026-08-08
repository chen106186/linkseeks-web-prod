/*
 * @Author: Bill
 * @Date: 2020-10-19 16:54:15
 * @Description: 新建会员策略支付策略
 */

import React, { useEffect, useState, useRef } from 'react'
import NiceForm from '@/components/NiceForm'
import { Button, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { infoSchema } from './info/schema'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import SettleMethod from '../components/SettleMethod'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { getMemberManageAllProviderPage } from '@apps/apis'
import {
  getSettlementCommonGetPlatformStrategySettlementOrderType,
  postSettlementPlatformConfigAddPlatformSettlementStrategy,
  postSettlementPlatformConfigUpdatePlatformSettlementStrategy,
} from '@apps/apis'
import { getOrderPlatformSettlementCategoryList, getOrderPlatformSettlementTypeList } from '@apps/apis'
import useGetInfo from './info/useGetInfo'
import { PageHeaderWrapper } from '@apps/components'

const anchorColumn = [
  {
    key: 'basicInfo',
    label: '基本信息',
  },
  {
    key: 'member',
    label: '适用会员',
  },
]

export const fetchOptions = (service) => {
  return async function () {
    const res = await service()
    if (res.code === 1000) {
      return res.data.map((item) => {
        return { label: item.text, value: item.id }
      })
    }
    return []
  }
}

const formActions = createFormActions()

const common_columns: RecordColumns<any>[] = [
  { title: 'ID', key: 'memberId' },
  {
    title: '会员名称',
    key: 'name',
    searchField: 'Input',
    render: (text: string, record: any) => {
      return record.name || record.memberName
    },
  },
  { title: '会员类型', key: 'memberTypeName' },
  { title: '会员角色', key: 'roleName' },
  {
    title: '会员等级',
    key: 'levelTag',
    render: (text: string, record: any) => {
      return record.levelTag || record.levelName
    },
  },
]
const MemberSettleAdd: React.FC = () => {
  const { pathname } = useLocation()
  const { id, preview } = usePageStatus()
  const { initialValue } = useGetInfo({ id: id })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const modalRef = ModalFormTable.useTableRef()
  const [list, setList] = useState<any[]>([])
  const isAdd = !id && !preview
  const isEdit = pathname.includes('edit')
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const tableAddButton = () => {
    return (
      <div>
        {isAdd || isEdit ? (
          <Button
            onClick={() => modalRef.current.setVisible(true)}
            style={{ marginBottom: 16 }}
            block
            icon={<PlusOutlined />}
            type="dashed"
          >
            选择适用会员
          </Button>
        ) : null}
      </div>
    )
  }

  //
  const handleRemove = (uniqueId: number) => {
    const string = 'memberCard.someLists'
    const chooseList = formActions.getFieldValue(string)
    const res = chooseList.filter((item) => item.uniqueId !== uniqueId)
    formActions.setFieldValue(string, res)
    setList(res)
  }

  const columns = common_columns.concat(
    isAdd || isEdit
      ? [
          {
            title: '操作',
            key: 'option',
            render: (text, record) => {
              return <a onClick={() => handleRemove(record.uniqueId)}>删除</a>
            },
          },
        ]
      : [],
  )

  // 获取适用会员
  const fetchMemberData = async (params: any) => {
    const { data } = await getMemberManageAllProviderPage(params)
    return {
      ...data,
      data: data.data.map((v) => ({ ...v, uniqueId: v.memberId + '_' + v.roleId })),
      totalCount: data.totalCount,
    }
  }

  // 使用会员弹框确认
  const handleOkAddMember = () => {
    const selectItems = modalRef.current.getSelectionItems()
    if (selectItems.length > 0) {
      const result = [...list, ...selectItems]
      formActions.setFieldValue('memberCard.someLists', result)
      setList(result)
      modalRef.current.clearSelection()
      modalRef.current.setVisible(false)
    } else {
      message.info('请选择一条记录')
    }
  }

  // 提交
  const handleSubmit = (value) => {
    const memberList =
      value.someLists &&
      value.someLists.map((item) => ({
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
      memberList: value.isDefault ? [] : memberList,
      settlementWay: value.settlementWay.active,
      settlementDays: value.settlementWay.otherValues[0],
      settlementDate: value.settlementWay.otherValues[1],
      isDefault: value.isDefault,
      settlementPaymentType: value.settlementPaymentType,
      estimatedPaymentDate: value.settlementWay.payDay,
    }
    const serviceActions = isAdd
      ? postSettlementPlatformConfigAddPlatformSettlementStrategy
      : postSettlementPlatformConfigUpdatePlatformSettlementStrategy

    const postData = { ...tempData, id: id || 0 }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.goBack()
      }
    })
  }
  // 提交
  const handleClick = () => {
    formActions.submit()
  }

  // 从PAAS平台--规则配置--平台规则配置取已勾选的结算方式决定是否显示结算方式
  const fetchBalancedMethods = async () => {
    const { data, code } = await getOrderPlatformSettlementCategoryList()
    const config = {
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
        //@ts-ignore
        state.props['x-component-props']['options'] = data
      })
    })
  }, [])

  const fetchPaymentType = async () => {
    const { data, code } = await getOrderPlatformSettlementTypeList()
    if (code === 1000) {
      return data.map((_item) => ({ value: _item.methodCode, label: _item.methodName }))
    }
    return []
  }

  useEffect(() => {
    if (!initialValue) {
      return
    }

    const list =
      initialValue.memberList?.map((item) => ({
        ...item,
        uniqueId: item.memberId + '_' + item.roleId,
        name: item.memberName,
        levelTag: item.levelName,
      })) || []

    if (list.length > 0) {
      formActions.setFieldValue('memberCard.someLists', list)
      // 必须设置key
      modalRef.current.setSelectionKeys(list.map((item) => item.uniqueId))
    }
  }, [initialValue])

  const renderTitle = () => {
    if (isAdd) {
      return '新增会员策略'
    }
    if (isEdit) {
      return '编辑会员策略'
    }
    return '查看会员策略'
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
          保存
        </Button>
      }
    >
      <NiceForm
        editable={isAdd || isEdit}
        actions={formActions}
        initialValues={
          isAdd
            ? {
                isDefault: 1,
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
        onSubmit={(values) => handleSubmit(values)}
        schema={infoSchema}
        effects={() => {
          // 获取单据类型
          useAsyncSelect('settlementOrderType', fetchOptions(getSettlementCommonGetPlatformStrategySettlementOrderType))
          useAsyncSelect('settlementPaymentType', fetchPaymentType)
        }}
      />
      <ModalFormTable
        modalTitle="选择适用会员"
        actionRef={modalRef}
        request={fetchMemberData}
        columns={common_columns}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="uniqueId"
        pagination={false}
        onOk={handleOkAddMember}
        width={1000}
        getCheckboxProps={(record) => {
          return {
            disabled: list?.map((item) => item.uniqueId).includes(record.uniqueId),
          }
        }}
      />
    </PageHeaderWrapper>
  )
}

export default MemberSettleAdd
