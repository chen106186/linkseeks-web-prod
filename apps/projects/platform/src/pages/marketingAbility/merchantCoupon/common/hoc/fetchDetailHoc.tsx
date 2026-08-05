/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:50:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-06 17:07:22
 * @Description: 获取详情 hoc，要求传入的组件接受 dataSource、loading 属性
 */
import React, { useState, useEffect } from 'react'
import { DetailType } from '../../components/CouponDetail'

export interface IConfig {
  /**
   * 请求详情方法
   */
  fetchDetail: () => Promise<{ data: DetailType }>
}

const FetchDetailHoc = <P extends {}>(config: IConfig, WrapComponent: React.ComponentType<P>) => {
  const { fetchDetail } = config
  const [detail, setDetail] = useState<DetailType>()
  const [loading, setLoading] = useState(false)

  const getDetail = () => {
    if (fetchDetail) {
      setLoading(true)
      fetchDetail()
        .then((res) => {
          setDetail(res.data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return React.useMemo(() => {
    return (props: Omit<P, 'dataSource' | 'loading'>): JSX.Element => {
      return (
        <div>
          <WrapComponent {...(props as any)} dataSource={detail} loading={loading} />
        </div>
      )
    }
  }, [WrapComponent, detail, loading])
}

export default FetchDetailHoc
