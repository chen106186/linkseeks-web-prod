import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { View, Text, Image, Toast, ScrollView, Checkbox, SwipeAction } from '@apps/mobile-ui'
import { pxTransform, setNavigationBarTitle, showModal } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import Loading from '@/components/Loading'
import useStores from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import {
  getProductMobileShopBrowseRecordGetBrowseRecordList,
  GetProductMobileShopBrowseRecordGetBrowseRecordListResponse,
  postProductMobileShopBrowseRecordClearBrowseRecord,
  postProductMobileShopBrowseRecordDeleteBrowseRecord,
} from '@apps/apis'
import FootContent from './FootContent'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const empty = getOssUrlPath('/miniprogram/assets/images/empty.png')
const Footprint = () => {
  const {
    userStore: { userInfo },
  } = useStores()
  const [isEsit, setIsEsit] = useState(false)
  const [loaded] = useState(false)
  const [hasMore] = useState(true)
  const [footMessage, setFootMessage] = useState<any>({})
  const [current, setCurrent] = useState(1)
  const [selectIdArr, setSelectIdArr] = useState<any>([])
  const [allSelectId, setAllSelectId] = useState<any>([])
  const [dataList, setDataList] = useState<GetProductMobileShopBrowseRecordGetBrowseRecordListResponse[]>([])
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'address.footprint.navigationBarTitleText', defaultMessage: '我的足迹' }),
    // })
  }, [])
  const fnResetTimeArr = (printArr: any[]) => {
    const obj: any = {}
    const allId: number[] = []
    let _dataList
    if (current === 1) {
      _dataList = printArr
    } else {
      _dataList = [...dataList, ...printArr]
    }
    setDataList(_dataList)
    _dataList.forEach((item: { createTime: string; id: number }) => {
      const objKey = dateFormat(new Date(item.createTime), 'MM-DD')
      if (obj[objKey]) {
        obj[objKey].push(item)
      } else {
        obj[objKey] = [item]
      }
      allId.push(item.id)
    })
    setAllSelectId([...allId])
    setFootMessage(obj)
  }
  /**
   * 获取足迹
   */
  const fnGetFootPrint = async () => {
    const param: any = {
      current,
      pageSize: 10,
    }
    const { data } = await getProductMobileShopBrowseRecordGetBrowseRecordList(param)
    console.log(data)
    fnResetTimeArr(data.data)
  }

  /**
   * 下拉刷新
   */
  const handleLoadMore = () => {
    setCurrent(current + 1)
    // fnGetFootPrint();
  }
  /**
   * @returns 跳转商品页面
   */
  const handleJump = () => {
    if (!userInfo) {
      Router.navigateTo('user/login', {
        refresh: () => {
          fnGetFootPrint()
        },
      })
      return
    }
    Router.navigateTo('commodityMerge/stocksSourcing/index')
  }
  /**
   * @returns 空白的domm
   */
  const renderEmpty = () => (
    <View className={cx(styles['footproint-page-empty'], styles['footproint-page-section'])}>
      {/* <Text>{loading ? "正在加载..." : "您还未添加商品进入进货单"}</Text> */}
      <Image
        src={empty}
        style={{
          width: pxTransform(160),
          height: pxTransform(120),
        }}
      />
      <Text className={styles['footproint-page-emptyText']}>
        {!userInfo
          ? intl.formatMessage({
              id: 'address.footprint.tip.noLogin',
            })
          : intl.formatMessage({
              id: 'address.footprint.tip.noRead',
            })}
      </Text>
      <View className={styles['footproint-page-btn']} onClick={handleJump}>
        <Text className={styles['footproint-page-btnText']}>
          {!userInfo
            ? intl.formatMessage({
                id: 'address.footprint.tip.toLogin',
              })
            : intl.formatMessage({
                id: 'address.footprint.tip.toBuy',
              })}
        </Text>
      </View>
    </View>
  )
  const fnChangeSelect = (thisId: number) => {
    console.log(thisId)
    const thisIndex = selectIdArr.indexOf(thisId)
    if (thisIndex > -1) {
      selectIdArr.splice(thisIndex, 1)
    } else {
      selectIdArr.push(thisId)
    }
    setSelectIdArr([...selectIdArr])
  }
  /**
   * 删除浏览记录
   */
  const fnDelectHistory = (thisId?: number) => {
    const obj: any = {
      idList: [thisId],
    }
    if (!thisId) {
      obj.idList = selectIdArr
    }
    if (obj.idList.length === 0) {
      Toast.show({
        title: intl.formatMessage({
          id: 'address.footprint.delete.select',
        }),
        icon: 'none',
      })
    } else {
      postProductMobileShopBrowseRecordDeleteBrowseRecord(obj).then(() => {
        Toast.show({
          title: intl.formatMessage({
            id: 'address.footprint.delete.success',
          }),
        })
        setSelectIdArr([])
        setIsEsit(false)
        if (current === 1) {
          fnGetFootPrint()
        } else {
          setCurrent(1)
        }
      })
    }
  }
  /**
   * 清空所有
   */
  const handleConfirm = () => {
    showModal({
      title: '',
      content: intl.formatMessage({
        id: 'address.footprint.clear.confirm',
      }),
      confirmText: intl.formatMessage({
        id: 'address.confirm.modal.btn.confirm',
      }),
      cancelText: intl.formatMessage({
        id: 'address.confirm.modal.btn.cancel',
      }),
      success: (res) =>
        new Promise<void>((resolve) => {
          if (res.confirm) {
            postProductMobileShopBrowseRecordClearBrowseRecord().then(() => {
              Toast.show({
                title: intl.formatMessage({
                  id: 'address.footprint.clear.success',
                }),
              })
              // setSelectIdArr([]);
              setIsEsit(false)
              fnGetFootPrint()
              resolve()
            })
          }
        }),
    })
  }
  /**
   * 选择全部
   */
  const fnSelectAll = () => {
    // selectIdArr allSelectId
    if (selectIdArr.length !== allSelectId.length) {
      setSelectIdArr([...allSelectId])
    } else {
      setSelectIdArr([])
    }
  }
  useEffect(() => {
    fnGetFootPrint()
  }, [current])
  /**
   * @returns 返回数据dom
   */
  const renderItem = (newMessage: any) => {
    const { item } = newMessage
    return (
      <View className={styles['footproint-page-contentMain']}>
        <Text className={styles['footproint-page-time']}>{item}</Text>
        {footMessage[item].map((thisItem: any) => {
          return (
            <View key={thisItem.id} className={styles['footproint-page-contentBody']}>
              <SwipeAction
                customStyle={{
                  width: '100%',
                }}
                options={[
                  {
                    text: intl.formatMessage({
                      id: 'address.footprint.delete.btn',
                      defaultMessage: '删除',
                    }),
                    className: styles['footproint-page-slipBox'],
                  },
                ]}
                onClick={() => fnDelectHistory(thisItem.id)}
                maxDistance={72}
              >
                <View className={styles['footproint-page-contentItem']}>
                  <FootContent
                    commodityName={thisItem.commodityName}
                    mainPic={thisItem.mainPic}
                    sold={thisItem.sold}
                    unitName={thisItem.unitName}
                    minPrice={thisItem.min}
                    id={thisItem.commodityId}
                    isPublish={thisItem.isPublish}
                    priceType={thisItem.priceType}
                  />
                </View>
              </SwipeAction>
            </View>
          )
        })}
      </View>
    )
  }
  return (
    <View className={styles['footproint-page-page']}>
      <View className={styles['footproint-page-pageMain']}>
        {Object.keys(footMessage).length > 0 ? (
          <View className={styles['footproint-page-pageEdit']}>
            {!isEsit ? (
              <Text
                onClick={() => {
                  setIsEsit(!isEsit)
                }}
              >
                {intl.formatMessage({
                  id: 'address.footprint.delete.edit',
                  defaultMessage: '编辑',
                })}
              </Text>
            ) : (
              <View>
                <Text
                  style={{
                    marginRight: pxTransform(8),
                  }}
                  onClick={() => handleConfirm()}
                >
                  {intl.formatMessage({
                    id: 'address.footprint.delete.clear',
                    defaultMessage: '清空',
                  })}
                </Text>
                <Text
                  onClick={() => {
                    setIsEsit(!isEsit)
                  }}
                >
                  {intl.formatMessage({
                    id: 'address.footprint.delete.finish',
                    defaultMessage: '完成',
                  })}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View />
        )}
        {!isEsit ? (
          <ScrollView
            className={styles['footproint-page-Main']}
            data={Object.keys(footMessage)}
            scrollY
            renderItem={renderItem}
            // scrollEventThrottle={16}
            horizontal={false}
            listFooterComponent={<Loading loading={loaded} noMore={!hasMore} />}
            onEndReached={() => handleLoadMore()}
            // showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.05}
          />
        ) : (
          <ScrollView scrollY className={styles['footproint-page-Main']}>
            {Object.keys(footMessage).map((keyName: any, index: number) => {
              return (
                <View className={styles['footproint-page-scrollMain']} key={`${keyName}_${index}`}>
                  <Text className={styles['footproint-page-time']}>{keyName}</Text>
                  {footMessage[keyName].map((item: any) => (
                    <View
                      className={cx(styles['footproint-page-contentItem'], styles['footproint-page-contentBody'])}
                      key={item.id}
                    >
                      <View className={styles['footproint-page-iconWarp']}>
                        <Checkbox
                          checked={selectIdArr.indexOf(item.id) > -1}
                          onChange={() => {
                            fnChangeSelect(item.id)
                          }}
                        />
                      </View>
                      <View className={styles['footproint-page-footWarp']}>
                        <FootContent
                          commodityName={item.commodityName}
                          mainPic={item.mainPic}
                          sold={item.sold}
                          unitName={item.unitName}
                          minPrice={item.min}
                          id={item.commodityId}
                          isPublish={item.isPublish}
                          priceType={item.priceType}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )
            })}
            <View
              style={{
                height: pxTransform(60),
              }}
            />
          </ScrollView>
        )}
        {Object.keys(footMessage).length === 0 && <View onClick={fnGetFootPrint}>{renderEmpty()}</View>}
      </View>
      {isEsit && (
        <View className={styles['footproint-page-bottomContainer']}>
          <View className={styles['footproint-page-allSelectView']}>
            <View>
              <Checkbox
                checked={allSelectId.length === selectIdArr.length}
                onChange={() => {
                  fnSelectAll()
                }}
              />
            </View>
            <Text className={styles['footproint-page-allSelectText']}>
              {intl.formatMessage({
                id: 'address.footprint.delete.allCheck',
                defaultMessage: '全选',
              })}
            </Text>
          </View>
          <View
            className={styles['footproint-page-delectBtn']}
            onClick={() => {
              fnDelectHistory()
            }}
          >
            <Text className={styles['footproint-page-delectBtnText']}>
              {intl.formatMessage({
                id: 'address.footprint.delete.btn',
                defaultMessage: '删除',
              })}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
export default GlobalWrapper(Footprint)
