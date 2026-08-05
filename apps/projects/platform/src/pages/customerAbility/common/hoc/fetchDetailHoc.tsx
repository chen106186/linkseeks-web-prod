/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-12 14:21:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-12 17:27:33
 * @Description: 获取详情 hoc，要求传入的组件接受 dataSource、loading 属性
 */
import React, { useState, useEffect } from 'react';

export type ResponseType<P> = {
  data: P,
  code: number
}

export interface IConfig<P> {
  /**
   * 请求详情方法
   */
  fetchDetail: () => Promise<ResponseType<P>>;
  /**
   * fetch callback
   */
  fetchCallback?: (data: P) => void;
}

const FetchDetailHoc = <P, T extends {}>(config: IConfig<P>, WrapComponent: React.ComponentType<T>) => {
  const { fetchDetail, fetchCallback } = config;
  const [detail, setDetail] = useState<P>();
  const [loading, setLoading] = useState(false);

  const getDetail = () => {
    if (fetchDetail) {
      setLoading(true);
      fetchDetail().then((res) => {
        if (res.code === 1000) {
          setDetail(res.data);
          fetchCallback?.(res.data);
        }
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return React.useMemo(() => {
    return (props: Omit<T, ('dataSource' | 'loading')>): JSX.Element => {
      return (
        <div>
          <WrapComponent {...props as any} dataSource={detail} loading={loading} />
        </div>
      );
    }
  }, [WrapComponent, detail, loading]);
};

export default FetchDetailHoc;