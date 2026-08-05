/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-29 09:36:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 09:57:37
 * @Description: 发券明细
 */
import React, { useState, useMemo } from 'react'
import { Space, Button, Drawer, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { DatePicker, NumberPicker } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import MellowCard from '@/components/MellowCard'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { querySchema, drawerSchema } from './schema'
import { postMemberManageMarketingSuitablePage, postMemberManageMarketingSuitablePageItems } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const { confirm } = Modal

const drawerFormActions = createFormActions()

export type SuitableMemberType = {
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员角色id
   */
  roleId: number
  /**
   * 唯一的id
   */
  onlyId: string
  /**
   * 会员名称
   */
  name?: string
  /**
   * 适用用户
   */
  memberAgeTypeName?: string
  /**
   * 会员类型
   */
  memberTypeName?: string
  /**
   * 等级标签
   */
  levelTag?: string
  /**
   * 会员角色
   */
  roleName?: string
  /**
   * 成为会员时间开始
   */
  becomeTime?: string
  /**
   * 是否禁用的
   */
  disabled?: boolean
  /**
   * 适用会员类型
   */
  suitableMemberType: number
}

type MemberListItemType = {
  /**
   * 会员id
   */
  memberId: number
  /**
   * 角色id
   */
  roleId: number
}

interface IProps {
  /**
   * 适用会员等级类型
   */
  suitableMemberLevelTypes: number[]
  /**
   * 已发券用户
   */
  memberList: {
    /**
     * 会员id
     */
    memberId: number
    /**
     * 角色Id
     */
    roleId: number
  }[]
  /**
   * 点击确认触发事件，参数待定
   */
  onChange?: (value: ChangeValueItem[]) => void
}

export type ExtraFetchType = {
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员名称
   */
  name: string
  /**
   * 会员类型枚举
   */
  memberTypeEnum: number
  /**
   * 会员等级
   */
  level: number
  /**
   * 会员id和角色id数组，需要排除的数据
   */
  excludeMemberList: {
    memberId: number
    roleId: number
  }[]
  /**
   * 成为会员时间开始
   */
  becomeTime: string
  /**
   * 成为会员时间结束
   */
  becomeTimeEnd: string
  /**
   * 适用会员等级类型
   */
  suitableMemberLevelTypes: number[]
}

export type ChangeValueItem = Omit<SuitableMemberType, 'onlyId'>

const DeliverCoupon: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { memberList, suitableMemberLevelTypes, onChange, ...rest } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [suitableMemberList, setSuitableMemberList] = useState<SuitableMemberType[]>([])
  const [queryValue, setQueryValue] = useState<ExtraFetchType | null>(null)

  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'onlyId', type: 'checkbox' })

  // 根据会员名称过滤会员列表
  const handleFilterMemberListByName = (value: ExtraFetchType) => {
    setQueryValue(value)
  }

  // 获取未选择的会员类型列表
  const fetchSuitableMemberExcludeList = async (params: FetchParamsType & ExtraFetchType) => {
    const excludeMemberList = memberList?.map((item) => ({
      memberId: item.memberId,
      roleId: item.roleId,
    }))
    const res = await postMemberManageMarketingSuitablePage(
      {
        ...params,
        excludeMemberList,
        suitableMemberLevelTypes: suitableMemberLevelTypes || [],
      },
      {
        ctlType: 'none',
        penetrateError: true,
      },
    )
    if (res.code === 1000) {
      const { data, ...rest } = res.data
      const newData = data.map((item) => ({
        onlyId: `${item.memberId}+${item.roleId}`,
        ...item,
      }))
      return { ...res.data, data: newData }
    } else {
      message.destroy()
      message.error(res.message)
    }
    return { data: [], totalCount: 0 }
  }

  const columns: ColumnType<SuitableMemberType>[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.Vipname' }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.suitUsers' }),
      dataIndex: 'suitableMemberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.lfy' }),
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.roleName' }),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.levelTag' }),
      dataIndex: 'levelTag',
    },
    {
      title: intl.formatMessage({ id: 'merchantCoupon.becomeTime' }),
      dataIndex: 'becomeTime',
    },
  ]

  const triggerChange = (value: ChangeValueItem[]) => {
    if (onChange) {
      onChange(value)
    }
  }

  const outerRowSelection = {
    onChange: (keys: string[]) => {
      setSelectedRowKeys(keys)
    },
    selectedRowKeys: selectedRowKeys,
    getCheckboxProps: (record: SuitableMemberType) => ({
      disabled: record.disabled !== undefined ? record.disabled : true,
    }),
  }

  const handleVisibleDrawer = (flag: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleConfirm = () => {
    if (!RowCtl.selectRow.length) {
      message.warning(intl.formatMessage({ id: 'merchantCoupon.chooseVip' }))
      return
    }
    let newData = [...suitableMemberList]
    for (let i = 0; i < RowCtl.selectRow.length; i++) {
      const item = RowCtl.selectRow[i]
      // 防止重复添加
      if (!newData.find((current) => current.onlyId === item.onlyId)) {
        newData.push({
          ...item,
          disabled: false,
        })
      }
    }
    setSuitableMemberList(newData)
    const filtered = newData.map(({ onlyId, disabled, ...rest }) => ({ ...rest }))
    triggerChange(filtered)
    handleVisibleDrawer(false)
  }

  const handleBatchDelete = (keys: string[]) => {
    if (!keys.length) {
      message.warning(intl.formatMessage({ id: 'merchantCoupon.tickDeleteVip' }))
      return
    }
    confirm({
      title: intl.formatMessage({ id: 'merchantCoupon.tip' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'merchantCoupon.deleteChooseVip' }),
      onOk() {
        const filtered = suitableMemberList.filter((item) => !keys.includes(item.onlyId))
        setSuitableMemberList(filtered)
        triggerChange(filtered.map(({ onlyId, disabled, ...rest }) => ({ ...rest })))
        setSelectedRowKeys([])
      },
    })
  }

  const outerColumns = columns.concat({
    title: intl.formatMessage({ id: 'merchantCoupon.operation' }),
    dataIndex: 'option',
    align: 'center',
    render: (_, record) => (
      <Button
        type="link"
        disabled={record.disabled !== undefined ? record.disabled : true}
        onClick={() => handleBatchDelete([record.onlyId])}
      >
        {intl.formatMessage({ id: 'merchantCoupon.delete' })}
      </Button>
    ),
  })

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await postMemberManageMarketingSuitablePageItems(null, {
      ctlType: 'none',
    })

    if (res.code === 1000) {
      const { memberTypes = [], levels = [], suitableMemberTypes = [] } = res.data

      return {
        memberTypeEnum: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberTypeId })),
        level: levels.map((item) => ({ label: item.levelTag, value: item.level })),
        suitableMemberType: suitableMemberTypes?.map((item) => ({ label: item.name, value: item.value })),
      }
    }
    return {}
  }

  const ControllerBtns = () => (
    <Space size={16}>
      <Button type="primary" onClick={() => handleVisibleDrawer(true)}>
        <PlusOutlined />
        {intl.formatMessage({ id: 'merchantCoupon.choose' })}
      </Button>
      <Button onClick={() => handleBatchDelete(selectedRowKeys)}>
        {intl.formatMessage({ id: 'merchantCoupon.amountDelete' })}
      </Button>
    </Space>
  )

  const filtered = useMemo(
    () =>
      queryValue && queryValue?.name
        ? suitableMemberList.filter((item) => item.name.includes(queryValue.name))
        : suitableMemberList,
    [queryValue, suitableMemberList],
  )

  return (
    <MellowCard title={intl.formatMessage({ id: 'merchantCoupon.moneyDetail' })} {...rest}>
      <PolymericTable
        rowKey="onlyId"
        columns={outerColumns}
        dataSource={filtered}
        pagination={null}
        rowSelection={outerRowSelection}
        searchFormProps={{
          schema: querySchema,
          components: {
            ControllerBtns,
            RangePicker: DatePicker.RangePicker,
          },
          effects: ($, actions) => {
            // 这里不需要单独去监听 reset事件，Search内部点击重置按钮也会触发 submit 事件
            // onFormReset$().subscribe(() => {
            //   console.log('重置了')
            // });
          },
          onSubmit: (values: ExtraFetchType) => handleFilterMemberListByName(values),
        }}
      />

      <Drawer
        title={intl.formatMessage({ id: 'merchantCoupon.choose' })}
        width={1000}
        onClose={() => handleVisibleDrawer(false)}
        visible={visibleDrawer}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="onlyId"
          columns={columns}
          rowSelection={rowSelection}
          fetchDataSource={fetchSuitableMemberExcludeList}
          defaultPageSize={15}
          searchFormProps={{
            actions: drawerFormActions,
            schema: drawerSchema,
            components: {
              NumberPicker,
            },
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              useAsyncInitSelect(['memberTypeEnum', 'level', 'suitableMemberType'], fetchSelectOptions)
            },
          }}
          full
        />
      </Drawer>
    </MellowCard>
  )
}

export default DeliverCoupon
