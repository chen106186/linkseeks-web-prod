import React from 'react';
import { View, Text, Image } from '@apps/mobile-ui';
import styles from './index.module.scss';

export type NavItemType = {
  icon: string,
  name: string,
  id: number
}

interface Iprops {
  dataSource: NavItemType[],
  onClick?: (dataProps: NavItemType) => void
}

const NavList: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource, onClick } = props;

  const handlePress = (dataProps: NavItemType) => {
    onClick?.(dataProps);
  }
  return (
    <View className={styles['navList']}>
      {
        dataSource?.map((_item, _index) => (
          <View onClick={() => handlePress(_item)} className={styles['navItem']} key={`${_item.id}_${_index}`}>
            <View className={styles['navContainer']}>
              <View className={styles['iconContainer']}>
                {/* <View className='' /> */}
                <Image src={_item.icon} className={styles['icon']} />
              </View>
              <Text className={styles['name']}>{_item.name}</Text>
            </View>
          </View>
        ))
      }
    </View>
  )
}

export default NavList;
