import React, { useState, useRef } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Button, Space, Switch, Select } from 'antd'
import {
  getMemberPositionInventoryRulesPage,
  postMemberPositionInventoryRulesUpdatePositionInventory,
  postMemberPositionInventoryRulesUpdateMaterialInventory,
  getMemberPositionInventoryRulesList,
} from '@apps/apis'

const { Option } = Select

/**
 * 仓位库存同步物料库存规则
 */

const MaterialInventory: React.FC = () => {
  const ref = useRef({} as ActionType)
  const recordCacheRef = useRef<any>({})
  const beforeCacheRef = useRef<any>({})
  const [steps, setSteps] = useState<number>(1)

  const _handleSwitchChange = (checked: boolean, record: any) => {
    const _params = {
      memberId: record.memberId,
      roleId: record.roleId,
      positionInventoryMode: checked,
    }
    recordCacheRef.current[record.memberId] = recordCacheRef.current?.[record.memberId] ?? record
    postMemberPositionInventoryRulesUpdatePositionInventory(_params).then((res) => {
      if (res.code === 1000) {
        recordCacheRef.current[record.memberId] = { ...record, positionInventoryMode: checked }
        setSteps(steps + 1)
      }
    })
  }

  const _handleUpdateMaterialInventory = (record: any) => {
    const _params = {
      memberId: record.memberId,
      roleId: record.roleId,
      materialInventoryMode: recordCacheRef.current[record.memberId].materialInventoryMode,
      synchronousRoleId: recordCacheRef.current[record.memberId].synchronousRoleId,
      synchronousRoleName: recordCacheRef.current[record.memberId].synchronousRoleName,
    }
    postMemberPositionInventoryRulesUpdateMaterialInventory(_params).then((res) => {
      if (res.code === 1000) {
        recordCacheRef.current[record.memberId] = {
          ...recordCacheRef.current[record.memberId],
          editAble: false,
        }
        setSteps(steps + 1)
        // record.editAble = false;
      }
    })
  }

  const _handleEdit = async (record: any, flag: boolean) => {
    if (flag) {
      recordCacheRef.current[record.memberId] = recordCacheRef.current?.[record.memberId] ?? record
      beforeCacheRef.current[record.memberId] = recordCacheRef.current?.[record.memberId] ?? record
      const _params = {
        memberId: record.memberId,
      }
      try {
        const { data } = await getMemberPositionInventoryRulesList(_params)
        recordCacheRef.current[record.memberId] = {
          ...recordCacheRef.current[record.memberId],
          synchronousData: data,
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      recordCacheRef.current[record.memberId] = beforeCacheRef.current[record.memberId]
    }
    recordCacheRef.current[record.memberId] = {
      ...recordCacheRef.current[record.memberId],
      editAble: flag,
    }
    setSteps(steps + 1)
  }

  const _handleRoleSelect = (value: any, record) => {
    const _val = value.split('-')
    const _synchronousRoleId = _val[0]
    const _synchronousRoleName = _val[1]
    recordCacheRef.current[record.memberId] = {
      ...recordCacheRef.current[record.memberId],
      synchronousRoleId: _synchronousRoleId,
      synchronousRoleName: _synchronousRoleName,
    }
    setSteps(steps + 1)
    // record.synchronousRoleId = _synchronousRoleId;
    // record.synchronousRoleName = _synchronousRoleName;
  }

  const _handleMaterialInventoryMode = (value, record: any) => {
    recordCacheRef.current[record.memberId] = {
      ...recordCacheRef.current[record.memberId],
      materialInventoryMode: value === 'true',
    }
    setSteps(steps + 1)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '会员ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
      searchField: 'Input',
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '仓位库存模式',
      dataIndex: 'positionInventoryMode',
      key: `positionInventoryMode_${steps}`,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Switch
            checked={
              recordCacheRef?.current?.[record.memberId]?.positionInventoryMode !== undefined
                ? recordCacheRef?.current?.[record.memberId]?.positionInventoryMode
                : text
            }
            onChange={(checked) => {
              _handleSwitchChange(checked, record)
            }}
          />
        )
      },
    },
    {
      title: '物料库存模式',
      dataIndex: 'materialInventoryName',
      key: `materialInventoryName_${steps}`,
      width: 192,
      render: (text, record) => {
        if (recordCacheRef?.current?.[record.memberId]?.editAble) {
          return (
            <Select
              style={{ width: '100%' }}
              value={String(
                recordCacheRef?.current?.[record.memberId]?.materialInventoryMode ?? record.materialInventoryMode,
              )}
              onChange={(val) => {
                _handleMaterialInventoryMode(val, record)
              }}
            >
              <Option value="true">同步角色物料库存</Option>
              <Option value="false">不同步</Option>
            </Select>
          )
        } else {
          return text
        }
      },
    },
    {
      title: '同步角色',
      dataIndex: 'synchronousRoleName',
      key: `synchronousRoleName_${steps}`,
      width: 192,
      render: (text, record) => {
        const _edit = recordCacheRef?.current?.[record.memberId]?.materialInventoryMode ?? record.materialInventoryMode
        if (recordCacheRef?.current?.[record.memberId]?.editAble && _edit) {
          let _val
          if (recordCacheRef?.current?.[record.memberId].synchronousRoleId) {
            _val = `${recordCacheRef?.current?.[record.memberId].synchronousRoleId}-${
              recordCacheRef?.current?.[record.memberId].synchronousRoleName
            }`
          } else if (record.synchronousRoleId) {
            _val = `${record.synchronousRoleId}-${record.synchronousRoleName}`
          }
          return (
            <Select
              style={{ width: '100%' }}
              value={_val}
              onChange={(val) => {
                _handleRoleSelect(val, record)
              }}
            >
              {recordCacheRef?.current?.[record.memberId]?.synchronousData?.map((_item) => (
                <Option key={_item.synchronousRoleId} value={`${_item.synchronousRoleId}-${_item.synchronousRoleName}`}>
                  {_item.synchronousRoleName}
                </Option>
              ))}
            </Select>
          )
        } else {
          return recordCacheRef?.current?.[record.memberId]?.synchronousRoleName ?? text ?? '--'
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: `actions_${steps}`,
      width: 128,
      render: (text, record) => {
        if (recordCacheRef?.current?.[record.memberId]?.editAble) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  _handleUpdateMaterialInventory(record)
                }}
              >
                确认
              </Button>
              <Button
                type="default"
                size="small"
                onClick={() => {
                  _handleEdit(record, false)
                }}
              >
                取消
              </Button>
            </Space>
          )
        } else {
          return (
            <Button
              type="link"
              onClick={() => {
                _handleEdit(record, true)
              }}
            >
              编辑
            </Button>
          )
        }
      },
    },
  ]

  const fetchListData = async (params) => {
    const { code, data } = await getMemberPositionInventoryRulesPage(params)
    recordCacheRef.current = {}
    beforeCacheRef.current = {}
    if (code === 1000) {
      return data
    }

    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <PageHeaderWrapper title={'仓位库存同步物料库存规则'}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchListData(params)}
        rowKey="memberId"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default MaterialInventory
