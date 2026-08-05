/**
 * 系统能力 - 流程引擎 - 生命周期变更流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import {
  getMemberLifeCycleProcessDelete,
  getMemberLifeCycleProcessPage,
  postMemberLifeCycleProcessUpdateStatus,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`/systemAbility/processManagement/lifecycleChangeProcess/detail?id=`),
    {
      ..._processName,
      title: intl.formatMessage({ id: 'processRuleSetting.jiaoyiliuchengming', defaultMessage: '交易流程名称' }),
    },
    _isDefault(
      intl.formatMessage({
        id: 'processRuleSetting.dangshengmingzhouqibiangengshenqingtijiaohou',
        defaultMessage: '当生命周期变更申请单提交后',
      }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postMemberLifeCycleProcessUpdateStatus({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'lifecycleChangeProcess' }, (processId: string) => {
      getMemberLifeCycleProcessDelete({ processId }).then(({ code }) => {
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
      fetch={getMemberLifeCycleProcessPage}
      schema={schema}
      controllerBtns={controllerBtns('add', '/systemAbility/processManagement/lifecycleChangeProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
