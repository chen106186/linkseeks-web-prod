import React, { useMemo } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'

import styles from './index.less'
import CustomizeTag from '../../CustomizeTag'

type TagType = Omit<React.ComponentProps<typeof CustomizeTag>, 'children'>
type WithNameType = TagType & { name: string }

export interface GoodsItemProps {
  // 图片
  img: any
  name?: string
  // 标签文本
  info?: string
  // 原价
  originalPrice?: string
  // 折扣价
  discountPrice?: string
  // 价格排列方向
  direction?: 'row' | 'column'
  // 是否为空状态
  isnull?: boolean
  className: string
  mode?: 'vertical' | 'horizontal'
  tags?: string[]
  [key: string]: any
}

const GoodsItem: React.FC<GoodsItemProps> = (props: GoodsItemProps) => {
  const {
    img,
    info,
    originalPrice,
    discountPrice,
    tags,
    name,
    direction = 'row',
    mode = 'vertical',
    isnull = true,
    className,
    num,
    ...other
  } = props

  const _discountPrice = useMemo(() => {
    if (discountPrice) {
      const _price = discountPrice.split('.')
      return (
        <div
          className={
            styles[`lingxi-marketingCard-goodsItem-price-discountPrice`]
          }
        >
          ¥<span>{_price[0]}</span>.{_price[1]}
        </div>
      )
    } else {
      return null
    }
  }, [discountPrice])

  if (isnull) {
    return (
      <div
        className={cx(
          styles[`lingxi-marketingCard-goodsItem-null`],
          mode === 'horizontal' && styles['horizontal'],
          className,
        )}
        {...other}
      >
        <PlusOutlined />
      </div>
    )
  } else {
    return mode === 'vertical' ? (
      <div
        className={cx(styles['lingxi-marketingCard-goodsItem'], className)}
        {...other}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={img}
            className={styles[`lingxi-marketingCard-goodsItem-img`]}
          />
          {num ? (
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 12,
                color: '#252D37',
                fontSize: 12,
                zIndex: 10,
              }}
            >
              x{num}
            </div>
          ) : null}
        </div>
        {info ? (
          <div className={styles[`lingxi-marketingCard-goodsItem-tag`]}>
            {info}
          </div>
        ) : null}
        <div
          className={styles[`lingxi-marketingCard-goodsItem-price`]}
          style={{ flexDirection: direction }}
        >
          {_discountPrice}
          {originalPrice ? (
            <div
              className={
                styles[`lingxi-marketingCard-goodsItem-price-originalPrice`]
              }
              style={discountPrice ? { marginLeft: 4 } : {}}
            >
              ¥{originalPrice}
            </div>
          ) : null}
        </div>
      </div>
    ) : (
      <div
        className={cx(
          styles['lingxi-marketingCard-goodsItem'],
          styles['horizontal'],
          className,
        )}
        {...other}
      >
        <div className={styles['lingxi-marketingCard-goodsItem-body']}>
          <div style={{ position: 'relative' }}>
            <img
              src={img}
              className={styles[`lingxi-marketingCard-goodsItem-img`]}
            />
            {num ? (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 12,
                  color: '#252D37',
                  fontSize: 12,
                  zIndex: 10,
                }}
              >
                x{num}
              </div>
            ) : null}
          </div>
          <div className={styles['lingxi-marketingCard-goodsItem-info']}>
            <div className={styles['lingxi-marketingCard-goodsItem-name']}>
              {name}
            </div>
            {tags && (
              <div className={styles[`lingxi-marketingCard-goodsItem-taglist`]}>
                {tags?.map((_item, index) => {
                  const isString = typeof _item === 'string'
                  if (isString) {
                    return <CustomizeTag key={index}>{_item}</CustomizeTag>
                  }
                  return (
                    <CustomizeTag {..._item} key={index}>
                      {(_item as WithNameType).name}
                    </CustomizeTag>
                  )
                })}
              </div>
            )}
            {/* {info ? <div className={styles[`lingxi-marketingCard-goodsItem-tag`]}>{info}</div> : null} */}
            <div
              className={styles[`lingxi-marketingCard-goodsItem-price`]}
              style={{ flexDirection: direction }}
            >
              {_discountPrice}
              {originalPrice ? (
                <div
                  className={
                    styles[`lingxi-marketingCard-goodsItem-price-originalPrice`]
                  }
                  style={discountPrice ? { marginLeft: 4 } : {}}
                >
                  ¥{originalPrice}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GoodsItem
