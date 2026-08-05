/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-29 09:36:25
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 09:57:24
 * @Description: 发券明细
 */
import React, { useState, useMemo } from 'react'
import { Space, Button, Drawer, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import { createFormActions, DatePicker, NumberPicker } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import MellowCard from '@/components/MellowCard'
import type { FetchParamsType } from '@/components/PolymericTable'
import PolymericTable from '@/components/PolymericTable'
import { querySchema, drawerSchema } from './schema'
import {
  postMemberManagePlatformMarketingSuitablePage,
  postMemberManagePlatformMarketingSuitablePageItems,
} from '@apps/apis'

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
   * 是否显示删除按钮
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
  const { memberList, suitableMemberLevelTypes, onChange, ...rest } = props
  const defaultSuitableMemberList = memberList
    ? memberList.map((item) => ({ onlyId: `${item.memberId}+${item.roleId}`, ...item }))
    : []
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [suitableMemberList, setSuitableMemberList] = useState<SuitableMemberType[]>(defaultSuitableMemberList)
  const [queryValue, setQueryValue] = useState<ExtraFetchType | null>(null)

  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'onlyId', type: 'checkbox' })

  // 根据会员名称过滤会员列表
  const handleFilterMemberListByName = (value: ExtraFetchType) => {
    setQueryValue(value)
  }

  // 获取未选择的会员类型列表
  const fetchSuitableMemberExcludeList = async (params: FetchParamsType) => {
    const excludeMemberList = memberList.map((item) => ({
      memberId: item.memberId,
      roleId: item.roleId,
    }))
    const res = await postMemberManagePlatformMarketingSuitablePage(
      {
        ...params,
        excludeMemberList,
        suitableMemberLevelTypes: suitableMemberLevelTypes || [],
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      const { data, ...rest } = res.data
      const newData = data.map((item) => ({
        onlyId: `${item.memberId}+${item.roleId}`,
        ...item,
      }))
      return { ...res.data, data: newData }
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
      title: '会员名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '适用用户',
      dataIndex: 'suitableMemberTypeName',
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      dataIndex: 'levelTag',
    },
    {
      title: '成为会员时间',
      dataIndex: 'becomeTime',
    },
  ]

  const triggerChange = (value: ChangeValueItem[]) => {
    if (onChange) {
      onChange(value)
    }
  }

  const outerRowSelection: any = {
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
      message.warning('请选择会员')
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
      message.warning('请勾选需要删除的会员')
      return
    }
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定需要删除选中的会员吗？`,
      onOk() {
        const filtered = suitableMemberList.filter((item) => !keys.includes(item.onlyId))
        setSuitableMemberList(filtered)
        triggerChange(filtered.map(({ onlyId, disabled, ...rest }) => ({ ...rest })))
        setSelectedRowKeys([])
      },
    })
  }

  const outerColumns = columns.concat({
    title: '操作',
    dataIndex: 'option',
    align: 'center',
    render: (_, record) => (
      <Button
        type="link"
        disabled={record.disabled !== undefined ? record.disabled : true}
        onClick={() => handleBatchDelete([record.onlyId])}
      >
        删除
      </Button>
    ),
  })

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await postMemberManagePlatformMarketingSuitablePageItems(undefined, {
      ctlType: 'none',
    })

    if (res.code === 1000) {
      const { memberTypes = [], levels = [], suitableMemberTypes = [] } = res.data

      return {
        memberTypeEnum: memberTypes.map((item) => ({ label: item.name, value: item.value })),
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
        选择会员
      </Button>
      <Button onClick={() => handleBatchDelete(selectedRowKeys)}>批量删除</Button>
    </Space>
  )

  const filtered = useMemo(
    () =>
      queryValue && queryValue?.name
        ? suitableMemberList.filter((item) => item.name!.includes(queryValue.name))
        : suitableMemberList,
    [queryValue, suitableMemberList],
  )

  return (
    <MellowCard title="发券明细" {...rest}>
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
          effects: ($, actions) => {},
          onSubmit: (values: ExtraFetchType) => handleFilterMemberListByName(values),
        }}
      />

      <Drawer
        title="选择会员"
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
              取 消
            </Button>
            <Button onClick={handleConfirm} type="primary">
              确 定
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
