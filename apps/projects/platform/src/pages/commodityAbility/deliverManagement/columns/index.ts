import { getIntl } from '@linkseeks/i18n'
import type { ColumnsType } from 'antd/lib/table'

export const requestSheetQueryColumn: ColumnsType & { title: string }[] = [
  {
    title: getIntl().formatMessage({
      id: 'commodity.deliverManagement.songyangxuqiudanhao',
      defaultMessage: '送样需求单号',
    }),
    dataIndex: 'deliveryNo',
    key: 'deliveryNo',
    width: 160,
  },
  {
    title: getIntl().formatMessage({
      id: 'commodity.deliverManagement.songyangxuqiudanzhaiyao',
      defaultMessage: '送样需求单摘要',
    }),
    dataIndex: 'summary',
    key: 'summary',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.xuqiuriqi', defaultMessage: '需求日期' }),
    dataIndex: 'demandDate',
    key: 'demandDate',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.songyangleixing', defaultMessage: '送样类型' }),
    dataIndex: 'typeName',
    key: 'typeName',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.jinjichengdu', defaultMessage: '紧急程度' }),
    dataIndex: 'emergencyLevelName',
    key: 'emergencyLevelName',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.jieshoubumen', defaultMessage: '接收部门' }),
    dataIndex: 'receiveDepartment',
    key: 'receiveDepartment',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.gongyingshang', defaultMessage: '供应商' }),
    dataIndex: 'vendorMemberName',
    key: 'vendorMemberName',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.danjushijian', defaultMessage: '单据时间' }),
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.waibuzhuangtai', defaultMessage: '外部状态' }),
    dataIndex: 'outerStatus',
    key: 'outerStatus',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.deliverManagement.caozuo', defaultMessage: '操作' }),
    dataIndex: 'operation',
    key: 'x',
    align: 'center',
  },
]
