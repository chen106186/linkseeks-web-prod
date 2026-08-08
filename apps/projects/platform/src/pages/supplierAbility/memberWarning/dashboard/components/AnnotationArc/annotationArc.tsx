import React, { useState, useEffect, useMemo } from 'react'
import { Chart, Axis, Coordinate, Point, Annotation } from 'bizcharts'

// import Point from 'bizcharts/lib/geometry/Point';
// import { Annotation } from 'bizcharts/lib';
import { registerShape } from '@antv/g2'

// 自定义Shape 部分
registerShape('point', 'pointer', {
  draw(cfg, container) {
    const group = container.addGroup()
    const center = this.parsePoint({ x: 0, y: 0 }) // 获取极坐标系下画布中心点
    // const start = this.parsePoint({ x: 0, y: 0.5 }); // 获取极坐标系下起始点
    // 绘制指针
    const line = group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: cfg.x,
        y2: cfg.y,
        stroke: '#c0c4cc',
        lineWidth: 5,
        lineCap: 'round',
      },
    })
    group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 9.75,
        stroke: '#c0c4cc',
        lineWidth: 4.5,
        fill: '#fff',
      },
    })
    return group
  },
})

const scale = {
  value: {
    min: 0,
    max: 1,
    tickInterval: 0.1,
    formatter: (v) => v * 100,
  },
}

const AnnotationArc = () => {
  const [data, setData] = useState([{ value: 0.56 }])
  useEffect(() => {
    setTimeout(() => {
      setData([{ value: 0.9 }])
    }, 1000)
  }, [])

  const steps = useMemo(() => {
    return [
      {
        color: '#1fBF87',
        start: 0,
      },
      {
        color: '#A0D911',
        start: 0.5,
      },
      {
        color: '#F7A128',
        start: 0.75,
      },
      {
        color: '#e05a55',
        start: 1,
      },
    ]
  }, [])

  return (
    <Chart height={255} data={data} scale={scale} autoFit>
      <Coordinate type="polar" radius={0.75} startAngle={(-12 / 10) * Math.PI} endAngle={(2 / 10) * Math.PI} />
      <Axis name="1" />
      <Axis name="value" line={null} label={null} subTickLine={null} tickLine={null} grid={null} />
      <Point position="value*1" color="#1890FF" shape="pointer" />
      {steps.map((_item, key) => {
        return (
          <Annotation.Arc
            key={key}
            start={[_item.start, 1]}
            end={[1, 1]}
            style={{
              stroke: _item.color,
              lineWidth: 18,
              lineDash: null,
            }}
          />
        )
      })}
    </Chart>
  )
}

export default AnnotationArc
