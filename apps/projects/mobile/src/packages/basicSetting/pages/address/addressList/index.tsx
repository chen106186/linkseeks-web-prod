import GlobalWrapper from '@/components/GlobalWrapper'
/* eslint-disable no-shadow */
import React, { useState, useEffect, useRef } from 'react'
import {
  getCurrentInstance,
  showLoading,
  hideLoading,
  setNavigationBarTitle,
  preload,
  getStorageSync,
  setStorageSync,
} from '@apps/mobile-services/utils/taro'
import { View, Button, Text, SwipeAction, ScrollView, Modal, Toast, Tabs, TabsPane, Image } from '@apps/mobile-ui'
import cs from 'classnames'
import { observer } from 'mobx-react-lite'
import { checkMore } from '@/utils'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import EmptyLayout from '@/components/Empty/index'
import { useIntl } from '@linkseeks/i18n'
import {
  getLogisticsMobileReceiverAddressListDefault,
  getLogisticsMobileShipperAddressListDefault,
  getOrderMobileCbgReceiverPickupList,
  postLogisticsMobileReceiverAddressDelete,
  postLogisticsMobileShipperAddressDelete,
  getOrderMobileCbgReceiverPickupDelete,
} from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { combinationAddress } from '@/utils/dataMerge'
import { getOssUrlPath } from '@apps/constants'
const Icon = getOssUrlPath('/miniprogram/assets/edit.png')
const addIcon = getOssUrlPath('/miniprogram/assets/plus.svg')
const PAGE_SIZE = 30
const AddressList = () => {
  const intl = useIntl()
  const params = Object.assign({}, getCurrentInstance().preloadData || {}, getCurrentInstance()?.router?.params || {})
  if (params && !params.active) {
    params.active = '0'
  }
  const { userStore, confirmOrderStore } = useStores()
  const [active, setActive] = useState(() => params.active)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const [list, setList] = useState<any>([]) // 数据集合
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [showDeleteModal, setShowDeleteModal] = useState(false) // 控制显示弹出
  const [id, setId] = useState('') // 对应的id
  /* 获取我的地址列表数据 */
  const getAddressList = (index: any, needresolve?: boolean) => {
    setLoading(true)
    showLoading()
    return new Promise((resolve, reject) => {
      const param: any = {
        current: `${pageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
      }
      const _index = String(index)
      // const fn: any = index === '0' ? getLogisticsMobileReceiverAddressPage : getLogisticsMobileShipperAddressPage
      // logistics/mobile/receiverAddress/list/default
      const fn: any =
        _index === '0'
          ? getLogisticsMobileReceiverAddressListDefault
          : // logistics/mobile/receiverAddress/list/default
          _index === '1'
          ? getLogisticsMobileShipperAddressListDefault
          : // /logistics/mobile/shipperAddress/list/default
            getOrderMobileCbgReceiverPickupList
      // /marketing/mobile/cbg/receiverPickup/list
      fn(param)
        .then((res: any) => {
          if (res.code === 1000) {
            let l
            if (_index === '2') {
              l = res.data.data
              setHasMore(list.length + l.length < res.data.totalCount)
            } else {
              l = res.data
              setHasMore(l.length < param.pageSize)
            }
            if (needresolve) {
              resolve(l)
            } else {
              setList(l)
            }
          } else {
            reject?.()
          }
          setLoading(false)
          hideLoading()
        })
        .catch(() => {
          reject?.()
        })
        .finally(() => {
          setLoading(false)
          hideLoading()
        })
    })
  }
  usePageInit()
  useEffect(() => {
    getAddressList(active)
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'mine.dizhiguanli',  defaultMessage: '地址管理' }) })
  }, [])

  /* 跳转页面 */
  const linkTo = (Id: string, index?: string) => {
    preload({
      id: Id,
      active,
      refresh: () => {
        pageRef.current = 1
        getAddressList(index)
      },
    })
    Router.navigateTo('basicSetting/addressAdd')
  }
  /* 删除 */
  const delItem = (delId: string) => {
    setToggle(true)
    setId(delId)
  }
  const delItem2 = (delId: string) => {
    setShowDeleteModal(true)
    setId(delId)
  }
  /* 删除接口 */
  const setConfirm = () => {
    const param: any = {
      id,
    }
    const fn: any =
      active === '0'
        ? postLogisticsMobileReceiverAddressDelete
        : active === '1'
        ? postLogisticsMobileShipperAddressDelete
        : getOrderMobileCbgReceiverPickupDelete
    fn(param).then((res: any) => {
      if (res.code === 1000) {
        setToggle(false)
        setShowDeleteModal(false)
        Toast.show({
          title: intl.formatMessage({
            id: 'mine.shanchuchenggong',
            defaultMessage: '删除成功',
          }),
        })
        getAddressList(active)
        if (confirmOrderStore.addressInfo?.id === Number(id)) {
          confirmOrderStore.setAddressInfo(null)
        }
        if (confirmOrderStore.selfPickupInfo?.id === Number(id)) {
          confirmOrderStore.setSelfPickupInfo(null)
        }
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
      }
    })
  }
  /* 数据存储 */
  const onAddressItem = (item: any) => {
    if (params.active && active !== params.active) {
      return
    }
    const fullAddress = combinationAddress([item.provinceName, item.cityName, item.districtName, item.address])
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
    const addAddressFlag = getStorageSync('addAddress')
    if (!params) {
      userStore.setAddressItem(item)
      confirmOrderStore.setAddressInfo(storeData)
      Router.navigateBack()
    } else if (params.addressList) {
      // 临时方案...
      ;(params.addressList as any)({
        ...item,
        fullAddress,
      })
      Router.navigateBack()
    } else if ('onSelect' in params) {
      params?.onSelect(storeData)
      Router.navigateBack()
    } else if ('handleSelectAddress' in params) {
      // EventChannel.emit('handleSelectAddress', item)
      // (params.handleSelectAddress as any)?.(item);
      if (active === '2') {
        confirmOrderStore.setSelfPickupInfo({
          id: item.id,
          name: item.name,
          phone: item.phone,
          isDefault: item.isDefault,
        })
      } else {
        confirmOrderStore.setAddressInfo(storeData)
      }
      Router.navigateBack()
    } else if (addAddressFlag == 1) {
      setStorageSync('addAddress', 0)
      confirmOrderStore.setAddressInfo(storeData)
      Router.navigateBack()
    } else {
      linkTo(item.id, active)
    }
  }
  const handleTabChange = (key: number) => {
    const index = key.toString()
    setList([])
    setActive(index)
    pageRef.current = 1
    getAddressList(index)
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
          customStyle={{
            width: '100%',
          }}
          options={[
            {
              text: intl.formatMessage({
                id: 'mine.options.shanchu',
                defaultMessage: '删除',
              }),
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
                    {intl.formatMessage({
                      id: 'mine.default',
                      defaultMessage: '默认',
                    })}
                  </Text>
                ) : (
                  <Text> </Text>
                )}
              </View>
              {item.provinceName && (
                <Text className={styles['address-list-item-text']}>
                  {item.provinceName + item.cityName + item.districtName + item.streetName}
                </Text>
              )}
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
  /* 自提管理 */
  const renderSelfPickup = ({ item }: { item: any }) => {
    return (
      <View className={styles['address-list']} key={String(item.id)}>
        <SwipeAction
          customStyle={{
            width: '100%',
          }}
          options={[
            {
              text: intl.formatMessage({
                id: 'mine.options.shanchu',
                defaultMessage: '删除',
              }),
              className: styles['delbtn'],
            },
          ]}
          onClick={() => delItem2(item.id)}
          maxDistance={97}
        >
          <View className={styles['address-list-item']}>
            <View className={styles['left']} onClick={() => onAddressItem(item)}>
              <View className={styles['box']}>
                <Text className={styles['box-name']}>{item.receiverName || item.name}</Text>
                {item.isDefault === 1 ? (
                  <Text className={styles['flag']}>
                    {intl.formatMessage({
                      id: 'mine.default',
                      defaultMessage: '默认',
                    })}
                  </Text>
                ) : (
                  <Text> </Text>
                )}
              </View>
              <Text className={styles['address-list-item-phone']}>{item.phone}</Text>
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
        tabList={[
          {
            title: intl.formatMessage({
              id: 'mine.shouhuodizhi',
              defaultMessage: '收货地址',
            }),
          },
          {
            title: intl.formatMessage({
              id: 'mine.fahuodizhi',
              defaultMessage: '发货地址',
            }),
          },
          {
            title: intl.formatMessage({
              id: 'mine.zitiguanli',
              defaultMessage: '自提管理',
            }),
          },
        ]}
        onClick={handleTabChange}
      >
        <TabsPane display current={Number(active)} index={0}>
          {list.length ? (
            <View className={styles['page']}>
              <ScrollView
                className={styles['main']}
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
                  getAddressList(0)
                }}
              />
            </View>
          ) : (
            <View className={styles['address-view']}>
              <EmptyLayout />
            </View>
          )}
        </TabsPane>
        <TabsPane display current={Number(active)} index={1}>
          {list.length ? (
            <View className={styles['page']}>
              <ScrollView
                className={styles['main']}
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
                  getAddressList(1)
                }}
              />
            </View>
          ) : (
            <View className={styles['address-view']}>
              <EmptyLayout />
            </View>
          )}
        </TabsPane>
        <TabsPane display current={Number(active)} index={2}>
          {list.length ? (
            <View className={styles['page']}>
              <ScrollView
                className={styles['main']}
                scrollY
                refresherEnabled
                data={list}
                renderItem={renderSelfPickup}
                horizontal={false}
                onEndReached={() => handleLoadMore()}
                onEndReachedThreshold={0.05}
                enableFlex
                lowerThreshold={1}
                onScrollToLower={handleLoadMore}
                refreshing={loading}
                onRefresh={() => {
                  pageRef.current = 1
                  getAddressList(2)
                }}
              />
            </View>
          ) : (
            <View className={styles['address-view']}>
              <EmptyLayout />
            </View>
          )}
        </TabsPane>
      </Tabs>

      <View className={styles['address-footer']}>
        <View
          onClick={() => {
            preload({
              active,
              refresh: () => {
                pageRef.current = 1
                getAddressList(active)
              },
            })
            Router.navigateTo('basicSetting/addressAdd')
          }}
          className={styles['address-add']}
        >
          <View className={styles['addicon']}>
            <Image className={styles['addicon-img']} src={addIcon} />
          </View>
          <Text className={styles['addtext']}>
            {active === '0'
              ? intl.formatMessage({
                  id: 'mine.xinzengshouhuodizhi',
                  defaultMessage: '新增收货地址',
                })
              : active === '1'
              ? intl.formatMessage({
                  id: 'mine.xinzengfahuodizhi',
                  defaultMessage: '新增发货地址',
                })
              : intl.formatMessage({
                  id: 'mine.xinzengdizhi',
                  defaultMessage: '新增地址',
                })}
          </Text>
        </View>
      </View>

      <Modal
        title={intl.formatMessage({
          id: 'mine.shifoushanchudizhi',
          defaultMessage: '是否删除地址？',
        })}
        isOpened={toggle}
        onConfirm={setConfirm}
        onCancel={() => {
          setToggle(false)
        }}
        cancelText={intl.formatMessage({
          id: 'mine.quxiao',
          defaultMessage: 'quxiao',
        })}
        confirmText={intl.formatMessage({
          id: 'mine.queren',
          defaultMessage: 'queren',
        })}
        className={styles['delete-model']}
      />

      <Modal isOpened={showDeleteModal} className={styles['delete-model']}>
        <View className={styles['delete-model-content']}>
          <View className={styles['delete-model-content-text']}>是否删除提货人信息？</View>
          <View className={styles['delete-model-content-buttons']}>
            <View
              className={cs(styles['delete-model-content-button'], styles.cancel)}
              onClick={() => {
                setShowDeleteModal(false)
              }}
            >
              取消
            </View>
            <View className={styles['delete-model-content-button']} onClick={setConfirm}>
              确定
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
export default GlobalWrapper(observer(AddressList))
