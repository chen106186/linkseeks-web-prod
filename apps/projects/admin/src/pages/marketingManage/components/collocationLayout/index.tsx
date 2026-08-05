import React, { useCallback, useEffect, useRef } from 'react'
import { postProductCommodityCommonGetCommoditySkuListByShopId } from '@apps/apis'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'

export interface CollocationLayoutProps {
  moda?: 'checkbox' | 'radio'
  /** */
  idNotInList?: number[]
  /** 适用商城 */
  shopIdList?: number[]
  /** 显示隐藏 */
  visible?: boolean
  /** toggle */
  toggle: (e: boolean) => void
  /** 确定 */
  onConfirm: (selectRowRecord: any) => void
}

const CollocationLayout: React.FC<CollocationLayoutProps> = (props: any) => {
  const { moda = 'checkbox', idNotInList, shopIdList, visible, toggle, onConfirm } = props
  const modalRef = ModalFormTable.useTableRef()

  /** 选择活动商品columns */
  const columns: RecordColumns<any>[] = [
    {
      title: 'SKUID',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
      searchField: {
        main: true,
        type: 'Input',
        name: 'commodityName',
      },
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: '商品状态',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <>
          {Number(text) === 1 && '待提交审核'}
          {Number(text) === 2 && '待审核'}
          {Number(text) === 3 && '审核不通过'}
          {Number(text) === 4 && '审核通过'}
          {Number(text) === 5 && '上架'}
          {Number(text) === 6 && '下架'}
        </>
      ),
    },
  ]
  const handleFetchData = useCallback(
    (params: any) => {
      return new Promise((resolve) => {
        postProductCommodityCommonGetCommoditySkuListByShopId(
          { idNotInList, shopIdList, ...params },
          { ctlType: 'none' },
        )
          .then((res) => {
            if (res.code !== 1000) {
              return
            }
            const { data } = res
            resolve({
              totalCount: data.totalCount,
              data: data.data.map((item) => {
                return {
                  skuId: item.id,
                  productId: item.commodityId,
                  productName: item.name,
                  category: item.customerCategoryName,
                  brand: item.brandName,
                  status: 5,
                  productImgUrl: item.mainPic,
                  unit: item.unitName,
                  price: item.unitPrice['0-0'],
                }
              }),
            })
          })
          .catch((error) => {
            console.warn(error)
          })
      })
    },
    [shopIdList, idNotInList],
  )

  const handleOk = (selectRowRecord: any) => {
    const rowRecord: any[] = [...selectRowRecord]
    const productList = rowRecord.map((item) => {
      return {
        id: item.id,
        skuId: item.skuId,
        productImgUrl: item.productImgUrl,
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        price: item.price,
        plummetPrice: item.plummetPrice,
        activityPrice: item.activityPrice,
        deductionPrice: item.deductionPrice,
        discount: item.discount,
        restrictNum: item.restrictNum,
        restrictTotalNum: item.restrictTotalNum,
      }
    })
    onConfirm(productList)
  }

  useEffect(() => {
    modalRef.current.setVisible(visible)
  }, [visible])

  return (
    <ModalFormTable
      modalType="Drawer"
      modalTitle="选择活动商品"
      actionRef={modalRef}
      request={handleFetchData}
      columns={columns}
      isRowSelection
      rowSelectionType={moda}
      rowKey="skuId"
      pagination={false}
      onOk={handleOk}
    />
  )
}
export default CollocationLayout
