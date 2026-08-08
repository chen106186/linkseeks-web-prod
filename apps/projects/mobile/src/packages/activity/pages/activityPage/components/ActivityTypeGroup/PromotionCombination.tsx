import React, { useState } from 'react'
import { Price, RowCommodity, SimpleCommodity, ActivityButton } from '@/components/Commodity'
import { useIntl } from '@linkseeks/i18n'
import { View, ScrollView, Text, Tabs, TabsPane } from '@apps/mobile-ui'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import './PromotionCombination.scss'

type CommodityProps = Omit<
  React.ComponentProps<typeof RowCommodity>,
  'onClickCommodity' | 'onBuy' | 'renderFooter' | 'renderMiddleArea'
>

export type EventCombinationParameters = {
  main: CommodityProps
}

type SuitCommodityItemProps = {
  brand?: string
  category?: string
  /** 主键id */
  id?: number
  /** 允许换购数量赠送数量搭配数量 */
  num?: number
  /** 商品价格 */
  price?: number
  max?: number
  min?: number
  tagList?: number
  /** 商品id */
  productId?: number
  productImgUrl?: string
  productName?: string
  skuId?: number
  /** 换购价格 */
  swapPrice?: number
  unit?: string
}

type SuitCommodity = {
  /** 分组编号优惠阶梯换购阶梯 */
  groupNo?: number
  /** 换购门槛优惠门槛数量或金额 */
  limitValue?: number
  /** 套餐价格 */
  groupPrice?: number

  goodsSubsidiaryGroupDetailsList?: SuitCommodityItemProps[]
}

interface Iprops extends CommodityProps {
  suit?: SuitCommodity[]
  isExchange: boolean
  onClick?: ((dataProps: EventCombinationParameters) => void) | null
}

const PromotionCombination: React.FC<Iprops> = (props: Iprops) => {
  const { productName, productImg, discount, originalPrice, productId, tags, suit, isExchange, buttonType, onClick } =
    props
  const intl = useIntl()
  const GROUPNO_TO_TEXT = [
    intl.formatMessage({ id: 'activity.group.one', defaultMessage: '一' }),
    intl.formatMessage({ id: 'activity.group.two', defaultMessage: '二' }),
    intl.formatMessage({ id: 'activity.group.three', defaultMessage: '三' }),
    intl.formatMessage({ id: 'activity.group.four', defaultMessage: '四' }),
    intl.formatMessage({ id: 'activity.group.five', defaultMessage: '五' }),
    intl.formatMessage({ id: 'activity.group.six', defaultMessage: '六' }),
    intl.formatMessage({ id: 'activity.group.seven', defaultMessage: '七' }),
    intl.formatMessage({ id: 'activity.group.eight', defaultMessage: '八' }),
    intl.formatMessage({ id: 'activity.group.nine', defaultMessage: '九' }),
    intl.formatMessage({ id: 'activity.group.ten', defaultMessage: '十' }),
  ]
  const { jmpProductDetail } = useProductDetailJump()
  const tabList =
    suit?.map((_item, _index) => ({
      title: `${intl.formatMessage({ id: 'activity.group.name', defaultMessage: '套餐' })}${GROUPNO_TO_TEXT[_index]}`,
    })) || []
  const [current, setCurrent] = useState<number>(0)

  const handleCommodityClick = (dataProps: EventCombinationParameters) => {
    onClick?.(dataProps)
  }

  const handleChangeTab = (value) => {
    setCurrent(value)
  }

  const handleGiftClick = (productInfo: SuitCommodityItemProps) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: productInfo.productId, skuId: productInfo.skuId })
  }

  const renderContent = () => {
    return (
      <View className="give-product-tabs">
        <Tabs current={current} tabList={tabList} scroll onClick={handleChangeTab}>
          {suit?.map((_item, _index) => {
            const { goodsSubsidiaryGroupDetailsList, groupPrice, groupNo } = _item
            const allTotal = goodsSubsidiaryGroupDetailsList?.reduce((_sum, _current) => {
              console.log('_current.price', _current.price, _current)
              const res = _sum + _current.price!
              return res
            }, 0)
            const total = allTotal! + originalPrice!
            return (
              <TabsPane key={groupNo} index={_index} current={current}>
                <ScrollView enhanced scrollX showScrollbar={false}>
                  <View className="give-product-tabs-tabpane-products">
                    {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                      const simpleLabel = [
                        intl.formatMessage({
                          id: 'activity.group.originPrice',
                          defaultMessage: '原价n元',
                          price: _row.price,
                        }),
                      ]
                      return (
                        <View
                          className="give-product-tabs-commodity-item"
                          key={`${groupNo}-${_row.id}`}
                          onClick={() => handleGiftClick(_row)}
                        >
                          <SimpleCommodity
                            productId={_row.productId!}
                            productImage={_row.productImgUrl!}
                            productName={_row.productName!}
                            tags={simpleLabel}
                          />
                        </View>
                      )
                    })}
                  </View>
                </ScrollView>
                <View className="give-product-footer">
                  <Price discount={groupPrice!} originalPrice={total} />
                  <ActivityButton type={buttonType} onClick={() => handleCommodityClick({ main: props })}>
                    {intl.formatMessage({ id: 'activity.group.nowBuy', defaultMessage: '立即购买' })}
                  </ActivityButton>
                </View>
              </TabsPane>
            )
          })}
        </Tabs>
      </View>
    )
  }

  return (
    <View className="promotion-combination">
      <RowCommodity
        customClassName="promotion-combination-main-commodity"
        productName={productName}
        productId={productId}
        productImg={productImg}
        discount={discount || originalPrice!}
        originalPrice={originalPrice}
        tags={tags}
        productTag={
          <Text className="product-tag">
            {intl.formatMessage({ id: 'activity.group.mainProduct', defaultMessage: '主要商品' })}
          </Text>
        }
        showBtn={false}
        onClickCommodity={() => handleCommodityClick({ main: props })}
      />
      {suit && suit.length !== 0 ? renderContent() : null}
    </View>
  )
}

export default PromotionCombination
