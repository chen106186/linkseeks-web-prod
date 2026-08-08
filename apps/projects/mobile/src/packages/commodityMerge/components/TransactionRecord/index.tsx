/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 16:27:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 16:58:25
 * @Description: 交易记录
 */
import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import ImageBox from '@/components/ImageBox';
import './index.scss';

export type TransactionRecordItemType = {
  /**
   * 采购会员Logo
   */
  logo: string,
  /**
   * 采购商id
   */
  buyerMemberId: number,
  /**
   * 采购商名称
   */
  buyerMemberName: string,
  /**
   * 创建时间
   */
  createTime: string | number,
  /**
   * 成交数量
   */
  quantity: string,
  /**
   * 单位
   */
  unit: string,
}

interface TransactionRecordProps {
  /**
   * 数据
   */
  data: TransactionRecordItemType,
}

const TransactionRecord: React.FC<TransactionRecordProps> = (props: TransactionRecordProps) => {
  const { data } = props;

  return (
    <View className='transaction'>
      <View className='transaction-left'>
        <View
          className='transaction-avatar'
        >
          <ImageBox
            source={data.logo}
            className='transaction-avatar-img'
          />
        </View>
      </View>
      <View className='transaction-center'>
        <View className='transaction-name'>
          {data.buyerMemberName}
        </View>
        <View className='transaction-created'>
          {data.createTime}
        </View>
      </View>
      <View className='transaction-right'>
        <Text className='transaction-quantity'>
          {data.quantity}
        </Text>
        <Text className='transaction-unit'>
          {data.unit}
        </Text>
      </View>
    </View>
  );
};

export default TransactionRecord;
