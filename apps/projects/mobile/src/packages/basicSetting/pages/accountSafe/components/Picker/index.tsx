import React, { useState } from 'react';
import { View, Text, Icons } from '@apps/mobile-ui';
import ActionSheet from '@/components/ActionSheet';
import styles from './index.module.scss';

export type OptionType = {
  label: string | number,
  value: string | number,
}

interface Iprops {
  value?: string | number,
  onChange?: null | ((item: OptionType) => void),
  options?: OptionType[],
  title: string,
}

const Picker: React.FC<Iprops> = (props: Iprops) => {
  const { value, onChange, options, title } = props;
  const [toggle, setToggle] = useState<boolean>(false);
  const [state, setState] = useState(value);
  const handleChange = (item: OptionType) => {
    if (onChange) {
      onChange(item)
    }
    setState(item.value);
    setToggle(false)
  }
  return (
    <View>
      <ActionSheet
        visible={toggle}
        title={title}
      >
        <View className={styles['main']}>
          {
            (options as OptionType[]).map((item) => (
              <View className={styles['list-item']} key={item.value} onClick={() => handleChange((item))}>
                <View>
                  <Text className={styles['country']}>{item.label}</Text>
                  <Text className={styles['code']}>{item.value}</Text>
                </View>
                {
                  item.value === state
                    && <Icons name="check" size={16} color="#3877FF" />
                }
              </View>
            ))
          }
        </View>
      </ActionSheet>
      <View className={styles['code']} onClick={() => setToggle(true)}>
        <Text className={styles['value']}>{ state }</Text>
        <Icons name="down" size={16} />
      </View>
    </View>
  )
}

Picker.defaultProps = {
  value: "",
  onChange: null,
  options: [],
}

export default Picker;
