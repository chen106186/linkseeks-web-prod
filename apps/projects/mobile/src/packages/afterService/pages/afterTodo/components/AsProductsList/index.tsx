/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-30 15:13:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 16:34:41
 * @Description: 售后申请的商品，展示用的
 */
import React from 'react';
import { View, Text, ScrollView } from '@apps/mobile-ui';
import ImageBox from '@/components/ImageBox';
import { AsProductsItem, AsProductsItemProps, AsProductsItemType } from '../AsProducts';
import styles from './index.module.scss';

export * from '../AsProducts';

export interface AsProductsListProps {
  /**
   * 数据
   */
  dataSource: AsProductsItemType[],

  /**
   * 大小，可选 'large' 'default'
   */
  size?: AsProductsItemProps['size'],

  /**
   * 自定义渲染 description
   */
  customRenderDescription?: AsProductsItemProps['customRenderDescription'],
  /**
   * 订单类型
   */
  orderType: number,
}

const AsProductsList: React.FC<AsProductsListProps> = (props: AsProductsListProps) => {
  const {
    dataSource,
    size,
    customRenderDescription,
    orderType,
  } = props;

  if (!dataSource.length) {
    return null;
  }

  if (dataSource.length > 1) {
    return (
      <ScrollView
        horizontal
        data={dataSource}
        renderItem={({ item, index }) => (
          <View key={index} className={styles['as-products-list-item-mult']}>
            <View className={styles['as-products-list-item-mult-img-wrap']}>
              <ImageBox
                width='100%'
                height='100%'
                source={item.skuPic as string}
                className={styles['as-products-list-item-mult-img']}
              />
            </View>
            {size === 'default' ? (
              <Text className={styles['as-products-list-item-mult-desc']}>
                x
                {item.purchaseCount}
              </Text>
            ) : null}
          </View>
        )}
      />
    );
  }

  return (
    <AsProductsItem
      data={dataSource[0] as AsProductsItemProps['data']}
      size={size}
      customRenderDescription={customRenderDescription}
      orderType={orderType}
    />
  );
};

AsProductsList.defaultProps = {
  size: undefined,
};

export default AsProductsList;
