import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const SelectGoodsColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'logistics.shangpinID' }),
    key: 'productId',
    dataIndex: 'productId',
  },
  {
    title: intl.formatMessage({ id: 'logistics.shangpinmingcheng' }),
    key: 'productName',
    dataIndex: 'productName',
    render: (productName, record) => {
      return productName || record.name
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.pinlei' }),
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({ id: 'logistics.pinpai' }),
    key: 'brand',
    dataIndex: 'brand',
  },
]

export const AfterSalesSelectGoodsColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'logistics.shangpinID' }),
    key: 'productId',
    dataIndex: 'productId',
  },
  {
    title: intl.formatMessage({ id: 'logistics.shangpinmingcheng' }),
    key: 'productName',
    dataIndex: 'productName',
    render: (productName, record) => {
      return productName || record.name
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.pinlei' }),
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({ id: 'logistics.dingdanbianhao' }),
    key: 'orderNo',
    dataIndex: 'orderNo',
  },
  {
    title: intl.formatMessage({ id: 'logistics.pinpai' }),
    key: 'brand',
    dataIndex: 'brand',
  },
]

export const ExternalListColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'logistics.liuzhuanshunxuhao' }),
    key: 'number',
    dataIndex: 'number',
    render: (text: any, record: any, index: number) => {
      return index + 1
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.caozuojuese' }),
    key: 'operatorRoleName',
    dataIndex: 'operatorRoleName',
  },
  {
    title: intl.formatMessage({ id: 'logistics.zhuangtai' }),
    key: 'status',
    dataIndex: 'status',
    render: (text: any, record: any, index: number) => {
      return text === 1
        ? intl.formatMessage({ id: 'logistics.daitijiao' })
        : text === 2
        ? intl.formatMessage({ id: 'logistics.daiqueren' })
        : text === 3
        ? intl.formatMessage({ id: 'logistics.bujieshouwuliudan' })
        : intl.formatMessage({ id: 'logistics.jieshouwuliudan' })
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.caozuo' }),
    key: 'type',
    dataIndex: 'type',
    render: (text: any, record: any, index: number) => {
      return text === 1
        ? intl.formatMessage({ id: 'logistics.tijiaowuliudan' })
        : intl.formatMessage({ id: 'logistics.querenwuliudan' })
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.caozuoshijian' }),
    key: 'operateTime',
    dataIndex: 'operateTime',
    render: (text: any, record: any) => {
      return moment(text).format('YYYY-MM-DD  HH:mm:ss')
    },
  },
  {
    title: intl.formatMessage({ id: 'logistics.shenheyijian' }),
    key: 'remark',
    dataIndex: 'remark',
  },
]
