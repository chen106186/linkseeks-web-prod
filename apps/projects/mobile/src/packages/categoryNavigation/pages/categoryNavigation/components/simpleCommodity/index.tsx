import React from 'react';
import { View, Text, Image } from '@apps/mobile-ui';
import { ScrollView } from '@tarojs/components';
import Label from '@/components/Label';
import { Price } from '@/components/Commodity';
import { useIntl } from '@linkseeks/i18n';
import styles from './index.module.scss';

type DataPropsType = {
  image: string,
  price: number,
  discount?: number,
  name: string,
  sale?: number,
  id: number,
}

type IListProps = {
  loading?: boolean,
  dataSource: {
    name: string,
    /** 商品价格 */
    price?: number,
    /** 图片 */
    pic: string,
    id: number,
    /** 销量 */
    sale?: number,
    /** 折扣价 */
    discount: number,
  }[],
  onClick?: (dataProps: DataPropsType) => void,
}


const SimpleCommodity: React.FC<IListProps> = (props: IListProps) => {
  const { dataSource, onClick } = props;
  const intl = useIntl()
  const handlePress = (dataProps: DataPropsType) => {
    onClick?.(dataProps);
  }

  return (
    <ScrollView
      className={styles['simpleCommodityList']}
      enhanced
      scrollX
      showScrollbar={false}
    >
      {
        dataSource?.map((_item, index) => {
          const { name, price, pic, sale, id, discount } = _item;
          return (
            <View key={id} className={styles['simpleCommodityItem']} onClick={() => handlePress(_item as any)}>

              <View className={styles['simpleCommodityItem-wrap']}>
                <View className={styles['imageContainer']}>
                  {
                    index < 3 && (
                      <View className={styles[`ranking-${index + 1}`]}>{index + 1}</View>
                    )
                  }
                  <Image src={pic} className={styles['image']} />
                </View>
                <Price originalPrice={price} discount={discount} direction='vertical' />
                {
                  typeof sale !== 'undefined' && (
                    <View className={styles['sale-label']}>
                      <Label name={intl.formatMessage({id: 'categoryNavigation.saleByMonth',  sale: sale || 0 })} type='danger' />
                    </View>
                  ) || null
                }
              </View>
            </View>
          )
        })
      }
    </ScrollView>
  )
}

export default SimpleCommodity
