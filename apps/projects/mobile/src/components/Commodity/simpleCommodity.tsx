import React from 'react'
import Label, { LabelProps }  from '@/components/Label';
import { View, Text, Image } from '@apps/mobile-ui'
import { Price } from '.';
import './simpleCommodity.scss';

interface Iprops {
  /** 商品id */
  productId: number,
  /** 商品图片 */
  productImage: string,
  /** 商品名 */
  productName: string,
  price?: number,
  discount?: number,
  /** 排行 */
  randking?: number,
  /** 标签 */
  tags: LabelProps[] | string[],
  productNum?: number,

  renderFooter?: React.ReactNode
  onClick?: ((data: Omit<Iprops, 'onClick'>) => void) | null
}

const SimpleCommodity: React.FC<Iprops> = (props: Iprops) => {
  const { onClick, productId, productImage, price, discount, renderFooter = null, randking, productName, tags, productNum } = props
  const handleOnPress = () => {
    onClick?.(props);
  }
  return (
    <View key={productId} className='simple-commodity' onClick={handleOnPress}>

    <View className='simple-commodity-wrap'>
      <View className='simple-commodity-imageContainer'>
        {
          randking && randking < 3 && (
            <View className={`ranking-${randking + 1}`}>{randking + 1}</View>
          )
        }
        <Image src={productImage} className='simple-commodity-image' />
        {
          productNum && (
            <Text className='simple-commodity-num'>{`x ${productNum}`}</Text>
          )
        }
      </View>
      <Text className='simple-commodity-name'>{productName}</Text>
      <View className='simple-commodity-tags'>
        {
          tags?.map((_item, _index) => {
            const _props = typeof _item === 'string' ? { name: _item } : _item;
            return (
              <View className='row-commodity-labels-tagItem' key={_index} >
                <Label {..._props} />
              </View>
            )
          })
        }
      </View>
      {
        discount && price && (
          <Price originalPrice={price} discount={discount} />
        )
      }
      {
        renderFooter
      }
    </View>
  </View>
  )
}

export default SimpleCommodity
