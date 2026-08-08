import React from 'react'
import Commodity from '../../../Commodity'

export interface CommodityItemProps {
  name: string
  mainPic: string
  min: number
  sold?: number | null
  tags?: string[]
  priceType?: number
}

export const EmptyCommodityItem = () => <Commodity empty mode={'vertical'} />

const CommodityItem: React.FC<CommodityItemProps> = (props) => {
  const { name, mainPic, min, tags, sold, priceType } = props

  return (
    <Commodity
      name={name}
      image={mainPic}
      discountPrice={min}
      sold={sold}
      mode="vertical"
      tags={tags}
      buyBtn={false}
      priceType={priceType}
    />
  )
}

export default CommodityItem
