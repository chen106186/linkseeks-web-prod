/**
 * @Description 供应商统计
 */
import React, { useMemo, useState } from 'react'
import { Chart, Tooltip, Area, Line, Axis, Point } from 'bizcharts'
import { getReportMemberHomeGetMemberRegisterList, GetReportMemberHomeGetMemberRegisterListResponse } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import MellowCard from '@/components/MellowCard'
import DateCycle, { DateCycleType } from '../DateCycle'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const SupplierAnalysis: React.FC = () => {
  const [dateType, setDateType] = useState<DateCycleType>('weekList')
  const translate = useWebIntl()
  const { data } = useHttpRequest<GetReportMemberHomeGetMemberRegisterListResponse>(
    () => getReportMemberHomeGetMemberRegisterList(),
    { manual: false },
  )

  const handleDateCycleChange = (value: DateCycleType) => {
    setDateType(value)
  }

  const scale = {
    count: {
      nice: true,
      alias: translate('web.resource.srmHome.gongyingshangxinzeng'),
    },
    dateTime: {
      range: [0, 1],
    },
  }

  const currentData = useMemo(() => data?.[dateType] || [], [dateType, data])

  return (
    <MellowCard
      title={
        <div className={styles['supplier-analysis-title']}>{translate('web.resource.srmHome.gongyingshangtongji')}</div>
      }
      extra={<DateCycle value={dateType} onChange={handleDateCycleChange} />}
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
          name="count"
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
        <Area
          position="dateTime*count"
          color="l (180) 0:rgba(71,135,240,0.24) 1:rgba(255,255,255,0.24)"
          tooltip={false}
        />
        <Line position="dateTime*count" />
        <Point position="dateTime*count" size={3} shape="circle" />
      </Chart>
    </MellowCard>
  )
}

export default SupplierAnalysis
