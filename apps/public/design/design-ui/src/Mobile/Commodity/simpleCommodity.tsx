import React, { useMemo } from 'react'
import cs from 'classnames'
import './simpleCommodity.global.less'

interface Iprops {
  image: string
  containerClassName?: string
  footer?: React.ReactNode
  discount?: number
  originalPrice?: number
}

const SimpleCommodity: React.FC<Iprops> = (props: Iprops) => {
  const {
    image,
    containerClassName,
    footer,
    discount = 0,
    originalPrice,
  } = props
  /** class 前缀， 应该写个provider */
  const prefix = 'lingxi'
  const disCountData = useMemo(
    () => discount?.toString().split('.'),
    [discount],
  )

  return (
    <div className={cs(`${prefix}-commodity`, containerClassName)}>
      <div className={`${prefix}-image-container`}>
        <img src={image} className={`${prefix}-image`} />
      </div>
      <div className={`${prefix}-commodity-content`}>
        <div className={`${prefix}-price`}>
          ￥<span className={`${prefix}-price-big`}>{disCountData?.[0]}</span>
          <span className={`${prefix}-price-small`}>
            .{disCountData?.[1] || '00'}
          </span>
        </div>
      </div>
      {(typeof footer === 'undefined' && (
        <div className={`${prefix}-commodity-footer`}>
          <span className={`${prefix}-originalPrice`}>
            {originalPrice ? `￥${originalPrice}` : ''}
          </span>
        </div>
      )) ||
        footer}
    </div>
  )
}

export default SimpleCommodity
