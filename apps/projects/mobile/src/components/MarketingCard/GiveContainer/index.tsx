import React from 'react'
import { ScrollView, View } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'

import GiveContainerItem from '../GiveContainerItem'

interface GiveContainerProps {
  details: any
  type: number
}

const GiveContainer: React.FC<GiveContainerProps> = (props: GiveContainerProps) => {
  const { details, type } = props
  return (
    <ScrollView
      data={details}
      scrollY={true}
      key="GiveContainer"
      keyExtractor={(item) => `${item.id}`}
      renderItem={({ item }) => (
        <View key={item.id} style={{ padding: pxTransform(12), width: '100%' }}>
          <GiveContainerItem detailType="give" detail={item} childType={type === 8 ? 'goods' : 'coupons'} />
        </View>
      )}
    />
  )
}

export default GiveContainer
