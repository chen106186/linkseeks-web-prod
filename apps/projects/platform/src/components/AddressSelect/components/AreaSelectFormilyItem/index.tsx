import React from 'react'
import { connect } from '@apps/formily'
import AreaSelect from '../AreaSelect'

const AreaSelectFormilyItem = connect()((props) => {
  const { value, onChange } = props
  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <AreaSelect value={value} onChange={onChange} />
    </div>
  )
})

export default AreaSelectFormilyItem
