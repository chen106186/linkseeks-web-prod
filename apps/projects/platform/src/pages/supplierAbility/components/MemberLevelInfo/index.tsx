/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 14:16:22
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:29:31
 * @Description: 会员等级信息
 */
import React from 'react'
import { Progress } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import classNames from 'classnames'
import { MiniArea } from '@/components/Charts'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

interface IProps {
  /**
   * 当前等级信息
   */
  levelInfo: {
    /**
     * 当前等级
     */
    level: string
    /**
     * 经验
     */
    score: number
    /**
     * 下一个等级
     */
    nextLevel: string
    /**
     * 下一个经验
     */
    nextScore: number
  }
  /**
   * 图表数据
   */
  chartData: {
    x: React.ReactText
    y: number
  }[]
}

const MemberLevelInfo = (props: IProps) => {
  const {
    levelInfo = {
      level: '',
      score: 0,
      nextLevel: '',
      nextScore: 0,
    },
    chartData = [],
    ...rest
  } = props
  const score = levelInfo.score || 0
  const nextScore = levelInfo.nextScore || 0

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'member.components.LevelInfo.levelInfo' })}
      {...rest}
      className={styles.levelInfo}
    >
      <div className={styles.infoWrap}>
        <div className={styles['infoWrap-left']}>
          <div className={classNames(styles.card, styles['card-level1'])}>
            <div className={styles['card-name']}>{levelInfo?.level}</div>

            <div className={styles['card-progress']}>
              <Progress
                strokeWidth={4}
                strokeLinecap="square"
                showInfo={false}
                percent={nextScore ? (score / nextScore) * 100 : 100}
              />
            </div>

            <div className={styles['card-txt']}>
              <div className={styles['card-experience']}>
                {score}/{nextScore}
              </div>
              <div className={styles['card-higher']}>{levelInfo.nextLevel}</div>
            </div>

            <div className={styles['card-higher']}>
              {intl.formatMessage({ id: 'member.components.LevelInfo.score.description' })}
            </div>
          </div>
        </div>
        <div className={styles['infoWrap-right']}>
          <MiniArea
            animate={false}
            line
            borderWidth={2}
            height={180}
            padding={[10, 20, 50, 60]}
            scale={{
              x: {
                alias: `${new Date().getFullYear()}${intl.formatMessage({
                  id: 'member.components.LevelInfo.score.miniArea.x',
                })}`, // 别名
              },
              y: {
                tickCount: 5,
                alias: intl.formatMessage({ id: 'member.components.LevelInfo.score.miniArea.y' }), // 别名
              },
            }}
            xAxis={{
              tickLine: undefined,
              label: undefined,
              title: {
                style: {
                  fontSize: 12,
                  fill: '#C0C4CC',
                  fontWeight: 400,
                  rotate: 90,
                },
              },
            }}
            yAxis={{
              tickLine: undefined,
              label: {
                offset: 10,
              },
              title: {
                style: {
                  fontSize: 12,
                  fill: '#C0C4CC',
                  fontWeight: 400,
                  rotate: 90,
                },
              },
              grid: {
                line: {
                  type: 'line',
                  style: {
                    stroke: '#d9d9d9',
                    lineWidth: 1,
                    lineDash: [2, 2],
                  },
                },
              },
            }}
            color="l(90) 0:#AAC5FC 1:#FFFFFF"
            data={chartData}
          />
        </div>
      </div>
    </MellowCard>
  )
}

export default MemberLevelInfo
