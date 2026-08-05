import { getProductCommodityGetLowerCommodityList } from '@apps/apis'
import { ModalFormTable, StandardFormTable } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { useProduct } from '../../services/context'
import { priceTypeLabel } from '../../constant'
import { PRICE_TYPE_TEXTS } from '@apps/services/commodity'

const MemberProductModal = () => {
  const translate = useWebIntl()
  const { productDataRef, previewUpperTableRef } = useProduct()

  const columns = StandardFormTable.createColumns([
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: translate('web.resource.commodity.shangyougongyingshanpin'),
      searchField: {
        main: true,
      },
    },
    {
      title: translate('web.resource.commodity.shanpinpinlei'),
      dataIndex: 'customerCategoryFullName',
      key: 'customerCategoryFullName',
    },
    {
      title: translate('web.resource.commodity.shanpinpinpai'),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: translate('web.common.unit'),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: translate('web.resource.commodity.shangpindingjia'),
      dataIndex: 'priceType',
      key: 'priceType',
      render: (text: any, reocrd: any) => priceTypeLabel[text],
      searchField: {
        type: 'Select',
        name: 'priceType',
        valueEnum: Object.keys(PRICE_TYPE_TEXTS).map((value) => ({
          label: PRICE_TYPE_TEXTS[value],
          value: value,
        })),
      },
    },
    {
      title: translate('web.resource.commodity.price'),
      dataIndex: 'min',
      key: 'min',
      render: (text, record) => {
        return `${translate('web.common.currencySymbol')}${text}~${translate('web.common.currencySymbol')}${record.max}`
      },
    },
  ])

  const fetchData = (params) => {
    if (productDataRef.current.row) {
      params.productId = productDataRef.current.row.id
    }
    if (!params.productId) {
      return { data: [], totalCount: 0 }
    }
    return getProductCommodityGetLowerCommodityList(params)
  }

  const onVisible = (visible: boolean) => {
    if (visible) {
      previewUpperTableRef.current.reload()
    }
  }
  return (
    <ModalFormTable
      request={fetchData}
      columns={columns}
      actionRef={previewUpperTableRef}
      onVisible={onVisible}
      modalTitle={translate('web.resource.commodity.chakanshangyoushangpin')}
      width={1000}
      rowKey="id"
      modalProps={{
        footer: null,
      }}
    />
  )
}

export default MemberProductModal
