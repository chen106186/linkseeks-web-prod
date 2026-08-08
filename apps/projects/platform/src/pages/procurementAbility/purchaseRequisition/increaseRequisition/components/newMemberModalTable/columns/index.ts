import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'

export const memberColumns: ColumnType<any>[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.huiyuanID', defaultMessage: '会员ID' }),
    key: 'memberId',
    dataIndex: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.huiyuanmingcheng', defaultMessage: '会员名称' }),
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsileixing', defaultMessage: '公司类型' }),
    key: 'memberTypeName',
    dataIndex: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsijuese', defaultMessage: '公司角色' }),
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.gongsidengji', defaultMessage: '公司等级' }),
    key: 'levelTag',
    dataIndex: 'levelTag',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.huiyuanzhuangtai', defaultMessage: '会员状态' }),
    key: 'statusName',
    dataIndex: 'statusName',
  },
]

export const materialSupplyColumns: ColumnType<any>[] = [
  {
    title: `${getIntl().formatMessage({ id: 'order.caigoushang', defaultMessage: '采购商' })}${getIntl().formatMessage({
      id: 'purchaseRequisition.wuliaobianhao',
      defaultMessage: '物料编号',
    })}`,
    key: 'code',
    dataIndex: 'code',
  },
  {
    title: `${getIntl().formatMessage({ id: 'order.caigoushang', defaultMessage: '采购商' })}${getIntl().formatMessage({
      id: 'purchaseRequisition.materialName',
      defaultMessage: '物料名称',
    })}`,
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.guigexinghao', defaultMessage: '规格型号' }),
    key: 'type',
    dataIndex: 'type',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinlei', defaultMessage: '品类' }),
    key: 'customerCategory',
    dataIndex: 'customerCategory',
    render: (_text) => _text?.name,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
    key: 'brand',
    dataIndex: 'brand',
    render: (_text) => _text?.name,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.danwei', defaultMessage: '单位' }),
    key: 'unitName',
    dataIndex: 'unitName',
  },
  {
    title: getIntl().formatMessage({ id: 'order.gongyingshang', defaultMessage: '供应商' }),
    key: 'memberName',
    dataIndex: 'memberName',
  },
  {
    title: `${getIntl().formatMessage({
      id: 'order.gongyingshang',
      defaultMessage: '供应商',
    })}${getIntl().formatMessage({ id: 'purchaseRequisition.wuliaobianhao', defaultMessage: '物料编号' })}`,
    key: 'goodsNo',
    dataIndex: 'goodsNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseRequisition.shengchangchangjia', defaultMessage: '生产厂家' }),
    key: 'manufacturer',
    dataIndex: 'manufacturer',
  },
  {
    title: getIntl().formatMessage({ id: 'order.departure', defaultMessage: '起运地' }),
    key: 'departure',
    dataIndex: 'departure',
  },
  ,
  {
    title: getIntl().formatMessage({ id: 'order.deliveryCycle', defaultMessage: '到货周期' }),
    key: 'deliveryCycle',
    dataIndex: 'deliveryCycle',
  },
  ,
  {
    title: getIntl().formatMessage({ id: 'order.deliveryMethod', defaultMessage: '交货方式' }),
    key: 'deliveryMethod',
    dataIndex: 'deliveryMethod',
  },
]
