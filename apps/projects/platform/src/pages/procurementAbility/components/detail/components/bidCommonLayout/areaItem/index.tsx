import React, { useState } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

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
          {showMore
            ? intl.formatMessage({ id: 'detail.purchase.label25' })
            : intl.formatMessage({ id: 'detail.purchase.label26' })}
          {showMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </p>
      )}
    </>
  )
}

export default areaItem
