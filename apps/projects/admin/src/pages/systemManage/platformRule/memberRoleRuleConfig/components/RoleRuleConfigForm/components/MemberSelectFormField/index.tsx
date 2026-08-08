/*
 * @Description: 会员角色规则 - 当前会员适用会员角色FormField
 */
import React, { useState, useEffect } from 'react'
import { Input, Button, Drawer, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useSchemaProps } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getMemberPlatformRoleRuleMemberPage } from '@apps/apis'
import PolymericTable, { FetchParamsType, FetchResponse } from '@/components/PolymericTable'
import { querySchema } from './schema'

export type MemberType = {
  /**
   * 会员id
   */
  memberId: number
  /**
   * 会员名称
   */
  memberName: string
}

export type MemberSelectValue = MemberType[]

interface MemberSelectFormFieldProps {
  /**
   * 值
   */
  value: MemberSelectValue
  /**
   * 选择会员触发事件
   */
  onChange?: (value: MemberSelectValue) => void
  /**
   * 是否是禁用的
   */
  disabled?: boolean
}

type ExtraFetchType = FetchParamsType & {
  /**
   * 会员角色名称
   */
  memberName: string
}

const MemberSelectFormField = (props) => {
  const { value } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'memberId' })

  const schemaProps = useSchemaProps()

  const componentProps = props.props['x-component-props'] || {}

  useEffect(() => {
    if (value) {
      rowCtl.setSelectRow(value)
      rowCtl.setSelectedRowKeys(value.map((item) => item.memberId))
    }
  }, [value])

  const columns: ColumnType<MemberType>[] = [
    {
      title: '会员ID',
      dataIndex: 'memberId',
      width: '20%',
    },
    {
      title: '会员名称',
      dataIndex: 'memberName',
    },
  ]

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const fetchMemberList = async (params: ExtraFetchType) => {
    const res = await getMemberPlatformRoleRuleMemberPage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning('请选择会员')
      return
    }
    if (props.mutators.change) {
      props.mutators.change(rowCtl.selectRow)
    }
    handleVisibleDrawer(false)
  }

  return (
    <>
      <Input.Group compact>
        <Input
          value={value && value.length ? value[0].memberName : ''}
          placeholder="请选择会员"
          style={{ width: 'calc(100% - 32px)' }}
          disabled
        />
        <Button
          type="primary"
          icon={<LinkOutlined />}
          onClick={() => handleVisibleDrawer(true)}
          disabled={!schemaProps.editable || componentProps?.disabled}
        />
      </Input.Group>
      <Drawer
        title="选择会员"
        visible={visibleDrawer}
        width={800}
        onClose={() => handleVisibleDrawer(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
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
      >
        <PolymericTable
          rowKey="memberId"
          columns={columns}
          fetchDataSource={(params) => fetchMemberList(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {},
          }}
          full
        />
      </Drawer>
    </>
  )
}

MemberSelectFormField.isFieldComponent = true

export default MemberSelectFormField
