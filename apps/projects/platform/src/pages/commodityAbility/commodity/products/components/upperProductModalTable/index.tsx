import React from 'react'
import { ModalTableProps } from '@/components/ModalTable'
import { priceTypeLabel, productStatusLabel } from '../../constant'
import { getProductCommodityGetLowerCommodityList, postProductCommoditySaveUpperCommodity } from '@apps/apis'
import { ModalFormTable, StandardFormTable } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { PRICE_TYPE_TEXTS } from '@apps/services/commodity'
import { useProduct } from '../../services/context'
import { useToggle } from '@linkseeks/hooks'

export interface UpperProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  currentRef?: any
  tableRef?: any
}

// 选择上游商品弹窗
const UpperProductModalTable: React.FC<UpperProductModalTableProps> = (props) => {
  const translate = useWebIntl()
  const { importProductTableRef, mainTableRef } = useProduct()
  const [btnLoading, toggleBtnLoading] = useToggle()
  // 上游商品 弹框列
  const upperCommodityColumns = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
      searchField: {
        main: true,
      },
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'customerCategoryFullName',
      key: 'customerCategoryFullName',
      searchField: {
        type: 'Input',
        name: 'customerCategoryName',
      },
    },
    {
      title: translate('web.resource.commodity.brand'),
      dataIndex: 'brandName',
      key: 'brandName',
      searchField: {
        type: 'Input',
        name: 'brandName',
      },
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
      render: (text: any, reocrd: any) => {
        if (reocrd.priceType === 1) {
          if (reocrd.max === reocrd.min)
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min}
              </>
            )
          else
            return (
              <>
                {translate('web.common.currencySymbol')}
                {reocrd.min} ~ {translate('web.common.currencySymbol')}
                {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 3) {
          if (reocrd.max === reocrd.min) return <>{reocrd.min}</>
          else
            return (
              <>
                {reocrd.min} ~ {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 2) return null
      },
    },
    {
      title: translate('web.resource.member.gongyinghuiyuan'),
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: 'Input',
    },
    {
      title: translate('web.common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => productStatusLabel[text],
    },
  ])

  const handleConfirm = async () => {
    const items = importProductTableRef.current?.getSelectionItems()
    if (items?.length) {
      toggleBtnLoading()
      postProductCommoditySaveUpperCommodity({ idList: items.map((item) => item.id) })
        .then(() => {
          importProductTableRef.current.clearSelection()
          importProductTableRef.current?.setVisible(false)
          mainTableRef.current.reload()
        })
        .finally(() => {
          toggleBtnLoading()
        })
    }
  }
  return (
    <ModalFormTable
      request={getProductCommodityGetLowerCommodityList}
      columns={upperCommodityColumns}
      actionRef={importProductTableRef}
      modalTitle={translate('web.resource.commodity.xuanzeshangyoushanping')}
      width={1000}
      rowKey="id"
      isRowSelection
      loading={btnLoading}
      onOk={handleConfirm}
      modalProps={{
        forceRender: false,
      }}
    />
  )
}

UpperProductModalTable.defaultProps = {}

export default UpperProductModalTable
