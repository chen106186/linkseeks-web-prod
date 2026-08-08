/**
 * 系统能力 - 流程引擎 - 合同管理流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import { getContractProcessDelete, getContractProcessPage, postContractProcessStatusUpdate } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`systemAbility/processManagement/contractManageProcess/detail?id=`),
    {
      ..._processName,
      title: intl.formatMessage({ id: 'processRuleSetting.jiaoyiliuchengming', defaultMessage: '交易流程名称' }),
    },
    _isDefault(
      intl.formatMessage({
        id: 'processRuleSetting.danghetongchuangjianshi',
        defaultMessage: '当合同创建、签订、外部协同时',
      }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postContractProcessStatusUpdate({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'contractManageProcess' }, (processId: string) => {
      getContractProcessDelete({ processId }).then(({ code }) => {
        if (code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
  ]

  return (
    <TableLayout
      reload={ref}
      columns={columns}
      fetch={getContractProcessPage}
      schema={schema}
      controllerBtns={controllerBtns('add', 'systemAbility/processManagement/contractManageProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
