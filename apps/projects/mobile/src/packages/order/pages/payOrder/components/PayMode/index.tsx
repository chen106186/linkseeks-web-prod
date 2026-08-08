import React, { useEffect, useState } from 'react';
import cx from 'classnames'
import { View, Text, Icons, Image } from '@apps/mobile-ui';
import MelloCard from '@/components/MellowCard';
import styles from './index.module.scss';

interface Iprops {
  options: OptionType[],
  value: string | number | null,
  onChange?: ((item: OptionType) => void) | null
}

export type OptionType = {
  icon?: any,
  label: string,
  value: string | number,
  extra?: string,
  disable?: boolean,
  helper?: string,
}

const PayMode: React.FC<Iprops> = (props: Iprops) => {
  const { options, value, onChange } = props;

  const [state, setState] = useState(value);

  const handleChange = (item: OptionType) => {
    if (item.disable) {
      return;
    }
    if (onChange) {
      onChange(item)
    }
    setState(item.value)
  }

  useEffect(() => {
    setState(value);
  }, [value])

  return (
    <MelloCard bodyStyle={{ padding: 0 }}>
      {
        options.map((_item: OptionType) => (
          <View className={styles['item']} key={_item.value} onClick={() => handleChange(_item)}>
            <View className={styles['infos']}>
              {
                _item.icon && <Image src={_item.icon} className={styles['img']} />
              }
              <Text className={cx(styles['name'],_item.disable ? styles['disable'] : '')}>{_item.label}</Text>
              <Text className={styles['extra']}>{_item.extra}</Text>
            </View>
            {
              _item.disable && _item.helper
                ? <Text className={styles['helper']}>{_item.helper}</Text>
                : (
                  <View className={state === _item.value ? styles['status'] : styles['disappear']}>
                    <Icons name={styles['check']} size={12} color='#fff' />
                  </View>
                )
            }
          </View>
        ))
      }
    </MelloCard>
  )
}

PayMode.defaultProps = {
  onChange: null,
}

export default PayMode;
