/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 11:30:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 15:59:49
 * @Description: 审核入库相关公用 columns
 */
import React from 'react'
import { Badge } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import StatusTag from '@/components/StatusTag'
import styles from '../styles.less'

const intl = getIntl()

/**
 *
 * @param target string 会员详情路径前缀
 * @returns Table Columns
 */
const columns = (target = '/supplierAbility/manage/memberPrSubmit/detail'): ColumnType<any>[] => [
  {
    title: intl.formatMessage({
      id: 'supplier.management.maintain.query.supplierId',
    }),
    dataIndex: 'memberId',
  },
  {
    title: intl.formatMessage({
      id: 'supplier.management.maintain.query.supplierName',
    }),
    dataIndex: 'name',
    render: (name, record) => (
      <>
        <EyeAuthButton url={`${target}?validateId=${record.validateId}`}>{name}</EyeAuthButton>
      </>
    ),
  },
  {
    title: intl.formatMessage({
      id: 'supplier.profile.roleName',
      defaultMessage: '供应商角色',
    }),
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({
      id: 'supplier.profile.createTime',
      defaultMessage: '申请时间',
    }),
    dataIndex: 'registerTime',
    sorter: (a, b) => new Date(a.registerTime).getTime() - new Date(b.registerTime).getTime(),
  },
  {
    title: intl.formatMessage({ id: 'member.management.common.columns.outerStatusName' }),
    dataIndex: 'outerStatusName',
    render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
  },
  {
    title: intl.formatMessage({ id: 'member.management.common.columns.innerStatusName' }),
    dataIndex: 'innerStatusName',
    render: (text, record) => (
      <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
    ),
  },
]

export default columns
