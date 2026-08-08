import { Badge } from 'antd'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { MATERIAL_INNER_STATUS_BADGE_COLOR } from './constants'

type Params = {
  detailUrl: string
  extraColumn: any[]
}

export function getColumn(params: Params) {
  const columns = [
    {
      title: getIntl().formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
      dataIndex: 'code',
      render: (text, record) => {
        return <Link to={`${params.detailUrl}?id=${record.id}`}>{text}</Link>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
      dataIndex: 'name',
    },
    {
      title: getIntl().formatMessage({ id: 'material.materialGroup', defaultMessage: '物料组' }),
      dataIndex: 'materialGroup',
      render: (text, record) => {
        return <div>{record.materialGroup?.name}</div>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
      dataIndex: 'type',
      // render: (text, record) => {
      //   const { materialAttributeList } = record;
      //   const string = materialAttributeList?.reduce((prev, current) => {
      //     const { customerAttributeValueList } = current;
      //     const temp = customerAttributeValueList?.map((_item) => {
      //       return _item.value
      //     }).join('/');
      //     return prev + "/" + temp
      //   }, "").slice(1);
      //   return (
      //     <div>{string}</div>
      //   )
      // }
    },
    {
      title: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      render: (text, record) => {
        return <div>{record.customerCategory?.name}</div>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      render: (text, record) => {
        return <div>{record.brand?.name}</div>
      },
    },
    {
      title: getIntl().formatMessage({ id: 'material.unit', defaultMessage: '单位' }),
      dataIndex: 'unitName',
    },
    {
      title: getIntl().formatMessage({ id: 'material.costPrice', defaultMessage: '目录价' }),
      dataIndex: 'costPrice',
    },
    {
      title: getIntl().formatMessage({ id: 'material.interiorStateName', defaultMessage: '内部状态' }),
      dataIndex: 'interiorStateName',
      render: (text, record) => <Badge color={MATERIAL_INNER_STATUS_BADGE_COLOR[record.interiorState]} text={text} />,
    },
  ]
  return columns.concat(params?.extraColumn || [])
}

export const columns = []
