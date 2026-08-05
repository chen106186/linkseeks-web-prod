import React, { useMemo } from 'react'
import add from '@/assets/add.png'
import subtraction from '@/assets/subtraction.png'
import { priceFormat } from '@/utils/numberFomat'

interface Iprops {
  count: number
  prefix?: string
}

const IconMoney: React.FC<Iprops> = (props: Iprops) => {
  const { count, prefix } = props

  const containerStyle = useMemo(() => ({ display: 'flex', FlexDirection: 'row', alignItems: 'center' }), [])

  return (
    <div style={containerStyle}>
      {(count > 0 || count < 0) && <img src={count > 0 ? add : subtraction} width={16} height={16} />}
      <span style={{ marginLeft: '8px' }}>
        {prefix} {priceFormat(Math.abs(count))}
      </span>
    </div>
  )
}

IconMoney.defaultProps = {
  prefix: '￥',
}

export default IconMoney
