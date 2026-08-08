/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-03 10:33:37
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:10:42
 * @Description: CellItem 组件
 */
import React from 'react';
import { View, Text, Icons } from '@apps/mobile-ui';
import cellContext from './context';
import './index.scss';

export interface CellItemProps {
  /**
   * 左侧标题
   */
  title?: React.ReactNode,
  /**
   * 左侧标题 numberOfLines
   */
  // titleNumberOfLines?: number,
  /**
   * icon 名称
   */
  icon?: string,
  /**
   * 自定义渲染 icon
   */
  customIcon?: React.ReactNode,
  /**
   * icon大小，默认 14，自定义渲染 icon 该属性无效
   */
  iconSize?: number,
  /**
   * 右侧内容
   */
  value?: React.ReactNode,
  /**
   * 标题下方的描述信息
   */
  label?: React.ReactNode,
  /**
   * 是否展示右侧箭头
   */
  hasArrow?: boolean,
  /**
   * 是否开启点击反馈
   */
  clickable?: boolean,
  /**
   * 点击触发事件，需要开启 clickable，否则无效
   */
  onPress?: () => void,
  /**
   * 是否展示边框
   */
  border?: boolean,
  /**
   * 是否对调 title 与 value 的字体样式
   */
  transposition?: boolean,
  /**
   * 自定义头部样式
   */
  customHeadStyle?: React.CSSProperties,
  /**
   * 自定义标题样式
   */
  customTitleStyle?: React.CSSProperties,
}

function isTextNode(node: React.ReactNode) {
  return typeof node === 'string' || typeof node === 'number';
}

const CellItem: React.FC<CellItemProps> = (props: CellItemProps) => {
  const {
    title,
    // titleNumberOfLines = undefined,
    icon,
    iconSize = 22,
    customIcon,
    value,
    label,
    hasArrow,
    clickable,
    onPress,
    border,
    transposition,
    customHeadStyle,
    customTitleStyle,
  } = props;

  const context = React.useContext(cellContext);

  const handlePress = () => {
    if (clickable && onPress) {
      onPress();
    }
  };

  const finalTransposition = transposition || context?.transposition;

  const renderTitle = () => (
    isTextNode(title) ? (
      <Text
        className={!finalTransposition ? 'cell-list-item-title' : 'cell-list-item-value'}
        style={!finalTransposition ? customTitleStyle : {}}
      >
        {title}
      </Text>
    ) : (
      title
    )
  );

  const renderValue = () => (
    isTextNode(value) ? (
      <Text
        className={!finalTransposition ? `${'cell-list-item-value'} ${'cell-list-item-value__right'}` : `${'cell-list-item-title'} ${'cell-list-item-value__right'}`}
        style={!finalTransposition ? {} : customTitleStyle}
      >
        {value}
      </Text>
    ) : (
      value
    )
  );

  const renderLabel = () => (
    isTextNode(label) ? (
      <Text className='cell-list-item-label'>{label}</Text>
    ) : (
      label
    )
  );

  return (
    <View
      className={`${'cell-list-item'} ${border && 'cell-list-item__border'}`}
      onClick={handlePress}
    >
      <View
        className='cell-list-item-head'
        style={customHeadStyle}
      >
        {(icon || customIcon) ? (
          <View className='cell-list-item-icon'>
            {!customIcon ? (
              <Icons name={icon} size={iconSize} color='#303133' />
            ) : (
              customIcon
            )}
          </View>
        ) : null}
        <View className='cell-list-item-title-wrap'>
          {renderTitle()}
        </View>
        {renderValue()}
        {hasArrow ? (
          <View className='cell-list-item-arrow'>
            <Icons name='ChevronRight' size={14} color='#C0C4CC' />
          </View>
        ) : null}
      </View>
      {label && (
        <View className='cell-list-item-label-wrap'>
          {renderLabel()}
        </View>
      )}
    </View>
  );
};

CellItem.defaultProps = {
  title: null,
  // titleNumberOfLines: undefined,
  icon: '',
  iconSize: 14,
  customIcon: null,
  value: null,
  label: null,
  hasArrow: false,
  clickable: false,
  onPress: undefined,
  border: undefined,
  transposition: false,
  customHeadStyle: {},
  customTitleStyle: {},
};

CellItem.displayName = 'CellItem';

export default CellItem;
