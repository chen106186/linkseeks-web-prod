import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Radio, Badge, Space } from 'antd'
import { Axis, Chart, LineAdvance } from 'bizcharts'
import { Card as CardLayout } from '@linkseeks/ui'
import style from './index.less'

interface ChartLineAdvanceProps {
  /** 数据 */
  // data?: any[]
  /** 标题 */
  title?: string
  /** 类型 */
  type?: 'lineAdvance' | 'lineInterval' | ({} & string)
}

const ChartLineAdvance: React.FC<ChartLineAdvanceProps> = (props: any) => {
  const intl = useIntl()
  const { title, type = 'lineAdvance' } = props
  const scale = {
    count: {
      min: 0,
      tickInterval: 200,
    },
  }
  const data = [
    {
      dateTime: '01:00',
      count: 900,
    },
    {
      dateTime: '02:00',
      count: 900,
    },
    {
      dateTime: '03:00',
      count: 900,
    },
    {
      dateTime: '04:00',
      count: 900,
    },
    {
      dateTime: '05:00',
      count: 900,
    },
    {
      dateTime: '06:00',
      count: 900,
    },
    {
      dateTime: '07:00',
      count: 900,
    },
    {
      dateTime: '08:00',
      count: 900,
    },
    {
      dateTime: '09:00',
      count: 900,
    },
    {
      dateTime: '10:00',
      count: 900,
    },

    {
      dateTime: '11:00',
      count: 900,
    },
    {
      dateTime: '12:00',
      count: 900,
    },
    {
      dateTime: '13:00',
      count: 888,
    },
    {
      dateTime: '14:00',
      count: 900,
    },
    {
      dateTime: '15:00',
      count: 880,
    },
    {
      dateTime: '16:00',
      count: 900,
    },
    {
      dateTime: '17:00',
      count: 870,
    },
    {
      dateTime: '18:00',
      count: 990,
    },
    {
      dateTime: '19:00',
      count: 950,
    },
    {
      dateTime: '20:00',
      count: 850,
    },
    {
      dateTime: '21:00',
      count: 650,
    },
    {
      dateTime: '22:00',
      count: 500,
    },

    {
      dateTime: '23:00',
      count: 500,
    },
    {
      dateTime: '24:00',
      count: 1000,
    },
  ]

  /** 类型 */
  const extraButtonType = (
    <Space>
      {type === 'lineInterval' && (
        <>
          <Badge color="green" text={intl.formatMessage({ id: 'marketingAbility.goumaijine' })} />
          <Badge color="blue" text={intl.formatMessage({ id: 'marketingAbility.dingdanshuliang' })} />
        </>
      )}
      <Radio.Group defaultValue={1} size="small">
        <Radio.Button value={1}>{intl.formatMessage({ id: 'marketingAbility.jinri' })}</Radio.Button>
        <Radio.Button value={2}>{intl.formatMessage({ id: 'marketingAbility.zuijin7ri' })}</Radio.Button>
        <Radio.Button value={3}>{intl.formatMessage({ id: 'marketingAbility.quanbu' })}</Radio.Button>
      </Radio.Group>
    </Space>
  )

  return (
    <div className={style.extraLayout}>
      <CardLayout id="chartLineAdvance" title={title} extra={extraButtonType}>
        <Chart autoFit height={239} data={data} scale={scale}>
          <Axis name="dateTime" visible={true} />
          <Axis name="count" visible={true} />
          <LineAdvance position="dateTime*count" color="#00A98F" point area shape="smooth" />
        </Chart>
      </CardLayout>
    </div>
  )
}
export default ChartLineAdvance
