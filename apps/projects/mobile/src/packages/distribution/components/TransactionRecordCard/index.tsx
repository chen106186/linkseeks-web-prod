/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 16:27:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 18:29:54
 * @Description: 交易记录Card
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Loading from '@/components/Loading'
import TransactionRecord, { TransactionRecordItemType } from '../TransactionRecord'
import './index.scss'

interface TransactionRecordCardProps {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 数据
     */
    data: TransactionRecordItemType[]
    /**
     * 条目
     */
    totalCount: number
  }
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义className
   */
  customClassName?: string
  /**
   * 点击跳转触发事件
   */
  onJump?: () => void
  /**
   * 跳转需要的params
   */
  params?: {
    /**
     * 商品id
     */
    commodityId: number
    /**
     * 当前商城id
     */
    shopId: number
  }
  /**
   * 标题
   */
  title: string
  /**
   * 商品定价类型
   */
  priceType: number
}

const TransactionRecordCard: React.FC<TransactionRecordCardProps> = (props: TransactionRecordCardProps) => {
  const { dataSource, loading, customStyle, customClassName, onJump, params, title, priceType } = props

  const intl = useIntl()

  /**
   * 跳转交易记录列表页面，目前都是跳转到同一个页面，而且请求接口都是一样的，所以先写死，如果以后有需求变动
   * 可以传入 onJump 外部进行跳转
   * @returns null
   */
  const handleJump = () => {
    if (!onJump) {
      Router.navigateTo('commodityMerge/stocksSourcing/transactionRecord', { ...params, priceType })
      return
    }
    onJump?.()
  }

  return (
    <MellowCard
      title={title}
      extra={
        <Shuttle
          describe={intl.formatMessage({
            id: 'commodityMerge.components.transactionRecordCard.totalCount',
            total: dataSource.totalCount,
          })}
          onJump={handleJump}
        />
      }
      style={customStyle}
      className={customClassName}
      bodyStyle={{
        padding: 0,
      }}
      headStyle={{
        borderBottomWidth: 0,
      }}
    >
      <View className="product-transaction-record">
        {dataSource.data.map((item, index) => (
          <View
            key={index}
            className={classNames('product-transaction-record-item', {
              'product-transaction-record-item__border': index !== dataSource.data.length - 1,
            })}
          >
            <TransactionRecord data={item} />
          </View>
        ))}
        <Loading
          loading={loading}
          noMoreText={
            dataSource.data.length ? '' : intl.formatMessage({ id: 'common.no.record', defaultMessage: '暂无记录~' })
          }
          noMore
        />
      </View>
    </MellowCard>
  )
}

export default TransactionRecordCard
