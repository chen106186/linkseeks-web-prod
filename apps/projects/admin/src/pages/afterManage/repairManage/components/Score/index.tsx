/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 14:12:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-18 15:48:12
 * @Description: 评价
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { Gauge } from '@/components/Charts'

// 满分 5分
const FULL_SCORE = 5
const COLOR_MAP = {
  0: '#EF6260',
  1: '#EF6260',
  2: '#FFC400',
  3: '#6C9CEB',
  4: '#41CC9E',
  5: '#41CC9E',
}
const TITLE_MAP = {
  0: '非常不满意',
  1: '非常不满意',
  2: '不满意',
  3: '一般',
  4: '满意',
  5: '非常满意',
}

interface ScoreProps {
  score: number
}

const Score: React.FC<ScoreProps> = ({ score = 0 }) => {
  return (
    <MellowCard title="售后评价" fullHeight>
      <Gauge
        title={`${score}分`}
        height={170}
        percent={+((score / FULL_SCORE) * 100).toFixed(2)}
        formatter={() => ''}
        formatContent={(val) => `${TITLE_MAP[score]}`}
        color={COLOR_MAP[score]}
      />
    </MellowCard>
  )
}

export default Score
