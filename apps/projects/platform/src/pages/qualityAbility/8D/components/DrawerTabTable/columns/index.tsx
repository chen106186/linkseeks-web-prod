import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { Image } from 'antd'
const intl = getIntl()

const inspectionType = {
  '1': intl.formatMessage({ id: 'eightD.mianjian', defaultMessage: '免检' }),
  '2': intl.formatMessage({ id: 'eightD.quanjian', defaultMessage: '全检' }),
  '3': intl.formatMessage({ id: 'eightD.choujian', defaultMessage: '抽检' }),
}
const batchJudgmentType = {
  '1': intl.formatMessage({ id: 'eightD.hege', defaultMessage: '合格' }),
  '2': intl.formatMessage({ id: 'eightD.rangbujieshou', defaultMessage: '让步接收' }),
  '3': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '拒收' }),
}

export const shopColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'eightD.shangpinID', defaultMessage: '商品ID' }),
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: intl.formatMessage({ id: 'eightD.shangpintupian', defaultMessage: '商品图片' }),
    key: 'mainPic',
    dataIndex: 'mainPic',
    render: (value) => <Image src={value} width={100} height={100}></Image>,
  },
  {
    title: intl.formatMessage({ id: 'eightD.shangpinmingcheng', defaultMessage: '商品名称' }),
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
    key: 'customerCategoryName',
    dataIndex: 'customerCategoryName',
  },
  {
    title: intl.formatMessage({ id: 'eightD.pinpai', defaultMessage: '品牌' }),
    key: 'brandName',
    dataIndex: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'eightD.danwei', defaultMessage: '单位' }),
    key: 'unitName',
    dataIndex: 'unitName',
  },
]
export const materialColumns: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'eightD.wuliaobianhao', defaultMessage: '物料编号' }),
    key: 'code',
    dataIndex: 'code',
  },
  {
    title: intl.formatMessage({ id: 'eightD.wuliaomingcheng', defaultMessage: '物料名称' }),
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: intl.formatMessage({ id: 'eightD.wuliaozu', defaultMessage: '物料组' }),
    key: 'materialGroup',
    dataIndex: 'materialGroup',
    render: (value) => value?.name ?? '',
  },
  {
    title: intl.formatMessage({ id: 'eightD.guigexinghao', defaultMessage: '规格型号' }),
    key: 'type',
    dataIndex: 'type',
  },
  {
    title: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
    key: 'customerCategory',
    dataIndex: 'customerCategory',
    render: (value) => value?.name ?? '',
  },
  {
    title: intl.formatMessage({ id: 'eightD.pinpai', defaultMessage: '品牌' }),
    key: 'brand',
    dataIndex: 'brand',
    render: (value) => value?.name ?? '',
  },
]

export const materialSupplyColumns = (roleType: number | string): ColumnType<any>[] => {
  return [
    {
      title: intl.formatMessage({ id: 'eightD.zhijiandanhao', defaultMessage: '质检单号' }),
      key: 'qualityNo',
      dataIndex: 'qualityNo',
    },
    {
      title:
        roleType == 1
          ? intl.formatMessage({ id: 'eightD.wuliaobianhao', defaultMessage: '物料编号' })
          : intl.formatMessage({ id: 'eightD.shangpinID', defaultMessage: '商品ID' }),
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title:
        roleType == 1
          ? intl.formatMessage({ id: 'eightD.wuliaomingcheng', defaultMessage: '物料名称' })
          : intl.formatMessage({ id: 'eightD.shangpinmingcheng', defaultMessage: '商品名称' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'eightD.guigexinghao', defaultMessage: '规格型号' }),
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'eightD.pinpai', defaultMessage: '品牌' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'eightD.danwei', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'eightD.dingdanhao', defaultMessage: '订单号' }),
      key: 'orderNo',
      dataIndex: 'orderNo',
    },
    {
      title: intl.formatMessage({ id: 'eightD.zhijianfangshi', defaultMessage: '质检方式' }),
      key: 'inspectionType',
      dataIndex: 'inspectionType',
      render: (data) => inspectionType[data],
    },
    {
      title: intl.formatMessage({ id: 'eightD.songjianshuliang', defaultMessage: '送检数量' }),
      key: 'submissionCount',
      dataIndex: 'submissionCount',
    },
    {
      title: intl.formatMessage({ id: 'eightD.chouyangshuliang', defaultMessage: '抽样数量' }),
      key: 'samplesCount',
      dataIndex: 'samplesCount',
    },
    {
      title: intl.formatMessage({ id: 'eightD.picipanding', defaultMessage: '批次判定' }),
      key: 'batchJudgmentType',
      dataIndex: 'batchJudgmentType',
      render: (data) => batchJudgmentType[data],
    },
    {
      title: intl.formatMessage({ id: 'eightD.yunshoushuliang', defaultMessage: '允收数量' }),
      key: 'acceptanceCount',
      dataIndex: 'acceptanceCount',
    },
    {
      title: intl.formatMessage({ id: 'eightD.rangbujieshoushuliang', defaultMessage: '让步接收数量' }),
      key: 'concessionToReceiveCount',
      dataIndex: 'concessionToReceiveCount',
    },
    {
      title: intl.formatMessage({ id: 'eightD.jushoushuliang', defaultMessage: '拒收数量' }),
      key: 'rejectCount',
      dataIndex: 'rejectCount',
    },
  ]
}
