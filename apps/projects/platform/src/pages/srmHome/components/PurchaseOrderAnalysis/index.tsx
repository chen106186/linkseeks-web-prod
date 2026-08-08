/**
 * @Description 采购订单统计
 */
import React, { useMemo, useState } from 'react'
import { Chart, Tooltip, Axis, Point, Line, Interval, registerShape } from 'bizcharts'
import { getReportMemberHomeGetOrderList, GetReportMemberHomeGetOrderListResponse } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import MellowCard from '@/components/MellowCard'
import DateCycle, { DateCycleType } from '../DateCycle'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

// registerShape('interval', 'border-radius', {
//   draw(cfg, container) {
//     const { points } = cfg;
//     let path = [];
//     path.push(['M', points[0].x, points[0].y]);
//     path.push(['L', points[1].x, points[1].y]);
//     path.push(['L', points[2].x, points[2].y]);
//     path.push(['L', points[3].x, points[3].y]);
//     path.push('Z');
//     path = this.parsePath(path); // 将 0 - 1 转化为画布坐标

//     const group = container.addGroup();
//     group.addShape('rect', {
//       attrs: {
//         x: path[1][1], // 矩形起始点为左上角
//         y: path[1][2],
//         width: path[2][1] - path[1][1],
//         height: path[0][2] - path[1][2],
//         fill: cfg.color,
//         radius: [4, 4, 0, 0], // test
//       },
//     });

//     return group;
//   },
// });

const PurchaseOrderAnalysis: React.FC = () => {
  const [dateType, setDateType] = useState<DateCycleType>('weekList')
  const translate = useWebIntl()
  const { data } = useHttpRequest<GetReportMemberHomeGetOrderListResponse>(() => getReportMemberHomeGetOrderList(), {
    manual: false,
  })

  const handleDateCycleChange = (value: DateCycleType) => {
    setDateType(value)
  }

  const scale = {
    amount: {
      min: 0,
      tickCount: 4,
      alias: translate('web.resource.srmHome.orderMoney'),
      type: 'linear-strict',
    },
    count: {
      min: 0,
      tickCount: 4,
      alias: translate('web.resource.srmHome.orderNumber'),
      type: 'linear-strict',
    },
  }

  const colors = ['#00A98F', '#4787F0']

  const currentData = useMemo(() => data?.[dateType] || [], [dateType, data])

  return (
    <MellowCard
      title={
        <div className={styles['purchase-order-analysis-title']}>
          {translate('web.resource.srmHome.caigoudingdantongji')}
        </div>
      }
      extra={<DateCycle value={dateType} onChange={handleDateCycleChange} />}
      bodyStyle={{
        paddingRight: 20,
        paddingLeft: 20,
      }}
    >
      <Chart scale={scale} height={287} data={currentData} padding="auto" appendPadding={[20, 0, 0, 0]} autoFit>
        <Tooltip
          itemTpl={`
            <li style="position:relative;" data-index={index}>
              <span
                style="background-color:{color};width:4px;height:4px;border-radius:50%;display:inline-block;position:absolute;top:3px;left:0;"
              ></span>
              <div style="padding-left: 12px;">
                {name}
                <div style="margin-top:8px;margin-bottom:8px;">
                  {value}
                </div>
              </div>
            </li>
          `}
          shared
        />
        <Axis
          name="dateTime"
          grid={{
            line: {
              type: 'line',
              style: {
                stroke: '#F5F6F7', // 网格线的颜色
              },
            },
          }}
        />
        <Axis
          name="amount"
          grid={{
            line: {
              type: 'line',
              style: {
                stroke: '#F5F6F7', // 网格线的颜色
                lineWidth: 1, // 网格线的宽度
              },
            },
          }}
        />
        <Interval
          position="dateTime*count"
          color={colors[0]}
          // shape={['dateTime*count', (dateTime, val) => {
          //   if (val === 0) {
          //     return;
          //   }
          //   // eslint-disable-next-line consistent-return
          //   return 'border-radius';
          // }]}
        />
        <Line position="dateTime*amount" color={colors[1]} size={3} shape="smooth" />
        <Point position="dateTime*amount" color={colors[1]} size={3} shape="circle" />
      </Chart>
    </MellowCard>
  )
}

export default PurchaseOrderAnalysis
