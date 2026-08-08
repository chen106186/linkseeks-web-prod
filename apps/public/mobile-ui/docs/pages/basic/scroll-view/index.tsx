import { View, ScrollView } from '../../../../packages'
import React, { useCallback, useState } from 'react'
import './index.scss'

export interface ScrollViewDocsProps {}

const data = new Array(100).fill('').map((v, i) => i)

const ScrollViewDocs:React.FC<ScrollViewDocsProps> = (props) => {
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState<number[]>([])
  const fetchRequest = useCallback(() => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false)
        setDataList(data)
        resolve(data)
      }, 2000)
    })
  }, [])

  return (
    <View className='page'>
      <ScrollView
        scrollY
        style={{height: 1000}}
        refresherEnabled
        refresherThreshold={40}
        refresherTriggered={loading}
        onRefresherRefresh={fetchRequest}
        refresherDefaultStyle='black'
        className='scroll-container'
      >
        <View className='scroll-loading-container'>loading</View>
        {
          dataList.map(v => <View>{v}</View>)
        }
      </ScrollView>
    </View>
  )
}

ScrollViewDocs.defaultProps = {}

export default ScrollViewDocs
