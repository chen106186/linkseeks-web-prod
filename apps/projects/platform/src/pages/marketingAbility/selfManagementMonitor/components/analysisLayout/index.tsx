import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col, Badge, Space, Divider, Typography } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import { DonutChart } from 'bizcharts'
// import DonutChart from 'bizcharts/lib/plots/DonutChart';
import style from './index.less'

interface AnalysisLayoutProps {
  /** 标题 */
  title?: string
}

const AnalysisLayout: React.FC<AnalysisLayoutProps> = (props: any) => {
  const { title } = props
  const intl = useIntl()

  const data = [
    {
      type: `${intl.formatMessage({ id: 'marketingAbility.xinyonghu' })}`,
      value: 27,
    },
    {
      type: `${intl.formatMessage({ id: 'marketingAbility.laoyonghu' })}`,
      value: 25,
    },
    {
      type: `${intl.formatMessage({ id: 'marketingAbility.xinhuiyuan' })}`,
      value: 18,
    },
    {
      type: `${intl.formatMessage({ id: 'marketingAbility.laohuiyuan' })}`,
      value: 15,
    },
  ]

  return (
    <CardLayout
      title={title}
      className={style.cardLayout}
      bodyStyle={{
        padding: '0px 16px 16px',
      }}
    >
      <DonutChart
        data={data || []}
        title={null}
        autoFit
        description={null}
        height={180}
        radius={1}
        innerRadius={0.75}
        padding="auto"
        angleField="value"
        colorField="type"
        pieStyle={{ stroke: 'white', lineWidth: 4 }}
        label={null}
        color={['#00A98F', '#007BFC', '#EB9B00', '#EF3346']}
        statistic={{
          title: {
            formatter: (text) => {
              return `${intl.formatMessage({ id: 'marketingAbility.yonghuzongshu' })}`
            },
            offsetY: -10,
            style: {
              fontSize: '12px',
              color: '#91959B',
            },
          },
          content: {
            formatter: (text) => {
              return '5,000.00'
            },
            style: {
              fontWeight: '400',
              fontSize: '24px',
              color: '#303133',
            },
          },
        }}
        legend={{
          visible: false,
        }}
      />
      <Row gutter={[16, 16]} style={{ marginTop: '26px' }}>
        <Col span={12}>
          <Space size={12}>
            <Badge color="#00A98F" text={intl.formatMessage({ id: 'marketingAbility.xinyonghu' })} />
            <Divider type="vertical" />
            <Typography.Text type="secondary">20%</Typography.Text>
            <Typography.Text>12</Typography.Text>
          </Space>
        </Col>
        <Col span={12}>
          <Space size={12}>
            <Badge color="#EB9B00" text={intl.formatMessage({ id: 'marketingAbility.xinhuiyuan' })} />
            <Divider type="vertical" />
            <Typography.Text type="secondary">20%</Typography.Text>
            <Typography.Text>12</Typography.Text>
          </Space>
        </Col>
        <Col span={12}>
          <Space size={12}>
            <Badge color="#007BFC" text={intl.formatMessage({ id: 'marketingAbility.laoyonghu' })} />
            <Divider type="vertical" />
            <Typography.Text type="secondary">20%</Typography.Text>
            <Typography.Text>12</Typography.Text>
          </Space>
        </Col>
        <Col span={12}>
          <Space size={12}>
            <Badge color="#EF3346" text={intl.formatMessage({ id: 'marketingAbility.laohuiyuan' })} />
            <Divider type="vertical" />
            <Typography.Text type="secondary">20%</Typography.Text>
            <Typography.Text>12</Typography.Text>
          </Space>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default AnalysisLayout
