/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 19:45:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 11:00:16
 * @Description: 规格属性组
 */
import React from 'react';
import { View } from '@apps/mobile-ui';
import classNames from 'classnames';
import ImageBox from '@/components/ImageBox';
import './index.scss';

export type SpecGroupValueType = number | null

export type GroupItemType = {
  /**
   * 名称
   */
  name: string,
  /**
   * 数据id
   */
  id: number,
  /**
   * 规格图片
   */
  img?: string,
}

export interface SpecGroupProps {
  /**
   * specId
   */
  specId: number,
  /**
   * skuKey，对应关联sku中的key
   */
  skuKey: string,
  /**
   * 组名
   */
  title: string,
  /**
   * 项
   */
  items: GroupItemType[],
  /**
   * 当前选中的项
   */
  value: SpecGroupValueType,
  /**
   * 当前禁用的项
   */
  disableds: number[],
  /**
   * 点击选择触发事件
   */
  onChange?: (value: SpecGroupValueType | null) => void,
}

const SpecGroup: React.FC<SpecGroupProps> = (props: SpecGroupProps) => {
  const {
    title,
    items,
    value,
    disableds = [],
    onChange,
  } = props;

  const handlePressItem = (record: GroupItemType) => {
    if (disableds.includes(record.id)) {
      return;
    }
    onChange?.(value !== record.id ? record.id : null);
  };

  const checkDisabed = (recordId: number) => disableds.includes(recordId);

  return (
    <View
      className='attrs-group'
    >
      <View className='attrs-group-title'>
        {title}
      </View>
      <View className='attrs-group-spec'>
        {items.map((item) => (
          <View
            className='attrs-group-spec-itemWrap'
            key={item.id}
            onClick={() => handlePressItem(item)}
          >
            <View
              className={classNames([
                'attrs-group-spec-item',
                {
                  'attrs-group-spec-item__active': item.id === value,
                  'attrs-group-spec-item__disabled': checkDisabed(item.id),
                },
              ])}
            >
              {item.img ? (
                <View className='attrs-group-spec-item-imgWrap'>
                  <View className='attrs-group-spec-item-img'>
                    <ImageBox
                      width={24}
                      height={24}
                      source={item.img}
                      borderRadius={0}
                    />
                  </View>
                </View>
              ) : null}
              <View
                className={classNames([
                  'attrs-group-spec-item-name',
                  {
                    'attrs-group-spec-item-name__active': item.id === value,
                    'attrs-group-spec-item-name__disabled': checkDisabed(item.id),
                  },
                ])}
              >
                {item.name}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SpecGroup;
