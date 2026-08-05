import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { getOrderMobileCbgTeamLeaderGetPickupProducts, postOrderMobileCbgTeamLeaderConfirmPickup } from '@apps/apis'
import Progress from '@/components/Progress'
import ConfirmReceiptModal from '@/packages/teamLeader/components/confirmReceiptModal'
import {
  showLoading,
  hideLoading,
  pxTransform,
  showToast,
  useRouter,
  useDidShow,
  showModal,
} from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import Router from '@/utils/router'
import { THEME_COLORS } from '@/constants/theme'
const tradeIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-trade.png'

// 代客取货页
const TeamLeaderAgentPickup: React.FC<{}> = () => {
  const intl = useIntl()
  // enterType 类型 1-核销，2-代客取货
  const { orderId, enterType } = useRouter().params
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [toggle, setToggle] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [list, setList] = useState([])

  // useDidShow(() => {
  // 	getPickupProducts()
  // })

  useEffect(() => {
    getPickupProducts()
  }, [])

  const getPickupProducts = async () => {
    showLoading({
      title: intl.formatMessage({ id: 'teamLeader.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    const params: any = { orderId: orderId }
    try {
      const res = await getOrderMobileCbgTeamLeaderGetPickupProducts(params)
      if (res.code === 1000) {
        const list = res.data || []
        setList(list)
      } else {
        showToast({
          title:
            res?.message ||
            intl.formatMessage({
              id: 'teamLeader.huoqushujushibai',
              defaultMessage: '获取数据失败',
            }),
          icon: 'none',
        })
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    } finally {
      hideLoading()
    }
  }

  const openConfirmBox = () => {
    setToggle(true)
  }

  const getPercent = (received?: number, quantity?: number): number => {
    if (typeof received !== 'number' || typeof quantity !== 'number' || quantity === 0) return 0

    const percent = (received / quantity) * 100
    const number = Math.min(100, Math.max(0, parseFloat(percent.toFixed(2))))
    return number
  }

  // 确认收货
  const confirmPickUp = (urls: string[]) => {
    showModal({
      title: '',
      confirmText: intl.formatMessage({
        id: 'confirm',
        defaultMessage: '确认',
      }),
      cancelText: intl.formatMessage({
        id: 'cancel',
        defaultMessage: '取消',
      }),
      content: intl.formatMessage({
        id: 'teamLeader.shifouquerenshouhuo',
        defaultMessage: '是否确认取货？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          const products = list.map((item: any) => ({
            productId: item.productId,
            skuId: item.skuId,
            num: item.quantity, // 取的是发货数量，暂时只能全收货
          }))
          const params = {
            orderId: Number(orderId),
            type: Number(enterType),
            // receiptImg: urls[0],
            products: products,
          }
          postOrderMobileCbgTeamLeaderConfirmPickup(params).then((res) => {
            if (res.code === 1000) {
              setToggle(false)
              showToast({
                title: res.message,
                icon: 'none',
              })
              setTimeout(() => {
                Router.navigateBack()
              }, 800)
            } else {
              showToast({
                title: res.message,
                icon: 'none',
              })
            }
          })
        }
      },
    })
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={styles['pickup-box-commodity']}>
        <View className={styles['commodity-top']}>
          <Image className={styles['commodity-top-img']} src={item.productImage} />
          <View className={styles['commodity-top-info']}>
            <Text className={styles['info-title']}>{item.name}</Text>
            <Text className={styles['info-text']}>{item.spec}</Text>
          </View>
        </View>
        <View className={styles['commodity-amount']}>
          <View className={styles['amount-view']}>
            {intl.formatMessage({
              id: 'teamLeader.fahuoshuliang',
              defaultMessage: '发货数量',
            })}
            <Text>({item.unit})：</Text>
            <Text className={styles['amount-text']}>{item.quantity}</Text>
          </View>
          <View className={styles['amount-view']}>
            {intl.formatMessage({
              id: 'teamLeader.shouhuoshuliang',
              defaultMessage: '收货数量',
            })}
            <Text>({item.unit})：</Text>
            <Text className={styles['amount-text']}>{item.received}</Text>
          </View>
        </View>
        <View className={styles['commodity-progress']} style={{ position: 'relative' }}>
          {/* 进度条 */}
          <Progress
            percent={getPercent(item.received, item.quantity)}
            showInfo={false}
            strokeColor={THEME_COLORS.primary}
            trailColor="#edeeef"
            width={4}
            strokeWidth={4}
          />
          {/* 图标 */}
          <Image
            src={tradeIcon}
            className={styles['commodity-progress-icon']}
            style={{
              position: 'absolute',
              top: pxTransform(-6), // 可根据实际调整垂直位置
              left: `calc(${getPercent(item.received, item.quantity)}%)`, // 进度百分比，减是为了图标居中
              transition: 'left 0.3s ease',
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View className={styles['agent-pickup']}>
      <View className={styles['pickup-top']}>
        <Text className={styles['pickup-top-title']}>
          {intl.formatMessage({
            id: 'teamLeader.daiquhuo',
            defaultMessage: '待取货',
          })}
        </Text>
      </View>
      <View className={styles['pickup-box']}>
        <ScrollView
          scrollY
          data={list}
          className={styles['scroll-list']}
          renderItem={renderItem}
          listEmptyComponent={<Empty />}
          listFooterComponent={
            list.length ? (
              <Loading
                loading={loading}
                noMore={hasMore}
                // customStyle={{ marginTop: pxTransform(8) }}
                noMoreText={`共${list.length}条商品数据`}
                // noMoreText={intl.formatMessage({
                //  id: 'teamLeader.shangpinshuju',
                //  defaultMessage: `共${list.length}条商品数据`,
                // })}
              />
            ) : null
          }
        ></ScrollView>
        {/*<View className={styles['pickup-number']}>共{list.length}条商品数据</View>*/}
      </View>
      <View className={styles['pickup-btm']} onClick={openConfirmBox}>
        <View className={styles['pickup-btm-btn']}>
          {intl.formatMessage({
            id: 'teamLeader.querenquhuo',
            defaultMessage: '确认取货',
          })}
        </View>
      </View>
      <ConfirmReceiptModal visible={toggle} onClose={() => setToggle(false)} onConfirm={confirmPickUp} />
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderAgentPickup))
