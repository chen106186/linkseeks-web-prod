import { ColumnType } from 'antd/lib/table/interface'
import { message, Tag } from 'antd'
import { STATUS_COLOR, STATUS_NAME } from '../../constants'
import { id, name, processName, createTime, operation, status } from '../../columns'
import { history } from '@linkseeks/router-manager'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/** 流程规则ID */
export const column_id = {
  ...id,
  width: 150,
}

/** 流程规则名称 */
export const column_name = {
  ...name,
  width: 250,
}

/** 流程规则类型 */
export const column_processRuleType: ColumnType<any> = {
  title: translate('web.resource.system.liuchengguizeleixing'),
  key: 'processTypeName',
  dataIndex: 'processTypeName',
}

/** 流程名称 */
export const column_processName = {
  ...processName,
  width: 250,
}

/** 操作时间 */
export const column_createTime = createTime

/** 状态 */
export const column_status: ColumnType<any> = {
  ...status,
  render: (text: string) => (
    <Tag color={STATUS_COLOR[text]?.color}>
      <span style={{ color: STATUS_COLOR[text]?.fontColor }}>{STATUS_NAME[text]}</span>
    </Tag>
  ),
}

/** 操作 */
export const column_operation = operation

export const configOperationHandler = (record: any, type: string) => {
  if (record.processKind === 1) {
    history.push(`/systemAbility/ruleEng/ruleEngConfig?type=${type}&processId=${record.processId}`)
    return
  }
  message.warning(translate('web.resource.system.dangqingliuchengwuxupeizhi'))
}
