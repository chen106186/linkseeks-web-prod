/**
 * @Deprecated 配送至组件
 */
 import React from 'react';
 import { View, Text, Icons } from '@apps/mobile-ui';
 import Bookshelf from '../../../../components/Bookshelf';
 import './index.scss';

 interface StockProps {
   /**
    * 点击跳转触发事件
    */
   onJump?: () => void,
 }

 const Stock: React.FC<StockProps> = (props: StockProps) => {
   const { onJump } = props;

   const handlePress = () => {
     onJump?.();
   };

   return (
     <Bookshelf.Item
       label='配送至'
       labelWidth={64}
       content={(
         <View className='stock'>
           <View className='stock-address'>
             <View className='stock-address-left'>
               <Icons name='Pin' size={12} color='#303133' />
             </View>
             <View className='stock-address-right'>
               <Text className='stock-address-text'>广东省广州市海珠区琶洲街道</Text>
             </View>
           </View>
           <Text className='stock-tip'>该地区暂不支持配送</Text>
         </View>
       )}
       onPress={handlePress}
       customStyle={{
         alignItems: 'flex-start',
       }}
       isLink
     />
   );
 };

 export default Stock;
