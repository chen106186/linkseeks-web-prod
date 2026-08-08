/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 14:59:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:22:28
 * @Description: 会员考察信息
 */
import React from 'react'
import { Row, Col, Descriptions, Progress, Upload } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { normalizeFiledata } from '@/utils'
import MellowCard from '@/components/MellowCard'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import styles from './index.less'

export type InvestigateInfoProps = {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 考察日期
     */
    inspectDay: string
    /**
     * 考察评分
     */
    score: string
    /**
     * 考察结果
     */
    result: string
    /**
     * 考察结果
     */
    reports: {
      /**
       * 文件名
       */
      name: string
      /**
       * 文件Url
       */
      url: string
    }[]
  }
}

const MemberInvestigateInfo: React.FC<InvestigateInfoProps> = (props: InvestigateInfoProps) => {
  const { dataSource, ...rest } = props

  const intl = useIntl()

  const strokeColor = (score: string) => {
    const numScore = +score
    if (numScore >= 0 && numScore <= 39) {
      return {
        '0%': '#D32F2F',
        '100%': '#F18E8E',
      }
    }
    if (40 >= 0 && numScore <= 59) {
      return {
        '0%': '#EA8000',
        '100%': '#EBBD86',
      }
    }
    if (60 >= 0 && numScore <= 79) {
      return {
        '0%': '#2266EE',
        '100%': '#83A5E8',
      }
    }
    return {
      '0%': '#00A98F',
      '100%': '#82DFC1',
    }
  }

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberInvestigateInfo.title',
        defaultMessage: '考察信息',
      })}
      className={styles['investigate-info']}
      {...rest}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberInvestigateInfo.score',
                defaultMessage: '考察评分',
              })}
              labelStyle={{ width: 106 }}
            >
              <div className={styles['investigate-info-progress']}>
                <Progress
                  type="dashboard"
                  percent={+dataSource?.score}
                  gapDegree={150}
                  strokeColor={strokeColor(dataSource?.score)}
                  width={80}
                  showInfo={false}
                />
                <div className={styles['investigate-info-progress-text']}>
                  <span>{dataSource?.score}</span>
                  {intl.formatMessage({
                    id: 'customerAbility.components.MemberInvestigateInfo.score.unit',
                    defaultMessage: '分',
                  })}
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberInvestigateInfo.inspectDay',
                defaultMessage: '考察日期',
              })}
              labelStyle={{ width: 106 }}
            >
              {dataSource?.inspectDay}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberInvestigateInfo.result',
                defaultMessage: '考察结果',
              })}
              labelStyle={{ width: 106 }}
              style={{ paddingBottom: 0 }}
            >
              {dataSource?.result}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberInvestigateInfo.reports',
                defaultMessage: '考察报告',
              })}
              labelStyle={{ width: 106 }}
              contentStyle={{ display: 'block', overflow: 'hidden' }}
            >
              <UploadFiles
                fileList={
                  dataSource && dataSource.reports ? dataSource.reports.map((item) => normalizeFiledata(item.url)) : []
                }
                disable
              />
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </MellowCard>
  )
}

export default MemberInvestigateInfo
