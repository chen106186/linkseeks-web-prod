/*
 * @Description: 基础信息卡片
 */
import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import './index.scss';

type BasicInfoDataType = {
  /**
  * 商品名称
  */
  name?: string,
  /**
  * 商品标语
  */
  slogan?: string,
  /**
  * 卖点
  */
  sellingPoint?: string[],
}

interface BasicInfoCardProps {
  /**
   * 数据
   */
  data: BasicInfoDataType,
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties,
  /**
   * 自定义渲染价格区域
   */
  customRenderPrice?: (data: BasicInfoDataType) => React.ReactNode,
  /**
   * 自定义渲染底部区域
   */
  customRenderFoot?: (data: BasicInfoDataType) => React.ReactNode,
}

const BasicInfoCard = (props: BasicInfoCardProps) => {
  const {
    data,
    customStyle,
    customRenderPrice,
    customRenderFoot,
  } = props;

  return (
    <View className='basicInfo-card' style={customStyle}>
      <View className='basicInfo-card-body'>
        {customRenderPrice?.(data)}
        <Text className='basicInfo-card-name'>
          {data?.name}
        </Text>
        {data && data.slogan && (
          <Text className='basicInfo-card-describe'>
            {data?.slogan}
          </Text>
        )}
        {data?.sellingPoint && data?.sellingPoint.length > 0 ? (
          <View className='basicInfo-card-tags'>
            {data?.sellingPoint.map((item, index) => (
              <View
                      key={index}
                className='basicInfo-card-tags-item'
              >
                <Text className='basicInfo-card-tags-item-text'>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
      {customRenderFoot ? (
        <View className='basicInfo-card-foot'>
          {customRenderFoot?.(data)}
        </View>
      ) : null}
    </View>
  );
};

BasicInfoCard.defaultProps = {
  customStyle: {},
  customRenderPrice: null,
  customRenderFoot: null,
};

export default React.memo(BasicInfoCard);
