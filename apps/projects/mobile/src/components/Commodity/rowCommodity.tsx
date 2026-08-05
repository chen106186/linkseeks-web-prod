import React from 'react'
import Label, { LabelProps } from '@/components/Label'
import { useIntl } from '@linkseeks/i18n'
import { View, Image, Text } from '@apps/mobile-ui'
import { omit } from '@/utils'
import className from 'classnames'
import './rowCommodity.scss'
import { Price } from '.'
import Button from './button'

/**
 * 横放时的商品样式， 参考特价促销
 * https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/VbAE95Wd7WZPlze/inspect
 */

interface ProductProps {
  skuId?: number
  customClassName?: string
  /** 商品标签 */
  productTag?: React.ReactNode
  /** 商品名 */
  productName: string
  /** 商品图片 */
  productImg: string
  /** 原价 */
  originalPrice?: number
  /** 折扣价 */
  discount: number
  /** 商品id */
  productId: number
  /** 互动标签 */
  tags?: LabelProps[] | string[] | undefined

  /** 折扣价 */
  tagList?: any[]
  min: number
  max: number
}

interface Iprops extends ProductProps {
  /** 自定义render中间部分 */
  renderMiddleArea?: React.ReactNode
  /** 自定义renderFooter */
  renderFooter?: React.ReactNode
  /**
   * 是否显示button
   */
  showBtn?: boolean
  buttonText?: string
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'violet'
  /** 点击商品 */
  onClickCommodity?: ((dataProps: ProductProps) => void) | null
  /** 点击购买按钮 */
  onBuy?: ((dataProps: ProductProps) => void) | null
}

const RowCommodity: React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const {
    productTag,
    productImg,
    productName,
    customClassName,
    discount,
    min,
    max,
    tagList,
    tags,
    originalPrice,
    renderMiddleArea,
    renderFooter,
    showBtn = true,
    buttonText = intl.formatMessage({ id: 'rowCommodity_buttonText' }),
    buttonType = 'danger',
    onClickCommodity = null,
    onBuy = null,
  } = props

  console.log(props, 'propspropspropsprops')

  const handleOnClickCommodity = () => {
    const productProps = omit(props, ['onClickCommodity', 'onBuy', 'buttonText', 'buttonType'])
    onClickCommodity?.(productProps)
  }

  const handleBuyBtnClick = () => {
    const productProps = omit(props, ['onClickCommodity', 'onBuy', 'buttonText', 'buttonType'])
    onBuy?.(productProps)
  }

  return (
    <View className={className('row-commodity', customClassName)} onClick={handleOnClickCommodity}>
      <View className="row-commodity-productTag">{productTag}</View>
      <Image src={productImg} className="row-commodity-image" />
      <View className="row-commodity-content">
        <Text className="row-commodity-content-productName">{productName}</Text>
        <View className="row-commodity-content-middleArea">
          {typeof renderMiddleArea !== 'undefined' ? (
            renderMiddleArea
          ) : (
            <View className="row-commodity-labels">
              {tags?.map((_item, _index) => {
                const _props = typeof _item === 'string' ? { name: _item } : _item
                return (
                  <View className="row-commodity-labels-tagItem" key={_index}>
                    <Label {..._props} />
                  </View>
                )
              })}
            </View>
          )}
        </View>
        <View className="row-commodity-content-footer">
          {typeof renderFooter !== 'undefined' ? (
            renderFooter
          ) : (
            <View className="row-commodity-content-footer-default">
              <Price discount={discount} originalPrice={originalPrice} saleTags={tagList} max={max} min={min} />

              {showBtn && (
                <Button
                  type={buttonType}
                  customClassName="row-commodity-content-footer-default-btn"
                  // onClick={handleBuyBtnClick}
                >
                  {buttonText}
                </Button>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

RowCommodity.defaultProps = {
  productTag: null,
  customClassName: '',
}

export default RowCommodity
