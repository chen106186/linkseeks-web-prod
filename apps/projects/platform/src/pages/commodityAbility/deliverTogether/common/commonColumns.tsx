import { getIntl } from '@linkseeks/i18n'
import FileItem from '../components/FileItem'

/* 送样  */
export const sampleColumns = [
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.category',
      defaultMessage: '品类',
    }),
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.brand',
      defaultMessage: '品牌',
    }),
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.unit',
      defaultMessage: '单位',
    }),
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.demandQuantity',
      defaultMessage: '需求数量',
    }),
    dataIndex: 'demandQuantity',
    key: 'demandQuantity',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.batchJudgmentTypeName',
      defaultMessage: '批次判定',
    }),
    dataIndex: 'batchJudgmentTypeName',
    key: 'batchJudgmentTypeName',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.acceptanceCount',
      defaultMessage: '允收数量',
    }),
    dataIndex: 'acceptanceCount',
    key: 'acceptanceCount',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.concessionToReceiveCount',
      defaultMessage: '让步接收数量',
    }),
    dataIndex: 'concessionToReceiveCount',
    key: 'concessionToReceiveCount',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.rejectCount',
      defaultMessage: '拒收数量',
    }),
    dataIndex: 'rejectCount',
    key: 'rejectCount',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.demandTime',
      defaultMessage: '需求时间',
    }),
    dataIndex: 'demandTime',
    key: 'demandTime',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.demandPerson',
      defaultMessage: '需求人',
    }),
    dataIndex: 'demandPerson',
    key: 'demandPerson',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.demandDepartment',
      defaultMessage: '需求部门',
    }),
    dataIndex: 'demandDepartment',
    key: 'demandDepartment',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.detail.label.file',
      defaultMessage: '附件',
    }),
    dataIndex: 'attachment',
    key: 'attachment',
    render: (text) => <FileItem value={text} />,
  },
]

/* 送样商品 */
export const materialColumns = [
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.materialNum',
      defaultMessage: '物料编号',
    }),
    dataIndex: 'skuId',
    key: 'skuId',
    width: 160,
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.materialName',
      defaultMessage: '物料名称',
    }),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.spec',
      defaultMessage: '规格型号',
    }),
    dataIndex: 'spec',
    key: 'spec',
  },
]

/* 送样商品 */
export const productColumns = [
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.skuId',
      defaultMessage: '商品ID',
    }),
    dataIndex: 'skuId',
    key: 'skuId',
    width: 160,
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.commodityName',
      defaultMessage: '商品名称',
    }),
    dataIndex: 'name',
    key: 'name',
  },
]

/* 流转记录 */
export const recordColumns = [
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.recordIndex',
      defaultMessage: '序号',
    }),
    dataIndex: 'index',
    key: 'index',
    width: 100,
    render: (text, record, index) => index + 1,
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.operatorRoleName',
      defaultMessage: '操作角色',
    }),
    dataIndex: 'operatorRoleName',
    key: 'operatorRoleName',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.statusName',
      defaultMessage: '状态',
    }),
    dataIndex: 'statusName',
    key: 'statusName',
  },
  {
    title: getIntl().formatMessage({ id: 'customerAbility.songyang.title_0', defaultMessage: '操作' }),
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.table.createTime',
      defaultMessage: '操作时间',
    }),
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.detail.label.remark',
      defaultMessage: '备注',
    }),
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
]
