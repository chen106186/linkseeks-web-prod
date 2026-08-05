/*
 * @Description: 平台会员等级 - 适用会员角色FormField
 */
import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import themeConfig from '@apps/config/lingxi.theme.config'
import PolymericTable from '@/components/PolymericTable'
import MemberRoleDrawer, { MemberRoleDrawerSubmitValue, MemberRoleDrawerProps } from '../MemberRoleDrawer'
import { getWebIntl } from '@apps/locales'

export type MemberApplicableRoleType = MemberRoleDrawerSubmitValue[0] & {}

export interface MemberApplicableRoleProps {
  value?: MemberApplicableRoleType[]
  onChange?: (value: MemberApplicableRoleType[]) => void
  fetchDataSource: MemberRoleDrawerProps['fetchDataSource']
  editable: boolean
}

const translate = getWebIntl()

const normalColumns: ColumnType<MemberApplicableRoleType>[] = [
  {
    title: translate('web.resource.member.huiyuanjueseid'),
    dataIndex: 'roleId',
  },
  {
    title: translate('web.resource.member.huiyuanjuese'),
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

const MemberApplicableRole = (props: MemberApplicableRoleProps) => {
  const { value, onChange, fetchDataSource, editable } = props

  const [innerValue, setInnerValue] = useState<MemberApplicableRoleType[]>([])
  const [visibleDrawer, setVisibleDrawer] = useState(false)

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
    editable
      ? {
          title: translate('web.common.control'),
          dataIndex: 'option',
          align: 'center',
          render: (_, record) => (
            <Button type="link" onClick={() => handleRemoveItem(record)}>
              {translate('web.common.delete')}
            </Button>
          ),
        }
      : null,
  ].filter(Boolean) as any

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
      {editable && (
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleVisibleDrawer(true)}
          style={{
            marginBottom: themeConfig['@margin-md'],
          }}
          block
        >
          {translate('web.resource.member.xuanzehuiuyanjuese')}
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
