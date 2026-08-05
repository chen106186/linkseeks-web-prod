/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 17:40:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:52:44
 * @Description: 会员诚信信息统计信息
 */
import React, { HTMLAttributes } from 'react'
import { Row, Col, Card, Tooltip, Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { QuestionCircleOutlined } from '@ant-design/icons'
import MellowCard from '@/components/MellowCard'
import { Pie } from '@/components/Charts'
import styles from './index.less'
import integral_1 from '@/assets/imgs/integral-1.png'
import integral_2 from '@/assets/imgs/integral-2.png'
import integral_3 from '@/assets/imgs/integral-3.png'
import integral_4 from '@/assets/imgs/integral-4.png'

const imgMap = {
  1: integral_1,
  2: integral_2,
  3: integral_3,
  4: integral_4,
}
interface ContentBoxProps {
  /**
   * 标题
   */
  title: string
  /**
   * 描述信息
   */
  desc: string
  /**
   * 内容
   */
  content: React.ReactNode
  /**
   * 拓展区域
   */
  extra: React.ReactNode
}

const ContentBox: React.FC<ContentBoxProps> = ({ title = '', content, extra, desc }) => (
  <div className={styles.contentBox}>
    <div className={styles['contentBox-main']}>
      <div className={styles.title}>
        {title}
        <Tooltip title={desc}>
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
      <div className={styles.txt}>{content}</div>
    </div>
    <div className={styles['contentBox-extra']}>{extra}</div>
  </div>
)

interface IProps {
  /**
   * 饼图数据
   */
  creditData: {
    x: string
    y: number
  }[]
  /**
   * 积分列表
   */
  integralItems: {
    id: number
    creditTypeName: string
    remark: string
    creditPoint: number
    currentPoint: number
  }[]
  /**
   * 是否加载中
   */
  loading?: boolean
}

const MemberSincerityAnalysis: React.FC<IProps> = (props: IProps) => {
  const { creditData = [], integralItems = [], loading, ...rest } = props

  const intl = useIntl()

  return (
    <div className={styles.sincerityInfo} {...rest}>
      <Spin spinning={!!loading}>
        <Row gutter={16}>
          <Col flex="386px">
            <MellowCard
              title={intl.formatMessage({
                id: 'customerAbility.components.MemberSincerityAnalysis.title',
                defaultMessage: '信用积分',
              })}
              fullHeight
            >
              <Pie
                hasLegend
                subTitle={intl.formatMessage({
                  id: 'customerAbility.components.MemberSincerityAnalysis.pie.subTitle',
                  defaultMessage: '信用积分',
                })}
                total={() => creditData.reduce((pre, now) => now.y + pre, 0)}
                data={creditData}
                height={178}
                colors={['#6C9CEB', '#8777D9', '#FFC400', '#41CC9E']}
              />
            </MellowCard>
          </Col>
          <Col flex="1">
            <div className={styles.tofo}>
              <MellowCard
                bodyStyle={{
                  padding: 0,
                }}
                fullHeight
              >
                {integralItems.map((item, index) => (
                  <Card.Grid key={item.id} className={styles['tofo-item']}>
                    <ContentBox
                      title={item.creditTypeName}
                      desc={`${item.remark}（${item.creditPoint}）`}
                      content={item.currentPoint}
                      extra={<img className={styles['tofo-item-logo']} src={imgMap[index + 1]} />}
                    />
                  </Card.Grid>
                ))}
              </MellowCard>
            </div>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}

export default MemberSincerityAnalysis
