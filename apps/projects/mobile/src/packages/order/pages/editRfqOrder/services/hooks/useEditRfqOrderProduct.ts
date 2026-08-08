import { useState } from 'react'
import { getCurrentInstance, showToast } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { EDIT_INQUIRY_PRODUCT } from '@/constants/storage'
import { useMobileIntl } from '@apps/locales'

interface InquiryProductItemLogistics {
  /**
   * 配送方式:1-物流（默认）,2-自提,3-无需配送
   */
  deliveryType?: number
  /**
   * 运费方式:1-卖家承担运费（默认）,2-买家承担运费
   */
  carriageType?: number
  /**
   * 重量:单位-KG（公斤）
   */
  weight?: number
  /**
   * 是否使用运费模板
   */
  useTemplate?: boolean
  /**
   * 运费模板id
   */
  templateId?: number
  /**
   * 发货地址id
   */
  sendAddress?: number
  /**
   * 物流公司id
   */
  company?: number
  /**
   * 前端用的字段
   */
  render?: string
}
interface ProductItem extends InquiryProductItem {
  /**
   * 是否选中
   */
  check: boolean
}
interface InquiryProductItem {
  id: number
  /**
   * 商品ID
   */
  productId: number
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 商品询价单ID
   */
  inquiryListId: number
  /**
   * 询价报价单ID
   */
  productQuotationId: number
  /**
   * 金额
   */
  money: number
  /**
   * 报价单价
   */
  price: number
  /**
   * 供应会员ID
   */
  memberId: number
  /**
   * 供应会员ID
   */
  memberRoleId: number
  /**
   * 物流信息 ,LogisticsDetailsRequest
   */
  logistics: InquiryProductItemLogistics
  /**
   * 最小起订数
   */
  minOrder: number
  /**
   * 商品主图
   */
  imgUrl: string
  /**
   * 商品库存
   */
  stockCount?: number
  /**
   * 是否删除
   */
  isDeleted?: boolean
}

const useEditRfqOrderProduct = () => {
  const translate = useMobileIntl()
  const [productList, setProductList] = useState<ProductItem[]>([])
  const {
    params: { onConfirm },
  }: any = getCurrentInstance().preloadData
  const getProductList = () => {
    getAsyncStorage(EDIT_INQUIRY_PRODUCT).then((res: InquiryProductItem[]) => {
      const data = res.map(({ isDeleted, ...rest }) => ({ ...rest, check: !isDeleted }))
      setProductList(data)
    })
  }
  const handleCheckItem = (value: boolean, record: ProductItem) => {
    const newData = [...productList]
    const index = newData.findIndex((item) => item.productId === record.productId)
    const target = newData[index]
    newData.splice(index, 1, {
      ...target,
      check: value,
    })
    setProductList(newData)
  }
  const handleStepItem = (value: number, record: ProductItem) => {
    const newData = [...productList]
    const index = newData.findIndex((item) => item.productId === record.productId)
    const target = newData[index]
    newData.splice(index, 1, {
      ...target,
      purchaseCount: value,
    })
    setProductList(newData)
  }
  const handleSubmit = () => {
    if (productList.length === 0) {
      showToast({
        title: translate('mobile.common.qingzhishaoxuanzeyigeshangpingxunjia'),
        icon: 'none',
      })
    }
    if (onConfirm) {
      const filtered = productList.map(({ check, ...rest }) => ({ ...rest, isDeleted: !check }))
      onConfirm(filtered)
      Router.navigateBack()
    }
  }

  return {
    productList,
    getProductList,
    handleCheckItem,
    handleStepItem,
    handleSubmit,
  }
}

export default useEditRfqOrderProduct
