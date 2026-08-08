import { useWebIntl } from '@apps/locales'
import { Image, Table } from '@linkseeks/ui'
import { useMemo } from 'react'
import { PRICE_TYPE_ENUM, SPECS_ATTR_NAME_TEXT_PREFIX } from '../constants'
import { renderPrice, renderSubPrice } from '../publicDetail'
import { PriceDataModal } from '../models'
const SpecsDetailTable = ({ productData }) => {
  const translate = useWebIntl()

  const specsDataSource = useMemo(() => {
    if (productData) {
      return (productData as any).specsSettingDataSource
    } else {
      return []
    }
  }, [productData])

  const specsColumns = useMemo(() => {
    if (productData) {
      const extraColumns: any[] = [
        {
          key: 'id',
          title: 'SKU_ID',
          dataIndex: 'id',
        },
        {
          key: 'name',
          title: translate('web.resource.commodity.guigemingchen'),
          dataIndex: 'name',
          render: (value, record) => {
            const skuData = record?.getSpecsAttribute()
            return `${productData?.name}/${Object.keys(skuData)
              .map((skuKey) => skuData[skuKey].label)
              .join('/')}`
          },
        },
        {
          key: 'commodityPic',
          title: translate('web.resource.commodity.shanpintupian'),
          dataIndex: 'commodityPic',
          render(value, record, index) {
            return Array.isArray(value) ? value.map((v) => <Image src={v} key={v} width={120} />) : null
          },
        },
      ]
      const skuColumns = Object.keys(productData[SPECS_ATTR_NAME_TEXT_PREFIX]).map((mergeKey) => {
        const [id, name] = mergeKey.split('-')
        return {
          key: id,
          title: name,
          dataIndex: id,
          render(value) {
            return value?.label || ''
          },
        }
      })
      const defaultColumns: any[] = [
        {
          key: 'code',
          title: 'sku编码',
          dataIndex: 'code',
        },
        {
          key: 'materiel',
          title: translate('web.resource.order.guanlianwuliao'),
          dataIndex: 'materiel',
        },
        {
          key: 'hsCode',
          title: translate('web.resource.commodity.hsCode'),
          dataIndex: 'hsCode',
        },
        {
          key: 'unitPrice',
          title:
            (productData as any).priceType === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
              ? '积分'
              : translate('web.common.danjia'),
          dataIndex: 'unitPrice',
          render: (priceDataModal: PriceDataModal) => renderPrice(priceDataModal, (productData as any).priceType),
        },
        productData.subUnitId && {
          key: 'priceRate',
          title:
            (productData as any).priceType === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
              ? '副单位积分'
              : translate('web.resource.commodity.fudanweidanjia'),
          dataIndex: 'priceRate',
          render: (priceRate: number, record: any) => {
            return renderSubPrice(priceRate, record, (productData as any).priceType)
          },
        },
      ].filter(Boolean)

      return [...extraColumns, ...skuColumns, ...defaultColumns]
    } else {
      return []
    }
  }, [productData])

  return <Table columns={specsColumns} dataSource={specsDataSource} rowKey="id" />
}

export default SpecsDetailTable
