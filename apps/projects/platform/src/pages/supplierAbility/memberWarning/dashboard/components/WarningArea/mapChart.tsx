import React, { useEffect, useRef, useState } from 'react'
import { Chart, Tooltip, Coord, Geom } from 'bizcharts'

// import Coord from 'bizcharts/lib/components/Coordinate';
// import Geom from 'bizcharts/lib/geometry'
import DataSet from '@antv/data-set'

type PropertiesType = {
  acroutes: [100000]
  adchar: null
  adcode: '110000'
  center: number[]
  centroid: number[]
  childrenNum: number
  level: string
  name: string
  parent: {
    adcode: number
  }
  subFeatureIndex: number
  /** 值 */
  size: number
}
interface Iprops {
  mapData: {
    type: 'FeatureCollection'
    features: {
      geometry: {
        coordinates: []
        type: 'MultiPolygon'
      }
      properties: PropertiesType
      type: 'Feature'
    }
  }
  activeProvince: string
  onChangeProvince: (area: string) => void
}

type SelectEleType = {
  /** 省名 */
  name: string
  properties: PropertiesType
}

const MapChart: React.FC<Iprops> = (props: Iprops) => {
  const mapRef = useRef<any>(null)
  const { mapData, activeProvince, onChangeProvince } = props

  let bgView

  if (mapData) {
    // data set
    const ds = new DataSet()

    // draw the map
    const dv = ds
      .createView('back')
      .source(mapData, {
        type: 'GeoJSON',
      })
      .transform({
        type: 'geo.projection',
        projection: 'geoMercator',
        as: ['x', 'y', 'centroidX', 'centroidY'],
      })

    bgView = new DataSet.View().source(dv.rows)
  }

  const scale = {
    x: { sync: true },
    y: { sync: true },
  }

  const onSelectProvince = (e: any) => {
    const { data } = e
    const elementData = data.data as SelectEleType
    onChangeProvince(elementData.name)
  }

  useEffect(() => {
    if (!mapRef.current) {
      return
    }
    setActiveArea(mapRef.current, activeProvince)
  }, [activeProvince])

  const setActiveArea = (instance: any, areaName: string) => {
    instance.geometries[0].elements.forEach((e) => {
      if (areaName === e.data.name) {
        e.setState('selected', true)
      } else {
        e.setState('selected', false)
      }
    })
  }

  return (
    <div style={{ background: '#FAFBFC' }}>
      <Chart
        pure
        height={336}
        scale={scale}
        data={bgView ? bgView.rows : bgView}
        autoFit
        placeholder={<div>Loading</div>}
        padding={[20, 0, 0, 0]}
        onPlotClick={onSelectProvince}
        onGetG2Instance={(c) => {
          mapRef.current = c
          setActiveArea(c, activeProvince)
        }}
      >
        <Coord reflect="y" />
        <Tooltip title="name" />
        <Geom
          type="polygon"
          position="x*y"
          style={{
            stroke: '#fff',
            lineWidth: 1,
            fillOpacity: 0.85,
          }}
          color={[
            'properties',
            (v) => {
              if (v.size > 220) {
                return '#F7A128'
              } else if (v.size > 160) {
                return '#4B8BFA'
              } else if (v.size > 80) {
                return '#E05A55'
              }
              return '#EDEEEF'
            },
          ]}
          tooltip={[
            'name*properties',
            (t, p) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: 'Size',
                title: t,
                value: p.size,
              }
            },
          ]}
          state={{
            selected: {
              style: (t) => {
                return { fill: 'purple', stroke: 'green', lineWidth: 1 }
              },
            },
          }}
        />
        {/* <Interaction type='element-single-selected' /> */}
      </Chart>
    </div>
  )
}

export default MapChart
