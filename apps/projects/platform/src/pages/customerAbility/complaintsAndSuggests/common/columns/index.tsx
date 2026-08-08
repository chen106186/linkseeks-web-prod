import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
/**
 * 列表页column
 */
export const createListColumns = (links?: { [key: string]: string }, isCustomer = false): ColumnsType<any> => [
  {
    title: intl.formatMessage({
      id: 'member.memberInspection.common.columns.userColumns.memberSerial',
      defaultMessage: '序号',
    }),
    dataIndex: 'id',
    width: 64,
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.caseTopic',
      defaultMessage: '事件主题',
    }),
    dataIndex: 'subject',
    width: 304,
    render: (text, record) => {
      return links?.['detail'] ? (
        <Link to={`${links?.['detail']}?id=${record.id}&isCustomer=${Number(isCustomer)}`}>{text}</Link>
      ) : (
        <span>{text}</span>
      )
    },
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.businessType',
      defaultMessage: '业务类型',
    }),
    dataIndex: 'typeName',
    width: 96,
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.caseClass',
      defaultMessage: '事件分类',
    }),
    dataIndex: 'classifyName',
    width: 96,
  },
  isCustomer
    ? {
        title: intl.formatMessage({
          id: 'customerAbility.profile.belongName',
          defaultMessage: '归属供应商名称',
        }),
        dataIndex: 'upperName',
        width: 192,
      }
    : {
        title: translate('web.resource.member.memberName'),
        dataIndex: 'name',
        width: 192,
      },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.caseTime',
      defaultMessage: '事件时间',
    }),
    dataIndex: 'eventTime',
    width: 160,
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.proposer',
      defaultMessage: '提出人',
    }),
    dataIndex: 'byUserName',
    width: 96,
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.proposePhone',
      defaultMessage: '提出人电话',
    }),
    dataIndex: 'byUserPhone',
    width: 128,
  },
  {
    title: intl.formatMessage({
      id: 'member.complaintsAndSuggests.common.columns.index.dealTime',
      defaultMessage: '处理时间',
    }),
    dataIndex: 'handleTime',
    width: 160,
  },
  {
    title: intl.formatMessage({
      id: 'member.memberEvaluate.columns.detail.state',
      defaultMessage: '内部状态',
    }),
    dataIndex: 'statusName',
    width: 160,
  },
]

export const memberColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({
      id: 'customerAbility.management.import.query.supplierId',
      defaultMessage: '客户 ID',
    })}`,
    dataIndex: 'memberId',
  },
  {
    title: translate('web.resource.member.memberName'),
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({
      id: 'customerAbility.supplierInspection.common.columns.index.supplierLifecycle',
      defaultMessage: '生命周期阶段',
    })}`,
    dataIndex: 'lifeCycleStageName',
  },
  {
    title: `${intl.formatMessage({
      id: 'customerAbility.supplierInspection.common.columns.index.supplierEntryTime',
      defaultMessage: '入库时间',
    })}`,
    dataIndex: 'depositTime',
  },
]

export const memberColumnsForCustomer: ColumnsType<any> = [
  {
    title: `序号`,
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
  },
  {
    title: `采购商 ID`,
    dataIndex: 'memberId',
  },
  {
    title: `采购商名称`,
    dataIndex: 'name',
  },
]

export const userColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
    dataIndex: 'userId',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.name' })}`,
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.phone' })}`,
    dataIndex: 'phone',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.agency' })}`,
    dataIndex: 'orgName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
    dataIndex: 'jobTitle',
  },
]
