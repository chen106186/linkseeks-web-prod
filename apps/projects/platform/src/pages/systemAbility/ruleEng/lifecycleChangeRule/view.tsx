/**
 * 系统能力 - 规则引擎 - 生命周期变更规则引擎
 * @author: Crayon
 */
import React from 'react'
import type { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { getMemberLifeCycleProcessEnginePage } from '@apps/apis'
import CommonTable from '../component/CommonTable'
import {
  column_id,
  column_name,
  column_processName,
  column_status,
  column_createTime,
  column_operation,
  configOperationHandler,
} from '../columns'

const ProcessRule: React.FC = () => {
  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = { 配置: 'config' }
    const buttonGroup = { 配置: true }
    const operationHandler = {
      配置: () => {
        configOperationHandler(record, 'LIFECYCLE_CHANGE')
      },
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }

  const columns: ColumnType<any>[] = [
    // 流程规则ID
    column_id,
    // 流程规则名称
    column_name,
    // 流程名称
    column_processName,
    // 状态
    column_status,
    // 操作时间
    column_createTime,
    // 操作
    {
      ...column_operation,
      render: (_, record) => renderOptionButton(record),
    },
  ]

  return <CommonTable fetchApi={getMemberLifeCycleProcessEnginePage} columns={columns} />
}

export default ProcessRule
