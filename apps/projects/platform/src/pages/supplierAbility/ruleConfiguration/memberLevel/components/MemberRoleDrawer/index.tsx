/*
 * @Description: 会员角色规则 - 适用会员角色FormField
 */
import React, { useEffect } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { useWebIntl } from '@apps/locales'

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
   * 角色类型名称
   */
  roleTypeName: string
  /**
   * 会员类型名称
   */
  memberTypeName: string
}

export type MemberRoleDrawerSubmitValue = MemberRoleType[]

type ExtraFetchType = FetchParamsType & {}

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
  const translate = useWebIntl()

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.roleId))
    }
  }, [value])

  const columns: ColumnType<MemberRoleType>[] = [
    {
      title: translate('web.resource.member.memberRoleName'),
      dataIndex: 'roleName',
    },
    {
      title: translate('web.resource.member.roleType'),
      dataIndex: 'roleTypeName',
    },
    {
      title: translate('web.resource.member.memberSupperType'),
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
      message.warning(translate('web.resource.member.qingxuanzehuiyuanjuese'))
      return
    }
    if (onSubmit) {
      onSubmit(rowCtl.selectRow)
    }
  }

  return (
    <Drawer
      title={translate('web.resource.member.xuanzehuiyuan')}
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
            {translate('web.common.cancel')}
          </Button>
          <Button onClick={handleConfirm} type="primary">
            {translate('web.common.confirm')}
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
        full
      />
    </Drawer>
  )
}

export default MemberRoleDrawer
