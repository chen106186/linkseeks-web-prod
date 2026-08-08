import { View } from '@tarojs/components'
import React from 'react'
import './index.scss'

interface PropsType {
  data: {
    title?: string
    dataSource: { label: string; extra: JSX.Element }[]
  }
}

const CardList: React.FC<PropsType> = (props) => {
  const { data } = props

  return (
    <View className="card-box">
      {data.title && <View className="title-name">{data.title}</View>}
      <View className="content-box">
        {data.dataSource.map((v) => (
          <View className="content-item" key={v.label}>
            <View className="item-label">{v.label}</View>
            <View className="item-value">{v.extra}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default CardList
