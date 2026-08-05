import { useMemo } from 'react'
import React from 'react'
import { formatTimeString } from '@/utils'

/**
 * 详情页基本信息 列信息
 */
export const useBasicInfoColumnInDetail = <T extends object>(options: { initialValue: T }) => {
  const { initialValue } = options

  const basicInfoColumn = useMemo(() => {
    return [
      {
        title: '通知单号',
        value: initialValue?.['noticeNo'],
      },
      {
        title: '通知单来源',
        value: initialValue?.['source'] === 1 ? '订单加工' : '商品加工',
      },
      {
        title: '单据时间',
        value: initialValue?.['createTime'],
      },
      {
        title: '通知摘要',
        value: initialValue?.['summary'],
        span: 2,
      },
      {
        title: '加工企业',
        value: initialValue?.['processName'],
      },
      {
        title: '外部状态',
        value: initialValue?.['outerStatusName'],
        span: 3,
      },
      {
        title: '内部状态',
        value: initialValue?.['innerStatusName'],
        span: 3,
      },
    ]
  }, [initialValue])

  const payInfoColumns = useMemo(() => {
    return [
      {
        title: '配送方式',
        value: initialValue?.['deliveryType'] === 1 ? '物流' : '自提',
      },
      initialValue?.['deliveryType'] === 1
        ? {
            title: '收货地址',
            value: (
              <div>
                <div>
                  <span>
                    {initialValue?.['receiveUserName']}/ {initialValue?.['receiveUserTel']}
                  </span>
                </div>
                <span>{initialValue?.['receiveAddress']}</span>
              </div>
            ),
          }
        : null,
      initialValue?.['deliveryAddress'] !== null
        ? {
            title: initialValue?.['deliveryType'] === 1 ? '发货地址' : '自提地址',
            value: (
              <div>
                <div>
                  <span>
                    {initialValue?.['deliveryUserName']}/ {initialValue?.['deliveryUserTel']}
                  </span>
                </div>
                <span>{initialValue?.['deliveryAddress']}</span>
              </div>
            ),
          }
        : null,
      {
        title: '交期',
        value: initialValue?.['deliveryDate'] && formatTimeString(initialValue?.['deliveryDate']),
      },
    ].filter(Boolean)
  }, [initialValue])

  const cacheOtherInfo = useMemo(() => {
    const explain = initialValue?.['otherAsk']?.explain || []
    const list = explain.map((_item) => {
      return {
        title: _item.name,
        value: _item.value,
      }
    })
    return list
  }, [initialValue])

  const annexInfo = useMemo(() => {
    const annex = initialValue?.['otherAsk']?.annex || []
    return [
      {
        title: '附件',
        value: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {annex.map((_item, key) => {
              return (
                <a href={_item.value} style={{ marginTop: '4px' }} key={key}>
                  {_item.name}
                </a>
              )
            })}
          </div>
        ),
      },
    ]
  }, [initialValue])

  return { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo }
}
