import React from 'react';
import { View, Image } from '@apps/mobile-ui';
import styles from './index.module.scss';

interface Iprops {
  /** 活动图片 */
  imageUrl: string,
}

const ActivityImage: React.FC<Iprops> = (props: Iprops) => {
  const { imageUrl } = props;

  return (
    <View className={styles['activity-image']}>
      <Image src={imageUrl} />
    </View>
  )
}

export default ActivityImage;
