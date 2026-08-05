import React, { useState } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

const areaItem = (props: any) => {
  const { data } = props
  const [showMore, setShowMore] = useState<any>(false)
  const showDataSource = showMore ? data : [...data].splice(0, 3)
  // const showDataSource = useMemo(() => {
  //     return showMore ? data : [...data].splice(0, 3)
  // }, [showMore, data])

  const toogleMore = () => {
    setShowMore(!showMore)
  }

  return (
    <>
      {showDataSource.map((_item, _i) => (
        <p key={`address${_i}`}>{_item.province + '/' + (_item.city || '')}</p>
      ))}
      {data.length > 3 && (
        <p onClick={toogleMore} style={{ cursor: 'pointer' }} className="commonPickColor">
          {showMore ? '收起' : '展开'}
          {showMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </p>
      )}
    </>
  )
}

export default areaItem
