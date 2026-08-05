import React, { Fragment } from 'react'
import { View, Text, RadioGroup, Radio, Input, Icons, Picker } from '@apps/mobile-ui'
import { GetTradeAskPurchaseQuoteAskPurchaseDetailResponse } from '@apps/apis'
import { accMul } from '@apps/utils/src/format'
import cx from 'classnames'
import styles from './index.module.scss'
import { dateFmt } from '@/utils/date'
import { getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useMobileIntl } from '@apps/locales'

export type DataItemType = GetTradeAskPurchaseQuoteAskPurchaseDetailResponse['askPurchaseGoodsResponses'][0] & {
  quoteEndTime: string
  quoteStartTime: string
  taxRate: string
  unitPriceWithTax: string
  unitPriceWithoutTax: string
  includeTax: number
  totalPriceWithTax: number
  totalPriceWithoutTax: number
  commodityName: string
  commodityId: number
  skuId: number
  shopName: string
  shopId: number
  shopList: any[]
}

export interface OtherListProps {
  dataSource: DataItemType[]
  onChange: (values: DataItemType[]) => void
}

const OtherList = (props: OtherListProps) => {
  const { dataSource, onChange } = props
  const translate = useMobileIntl()

  const changeProducts = (key: string, value: any, index) => {
    const newList = [...dataSource]
    onChange(
      newList.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {
            ...item,
            [key]: value,
          }
        }
        return item
      }),
    )
  }

  const handleSelectSku = (
    skuInfo: { skuId: number; name: string; commodityId: number; shopList: any[] },
    index: number,
  ) => {
    const newList = [...dataSource]
    onChange(
      newList.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {
            ...item,
            index,
            skuId: skuInfo.skuId,
            commodityId: skuInfo.commodityId,
            commodityName: skuInfo.name,
            shopId: skuInfo.shopList[0]?.shopId,
            shopName: skuInfo.shopList[0]?.name,
            shopList: skuInfo.shopList || [],
          }
        }
        return item
      }),
    )
  }

  return (
    <Fragment>
      {Array.isArray(dataSource) &&
        dataSource.length > 0 &&
        dataSource.map((dataItem, dataIndex) => (
          <View className={styles['OtherList-container']} key={`${dataItem.id}-${dataIndex}`}>
            <View className={styles['OtherList-productInfoTitle']}>
              <View className={styles['OtherList-docLine']} />
              <Text className={styles['OtherList-productName']}>{dataItem?.goodsName}</Text>
            </View>
            <View className={styles['OtherList-productInfoNo']}>
              <Text className={styles['OtherList-productNo']}>
                {translate('mobile.resource.askPurchase.caigouliang')}
                {dataItem?.num}
              </Text>
            </View>
            <View className={styles['product-list']}>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.shifouhanshui')}
                </View>
                <View className={styles['product-list-item-content']}>
                  <RadioGroup
                    value={dataItem.includeTax || dataItem.includeTax === 0 ? dataItem.includeTax : 1}
                    onChange={(value) => changeProducts('includeTax', value, dataIndex)}
                  >
                    <Radio size={16} value={1}>
                      {translate('mobile.resource.askPurchase.hanshuijia')}
                    </Radio>
                    <Radio size={16} value={0}>
                      {translate('mobile.resource.askPurchase.buhanshui')}
                    </Radio>
                  </RadioGroup>
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.shuilv')}
                </View>
                <View className={styles['product-list-item-content']} style={{ display: 'flex', alignItems: 'center' }}>
                  <Input
                    placeholder={translate('mobile.common.dianjitianxie')}
                    type="number"
                    onChange={(value) => {
                      if (dataItem.unitPriceWithTax || dataItem.unitPriceWithoutTax) {
                        const newList = [...dataSource]
                        onChange(
                          newList.map((item, itemIndex) => {
                            if (itemIndex === dataIndex) {
                              const includeTax =
                                dataItem.includeTax === 1 || (!dataItem.includeTax && dataItem.includeTax !== 0)

                              const unitPriceWithTax = includeTax
                                ? String(dataItem.unitPriceWithTax)
                                : (Number(dataItem.unitPriceWithoutTax) * (1 + Number(value || 0) / 100)).toFixed(2)
                              const unitPriceWithoutTax = includeTax
                                ? (Number(dataItem.unitPriceWithTax) / (1 + Number(value || 0) / 100)).toFixed(2)
                                : String(dataItem.unitPriceWithoutTax)

                              return {
                                ...item,
                                taxRate: String(value),
                                unitPriceWithTax,
                                unitPriceWithoutTax,
                                totalPriceWithTax: accMul(Number(unitPriceWithTax), dataItem.num),
                                totalPriceWithoutTax: accMul(Number(unitPriceWithoutTax), dataItem.num),
                              }
                            }
                            return item
                          }),
                        )
                      } else {
                        changeProducts('taxRate', value, dataIndex)
                      }
                    }}
                    value={dataItem.taxRate}
                  />
                  <Text>%</Text>
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.danjiahanshui')}
                </View>
                <View className={styles['product-list-item-content']}>
                  {dataItem.includeTax === 1 || (!dataItem.includeTax && dataItem.includeTax !== 0) ? (
                    <Input
                      placeholder={translate('mobile.common.dianjitianxie')}
                      type="number"
                      onChange={(value) => {
                        const newList = [...dataSource]
                        onChange(
                          newList.map((item, itemIndex) => {
                            if (itemIndex === dataIndex) {
                              if (dataItem.taxRate) {
                                const withoutTaxFee = (
                                  Number(value) /
                                  (1 + Number(dataItem.taxRate || 0) / 100)
                                ).toFixed(2)
                                return {
                                  ...item,
                                  unitPriceWithTax: String(value),
                                  unitPriceWithoutTax: String(withoutTaxFee),
                                  totalPriceWithTax: accMul(Number(value), dataItem.num),
                                  totalPriceWithoutTax: accMul(Number(withoutTaxFee), dataItem.num),
                                }
                              } else {
                                return {
                                  ...item,
                                  unitPriceWithTax: String(value),
                                }
                              }
                            }
                            return item
                          }),
                        )
                      }}
                      value={dataItem.unitPriceWithTax}
                    />
                  ) : (
                    <Text>{dataItem.unitPriceWithTax}</Text>
                  )}
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.hanshuizongjia')}
                </View>
                <View className={styles['product-list-item-content']}>{dataItem.totalPriceWithTax || ''}</View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.danjiabuhanshui')}
                </View>
                <View className={styles['product-list-item-content']}>
                  {dataItem.includeTax === 0 ? (
                    <Input
                      placeholder={translate('mobile.common.dianjitianxie')}
                      type="number"
                      onChange={(value) => {
                        const newList = [...dataSource]
                        onChange(
                          newList.map((item, itemIndex) => {
                            if (itemIndex === dataIndex) {
                              if (dataItem.taxRate) {
                                const withTaxFee = (Number(value) * (1 + Number(dataItem.taxRate || 0) / 100)).toFixed(
                                  2,
                                )
                                return {
                                  ...item,
                                  unitPriceWithoutTax: String(value),
                                  unitPriceWithTax: String(withTaxFee),
                                  totalPriceWithoutTax: accMul(Number(value), dataItem.num),
                                  totalPriceWithTax: accMul(Number(withTaxFee), dataItem.num),
                                }
                              } else {
                                return {
                                  ...item,
                                  unitPriceWithoutTax: String(value),
                                }
                              }
                            }
                            return item
                          }),
                        )
                      }}
                      value={dataItem.unitPriceWithoutTax}
                    />
                  ) : (
                    <Text>{dataItem.unitPriceWithoutTax}</Text>
                  )}
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.buhanshuizongjia')}
                </View>
                <View className={styles['product-list-item-content']}>{dataItem.totalPriceWithoutTax || ''}</View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.baojiayouxianqicong')}
                </View>
                <View className={styles['product-list-item-content']}>
                  <Picker
                    mode="date"
                    onChange={(e) => changeProducts('quoteStartTime', e.detail.value, dataIndex)}
                    value={dataItem.quoteStartTime}
                    start={dateFmt(new Date(), 'YYYY-MM-DD')}
                    end={dataItem.quoteEndTime ? dataItem.quoteEndTime : undefined}
                  >
                    <View className={cx(styles['time'], !dataItem.quoteStartTime && styles.placeholderColor)}>
                      {dataItem.quoteStartTime || (
                        <Text>{translate('mobile.resource.askPurchase.qingxuanzeshijian')}</Text>
                      )}
                      <Icons name="ChevronRight" size={12} />
                    </View>
                  </Picker>
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.baojiayouxianqidao')}
                </View>
                <View className={styles['product-list-item-content']}>
                  <Picker
                    mode="date"
                    onChange={(e) => changeProducts('quoteEndTime', e.detail.value, dataIndex)}
                    value={dataItem.quoteEndTime}
                    start={dataItem.quoteStartTime ?? dateFmt(new Date(), 'YYYY-MM-DD')}
                  >
                    <View className={cx(styles['time'], !dataItem.quoteEndTime && styles.placeholderColor)}>
                      {dataItem.quoteEndTime || (
                        <Text>{translate('mobile.resource.askPurchase.qingxuanzeshijian')}</Text>
                      )}
                      <Icons name="ChevronRight" size={12} />
                    </View>
                  </Picker>
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.guanlianbaojiashangpin')}
                </View>
                <View className={styles['product-list-item-content']}>
                  <View
                    className={cx(styles['time'], !dataItem.commodityName && styles.placeholderColor)}
                    onClick={(e) => {
                      e.stopPropagation()
                      preload({
                        preloadDate: getCurrentInstance().preloadData,
                        onSelect: (selectInfo) => {
                          handleSelectSku(selectInfo, dataIndex)
                        },
                      })
                      Router.navigateTo('askPurchase/skuList')
                    }}
                  >
                    {dataItem.commodityName || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                    <Icons name="ChevronRight" size={12} />
                  </View>
                </View>
              </View>
              <View className={styles['product-list-item']}>
                <View className={styles['product-list-item-label']}>
                  {translate('mobile.resource.askPurchase.xiaoshouqudao')}
                </View>
                <View className={styles['product-list-item-content']}>
                  <Picker
                    range={dataItem.shopList || []}
                    rangeKey="name"
                    mode="selector"
                    value={
                      dataItem.shopId
                        ? dataItem.shopList.map((shopItem) => shopItem.shopId).indexOf(dataItem.shopId)
                        : 0
                    }
                    onChange={(e) => {
                      const newList = [...dataSource]
                      onChange(
                        newList.map((item, itemIndex) => {
                          if (itemIndex === dataIndex) {
                            const shopItem = dataItem.shopList[Number(e.detail.value)]
                            return {
                              ...item,
                              shopId: shopItem?.shopId,
                              shopName: shopItem?.name,
                            }
                          }
                          return item
                        }),
                      )
                    }}
                  >
                    <View className={cx(styles['time'], !dataItem.shopName && styles.placeholderColor)}>
                      {dataItem.shopName || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                      <Icons name="ChevronRight" size={12} />
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        ))}
    </Fragment>
  )
}

export default OtherList
