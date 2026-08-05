/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 10:24:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 13:53:28
 * @Description: 优惠券
 */
import React from 'react';
import { View } from '@apps/mobile-ui';
import classNames from 'classnames';
import './index.scss';

type CouponType = {
  /**
   * 数据id
   */
  id: number,
  /**
   * 优惠券名称
   */
  name: string,
}

interface CouponsItemProps {
  /**
   * 数据
   */
  data: CouponType,
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,
}

export const CouponsItem: React.FC<CouponsItemProps> = (props: CouponsItemProps) => {
  const { data, customStyle } = props;

  return (
    <View
      className='marketing-campaign-coupons-item'
      style={customStyle}
    >
      <View className='marketing-campaign-coupons-item-wrap'>
        <View className={classNames('marketing-campaign-coupons-item-circle', 'marketing-campaign-coupons-item-circle__left')} />
        <View className={classNames('marketing-campaign-coupons-item-circle', 'marketing-campaign-coupons-item-circle__right')} />
        <View className='marketing-campaign-coupons-item-protector'>
          <View className='marketing-campaign-coupons-item-text'>{data.name}</View>
        </View>
      </View>
    </View>
  );
};

CouponsItem.defaultProps = {
  customStyle: {},
};

interface IProps {
  /**
   * 数据
   */
  dataSource: CouponType[],
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,
  /**
   * 最多展示的个数，默认2
   */
  max?: number,
}

const Coupons: React.FC<IProps> = (props: IProps) => {
  const { dataSource, customStyle } = props;

  const slice = dataSource.slice(0, 2);

  return (
    <View className='marketing-campaign-coupons' style={customStyle}>
      {slice.map((item) => (
        <CouponsItem
          data={item}
          key={item.id}
        />
      ))}
    </View>
  );
};

Coupons.defaultProps = {
  customStyle: {},
  max: 2,
};

export default Coupons;
