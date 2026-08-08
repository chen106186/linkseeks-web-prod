import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { LineConfig } from '@ant-design/plots'

interface IProps {
  config: LineConfig
}

const LineChart: React.FC<IProps> = (props) => {
  const { config } = props
  const [Line, setLine] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@ant-design/plots').then((module) => {
        setLine(() => module.Line)
      })
    }
  }, [])

  if (!Line) {
    return <Spin spinning />
  }

  return <Line {...config} />
}

export default LineChart
