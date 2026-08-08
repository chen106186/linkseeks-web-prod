import React, { useMemo, useState } from 'react'
import { Chart, Tooltip, Axis, Point, Line } from 'bizcharts'
import { Radio, Row } from 'antd'
// import Point from 'bizcharts/lib/geometry/Point';
// import Line from 'bizcharts/lib/geometry/Line';

import Card from '../../../card'

import styles from '../../index.less'
import selfStyles from './index.less'
import { getIntl } from '@linkseeks/i18n'

interface QuotationDeskProps {
  title?: string
  chartsList?: any
}

const intl = getIntl()

const QuotationDesk: React.FC<QuotationDeskProps> = (props: any) => {
  const { title, chartsList } = props
  const [listLen, setListLen] = useState(7)
  const data = useMemo(() => {
    return chartsList
      ? chartsList.reduce(
          (total, cur) => total.concat(cur?.list ? (listLen ? [...cur.list].slice(-listLen) : [...cur.list]) : []),
          [],
        )
      : []
  }, [chartsList, listLen])
  const scaleObj = useMemo(() => {
    let _obj = {}
    chartsList.forEach((item) => {
      _obj[`${item.type}`] = item.title
    })
    return {
      value: { min: 0, type: 'log' },
      time: { range: [0, 1] },
      type: {
        formatter: (v) => {
          return _obj[v]
        },
      },
    }
  }, [chartsList])
  return (
    <div className={styles.wrap}>
      <div className={styles.layout} style={{ margin: 0 }}>
        <Card
          id={'QuotationDesk'}
          title={title}
          extra={
            <Row>
              {chartsList[1] && (
                <div className={selfStyles.colorLabel}>
                  <div style={{ backgroundColor: '#00A98F' }}></div>
                  {chartsList[1]?.title}
                </div>
              )}
              <div className={selfStyles.colorLabel}>
                <div style={{ backgroundColor: '#5B8FF9' }}></div>
                {chartsList[0]?.title}
              </div>
              <Radio.Group
                defaultValue={listLen}
                onChange={(e) => {
                  setListLen(e.target.value)
                }}
              >
                <Radio.Button value={7}>{intl.formatMessage({ id: 'detail.purchase.label45' })}</Radio.Button>
                <Radio.Button value={15}>{intl.formatMessage({ id: 'detail.purchase.label46' })}</Radio.Button>
                <Radio.Button value={0}>{intl.formatMessage({ id: 'detail.purchase.label47' })}</Radio.Button>
              </Radio.Group>
            </Row>
          }
        >
          <Chart appendPadding={[10, 0, 0, 10]} autoFit height={404} data={data} scale={scaleObj}>
            <Axis
              title={{ text: intl.formatMessage({ id: 'detail.purchase.label48' }) }}
              visible={true}
              name="value"
              tickLine={{ style: { lineWidth: 1 } }}
            />
            <Line position="time*value" color={['type', ['#5B8FF9', '#00A98F']]} />
            <Point position="time*value" color={['type', ['#5B8FF9', '#00A98F']]} shape="circle" />
            <Tooltip shared showCrosshairs />
          </Chart>
        </Card>
      </div>
    </div>
  )
}

QuotationDesk.defaultProps = {
  title: intl.formatMessage({ id: 'detail.purchase.label49' }),
}

export default QuotationDesk
