import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useCallback, useState } from 'react'
import { View, Text, Button, ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import useJmpHome from '@/hooks/useJmpHome'
import { ProductItem } from '@/components/ProductList/Item'
import ProductList from '@/components/ProductList'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import Router from '@/utils/router'
import { postProductMobileShopEnterpriseGetCommodityList, postProductMobileShopScoreGetCommodityList } from '@apps/apis'
// import { ProductItem } from '@/components/ProductList/Item';
import styles from './index.module.scss'
interface Iprops {
  route: any
  navigation: any
}
const SubmitSuccess = (props: Iprops) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const { jmpDefaultHome } = useJmpHome()
  const mode = 'default'
  const routeParams = useRouter()
  const paySuccess = routeParams.params.paySuccess
  const orderId = routeParams.params.orderId
  const [list, setList] = useState<any[]>([])
  const goHome = async () => {
    jmpDefaultHome()
  }
  const goOrderDetail = () => {
    // 订单提交成功后， 可前往报价单查询页面
    // navigation.navigate(`PurchaseOrderInquireDetail`, { id: orderId })
    Router.navigateTo('order/mycommodityDetails', {
      orderId: orderId,
    })
  }
  const _normalizeList = (data: any[]): ProductItem[] => {
    const ret: ProductItem[] = []
    data.forEach((item) => {
      const atom: ProductItem = {
        id: item.id,
        name: item.name,
        describe: item.slogan,
        price: item.min,
        unit: item.unitName,
        salesVolume: item.sold,
        picture: item.mainPic,
        storeId: item.storeId,
        priceType: item.priceType,
        supplierInfo: {
          id: item.memberId,
          roleId: item.memberRoleId,
          name: item.storeName || item.memberName,
        },
        preferentialPrice: (item as any).preferentialPrice,
        saleTags: (item as any).tagList,
        activityTypeList: (item as any).activityTypeList,
      }
      ret.push(atom)
    })
    return ret
  }
  const fetchCommodity = useCallback(async () => {
    const service =
      mode === 'default' ? postProductMobileShopEnterpriseGetCommodityList : postProductMobileShopScoreGetCommodityList
    const postData: {
      current: number
      pageSize: number
      priceTypeList: number[]
      storeId?: number
      channelMemberId?: number
    } = {
      current: 1,
      pageSize: 10,
      // priceTypeList: [mode === 'integral' ? 3 : 1],
      priceTypeList: [1],
    }
    const { data, code } = await service(postData, {
      headers: {
        type: 1,
      },
    })
    if (code === 1000) {
      const tempList = _normalizeList(data.data)
      setList(tempList)
    }
  }, [mode])
  useEffect(() => {
    fetchCommodity()
  }, [])
  const handleJumpProductDetail = (item: ProductItem) => {
    if (item.activityTypeList?.includes(17)) {
      Router.navigateTo('communityGroupBuy/list', { goodsId: item.id })
    } else {
      jmpProductDetail(item.priceType, {
        commodityId: item.id,
      })
    }
  }
  return (
    <View className={styles['page']}>
      <View className={styles['section']}>
        {paySuccess
          ? intl.formatMessage({
              id: 'order.zhifuchenggong',
              defaultMessage: '支付成功',
            })
          : intl.formatMessage({
              id: 'order.tijiaochenggong',
              defaultMessage: '提交成功',
            })}
      </View>
      <View className={styles['viewHeader']}>
        <View className={styles['msg']}>
          {intl.formatMessage({
            id: 'order.dingdanyitijiaochenggong',
            defaultMessage: '订单已提交成功， 请等待订单处理结果',
          })}
        </View>
        <View className={styles['actions']}>
          <Button className={styles['btn']} onClick={goHome}>
            <Text className={styles['btnText']}>
              {intl.formatMessage({
                id: 'order.fanhuishouye',
                defaultMessage: '返回首页',
              })}
            </Text>
          </Button>
          <Button className={styles['btn']} onClick={goOrderDetail}>
            <Text className={styles['btnText']}>
              {intl.formatMessage({
                id: 'order.zhakanxiangqing',
                defaultMessage: '查看详情',
              })}
            </Text>
          </Button>
        </View>
      </View>
      <View className={styles['recommend']}>
        <View className={styles['recommendTitle']}>
          -{' '}
          {intl.formatMessage({
            id: 'order.weinituijian',
            defaultMessage: '为你推荐',
          })}{' '}
          -
        </View>
        <ScrollView className={styles['product-list-warp']}>
          <ProductList
            dataSource={list}
            type="larger"
            onClickItem={handleJumpProductDetail}
            onClickSupplier={(item: { storeId: any }) =>
              Router.navigateTo('shop/home', {
                id: item.storeId,
              })
            }
          />
        </ScrollView>
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(SubmitSuccess))
