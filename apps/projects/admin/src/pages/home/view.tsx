import React, { useState, useEffect, useRef } from 'react'
import { Button, Space } from '@linkseeks/ui'
import TodayAdd from './components/TodayAdd'
// import OrderStatistics from './components/OrderStatistics';
import StatisticsColumn from './components/StatisticsColumn'
import Settlement from './components/Settlement'
import DataCenter from './components/DataCenter'
import RiskCenter from './components/RiseCenter'
import MemberStatisticsContainer from './components/MemberStatistics/MemberStatisticsContainer'
import OrderContainer from './components/Order'
import PurchaseCenter from './components/PurchaseCenter'
import { useNavigate } from '@linkseeks/router-core'

const Home: React.FC<{}> = () => {
  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <TodayAdd />
        {/* 会员统计 */}
        <MemberStatisticsContainer />
        {/* 订单统计 */}
        <OrderContainer />
        <PurchaseCenter />
        {/* 商品品牌统计 */}
        <StatisticsColumn />
        {/* 付款提现统计 */}
        <Settlement />
        {/* <DataCenter /> */}
        {/* 风控中心 */}
        {/* <RiskCenter /> */}
      </Space>
    </>
  )
}

export default Home
