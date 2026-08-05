import React, { useState, useEffect } from 'react'

export type ResponseType<P> = {
  data: P
  code: number
}

export interface IConfig<P> {
  /**
   * 请求详情方法
   */
  fetchDetail: () => Promise<ResponseType<P>>
  /**
   * fetch callback
   */
  fetchCallback?: (data: P) => void
}

const FetchDetailHoc = <P, T extends {}>(config: IConfig<P>, WrapComponent: React.ComponentType<T>) => {
  const WrapperComponent: React.ForwardRefRenderFunction<any, any> = (
    props: Omit<T, 'dataSource' | 'loading' | 'onRefresh'>,
    forwardedRef,
  ) => {
    const { fetchDetail, fetchCallback } = config
    const [detail, setDetail] = useState<P>()
    const [loading, setLoading] = useState(false)

    const getDetail = () => {
      if (fetchDetail) {
        setLoading(true)
        fetchDetail()
          .then((res) => {
            if (res.code === 1000) {
              setDetail(res.data)
              fetchCallback?.(res.data)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }

    useEffect(() => {
      getDetail()
    }, [])

    const handleRefresh = () => {
      getDetail()
    }

    return (
      <div>
        <WrapComponent
          ref={forwardedRef}
          {...(props as any)}
          dataSource={detail}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>
    )
  }

  return React.memo(React.forwardRef<any, Omit<T, 'dataSource' | 'loading' | 'onRefresh'>>(WrapperComponent))
}

export default FetchDetailHoc
