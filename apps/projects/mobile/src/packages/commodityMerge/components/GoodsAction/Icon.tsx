import React, { CSSProperties } from 'react';
import { Icons, View, Text } from '@apps/mobile-ui';
import { THEME_COLORS } from '@/constants/theme';
import './styles.scss';

interface GoodsActionIconProps {
  /**
   * text
   */
  text: string,
  /**
   * icon
   */
  icon: string,
  /**
   * icon color，默认使用主题正文色
   */
  color?: string,
  /**
   * icon size，默认 20
   */
  size?: number,
  /**
   * 自定义外部样式
   */
  customStyle?: string | CSSProperties,
  /**
   * 点击触发事件
   */
  onClick?: () => void,
}

const GoodsActionIcon: React.FC<GoodsActionIconProps> = (props: GoodsActionIconProps) => {
  const { text, icon, color, size, customStyle, onClick } = props;

  const handlePress = () => {
    onClick?.();
  };

  return (
    <View
      className='goods-action-icon'
      onClick={handlePress}
      style={customStyle}
    >
      <Icons
        name={icon}
        size={size}
        color={color}
      />
      <Text className='goods-action-icon-text'>{text}</Text>
    </View>
  );
};

GoodsActionIcon.defaultProps = {
  color: THEME_COLORS.text,
  size: 20,
  customStyle: {},
  onClick: undefined,
};

export default GoodsActionIcon;
