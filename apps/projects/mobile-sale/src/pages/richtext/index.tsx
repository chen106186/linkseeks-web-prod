import React, { useEffect, useState } from 'react'
import { View } from '@apps/mobile-ui'
import {
  getCurrentInstance,
  showLoading,
  hideLoading,
  setNavigationBarTitle,
  getEnv,
} from '@apps/mobile-services/utils/taro'
// import '@tarojs/taro/html.css'
import { getManageContentNoticeGet } from '@apps/apis'
// import Head from '../../../components/GlobalHeader';
import './style.scss'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      parser: any
    }
  }
}
/* 外部网页 */
const WebInfo = () => {
  const {
    router: {
      params: { id, type },
    },
  } = getCurrentInstance()
  console.log(id)
  const tagStyle = {
    video: 'width: 100%;',
  }
  const [columnTypeList, setcolumnTypeList] = useState<any>({})
  /* 协议 */
  const findAllByColumnType = async () => {
    showLoading()
    const res = await getManageContentNoticeGet({ id })
    if (res.code === 1000) {
      setNavigationBarTitle({ title: res.data.title })
      setcolumnTypeList(res.data)
    }
    hideLoading()
    // console.log(res)
    // const res = await PublicApi.getManageContentNoticeFindAllByColumnType({ columnType: type === 'sign' ? "2" : '4' })
    // if (res.code === 1000) {
    //   let obj: any = {};
    //   if (type === 'sign') {
    //     res.data.map((item: any) => {
    //       if (item.id == id) {
    //         obj = item;
    //       }
    //       console.log(obj);
    //     })
    //   } else {
    //     obj = res.data[0];
    //   }
    // }
  }
  useEffect(() => {
    findAllByColumnType()
  }, [])
  const envType = getEnv()
  return (
    <View className="html">
      {/* 为什么不用统一因为 用了一个插件他会把小程序解析不全的图片自动铺满屏幕 */}
      {envType === 'WEB' ? (
        <View className="taro_html" dangerouslySetInnerHTML={{ __html: columnTypeList.content }}></View>
      ) : (
        <parser html={columnTypeList.content} tag-style={tagStyle} />
      )}
    </View>
  )
}
export default WebInfo
