/**
 * 系统能力 - 流程引擎 - 请购单流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import {
  getPurchaseRequisitionProcessDelete,
  getPurchaseRequisitionProcessPage,
  postPurchaseRequisitionProcessUpdateStatus,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`/systemAbility/processManagement/buyingReqProcess/detail?id=`),
    _processName,
    _isDefault(
      intl.formatMessage({ id: 'processRuleSetting.dangqinggoudanxinzengshi', defaultMessage: '当请购单新增时' }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postPurchaseRequisitionProcessUpdateStatus({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'buyingReqProcess' }, (processId: string) => {
      getPurchaseRequisitionProcessDelete({ processId }).then(({ code }) => {
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
      fetch={getPurchaseRequisitionProcessPage}
      schema={schema}
      controllerBtns={controllerBtns('add', '/systemAbility/processManagement/buyingReqProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
