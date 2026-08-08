/**
 * 系统能力 - 流程引擎 - 采购订单(SRM)流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import {
  getOrderPurchaseProcessPageSrm,
  postOrderPurchaseProcessDelete,
  postOrderPurchaseProcessStatusUpdate,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`/systemAbility/processManagement/purchaseSRMProcess/detail?id=`),
    { ..._processName, title: '交易流程名称' },
    _isDefault(
      intl.formatMessage({ id: 'processRuleSetting.dangcaigoudingdantijiaoshi', defaultMessage: '当采购订单提交时' }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postOrderPurchaseProcessStatusUpdate({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'purchaseSRMProcess' }, (processId: any) => {
      postOrderPurchaseProcessDelete({ processId }).then(({ code }) => {
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
      fetch={getOrderPurchaseProcessPageSrm}
      schema={schema}
      controllerBtns={controllerBtns('add', '/systemAbility/processManagement/purchaseSRMProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
