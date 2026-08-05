import React from 'react';
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui';

import './index.scss';

interface GiveContainerItemCouponProps {
  typeName?: string,
  denomination: number,
  useConditionMoney: number,
  childWidth?: number,
  [key: string]: any,
}

const GiveContainerItemCoupon: React.FC<GiveContainerItemCouponProps> = (props: GiveContainerItemCouponProps) => {
  const intl = useIntl()
  const { typeName = intl.formatMessage({id: 'components.marketingCard.giveContainerItemCoupon.typeName'}), denomination, useConditionMoney, childWidth } = props;

  return (
    <View className='marketingCard-giveContainerItemCoupon-container' style={{ width: childWidth }}>
      <Text className='marketingCard-giveContainerItemCoupon-container-denomination'>
        {intl.formatMessage({id: 'currency'})}
        <Text className='marketingCard-giveContainerItemCoupon-container-denomination-in'>{denomination}</Text>
      </Text>
      <Text className='marketingCard-giveContainerItemCoupon-container-useConditionMoney'>{intl.formatMessage({id: 'components.marketingCard.giveContainerItemCoupon.useConditionMoney',  data: useConditionMoney })}</Text>
      <View
        className='marketingCard-giveContainerItemCoupon-container-typeName'
      >
        <Text className='marketingCard-giveContainerItemCoupon-container-typeName-text'>{typeName}</Text>
      </View>
    </View>
  );
}

export default GiveContainerItemCoupon;
