/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 17:12:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:35:36
 * @Description: 适用会员角色 Form Item
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button, Descriptions, Drawer, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import querySchema from './schema'
import styles from './index.less'
import { getMemberSupplierProcessRuleRolePage } from '@apps/apis'

export type ValueType = {
  /**
   * 角色id
   */
  roleId: number
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 角色类型
   */
  roleTypeName: string
  /**
   * 会员类型
   */
  memberTypeName: string
}

const fetchListData = async (params: any) => {
  const payload = { ...params }
  const res = await getMemberSupplierProcessRuleRolePage(payload)
  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberRoleFormItem = (props) => {
  const { value, mutators, editable } = props
  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const intl = useIntl()

  const [rowSelection, RowCtl] = useRowSelectionTable({ customKey: 'roleId', type: 'radio' })

  const columns: ColumnType<ValueType>[] = [
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.roleId' }),
      dataIndex: 'roleId',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.roleName' }),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.roleTypeName' }),
      dataIndex: 'roleTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.memberTypeName' }),
      dataIndex: 'memberTypeName',
    },
  ]

  useEffect(() => {
    if (value) {
      RowCtl.setSelectedRowKeys([value.roleId])
      RowCtl.setSelectRow([value])
    }
  }, [value])

  const handleVisibleDrawer = (flag: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleConfirm = () => {
    if (!RowCtl.selectRow.length) {
      message.warning(intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.confirm.warning' }))
    }
    mutators.change(RowCtl.selectRow[0])
    handleVisibleDrawer(false)
  }

  return (
    <div className={styles.memberRole}>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        className={styles['memberRole-action']}
        onClick={() => handleVisibleDrawer(true)}
        disabled={!editable}
        block
      >
        {intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.select' })}
      </Button>
      <div className={styles['memberRole-stamp']}>
        <Descriptions column={1}>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.roleName' })}
            labelStyle={{ width: 104 }}
          >
            {value?.roleName || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.roleTypeName' })}
            labelStyle={{ width: 104 }}
          >
            {value?.roleTypeName || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.memberTypeName' })}
            labelStyle={{ width: 104 }}
          >
            {value?.memberTypeName || ''}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Drawer
        title={intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.drawer.title' })}
        width={1000}
        onClose={() => handleVisibleDrawer(false)}
        visible={visibleDrawer}
        bodyStyle={{
          paddingBottom: 0,
        }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'member.actions.cancel' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'member.actions.confirm' })}
            </Button>
          </div>
        }
      >
        <PolymericTable
          rowKey="roleId"
          columns={columns}
          rowSelection={rowSelection}
          searchFormProps={{
            schema: querySchema,
          }}
          fetchDataSource={fetchListData}
          defaultPageSize={15}
          full
        />
      </Drawer>
    </div>
  )
}

MemberRoleFormItem.isFieldComponent = true

export default MemberRoleFormItem
