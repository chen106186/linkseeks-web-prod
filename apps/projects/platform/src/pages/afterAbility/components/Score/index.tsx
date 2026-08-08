/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 14:12:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-13 15:30:21
 * @Description: 评价
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Form } from 'antd'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { Gauge } from '@/components/Charts'
import styles from './index.less'

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

interface ScoreProps extends MellowCardProps {
  /**
   * 分数
   */
  score: number
  /**
   * 内容
   */
  content: string
}

const Score: React.FC<ScoreProps> = ({ score = 0, content, ...rest }) => {
  const intl = useIntl()

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.Score.title', defaultMessage: '售后评价' })}
      className={styles.evaluate}
      {...rest}
    >
      <Row gutter={40}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'afterService.components.Score.score', defaultMessage: '售后满意度' })}
            labelAlign="left"
            {...formItemLayout}
          >
            <div className={styles.score}>
              <div className={styles['score-left']}>
                <span className={styles['score-star']}>
                  {`${score}${intl.formatMessage({
                    id: 'afterService.components.Score.score.unit',
                    defaultMessage: '分',
                  })}`}
                </span>
              </div>
              <div className={styles['score-right']}>
                <Gauge
                  title=""
                  height={90}
                  percent={+((score / FULL_SCORE) * 100).toFixed(2)}
                  formatter={() => ''}
                  formatContent={() => ''}
                  color={COLOR_MAP[score]}
                  strokeWidth={5}
                />
              </div>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'afterService.components.Score.content', defaultMessage: '售后评价' })}
            labelAlign="left"
            {...formItemLayout}
          >
            {content}
          </Form.Item>
        </Col>
      </Row>
    </MellowCard>
  )
}

export default Score
