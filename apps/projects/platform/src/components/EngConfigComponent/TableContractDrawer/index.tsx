/**
 * 选择合同弹窗
 */
import type { ColumnType } from 'antd/lib/table'
import React, { memo, forwardRef } from 'react'
import CommonTableDrawer from '../CommonTableDrawer'
import { schema } from './schema'
import { getIntl } from '@linkseeks/i18n'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Cascader } from 'antd'
import { getContractManagePageList } from '@apps/apis'
import moment from 'moment'

interface PropsType {
  handleOk?: (data: any) => void
  onQueryAll?: (value?: any) => void
  otherParams?: Object
}

const intl = getIntl()

const tableColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'contract.hetongbianhao', defaultMessage: '合同编号' }),
    dataIndex: 'contractNo',
    key: 'contractNo',
  },
  {
    title: intl.formatMessage({ id: 'contract.hetongzhaiyao', defaultMessage: '合同摘要' }),
    dataIndex: 'contractAbstract',
    key: 'contractAbstract',
    width: 250,
  },
  {
    title: intl.formatMessage({
      id: 'contract.hetongshengxiaoshijian',
      defaultMessage: '合同生效时间',
    }),
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: intl.formatMessage({
      id: 'contract.hetongshixiaoshijian',
      defaultMessage: '合同失效时间',
    }),
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: intl.formatMessage({ id: 'contract.hetongyifang', defaultMessage: '合同乙方' }),
    dataIndex: 'partyBName',
    key: 'partyBName',
  },
  {
    title: intl.formatMessage({ id: 'contract.hetongjine', defaultMessage: '合同金额' }),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
  },
]

const TableMaterialDrawer = ({ handleOk, onQueryAll, otherParams = {}, ...rest }: PropsType, ref) => {
  return (
    <CommonTableDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'contract.select', defaultMessage: '选择合同' })}
      queryAllLabel={intl.formatMessage({ id: 'contract.all', defaultMessage: '全部合同' })}
      onOk={handleOk}
      onQueryAll={onQueryAll}
      tableColumns={tableColumns}
      fetchTableApi={getContractManagePageList}
      fnTableParams={(params: any) => {
        params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
        params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
        params.innerStatus = 0 // innerStatus 0 内部状态 所有
        params.outerStatus = 6 // outerStatus 6 外部状态 已完成签约
        return { ...params, ...otherParams }
      }}
      controlSchema={schema}
      controlComponents={{ Cascader }}
      controlEffects={($, actions) => {
        useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
      }}
      {...rest}
    />
  )
}

export default memo(forwardRef(TableMaterialDrawer))
