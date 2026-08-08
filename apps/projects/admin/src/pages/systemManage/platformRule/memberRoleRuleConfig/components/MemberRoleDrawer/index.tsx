/*
 * @Description: 会员角色规则 - 适用会员角色FormField
 */
import React, { useEffect, useRef } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './schema'

export type MemberRoleType = {
  /**
   * 角色id
   */
  roleId: number
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 角色类型，标识角色是"服务提供者"、"服务消费者"
   */
  roleTypeEnum: number
  /**
   * 角色类型名称
   */
  roleTypeName: string
  /**
   * 会员类型枚举，标识角色是“企业会员”、“企业个人会员”、“渠道会员”、“渠道个人会员”
   */
  memberType: number
  /**
   * 会员类型名称
   */
  memberTypeName: string
}

export type MemberRoleDrawerSubmitValue = MemberRoleType[]

type ExtraFetchType = FetchParamsType & {
  /**
   * 会员角色名称
   */
  roleName: string
  /**
   * 已经拥有的会员角色
   */
  checkRoleIdList: number[]
}

export interface MemberRoleDrawerProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value: MemberRoleType[]
  /**
   * Form 确认事件
   */
  onSubmit: (values: MemberRoleDrawerSubmitValue) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 获取dataSource方法
   */
  fetchDataSource: (params: ExtraFetchType) => Promise<FetchResponse<MemberRoleType>>
}

const MemberRoleDrawer = (props: MemberRoleDrawerProps) => {
  const { visible, value, onSubmit, onClose, fetchDataSource } = props
  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: 'roleId' })

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.roleId))
    }
  }, [value])

  const columns: ColumnType<MemberRoleType>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeName',
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
    },
  ]

  const fetchMemberRoleList = async (params: ExtraFetchType) => {
    if (!fetchDataSource) {
      return { data: [], totalCount: 0 }
    }
    const mergeParams = {
      ...params,
      checkRoleIdList: Array.isArray(value) ? value.map((item) => item.roleId) : [],
    }
    const res = await fetchDataSource(mergeParams)
    return res
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning('请选择会员角色')
      return
    }
    if (onSubmit) {
      onSubmit(rowCtl.selectRow)
    }
  }

  return (
    <Drawer
      title="选择会员"
      width={1000}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            取消
          </Button>
          <Button onClick={handleConfirm} type="primary">
            确 定
          </Button>
        </div>
      }
      bodyStyle={{
        paddingBottom: 0,
      }}
      destroyOnClose
    >
      <PolymericTable
        rowKey="roleId"
        columns={columns}
        fetchDataSource={(params) => fetchMemberRoleList(params as ExtraFetchType)}
        rowSelection={rowSelection}
        defaultPageSize={20}
        searchFormProps={{
          schema: querySchema,
          effects: ($, actions) => {},
        }}
        full
      />
    </Drawer>
  )
}

MemberRoleDrawer.isVirtualFieldComponent = true

export default MemberRoleDrawer
