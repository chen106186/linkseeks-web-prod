import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import classNames from 'classnames'
import './button.scss';

interface Iprops {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'violet',
  onClick?: () => void,
  children: React.ReactNode
  customClassName?: string
}

const Button: React.FC<Iprops> = (props: Iprops) => {
  const { type, onClick, children, customClassName = '' } = props;
  const handleClick = () => {
    onClick?.();
  }

  return (
    <View className={classNames('activity-btn', `activity-btn-${type}`, customClassName)} onClick={handleClick}>
      <Text className='activity-btn-text'>
        {children}
      </Text>
    </View>
  )
}

export default Button
