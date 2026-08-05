/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 15:12:28
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 15:12:28
 * @Description:
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Loading from '@/components/Loading'
import EvaluateRecord from '../EvaluateRecord'
import { GetMemberMobileCommentMallTradeHistoryPageResponseDetail } from '@apps/apis'
import './index.scss'

interface EvaluateRecordCardProps {
  /**
   * 数据
   */
  dataSource: GetMemberMobileCommentMallTradeHistoryPageResponseDetail[]
  /**
   * 好评率
   */
  tradeSummary: number
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
     * 商城类型
     */
    shopType: number
  }
}

const EvaluateRecordCard: React.FC<EvaluateRecordCardProps> = (props: EvaluateRecordCardProps) => {
  const { dataSource, tradeSummary, loading, customStyle, customClassName, onJump, params } = props

  const intl = useIntl()

  /**
   * 跳转评价列表页面，目前都是跳转到同一个页面，而且请求接口都是一样的，所以先写死，如果以后有需求变动
   * 可以传入 onJump 外部进行跳转
   * @returns null
   */
  const handleJump = () => {
    if (!onJump) {
      Router.navigateTo('commodityMerge/stocksSourcing/evaluateRecord', params)
      return
    }
    onJump?.()
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'commodityMerge.components.evaluateRecordCard.title', defaultMessage: '评价' })}
      extra={
        <Shuttle
          describe={
            tradeSummary
              ? `${intl.formatMessage({
                  id: 'commodityMerge.components.evaluateRecordCard.tradeSummary',
                  defaultMessage: '好评率',
                })}${tradeSummary}%`
              : ''
          }
          onJump={handleJump}
        />
      }
      className={customClassName}
      style={customStyle}
      bodyStyle={{
        padding: 0,
      }}
      headStyle={{
        borderBottomWidth: 0,
      }}
    >
      <View className="product-evaluate-record">
        {dataSource.map((item, index) => (
          <View
            key={item.id}
            className={classNames('product-evaluate-record-item', {
              'product-evaluate-record-item__border': index !== dataSource.length - 1,
            })}
          >
            <EvaluateRecord data={item} />
          </View>
        ))}
        <Loading
          loading={loading}
          noMoreText={`${
            dataSource.length
              ? ''
              : intl.formatMessage({
                  id: 'commodityMerge.components.evaluateRecordCard.nothing',
                  defaultMessage: '暂无评价~',
                })
          }`}
          noMore
        />
      </View>
    </MellowCard>
  )
}

export default EvaluateRecordCard
