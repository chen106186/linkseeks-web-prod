/**
 * 系统能力 - 流程引擎 - 质量管理流程规则配置
 * @author: Crayon
 */
import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { _processId, _name, _processName, _isDefault, _createTime, _status, _operation } from '../constants/columns'
import { schema } from '../constants/schema'
import { controllerBtns } from '../constants/utils'
import {
  getOrderQualityProcessDelete,
  getOrderQualityProcessPage,
  postOrderQualityProcessUpdateStatus,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const ProcessList: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>()

  const columns: ColumnType<any>[] = [
    _processId,
    _name(`/systemAbility/processManagement/qualityManageProcess/detail?id=`),
    {
      ..._processName,
      title: intl.formatMessage({ id: 'processRuleSetting.jiaoyiliuchengming', defaultMessage: '交易流程名称' }),
    },
    _isDefault(
      intl.formatMessage({ id: 'processRuleSetting.dang8Dbaogaotijiaohou', defaultMessage: '当8D报告提交后' }),
    ),
    _createTime,
    _status(({ processId }, status: number) => {
      postOrderQualityProcessUpdateStatus({ processId, status }).then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
    }),
    _operation({ urlKey: 'qualityManageProcess' }, (processId: string) => {
      getOrderQualityProcessDelete({ processId }).then(({ code }) => {
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
      fetch={getOrderQualityProcessPage}
      schema={schema}
      controllerBtns={controllerBtns('add', '/systemAbility/processManagement/qualityManageProcess/add')}
      rowKey="processId"
    />
  )
}
export default ProcessList
