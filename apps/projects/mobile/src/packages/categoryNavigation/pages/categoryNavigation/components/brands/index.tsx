import { View, Text, Image } from '@apps/mobile-ui';
import React from 'react';
import styles from './index.module.scss';

export type BrandType = {
  id: number,
  logoUrl: string,
  name: string
}

interface IListProps {
  dataSource: BrandType[],
  loading?: boolean,
  onClick?: (dataProps: BrandType) => void,
}

const BrandList: React.FC<IListProps> = (props: IListProps) => {
  const { dataSource, onClick } = props;

  const handlePress = (dataProps: BrandType) => {
    onClick?.(dataProps);
  }

  return (
    <View className={styles['brandList']}>
      {
        dataSource?.map((_item) => (
          <View onClick={() => handlePress(_item)} className={styles['brandItem']} key={_item.id}>
            <View className={styles['brand']}>
              <View className={styles['imageContainer']}>
                <Image src={_item.logoUrl} className={styles['image']} />
              </View>
              <Text className={styles['name']}>{_item.name}</Text>
            </View>
          </View>
        ))
      }
    </View>
  )
}

export default BrandList;
