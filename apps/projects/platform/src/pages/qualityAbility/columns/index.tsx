import { getIntl } from '@linkseeks/i18n'
import type { ColumnType } from 'antd/lib/table/interface'
import { Badge } from 'antd'
import styles from './index.less'

/** 质检单号 */
export const qualityNo: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.zhijiandanhao', defaultMessage: '质检单号' }),
  key: 'qualityNo',
  dataIndex: 'qualityNo',
  width: 160,
  ellipsis: true,
}

/** 质检单摘要 */
export const digest: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.zhijiandanzhaiyao', defaultMessage: '质检单摘要' }),
  key: 'digest',
  dataIndex: 'digest',
  width: 300,
  ellipsis: true,
}

/** 质检开始日期 */
export const startTime: ColumnType<any> = {
  title: getIntl().formatMessage({
    id: 'quality.zhijiankaishiriqi',
    defaultMessage: '质检开始日期',
  }),
  key: 'startTime',
  dataIndex: 'startTime',
  width: 150,
  ellipsis: true,
  sortDirections: ['descend'],
  sorter: (a, b) => {
    const _a = new Date(a.startTime).getTime()
    const _b = new Date(b.startTime).getTime()
    return _a - _b
  },
}

/** 质检结束日期 */
export const endTime: ColumnType<any> = {
  title: getIntl().formatMessage({
    id: 'quality.zhijianjieshuriqi',
    defaultMessage: '质检结束日期',
  }),
  key: 'endTime',
  dataIndex: 'endTime',
  width: 150,
  ellipsis: true,
  sortDirections: ['descend'],
  sorter: (a, b) => {
    const _a = new Date(a.endTime).getTime()
    const _b = new Date(b.endTime).getTime()
    return _a - _b
  },
}

/** 质检类型 */
export const qualityTypeName: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.zhijianleixing', defaultMessage: '质检类型' }),
  key: 'qualityTypeName',
  dataIndex: 'qualityTypeName',
  width: 96,
  ellipsis: true,
}

/** 来源收货单号 */
export const receiveNo: ColumnType<any> = {
  title: getIntl().formatMessage({
    id: 'quality.laiyuanshouhuodanhao',
    defaultMessage: '来源收货单号',
  }),
  key: 'receiveNo',
  dataIndex: 'receiveNo',
  width: 152,
  ellipsis: true,
}

/** 供应商 */
export const vendorMemberName: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.gongyingshang', defaultMessage: '供应商' }),
  key: 'vendorMemberName',
  dataIndex: 'vendorMemberName',
  width: 160,
  ellipsis: true,
}

/** 采购商 */
export const buyerMemberName: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.caigoushang', defaultMessage: '采购商' }),
  key: 'buyerMemberName',
  dataIndex: 'buyerMemberName',
  width: 160,
  ellipsis: true,
}

/** 单据时间 */
export const createTime: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.danjushijian', defaultMessage: '单据时间' }),
  key: 'createTime',
  dataIndex: 'createTime',
  width: 128,
  ellipsis: true,
  sortDirections: ['descend'],
  sorter: (a, b) => {
    const _a = new Date(a.createTime).getTime()
    const _b = new Date(b.createTime).getTime()
    return _a - _b
  },
}

/** 内部状态 */
export const outerStatusName: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.neibuzhuangtai', defaultMessage: '内部状态' }),
  key: 'outerStatusName',
  dataIndex: 'outerStatusName',
  width: 128,
  ellipsis: true,
  render: (_text, record) =>
    _text ? <Badge color={record?.outerStatus !== 1 ? 'green' : 'blue'} text={_text} /> : '--',
}

/** 操作 */
export const operation: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.caozuo', defaultMessage: '操作' }),
  key: 'operation',
  dataIndex: 'operation',
  width: 148,
  fixed: 'right',
}

/** 不良原因 */
export const badReasons: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.buliangyuanyin', defaultMessage: '不良原因' })}
    </div>
  ),
  key: 'badReasons',
  dataIndex: 'badReasons',
}

/** 不良说明 */
export const badDescription: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.buliangshuoming', defaultMessage: '不良说明' })}
    </div>
  ),
  key: 'badDescription',
  dataIndex: 'badDescription',
}

/** 测量值 */
export const measurements: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.celiangzhi', defaultMessage: '测量值' }),
  key: 'measurements',
  dataIndex: 'measurements',
}

/** 不良数量 */
export const badCount: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.buliangshuliang', defaultMessage: '不良数量' })}
    </div>
  ),
  key: 'badCount',
  dataIndex: 'badCount',
}

/** 收货判定 */
export const receiptJudgmentType: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.shouhuopanding', defaultMessage: '收货判定' })}
    </div>
  ),
  key: 'receiptJudgmentType',
  dataIndex: 'receiptJudgmentType',
}

/** 退货类型 */
export const returnType: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.tuihuoleixing', defaultMessage: '退货类型' }),
  key: 'returnType',
  dataIndex: 'returnType',
}

/** 处理方式 */
export const handleType: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.chulifangshi', defaultMessage: '处理方式' }),
  key: 'handleType',
  dataIndex: 'handleType',
}

/** 备注 */
export const remark: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.beizhu', defaultMessage: '备注' }),
  key: 'remark',
  dataIndex: 'remark',
}

/** 分组 */
export const grouping: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.fenzu', defaultMessage: '分组' })}
    </div>
  ),
  key: 'grouping',
  dataIndex: 'grouping',
}

/** 检验项目 */
export const testItems: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.jianyanxiangmu', defaultMessage: '检验项目' })}
    </div>
  ),
  key: 'testItems',
  dataIndex: 'testItems',
}

/** 合格范围 */
export const qualifiedRange: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.hegefanwei', defaultMessage: '合格范围' })}
    </div>
  ),
  key: 'qualifiedRange',
  dataIndex: 'qualifiedRange',
}

/** 检验说明 */
export const inspectionInstructions: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'quality.jianyanshuoming', defaultMessage: '检验说明' }),
  key: 'inspectionInstructions',
  dataIndex: 'inspectionInstructions',
}

/** 检测值 */
export const inspectionValue: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.jiancezhi', defaultMessage: '检测值' })}
    </div>
  ),
  key: 'inspectionValue',
  dataIndex: 'inspectionValue',
}

/** 检验判断 */
export const inspectionJudgmentType: ColumnType<any> = {
  title: (
    <div className={styles['micro-table-required']}>
      {getIntl().formatMessage({ id: 'quality.jianyanpanduan', defaultMessage: '检验判断' })}
    </div>
  ),
  key: 'inspectionJudgmentType',
  dataIndex: 'inspectionJudgmentType',
}
