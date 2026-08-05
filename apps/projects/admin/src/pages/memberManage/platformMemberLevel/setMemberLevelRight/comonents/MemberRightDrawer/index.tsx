/*
 * @Description: 会员角色规则 - 适用会员角色FormField
 */
import React, { useEffect, useRef } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'

export type MemberRoleType = {
  /**
   * 权益id
   */
  rightId: number
  /**
   * 权益类型枚举，1-价格权益，2-返现权益，3-积分权益
   */
  rightType: number
  /**
   * 权益名称
   */
  name: string
  /**
   * 获取方式枚举
   */
  acquireWay: number
  /**
   * 获取方式名称
   */
  acquireWayName: string
  /**
   * 参数设置方式枚举，1-按交易金额比例设置
   */
  paramWay: number
  /**
   * 参数设置方式枚举，1-按交易金额比例设置
   */
  paramWayName: string
}

export type MemberRightDrawerSubmitValue = MemberRoleType[]

type ExtraFetchType = FetchParamsType & {}

export interface MemberRightDrawerProps {
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
  onSubmit: (values: MemberRightDrawerSubmitValue) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 获取dataSource方法
   */
  fetchDataSource: (params: ExtraFetchType) => Promise<FetchResponse<MemberRoleType>>
}

const MemberRightDrawer = (props: MemberRightDrawerProps) => {
  const { visible, value, onSubmit, onClose, fetchDataSource } = props
  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'checkbox', customKey: 'rightType' })

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.rightType))
    }
  }, [value])

  const columns: ColumnType<MemberRoleType>[] = [
    {
      title: '会员权益ID',
      dataIndex: 'rightId',
      width: '15%',
    },
    {
      title: '会员权益名称',
      dataIndex: 'name',
    },
    {
      title: '会员权益说明',
      dataIndex: 'remark',
    },
    {
      title: '权益获取方式',
      dataIndex: 'acquireWayName',
    },
    {
      title: '参数设置方式',
      dataIndex: 'paramWayName',
    },
  ]

  const fetchMemberRoleList = async (params: ExtraFetchType) => {
    if (!fetchDataSource) {
      return { data: [], totalCount: 0 }
    }
    const mergeParams = {
      ...params,
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
      message.warning('请选择会员权益')
      return
    }
    if (onSubmit) {
      onSubmit(rowCtl.selectRow)
    }
  }

  return (
    <Drawer
      title="会员权益设置"
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
        rowKey="rightType"
        columns={columns}
        fetchDataSource={(params) => fetchMemberRoleList(params as ExtraFetchType)}
        rowSelection={rowSelection}
        pagination={null}
        full
      />
    </Drawer>
  )
}

export default MemberRightDrawer
