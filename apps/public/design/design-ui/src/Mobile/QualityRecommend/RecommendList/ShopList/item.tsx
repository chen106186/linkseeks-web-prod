import React from 'react'
import RecommendShopItem from '../../../RecommendShop/shopItem'

interface ProductItemType {
  name: string
  mainPic: string
  min: string
  price: number
  priceType: number
}

interface ShopItemPorps {
  id: number
  logo: string
  memberName: string
  registerYears: number
  creditPoint: number
  productList: ProductItemType[]
}

const ShopItem: React.FC<ShopItemPorps> = (props) => {
  const { id, logo, memberName, registerYears, creditPoint, productList } =
    props

  return (
    <RecommendShopItem
      id={id}
      logo={logo}
      memberName={memberName}
      registerYears={registerYears}
      creditPoint={creditPoint}
      productList={productList}
    />
  )
}

export default ShopItem
