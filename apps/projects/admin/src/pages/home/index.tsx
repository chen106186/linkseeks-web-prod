import React, { useState, useEffect, useRef } from 'react'
import { Card, Space, Row, Col, List, Skeleton, Badge } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import TodayAdd from './components/TodayAdd'
// import OrderStatistics from './components/OrderStatistics';
import StatisticsColumn from './components/StatisticsColumn'
import Settlement from './components/Settlement'
import DataCenter from './components/DataCenter'
import RiskCenter from './components/RiseCenter'
import MemberStatisticsContainer from './components/MemberStatistics/MemberStatisticsContainer'
import OrderContainer from './components/Order'
import PurchaseCenter from './components/PurchaseCenter'

const Home: React.FC<{}> = () => {
  return (
    // 全局统计
    <PageHeaderWrapper>
      <Space direction="vertical" style={{ width: '100%' }}>
        <TodayAdd />
      </Space>
      {/* 会员统计 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <MemberStatisticsContainer />
      </Space>
      {/* 订单统计 */}
      <Space direction="vertical" style={{ width: '100%', height: '100%' }}>
        <OrderContainer />
      </Space>
      <Space direction="vertical" style={{ width: '100%', height: '100%' }}>
        <PurchaseCenter />
      </Space>
      {/* 商品品牌统计 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <StatisticsColumn />
      </Space>

      {/* 付款提现统计 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Settlement />
      </Space>

      <Space direction="vertical" style={{ width: '100%' }}>
        <DataCenter />
      </Space>
      {/* 风控中心 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <RiskCenter />
      </Space>
    </PageHeaderWrapper>
  )
}

export default Home
