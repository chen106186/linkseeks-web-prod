import React from 'react'
// import { Chart, Area } from 'bizcharts'

interface DatePriceItemType {
  date: string
  price: number
}

interface AreaChartProps {
  data: DatePriceItemType[]
  onTooltipChange: (e: any) => void
}

const AreaChart: React.FC<AreaChartProps> = (props) => {
  const { data, onTooltipChange } = props

  const scale = {
    price: {
      min: 0,
      // nice: true
    },
    date: {
      range: [0, 1],
    },
  }

  const handleTooltipChange = (e: any) => {
    onTooltipChange(e)
  }

  // return data && data.length > 0 ? (
  //   <Chart
  //     scale={scale}
  //     height={200}
  //     width={580}
  //     data={data}
  //     autoFit
  //     onTooltipChange={handleTooltipChange}
  //     // pure
  //   >
  //     <Area position="date*price" shape="smooth" />
  //   </Chart>
  // ) : null
  return null
}

export default AreaChart
