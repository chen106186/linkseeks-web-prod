import React, { useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import isEqual from 'lodash/isEqual'
import { ProductInfoType, CurrentSkuItemType, ImgItemType } from '../../types'
import styles from '../../index.module.less'

export interface SelectAttrValType {
  attrId: number
  attrValId: number
}

interface SkuInfoProps {
  type: number
  skuId: number | undefined
  /** 商品详情信息 */
  productInfo: ProductInfoType
  onSelect: (skuInfo: CurrentSkuItemType | undefined) => void
  currentSku: CurrentSkuItemType | undefined
}

/**
 * 去除重复的图片
 * @param list
 * @param addList
 */
export const deleteRepeatImg = (list: ImgItemType[], addList: any) => {
  const result = [...list]
  for (const addItem of addList) {
    if (list.every((item) => item.commodityPic !== addItem.commodityPic)) {
      result.push(addItem)
    }
  }
  return result
}

export const formatImgList = (item: any) => {
  let tempImgList: ImgItemType[] = []
  if (item.commodityPic) {
    const tempCommodityPic = item.commodityPic.map((picItem: any, picIndex: any) => {
      return {
        id: `${item.id}-${picIndex}`,
        commodityPic: picItem,
      }
    })
    tempImgList = deleteRepeatImg(tempImgList, tempCommodityPic)
  }
  return tempImgList
}

const SkuInfo: React.FC<SkuInfoProps> = (props) => {
  const { skuId, productInfo, onSelect } = props
  const [skuList, setSkuList] = useState<any[]>([])
  const [selectAttrVal, setSelectAttrVal] = useState<SelectAttrValType[]>([])
  const translate = getWebIntl()
  const [expand, setExpand] = useState<boolean>(false)
  const SHOW_COUNT = 3 // 默认显示数量

  const judgeSelectAttrInList = (list: any[], attrValId: number, attrId: number) => {
    return list.some((item) => item['attrId'] === attrId && item['attrValId'] === attrValId)
  }

  /**
   * 判断数组中是否存在该数据
   * @param list
   * @param attrId
   */
  const judgeAttrInList = (list: any[], attrId: number) => {
    return list.some((item) => item.customerAttribute.id === attrId)
  }

  const judgeAttrValueInList = (list: any[], attrId: number) => {
    return list.some((item) => item.id === attrId)
  }

  const handleSelectAttrVal = (attrId: number, attrValId: number) => {
    let result: any[] = []
    if (selectAttrVal.some((item) => item.attrId === attrId && item.attrValId === attrValId)) {
      // 如果点击了已选择的属性，则删除选择
      result = selectAttrVal.filter((item) => item.attrId !== attrId)
    } else if (selectAttrVal.every((item) => item.attrId !== attrId && item.attrValId !== attrValId)) {
      result = [...selectAttrVal, { attrId, attrValId }]
    } else if (selectAttrVal.some((item) => item.attrId === attrId && item.attrValId !== attrValId)) {
      for (const item of selectAttrVal) {
        if (item.attrId === attrId && item.attrValId !== attrValId) {
          item.attrValId = attrValId
          result.push(item)
        } else {
          result.push(item)
        }
      }
    }

    setSelectAttrVal(result)
    getCurentSKu(result)
  }

  /**
   * 设置当前选择的sku的价格区间
   * @param uniPrice
   */
  const getCurrentPriceRange = (uniPrice: any) => {
    if (!uniPrice) return []
    const initPriceRange = uniPrice
    let tempPriceRange: any[] = []
    Object.keys(initPriceRange).forEach((key) => {
      const keyArr = key.split('-')
      const min = Number(keyArr[0])
      const max = Number(keyArr[1])
      tempPriceRange.push({
        range: key,
        min,
        max,
        price: initPriceRange[key],
      })
    })
    try {
      tempPriceRange = tempPriceRange.sort((a, b) => (a.min > b.max ? 1 : -1))
    } catch (error) {
      console.log(error)
    }
    return tempPriceRange
  }

  const getMinPriceSku = () => {
    const commoditySkuList = productInfo?.commoditySkuList

    if (!commoditySkuList || (commoditySkuList && commoditySkuList.length === 0)) return
    const newList = commoditySkuList.sort((a, b) => {
      const bPrice = getCurrentPriceRange(b.unitPrice)[0]
      const aPrice = getCurrentPriceRange(a.unitPrice)[0]
      return bPrice.price <= aPrice.price || b.stockCount > a.stockCount ? 1 : -1
    })
    const minItem = newList[0]
    if (minItem) {
      if (minItem.commoditySkuAttributeList && minItem.commoditySkuAttributeList.length > 0) {
        const newAttrVal: SelectAttrValType[] = []
        minItem.commoditySkuAttributeList.forEach((item) => {
          if (item.customerAttribute?.id && item.customerAttributeValue?.id) {
            newAttrVal.push({
              attrId: item.customerAttribute?.id,
              attrValId: item.customerAttributeValue?.id,
            })
          }
        })
        setSelectAttrVal(newAttrVal)
        getCurentSKu(newAttrVal)
      }
    }
  }

  const getSkuImg = (attrId: number, valId: number, commoditySkuList: ProductInfoType['commoditySkuList']): string => {
    const current = commoditySkuList.find((item) =>
      item?.commoditySkuAttributeList.some(
        (listItem) => listItem?.customerAttribute?.id === attrId && listItem?.customerAttributeValue?.id === valId,
      ),
    )
    if (current) {
      return current?.commodityPic[0] || ''
    }
    return ''
  }

  const initSkuList = (dataInfo: ProductInfoType) => {
    const commoditySkuList = dataInfo?.commoditySkuList

    if (!commoditySkuList || (commoditySkuList && commoditySkuList.length === 0)) return

    /** 当只有一个sku时自动选中改sku */
    if (commoditySkuList.length === 1) {
      const item = commoditySkuList[0]
      if (
        !item?.commoditySkuAttributeList ||
        (item?.commoditySkuAttributeList && item?.commoditySkuAttributeList.length === 0)
      ) {
        onSelect({
          skuId: item.id,
          ladder: getCurrentPriceRange(item.unitPrice),
          priceRate: item.priceRate,
          stockNum: item.stockCount,
          commodityPic: item.commodityPic ? item.commodityPic[0] : productInfo?.mainPic,
          commoditySkuAttributeList: item.commoditySkuAttributeList || [],
          imgList: formatImgList(item),
          code: item.code,
        })

        return
      }
    }

    let tempSkuList: {
      customerAttribute: {
        id: number
      }
      customerAttributeValueList: any[]
      id: number
    }[] = []

    for (const item of commoditySkuList) {
      if (item.commoditySkuAttributeList && item.commoditySkuAttributeList.length > 0) {
        for (const attrListItem of item.commoditySkuAttributeList) {
          if (attrListItem?.customerAttribute) {
            if (
              attrListItem?.customerAttribute?.id &&
              judgeAttrInList(tempSkuList, attrListItem.customerAttribute.id)
            ) {
              let tempSkuListIndex = 0
              tempSkuList.map((item, index) => {
                if (item.customerAttribute.id === attrListItem.customerAttribute?.id) {
                  tempSkuListIndex = index
                }
              })
              const customerAttributeValue: any = {
                ...attrListItem.customerAttributeValue,
              }
              if (
                customerAttributeValue?.id &&
                !judgeAttrValueInList(
                  tempSkuList[tempSkuListIndex].customerAttributeValueList,
                  customerAttributeValue?.id,
                )
              ) {
                tempSkuList[tempSkuListIndex].customerAttributeValueList = [
                  ...tempSkuList[tempSkuListIndex].customerAttributeValueList,
                  customerAttributeValue,
                ]
              }
            } else {
              const temp: any = {}
              temp.id = attrListItem.id
              temp.customerAttribute = attrListItem.customerAttribute
              const customerAttributeValue: any = {
                ...attrListItem.customerAttributeValue,
              }
              temp.customerAttributeValueList = [customerAttributeValue]
              tempSkuList.push(temp)
            }
          }
        }
      }
    }

    // 如果链接带有sku参数
    if (skuId) {
      const commoditySkuList = productInfo?.commoditySkuList
      if (commoditySkuList && commoditySkuList.length > 0) {
        const filterItem = commoditySkuList.filter((item) => item.id === Number(skuId))[0]
        if (filterItem) {
          onSelect({
            skuId: filterItem.id,
            ladder: getCurrentPriceRange(filterItem.unitPrice),
            priceRate: filterItem.priceRate,
            stockNum: filterItem.stockCount,
            commodityPic: filterItem.commodityPic ? filterItem.commodityPic[0] : productInfo?.mainPic,
            commoditySkuAttributeList: filterItem.commoditySkuAttributeList || [],
            imgList: formatImgList(filterItem),
            code: filterItem.code,
          })
          if (filterItem.commoditySkuAttributeList && filterItem.commoditySkuAttributeList.length > 0) {
            const newAttrVal: SelectAttrValType[] = []
            filterItem.commoditySkuAttributeList.forEach((item) => {
              if (item.customerAttribute?.id && item.customerAttributeValue?.id) {
                newAttrVal.push({
                  attrId: item.customerAttribute?.id,
                  attrValId: item.customerAttributeValue?.id,
                })
              }
            })
            setSelectAttrVal(newAttrVal)
          }
        }
      }
    } else {
      if (tempSkuList.length > 0) {
        if (productInfo.priceType !== 2) {
          // 自动选中价格最低sku
          getMinPriceSku()
        } else {
          // 询价商品默认选中第一个sku
          const defaultItem = commoditySkuList[0]

          if (defaultItem) {
            if (defaultItem.commoditySkuAttributeList && defaultItem.commoditySkuAttributeList.length > 0) {
              const newAttrVal: SelectAttrValType[] = []
              defaultItem.commoditySkuAttributeList.forEach((item) => {
                if (item.customerAttribute?.id && item.customerAttributeValue?.id) {
                  newAttrVal.push({
                    attrId: item.customerAttribute?.id,
                    attrValId: item.customerAttributeValue?.id,
                  })
                }
              })
              setSelectAttrVal(newAttrVal)
              getCurentSKu(newAttrVal)
            }
          }
        }
      }
    }

    if (tempSkuList && tempSkuList.length > 0) {
      // 根据属性长度进行排序
      tempSkuList = tempSkuList.sort((a, b) =>
        b.customerAttributeValueList.length > a.customerAttributeValueList.length ? 1 : -1,
      )
      // 第一行属性添加sku图片
      tempSkuList = tempSkuList.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            customerAttributeValueList: item?.customerAttributeValueList.map(
              (attrItem: { id: number; value: string }) => {
                return {
                  ...attrItem,
                  commodityPic: getSkuImg(item.customerAttribute.id, attrItem.id, commoditySkuList),
                }
              },
            ),
          }
        }
        return item
      })
    }

    setSkuList(tempSkuList)
  }

  const judgeArrisCommon = (list: any[], otherList: any[]) => {
    if (list.length === otherList.length) {
      const result = list.every((listItem) => {
        return otherList.some((item) => {
          return JSON.stringify(item) === JSON.stringify(listItem)
        })
      })
      return result
    } else {
      return false
    }
  }

  /** 获取选中的sku */
  const getCurentSKu = (selectAttrValList: any[]) => {
    if (productInfo?.commoditySkuList) {
      for (const item of productInfo?.commoditySkuList) {
        const temp = item?.commoditySkuAttributeList.map((attrItem: any) => {
          return {
            attrId: attrItem.customerAttribute?.id,
            attrValId: attrItem.customerAttributeValue?.id,
          }
        })

        if (judgeArrisCommon(temp, selectAttrValList)) {
          onSelect({
            skuId: item.id,
            ladder: getCurrentPriceRange(item.unitPrice),
            priceRate: item.priceRate,
            stockNum: item.stockCount,
            commodityPic: item.commodityPic ? item.commodityPic[0] : productInfo?.mainPic,
            commoditySkuAttributeList: item.commoditySkuAttributeList || [],
            imgList: formatImgList(item),
            code: item.code,
          })
          return
        } else {
          onSelect(undefined)
        }
      }
    }
  }

  useEffect(() => {
    if (productInfo) {
      initSkuList(productInfo)
    }
  }, [productInfo])

  const sortItem = (sortArr: any[]) => {
    if (Array.isArray(sortArr) && sortArr.length > 0) {
      return sortArr.sort((a, b) => (b.attrId > a.attrId ? -1 : 1))
    }
    return sortArr
  }

  const judgeSkuNotExist = (skuArr: SelectAttrValType[]): boolean => {
    if (productInfo?.commoditySkuList && productInfo?.commoditySkuList.length > 0) {
      if (skuArr.length < productInfo?.commoditySkuList[0].commoditySkuAttributeList.length) {
        return false
      }

      const allSkuArr: Array<SelectAttrValType[]> = []
      productInfo.commoditySkuList.forEach((item) => {
        const itemSkuArr: SelectAttrValType[] = []

        item.commoditySkuAttributeList &&
          item.commoditySkuAttributeList.length > 0 &&
          item.commoditySkuAttributeList.forEach((attrAndValItem) => {
            itemSkuArr.push({
              attrId: attrAndValItem.customerAttribute?.id!,
              attrValId: attrAndValItem.customerAttributeValue?.id!,
            })
          })
        allSkuArr.push(itemSkuArr)
      })

      return !allSkuArr.some((item) => isEqual(sortItem(item), sortItem(skuArr)))
    }
    return true
  }

  /**
   * 查询该属性是否在sku中
   * @param attrId 属性名id
   * @param attrValId 属性值id
   * @returns
   */
  const judgeAttrNotExist = (attrId: number, attrValId: number): boolean => {
    if (!selectAttrVal.length) return false
    // 如果当前属性不在选择的sku中,则判断和已选择的属性的组合的sku是否存在
    if (selectAttrVal.some((item) => item.attrId === attrId && item.attrValId !== attrValId)) {
      const currentSelectAttrVal = selectAttrVal.map((item) => {
        if (item.attrId === attrId) {
          return {
            attrId,
            attrValId,
          }
        }
        return {
          ...item,
        }
      })
      return judgeSkuNotExist(currentSelectAttrVal)
    } else if (selectAttrVal.every((item) => item.attrId !== attrId)) {
      const currentSelectAttrVal = [...selectAttrVal, { attrId, attrValId }]
      return judgeSkuNotExist(currentSelectAttrVal)
    }

    return false
  }

  const renderSkuList = useMemo(() => {
    if (skuList && skuList.length > 0) {
      return (
        <>
          {skuList.map(
            (skuItem, index) =>
              (index < SHOW_COUNT || expand) && (
                <div className={styles.product_info_line} key={`product_info_line_${skuItem.id}`}>
                  <div className={styles.product_info_line_label}>{skuItem?.customerAttribute?.name}</div>
                  <div className={styles.product_info_line_brief}>
                    <div className={styles.product_info_line_list}>
                      {skuItem.customerAttributeValueList.map((childItem: any, index: number) => (
                        <div
                          key={`product_info_line_list_item_${childItem.id}_${index}`}
                          className={cx(
                            styles.product_info_line_list_item,
                            judgeSelectAttrInList(selectAttrVal, childItem.id, skuItem.customerAttribute.id) &&
                              styles.active,
                            judgeAttrNotExist(skuItem.customerAttribute.id, childItem.id) && styles.disabled,
                          )}
                          onClick={() => {
                            if (judgeAttrNotExist(skuItem.customerAttribute.id, childItem.id)) return
                            handleSelectAttrVal(skuItem.customerAttribute.id, childItem.id)
                          }}
                        >
                          {/* {childItem.commodityPic && (
                            <div className={styles.imgbox}>
                              <img src={childItem.commodityPic} />
                            </div>
                          )} */}
                          <span className={styles.attrName}>{childItem.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
          )}
          {skuList.length > SHOW_COUNT && (
            <div className={styles.product_promotion_expand} onClick={() => setExpand(!expand)}>
              <span>{expand ? translate('web.resource.mall.shouqi') : translate('web.resource.mall.zhankai')}</span>
              {expand ? (
                <CaretUpOutlined className={styles.product_promotion_expand_icon} />
              ) : (
                <CaretDownOutlined className={styles.product_promotion_expand_icon} />
              )}
            </div>
          )}
        </>
      )
    }
    return null
  }, [skuList, selectAttrVal, expand])

  return renderSkuList
}

export default SkuInfo
