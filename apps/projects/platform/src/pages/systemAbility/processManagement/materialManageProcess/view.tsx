/**
 * 系统能力 - 流程引擎 - 物料管理流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import {
  getProductMaterialProcessDelete,
  getProductMaterialProcessPage,
  postProductMaterialProcessUpdateStatus,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`/systemAbility/processManagement/materialManageProcess/detail?id=`),
    {
      ..._processName,
      title: intl.formatMessage({ id: 'processRuleSetting.wuliaoliuchengming', defaultMessage: '物料流程名称' }),
    },
    _isDefault(
      intl.formatMessage({ id: 'processRuleSetting.dangwuliaoxinjianshi', defaultMessage: '当物料新建或变更时' }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postProductMaterialProcessUpdateStatus({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'materialManageProcess' }, (processId: string) => {
      getProductMaterialProcessDelete({ processId }).then(({ code }) => {
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
      fetch={getProductMaterialProcessPage}
      schema={schema}
      controllerBtns={controllerBtns('add', '/systemAbility/processManagement/materialManageProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
