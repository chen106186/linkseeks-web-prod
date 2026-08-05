import React, { useMemo, useState } from 'react'
import { View, Text, Toast, Icons } from '@apps/mobile-ui'
import { ActivityButton, Price, SimpleCommodity } from '@/components/Commodity'
import classNames from 'classnames'
import { ACTIVITY_COMBINATION_NUMBER } from '@/constants/const/activity'
import { arrayToMap } from '@/utils'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import { postProductCommodityGetCommodityByCommoditySkuIdList } from '@apps/apis'
import './combination.scss'

type ProductType = {
  productName: string
  productImg: string
  id: number
  /** 原价 */
  originalPrice: number
  /** 折扣价 */
  discount: number
  skuId: number
  /** 标签 */
  tags: {
    name: string
    type: string
  }[]
  /** 商品id */
  productId: number
}
type SimpleCommodityProps = Omit<React.ComponentProps<typeof SimpleCommodity>, 'onClick' | 'renderFooter'>

interface Iprops {
  dataSource: ProductType[]
  /** 1 => 平台 2 => 商家 */
  belongType: 1 | 2
}

const Combination: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource, belongType } = props
  const [checked, setChecked] = useState<number[]>([])
  const {
    purchaseOrderStore: { setShopMessageStore },
  } = useStores()
  const intl = useIntl()
  const formatedTitle = useMemo(() => {
    if (dataSource && dataSource?.length <= 0) {
      return {
        money: 0,
        unit: 0,
      }
    }
    console.log(dataSource)
    const [defaultLable, money = 0, unit = 0] = dataSource?.[0]?.tags?.[1]?.name?.match(/(\d+\.?\d*)[^\d]*?(\d+)/) || []

    return {
      money,
      unit,
    }
  }, [dataSource])

  const getSubmitData = async (data: ProductType[]) => {
    const skuIdList = data.map((_item) => _item.skuId)
    const dataToSkuIdMap = arrayToMap(data, 'skuId')
    const skuDataResponse = await postProductCommodityGetCommodityByCommoditySkuIdList({ idList: skuIdList } as any)
    console.log(skuDataResponse, 'skuDataResponse')

    if (skuDataResponse.code !== 1000) {
      return null
    }
    const result: any = {}
    skuDataResponse.data.forEach((_item) => {
      const activityTarget = dataToSkuIdMap[_item.id].activityList.find(
        (_activity) => _activity.activityType === ACTIVITY_COMBINATION_NUMBER,
      )
      const shopId = `shopId_${_item?.memberId}`
      if (typeof result[shopId] === 'undefined') {
        result[shopId] = []
      }
      const tempData = {
        activityDetails: [],
        commodityId: _item.commodityId,
        commodityLogo: _item.mainPic,
        commoditySku: [],
        count: 1,
        brandId: _item.brandId,
        brandName: _item.brandName,
        customerCategoryId: _item.customerCategoryId,
        customerCategoryName: _item.customerCategoryName,
        estimatePrice: dataToSkuIdMap[_item.id].originalPrice,
        giftList: [],
        /** 购物车id， 可以不用传哇 */
        id: 0,
        isCrossBorder: _item.isCrossBorder ?? false,
        isMemberPrice: _item.isMemberPrice,
        isPublish: true,
        logistics: _item.logistics,
        memberId: _item.memberId,
        memberName: _item.memberName,
        memberRoleId: _item.memberRoleId,
        minOrder: 1,
        name: _item.name,
        newAction: 0,
        newPrice: dataToSkuIdMap[_item.id].originalPrice,
        parameter: 1,
        priceType: _item.priceType,
        saleTotalAmount: dataToSkuIdMap[_item.id].originalPrice,
        skuId: _item.id,
        stockCount: _item.stockCount,
        storeId: (_item as any).storeId,
        storeLogo: (_item as any).storeLogo,
        storeName: (_item as any).storeName,
        taxRate: _item.taxRate,
        topActivityDetail: {
          activityId: activityTarget?.id,
          belongType: belongType,
          activityType: ACTIVITY_COMBINATION_NUMBER,
          combination: {
            num: activityTarget?.activityDefined.num,
            price: activityTarget?.activityDefined.price,
          },
          canUseCoupon: activityTarget?.allowCoupon,
          concreteType: null,
          endTime: activityTarget?.startTime,
          preferentialTag: activityTarget?.activityName,
          startTime: activityTarget?.endTime,
        },
        unitName: _item.unitName,
        upperMemberId: _item.upperMemberId,
        upperMemberName: _item.upperMemberName,
        upperMemberRoleId: _item.upperMemberRoleId,
        upperMemberRoleName: _item.upperMemberRoleName,
        commodityAreaList: (_item as any).commodityAreaList,
        isAllArea: (_item as any).isAllArea,
      }
      result[shopId].push(tempData)
    })
    return result
  }

  const handleClickItem = (item: ProductType) => {
    const isChecked = checked.includes(item.skuId)
    const checkedLength = checked.length
    if (!isChecked && checkedLength >= formatedTitle.unit) {
      return
    }
    if (isChecked) {
      setChecked(checked.filter((_item) => _item !== item.skuId))
    } else {
      setChecked(checked.concat(item.skuId))
    }
  }

  const handleBuy = async () => {
    const checkedLength = checked.length
    // Toast.show({ title: intl.formatMessage({id: 'activity.zuhecuxiaozanweikaifang', defaultMessage: '组合促销暂未开放'}) , icon: 'none' });
    if (checkedLength < formatedTitle.unit) {
      return
    }
    const data = dataSource.filter((_item) => checked.includes(_item.skuId))
    const submitData = await getSubmitData(data)
    if (submitData === null) {
      // Toast.show({});
      Toast.show({
        title: '参数异常',
        icon: 'none',
      })
      return
    }
    console.log(submitData)
    setShopMessageStore(submitData)
    Router.navigateTo('order/ConfirmOrder')
  }

  return (
    <View className="combination">
      <View className="combination-title">
        {intl.formatMessage({
          id: 'activity.group.combination',
          defaultMessage: '以下商品认选{{n}}件, 只需{{m}}元',
          n: formatedTitle.unit,
          m: formatedTitle.money,
        })}
      </View>
      <View className="combination-container">
        {dataSource.map((_item: ProductType) => {
          return (
            <View className="combination-item" key={_item.id} onClick={() => handleClickItem(_item)}>
              <View
                className={classNames('combination-item-border', {
                  'combination-item-border-active': checked.includes(_item.skuId),
                })}
              >
                {(checked.includes(_item.skuId) && (
                  <View className="combination-item-extra">
                    <View className="combination-item-checked-arrow" />
                    <View className="combination-item-checked-icon">
                      <Icons name="Right" color="#fff" size={14} />
                    </View>
                  </View>
                )) ||
                  null}
                <SimpleCommodity
                  productId={_item.productId}
                  productName={_item.productName}
                  tags={_item.tags as any}
                  productImage={_item.productImg}
                />
              </View>
            </View>
          )
        })}
      </View>
      <View className="combination-footer">
        <Price discount={+formatedTitle.money!} />
        <ActivityButton type="danger" onClick={handleBuy}>
          {intl.formatMessage({ id: 'activity.group.nowBuy', defaultMessage: '立即购买' })}
        </ActivityButton>
      </View>
    </View>
  )
}

export default observer(Combination)
