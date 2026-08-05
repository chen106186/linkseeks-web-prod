/**
 * 系统能力 - 规则引擎 - 请款单管理规则引擎
 * @author: Crayon
 */
import React from 'react'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { getSettlementApplyAmountProcessEffectiveStatus } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
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

const RequestFundsManageRule: React.FC = () => {
  const translate = useWebIntl()

  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = { 配置: 'config' }
    const buttonGroup = { 配置: true }
    const operationHandler = {
      配置: () => {
        configOperationHandler(record, 'REQUEST_FUNDS_MANAGE')
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
    // 请款单流程名称
    {
      ...column_processName,
      title: translate('web.resource.system.qingkuandanliuchengmingcheng'),
    },
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

  return <CommonTable fetchApi={getSettlementApplyAmountProcessEffectiveStatus} columns={columns} />
}

export default RequestFundsManageRule
