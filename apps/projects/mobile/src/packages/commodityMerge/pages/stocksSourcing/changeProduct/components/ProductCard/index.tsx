/**
 * @Description 换购商品
 */
import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import { useIntl } from '@linkseeks/i18n';
import ImageBox from '@/components/ImageBox';
import './index.scss';

export type ProductCardData = {
  /**
   * 商品id
   */
  id: number,
  /**
   * 商品skuId
   */
  skuId: number,
  /**
   * 商品名称
   */
  name: string,
  /**
  * 商品描述
  */
  describe?: string,
  /**
  * 商品图片
  */
  picture: string,
  /**
   * 定价类型
   */
  priceType: number,
  /**
  * 价格
  */
  price?: number | string,
  /**
  * 原价
  */
  originalPrice?: number | string,
  /**
   * 购买数量
   */
  quantity: number,
  /**
   * 店铺会员id
   */
  memberId: number,
  /**
   * 店铺id
   */
  storeId: number,
}

interface ProductCardProps {
  /**
   * 数据
   */
  data: ProductCardData,
  /**
   * 是否显示当前商品，默认 false
   */
  current?: boolean,
  /**
   * 点击触发事件
   */
  onClick?: (data: ProductCardData) => void,
}

const ProductCard: React.FC<ProductCardProps> = (props: ProductCardProps) => {
  const { data, current, onClick } = props;

  const intl = useIntl()

  const handleClick = () => {
    onClick?.(data);
  };

  return (
    <View onClick={handleClick} className='productCard'>
      <View className='productCard-left'>
        <View className='productCard-imgWrap'>
          <ImageBox
            source={data.picture}
            width='100%'
            height='100%'
            className='productCard-img'
            resizeMode='aspectFit'
          />
          {current && (
            <View className='productCard-name-tag'>
              <Text className='productCard-name-tag-text'>{intl.formatMessage({id: 'commodityMerge.changeProduct.current',  defaultMessage: '当前商品' })}</Text>
            </View>
          )}
        </View>
      </View>
      <View className='productCard-right'>
        <View className='productCard-right-head'>
          <View className='productCard-nameWrap'>
            <View className='productCard-name'>
              {data.name}
            </View>
          </View>
          {data.describe ? (
            <View className='productCard-description'>
              {data.describe}
            </View>
          ) : null}
        </View>
        <View className='productCard-priceWrap'>
          <Text className='productCard-price'>
            {intl.formatMessage({id: 'currency',  defaultMessage: '¥' })}
            {data.price}
          </Text>
          {data.originalPrice !== data.price && (
            <Text className='productCard-origin-price'>
              {intl.formatMessage({id: 'currency',  defaultMessage: '¥' })}
              {data.originalPrice}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
