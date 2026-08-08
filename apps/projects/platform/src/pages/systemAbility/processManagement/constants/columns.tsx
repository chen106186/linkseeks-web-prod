import React from 'react'
import { Modal, Switch, Tooltip } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { history } from '@linkseeks/router-manager'
import { Link, useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import TableOperation from '@/components/TableOperation'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'

const intl = getIntl()

const editKey = intl.formatMessage({ id: 'common.button.modify', defaultMessage: '修改' })
const seeKey = intl.formatMessage({ id: 'common.button.see', defaultMessage: '查看' })
const deleteKey = intl.formatMessage({ id: 'common.button.delete', defaultMessage: '删除' })

/** 流程规则ID */
export const _processId: ColumnType<any> = {
  title: 'ID',
  key: 'processId',
  dataIndex: 'processId',
  width: 100,
}

/** 流程规则名称 */
export const _name = (link: string, idKey = 'processId'): ColumnType<any> => {
  const { pathname } = useLocation()
  return {
    title: intl.formatMessage({ id: 'processRuleSetting.liuchengguizeming', defaultMessage: '流程规则名称' }),
    key: 'name',
    dataIndex: 'name',
    width: 300,
    render: (_text, record) => <Link to={authUrl(pathname, 'detail') ? `${link}${record[idKey]}` : '#'}>{_text}</Link>,
  }
}

/** 流程名称 */
export const _processName: ColumnType<any> = {
  title: intl.formatMessage({ id: 'processRuleSetting.liuchengmingcheng', defaultMessage: '流程名称' }),
  key: 'processName',
  dataIndex: 'processName',
  width: 300,
}

/** 是否默认 */
export const _isDefault = (typeText?: string, tips?: string): ColumnType<any> => ({
  title: (
    <div>
      {intl.formatMessage({ id: 'processRuleSetting.shifoumoren', defaultMessage: '是否默认' })}&nbsp;
      <Tooltip
        title={
          tips ||
          `${intl.formatMessage({
            id: 'processRuleSetting.defaultTipsFragment1',
            defaultMessage: '系统初始化自动创建的默认流程',
          })}, ${typeText}, ${intl.formatMessage({
            id: 'processRuleSetting.defaultTipsFragment2',
            defaultMessage: '优先使用用户配置的流程',
          })}, ${intl.formatMessage({
            id: 'processRuleSetting.defaultTipsFragment3',
            defaultMessage: '当用户配置的流程全部都不匹配时则使用默认流程',
          })}`
        }
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </div>
  ),
  key: 'isDefault',
  dataIndex: 'isDefault',
  render: (_text, record) =>
    !!_text
      ? intl.formatMessage({ id: 'common.button.yes', defaultMessage: '是' })
      : intl.formatMessage({ id: 'common.button.no', defaultMessage: '否' }),
})

/** 操作时间 */
export const _createTime: ColumnType<any> = {
  title: intl.formatMessage({ id: 'processRuleSetting.caozuoshijian', defaultMessage: '操作时间' }),
  key: 'createTime',
  dataIndex: 'createTime',
}

/** 状态 */
export const _status = (handleStatus: (record: any, status: 0 | 1) => void): ColumnType<any> => {
  const { pathname } = useLocation()
  return {
    title: intl.formatMessage({ id: 'processRuleSetting.zhuangtai', defaultMessage: '状态' }),
    key: 'status',
    dataIndex: 'status',
    render: (_text, record) => (
      <Switch
        disabled={!authUrl(pathname, 'custom', 'status') || record.isDefault === 1}
        checked={!!_text}
        onChange={() => handleStatus(record, !!_text ? 0 : 1)}
      />
    ),
  }
}

type OperationKey = {
  urlKey: string
  idKey?: string
}
/**
 * 操作
 * 业务不满足的情况下请在对应的列表页重写操作的render，切勿改动此处
 * @param param0
 * @param onDeleteCallback
 * @returns
 */
export const _operation = (
  { urlKey, idKey = 'processId' }: OperationKey,
  onDeleteCallback?: (id: string) => void,
): ColumnType<any> => ({
  title: intl.formatMessage({ id: 'processRuleSetting.caozuo', defaultMessage: '操作' }),
  width: 150,
  render: (record: any) => {
    const btnAuthOfOperationTextMap = {
      [editKey]: `edit`,
      [seeKey]: `detail`,
      [deleteKey]: `delete`,
    }
    const buttonGroup = {
      [editKey]: record.status === 0 || record.isDefault === 1,
      [seeKey]: true,
      [deleteKey]: record.status === 0 && record.isDefault !== 1,
    }
    const operationHandler = {
      [editKey]: () => {
        history.push(`/systemAbility/processManagement/${urlKey}/edit?id=${record[idKey]}`)
      },
      [seeKey]: () => {
        history.push(`/systemAbility/processManagement/${urlKey}/detail?id=${record[idKey]}`)
      },
      [deleteKey]: () => {
        Modal.confirm({
          content: intl.formatMessage({ id: 'common.tip.option.confirm' }),
          okText: intl.formatMessage({ id: 'common.button.confirm' }),
          cancelText: intl.formatMessage({ id: 'common.button.cancel' }),
          onOk: () => {
            onDeleteCallback?.(record[idKey])
          },
        })
      },
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  },
})
