/*
 * @Description: 会员角色规则 - 适用会员角色FormField
 */
import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useSchemaProps } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import PolymericTable from '@/components/PolymericTable'
import MemberRoleDrawer, { MemberRoleDrawerSubmitValue, MemberRoleDrawerProps } from '../MemberRoleDrawer'

export type MemberApplicableRoleType = MemberRoleDrawerSubmitValue[0] & {}

export interface MemberApplicableRoleProps {
  value?: MemberApplicableRoleType[]
  onChange?: (value: MemberApplicableRoleType[]) => void
  fetchDataSource: MemberRoleDrawerProps['fetchDataSource']
}

const normalColumns: ColumnType<MemberApplicableRoleType>[] = [
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

const MemberApplicableRole = (props: MemberApplicableRoleProps) => {
  const { value, onChange, fetchDataSource } = props

  const [innerValue, setInnerValue] = useState<MemberApplicableRoleType[]>([])
  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const schemaProps = useSchemaProps()

  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value!)
    }
  }, [value])

  const triggerChange = (next: MemberRoleDrawerSubmitValue) => {
    onChange?.(next)
  }

  // 删除项
  const handleRemoveItem = (record: MemberApplicableRoleType) => {
    const newData = [...innerValue]
    const index = newData.findIndex((item) => item.roleId === record.roleId)
    if (index !== -1) {
      newData.splice(index, 1)
    }
    if (!('value' in props)) {
      setInnerValue(newData)
    }
    triggerChange(newData)
  }

  const columns: ColumnType<MemberApplicableRoleType>[] = [
    ...normalColumns,
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_, record) => (
        <Button type="link" onClick={() => handleRemoveItem(record)} disabled={!schemaProps.editable}>
          删除
        </Button>
      ),
    },
  ]

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleMemberRoleDrawerSubmit = (next: MemberRoleDrawerSubmitValue) => {
    if (!('value' in props)) {
      setInnerValue(next)
    }
    triggerChange(next)
    handleVisibleDrawer(false)
  }

  return (
    <div>
      {schemaProps.editable && (
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleVisibleDrawer(true)}
          style={{
            marginBottom: themeConfig['@margin-md'],
          }}
          block
        >
          选择适用会员角色
        </Button>
      )}
      <PolymericTable rowKey="roleId" columns={columns} dataSource={innerValue} pagination={null} />
      <MemberRoleDrawer
        visible={visibleDrawer}
        onClose={() => handleVisibleDrawer(false)}
        value={innerValue}
        onSubmit={handleMemberRoleDrawerSubmit}
        fetchDataSource={fetchDataSource}
      />
    </div>
  )
}

MemberApplicableRole.isVirtualFieldComponent = true

export default MemberApplicableRole
