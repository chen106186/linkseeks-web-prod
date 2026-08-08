/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  useRouter,
  getCurrentInstance,
  setNavigationBarTitle,
  preload,
  showLoading,
  hideLoading,
} from '@apps/mobile-services/utils/taro'
import { View, Text, SwipeAction, ScrollView, Modal, Toast, Tabs, TabsPane, Image } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Icon from '@/assets/edit.png'
import { checkMore } from '@/utils'
import useStores from '@/store/useStores'
import addIcon from '@/assets/plus.svg'
import Router from '@/utils/router'
import EmptyLayout from '@/components/Empty/index'
import { useIntl } from '@linkseeks/i18n'
import {
  getLogisticsMobileReceiverAddressListDefault,
  getLogisticsMobileShipperAddressListDefault,
  postLogisticsMobileReceiverAddressDelete,
  postLogisticsMobileShipperAddressDelete,
} from '@apps/apis'

import styles from './index.module.scss'

const PAGE_SIZE = 30
const AddressList = () => {
  const intl = useIntl()
  const params = Object.assign({}, getCurrentInstance().preloadData || {}, getCurrentInstance()?.router?.params || {})
  console.log(params)
  if (params && !params.active) {
    params.active = '0'
  }
  const { userStore, createStore } = useStores()
  const { hideDeliver } = useRouter().params
  const [active, setActive] = useState(() => params.active)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const [list, setList] = useState<any>([]) // 数据集合
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [id, setId] = useState('') // 对应的id

  const _tabList = useMemo(() => {
    let list: any = []
    list.push({ title: intl.formatMessage({ id: 'mine.shouhuodizhi', defaultMessage: '收货地址' }) })
    if (!hideDeliver) {
      list.push({ title: intl.formatMessage({ id: 'mine.fahuodizhi', defaultMessage: '发货地址' }) })
    }
    return list
  }, [hideDeliver])
  /* 获取我的地址列表数据 */
  const getAddressList = (index: any, needresolve?: boolean) => {
    setLoading(true)
    showLoading()
    return new Promise((resolve, reject) => {
      const param: any = {
        current: `${pageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
      }

      // logistics/mobile/receiverAddress/list/default
      const fn: any =
        index === '0' ? getLogisticsMobileReceiverAddressListDefault : getLogisticsMobileShipperAddressListDefault
      // /logistics/mobile/shipperAddress/list/default
      fn(param)
        .then((res: any) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            // resolve(res.data.data);
            // setList(res.data.data);
            if (needresolve) {
              resolve(res.data)
            } else {
              setList(res.data)
            }
          } else {
            reject()
          }
          setLoading(false)
          hideLoading()
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
          hideLoading()
        })
    })
  }
  useEffect(() => {
    getAddressList(active)
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'mine.dizhiguanli', defaultMessage: '地址管理' }) })
  }, [])

  /* 跳转页面 */
  const linkTo = (Id: string, index?: string) => {
    preload({
      id: Id,
      active,
      refresh: () => {
        getAddressList(index)
      },
    })
    Router.navigateTo('address/addressAdd')
  }
  /* 删除 */
  const delItem = (delId: string) => {
    if (!toggle) {
      setToggle(!toggle)
    }
    setId(delId)
  }
  /* 删除接口 */
  const setConfirm = () => {
    const param: any = {
      id,
    }
    const fn: any = active === '0' ? postLogisticsMobileReceiverAddressDelete : postLogisticsMobileShipperAddressDelete
    fn(param).then((res: any) => {
      if (res.code === 1000) {
        setToggle(!toggle)
        Toast.show({ title: intl.formatMessage({ id: 'mine.shanchuchenggong', defaultMessage: '删除成功' }) })
        getAddressList(active)
        if (createStore.deliveryAddressId === Number(id)) {
          createStore.setCreateValuesMaps({ deliveryAddressId: undefined, deliveryAddress: undefined })
        }
      } else {
        Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
      }
    })
  }
  /* 数据存储 */
  const onAddressItem = (item: any) => {
    if (params.active && active !== params.active) {
      return
    }
    console.log(params, 'params')
    const fullAddress = `${item.receiverName} ${item.phone} / ${item.provinceName}${item.cityName}${item.districtName}${item.address}`
    const storeData = {
      fullAddress,
      id: item.id,
      phone: item.phone,
      receiverName: item.receiverName,
      isDefault: item.isDefault,
      address: item.address,
      cityCode: item.cityCode,
      cityName: item.cityName,
      districtCode: item.districtCode,
      districtName: item.districtName,
      postalCode: item.postalCode,
      provinceCode: item.provinceCode,
      provinceName: item.provinceName,
      streetCode: item.streetCode,
      streetName: item.streetName,
      tel: item.tel,
    }
    userStore.setAddressItem(item)
    createStore.setCreateValuesMaps({ deliveryAddress: fullAddress, deliveryAddressId: item.id })
    Router.navigateBack()
    // if (!params) {
    //   userStore.setAddressItem(item)
    //   createStore.setCreateValuesMaps({ deliveryAddress: fullAddress, deliveryAddressId: item.id })
    //   Router.navigateBack()

    // } else if (params.addressList) {
    //   // 临时方案...
    //   (params.addressList as any)({ ...item, fullAddress });
    //   Router.navigateBack();
    // } else if ("handleSelectAddress" in params) {
    //   // EventChannel.emit('handleSelectAddress', item)
    //   // (params.handleSelectAddress as any)?.(item);
    //   createStore.setCreateValuesMaps({ deliveryAddress: fullAddress, deliveryAddressId: item.id })
    //   Router.navigateBack();
    // } else {
    //   linkTo(item.id, active)
    // }
  }

  const handleTabChange = (key: number) => {
    const index = key.toString()

    setList([])
    setActive(index)

    getAddressList(index)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getAddressList(active, true)
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }
  /* dom 元素 */
  const renderItem = ({ item }: { item: any }) => {
    return (
      <View className={styles['address-list']} key={String(item.id)}>
        <SwipeAction
          customStyle={{ width: '100%' }}
          options={[
            {
              text: intl.formatMessage({ id: 'mine.options.shanchu', defaultMessage: '删除' }),
              className: styles['delbtn'],
            },
          ]}
          onClick={() => delItem(item.id)}
          maxDistance={97}
        >
          <View className={styles['address-list-item']}>
            <View className={styles['left']} onClick={() => onAddressItem(item)}>
              <View className={styles['box']}>
                <Text className={styles['box-name']}>
                  {item.receiverName}
                  {item.shipperName}
                  {/* {active === '1' ? item.shipperName : item.receiverName} */}
                  {/* {active === '1' ? item.shipperName : item.receiverName} */}
                </Text>
                <Text className={styles['box-name']}>{item.phone}</Text>
                {item.isDefault === 1 ? (
                  <Text className={styles['flag']}>
                    {intl.formatMessage({ id: 'mine.default', defaultMessage: '默认' })}
                  </Text>
                ) : (
                  <Text> </Text>
                )}
              </View>
              <Text className={styles['address-list-item-text']}>
                {item.provinceName + item.cityName + item.districtName + item.streetName}
              </Text>
              <Text className={styles['address-list-item-text']}>{item.address}</Text>
            </View>
            <View className={styles['right']} onClick={() => linkTo(item.id, active)}>
              <Image className={styles['icon']} src={Icon} />
            </View>
          </View>
        </SwipeAction>
      </View>
    )
  }

  return (
    <View className={styles['address-container']}>
      <Tabs
        className={styles['tab-bar-style']}
        current={Number(active)}
        swipeable={false}
        tabList={_tabList}
        onClick={handleTabChange}
      >
        <TabsPane current={Number(active)} index={0}>
          {list.length ? (
            <View className={styles['page']}>
              <ScrollView
                className={styles['mian']}
                scrollY
                refresherEnabled
                refreshing={loading}
                data={list}
                renderItem={renderItem}
                horizontal={false}
                onEndReached={() => handleLoadMore()}
                onEndReachedThreshold={0.05}
                enableFlex
                lowerThreshold={1}
                onScrollToLower={handleLoadMore}
                onRefresh={() => {
                  pageRef.current = 1
                  getAddressList(active)
                }}
              />
            </View>
          ) : (
            <View className={styles['address-view']}>
              <EmptyLayout />
            </View>
          )}
        </TabsPane>
        {!hideDeliver && (
          <TabsPane current={Number(active)} index={1}>
            {list.length ? (
              <View className={styles['page']}>
                <ScrollView
                  className={styles['mian']}
                  scrollY
                  refresherEnabled
                  data={list}
                  renderItem={renderItem}
                  horizontal={false}
                  onEndReached={() => handleLoadMore()}
                  onEndReachedThreshold={0.05}
                  enableFlex
                  lowerThreshold={1}
                  onScrollToLower={handleLoadMore}
                  refreshing={loading}
                  onRefresh={() => {
                    pageRef.current = 1
                    getAddressList(active)
                  }}
                />
              </View>
            ) : (
              <View className={styles['address-view']}>
                <EmptyLayout />
              </View>
            )}
          </TabsPane>
        )}
      </Tabs>

      <View className={styles['address-footer']}>
        <View
          onClick={() => {
            preload({
              active,
              refresh: () => {
                getAddressList(active)
              },
            })
            Router.navigateTo('address/addressAdd')
          }}
          className={styles['address-add']}
        >
          <View className={styles['addicon']}>
            <Image className={styles['addicon-img']} src={addIcon} />
          </View>
          <Text className={styles['addtext']}>
            {active === '0'
              ? intl.formatMessage({ id: 'mine.xinzengshouhuodizhi', defaultMessage: '新增收货地址' })
              : intl.formatMessage({ id: 'mine.xinzengfahuodizhi', defaultMessage: '新增发货地址' })}
          </Text>
        </View>
      </View>

      <Modal
        title={intl.formatMessage({ id: 'mine.shifoushanchudizhi', defaultMessage: '是否删除地址？' })}
        isOpened={toggle}
        onConfirm={setConfirm}
        onCancel={() => {
          setToggle(false)
        }}
        cancelText={intl.formatMessage({ id: 'mine.quxiao', defaultMessage: 'quxiao' })}
        confirmText={intl.formatMessage({ id: 'mine.queren', defaultMessage: 'queren' })}
        className={styles['invoice-model']}
      />
    </View>
  )
}

export default observer(AddressList)
