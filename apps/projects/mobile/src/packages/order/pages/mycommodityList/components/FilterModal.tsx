import React, { useState, useEffect } from 'react'
import { View, Image, ScrollView, Text, Icons } from '@apps/mobile-ui'
import cx from 'classnames'
import Router from '@/utils/router'
import { getMenuButtonBoundingClientRect, pxTransform } from '@apps/mobile-services/utils/taro'
import Header from '@/components/NavBar'
import Search from '@/components/Search'
import { useStatusBarHeight } from '@apps/mobile-services'
import { getOssUrlPath } from '@apps/constants'
import { useIntl } from '@linkseeks/i18n'
import { THEME_COLORS } from '@/constants/theme'
import styles from './index.module.scss'

const choice = getOssUrlPath('/miniprogram/assets/images/choice.png')

interface FilterModalProps {
  // 显示控制
  visible?: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any) => void
  externalState: Array<any>
  internalState: Array<any>
  orderType: Array<any>
  /**
   * 搜索值，临时解决方案
   */
  searchValue?: string
}
const FilterModal = (props: FilterModalProps) => {
  const { visible, onClose, onSelect, externalState, internalState, orderType, searchValue } = props
  const [keyword, setKeyword] = useState<string>('')
  const [list, setlist] = useState<any>([])
  const [more, setmore] = useState(false)
  const [checkRadio, setCheckRadio] = useState<{ [key: string]: any }>({
    outerStatus: '',
    innerStatus: '',
    orderType: '',
    keyword: '',
    startDate: '',
    endDate: '',
    dateId: '',
    // list: [],
  })
  const intl = useIntl()

  useEffect(() => {
    if ('searchValue' in props && searchValue !== keyword) {
      setKeyword(searchValue || '')
    }
  }, [searchValue])

  const getPreMonth = (number: any) => {
    const time30 = 2592000000 // 30天的时间戳
    const newTime = new Date().getTime()
    const lastTime = time30 * number
    const initTime = newTime - lastTime
    const newData = new Date(initTime)
    const Y = newData.getFullYear()
    let M: any = newData.getMonth() + 1
    let D: any = newData.getDate()
    if (M < 10) {
      M = `0${String(M)}`
    }
    if (D < 10) {
      D = `0${String(D)}`
    }
    return `${Y}-${M}-${D}`
  }

  /* 获取当前时间 */
  const starttime = () => {
    const date = new Date()
    const Y = date.getFullYear()
    let M: any = date.getMonth() + 1
    let D: any = date.getDate()
    if (M < 10) {
      M = `0${String(M)}`
    }
    if (D < 10) {
      D = `0${String(D)}`
    }
    return `${Y}-${M}-${D}`
  }
  const handleState = (name: string, key: any) => {
    const state = { ...checkRadio }
    if (name === 'outerStatus') {
      state.outerStatus = key
    } else if (name === 'innerStatus') {
      state.innerStatus = key
    } else if (name === 'orderType') {
      state.orderType = key
    } else if (name === 'dateId') {
      state.startDate = key.endtime
      state.endDate = key.starttime
      state.dateId = key.id
    }
    setCheckRadio(state)
  }
  const handleSubmit = (flag: boolean) => {
    console.log(flag)
    if (flag) {
      // setCheckRadio(state);
      const state: any = { ...checkRadio, keyword }
      console.log(state, '请求参数是什么')
      // return;
      setmore(false)
      onSelect && onSelect(state)
      onClose && onClose()
    } else {
      let data = {
        outerStatus: '',
        innerStatus: '',
        orderType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        dateId: '',
      }
      setCheckRadio({
        outerStatus: '',
        innerStatus: '',
        orderType: '',
        keyword: '',
        startDate: '',
        endDate: '',
        dateId: '',
      })
      setKeyword('')
      onSelect && onSelect(data)
      onClose && onClose()
    }
  }
  useEffect(() => {
    const start = starttime()
    const arr = [
      {
        name: intl.formatMessage({ id: 'order.yigeyuenei', defaultMessage: '一个月内' }),
        starttime: start,
        endtime: getPreMonth(1),
        id: 1,
      },
      {
        name: intl.formatMessage({ id: 'order.sangeyuenei', defaultMessage: '三个月内' }),
        starttime: start,
        endtime: getPreMonth(3),
        id: 2,
      },
      {
        name: intl.formatMessage({ id: 'order.6geyuenei', defaultMessage: '6个月内' }),
        starttime: start,
        endtime: getPreMonth(6),
        id: 3,
      },
      {
        name: `${getPreMonth(12).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(12).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(12).substring(0, 4)}-01-01`,
        id: 4,
      },
      {
        name: `${getPreMonth(24).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(24).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(24).substring(0, 4)}-01-01`,
        id: 5,
      },
      {
        name: `${getPreMonth(36).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(36).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(36).substring(0, 4)}-01-01`,
        id: 6,
      },
      {
        name: `${getPreMonth(48).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(48).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(48).substring(0, 4)}-01-01`,
        id: 7,
      },
      {
        name: `${getPreMonth(60).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(60).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(60).substring(0, 4)}-01-01`,
        id: 8,
      },
      {
        name: `${getPreMonth(72).substring(0, 4)}${intl.formatMessage({ id: 'order.nian', defaultMessage: '年' })}`,
        starttime: `${getPreMonth(72).substring(0, 4)}-12-30`,
        endtime: `${getPreMonth(72).substring(0, 4)}-01-01`,
        id: 9,
      },
    ]
    setlist(arr)
    console.log(arr)
  }, [])
  const handleSearchSubmit = (value: string) => {
    // changeSearchKeyword(value || "")
  }
  // onClick={handleSelect}
  const [menuRect, setMenuRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  })
  const getMenuRect = () => {
    const res = getMenuButtonBoundingClientRect()
    setMenuRect(res)
  }

  useEffect(() => {
    getMenuRect()
  }, [])
  const { statusBarHeight } = useStatusBarHeight()
  const navHeight = statusBarHeight + menuRect.height + (menuRect.top - statusBarHeight) * 2
  return (
    <View>
      {visible && (
        <View
          className={cx(styles['ap'], visible ? styles['ap--active'] : '')}
          style={{ marginTop: pxTransform(navHeight) }}
        >
          <Header
            title={
              <Text
                style={{ lineHeight: pxTransform(60), fontSize: pxTransform(14), textAlign: 'center', color: '#000' }}
              >
                {intl.formatMessage({ id: 'order.wodedingdan', defaultMessage: '我的订单' })}
              </Text>
            }
            customRenderLeft={
              <View style={{ flex: 2 }}>
                <Icons
                  name="ChevronLeft"
                  size={24}
                  color="#000"
                  onClick={() => Router.reLaunch('extra/mine', { hasTab: 'true' })}
                />
              </View>
            }
          />
          <View
            className={cx(styles['ap-seat'], visible ? styles['ap-seat--active'] : '')}
            onClick={() => {
              onClose && onClose()
            }}
          ></View>
          <View className={cx(styles['ap-container'], styles['position'], visible ? styles['container--active'] : '')}>
            <View className={styles['page-wrap-Search']}>
              <Search
                value={keyword}
                placeholder={intl.formatMessage({
                  id: 'order.shangpinmingchenggongyingshang',
                  defaultMessage: '商品名称/供应商/订单编号',
                })}
                onChange={(value) => setKeyword(value)}
                onClear={handleSearchSubmit}
                onSearch={handleSearchSubmit}
                customClassName={styles['page-wrap-Search-key']}
                innerBackground={THEME_COLORS.surface}
                shape="round"
                clearable
                showAction
                customAction={
                  <View
                    className={styles['page-wrap-Search-button']}
                    onClick={() => {
                      handleSearchSubmit(keyword)
                    }}
                  >
                    {intl.formatMessage({
                      id: 'order.sousuo',
                      defaultMessage: '搜索',
                    })}
                  </View>
                }
              />
              <Image style={{ width: pxTransform(18), height: pxTransform(18) }} src={choice} />
            </View>
            <ScrollView style={{ height: pxTransform(300) }}>
              <View className={styles['radioBox']}>
                <View className={styles['title']}>
                  {intl.formatMessage({ id: 'order.anshijian', defaultMessage: '按时间' })}
                </View>
                <View className={styles['radioBoxCon']}>
                  {list.map((item: any) => (
                    <View
                      className={checkRadio.dateId === item.id ? styles['radioActive'] : styles['radioBoxCon-radio']}
                      key={item.id}
                      onClick={() => handleState('dateId', item)}
                    >
                      {item.name}
                    </View>
                  ))}
                </View>
                {more ? (
                  <>
                    <View className={styles['title']}>
                      {intl.formatMessage({ id: 'order.waibuzhuangtai', defaultMessage: '外部状态' })}
                    </View>
                    <View className={styles['radioBoxCon']}>
                      {externalState.map((item: any) => (
                        <View
                          className={
                            checkRadio.outerStatus === item.id ? styles['radioActive'] : styles['radioBoxCon-radio']
                          }
                          key={item.id}
                          onClick={() => handleState('outerStatus', item.id)}
                        >
                          {item.text}
                        </View>
                      ))}
                    </View>
                    <View className={styles['title']}>
                      {intl.formatMessage({ id: 'order.dingdanleixing', defaultMessage: '订单类型' })}
                    </View>
                    <View className={styles['radioBoxCon']}>
                      {orderType.map((item: any) => (
                        <View
                          className={
                            checkRadio.orderType === item.id ? styles['radioActive'] : styles['radioBoxCon-radio']
                          }
                          key={item.id}
                          onClick={() => handleState('orderType', item.id)}
                        >
                          {item.text}
                        </View>
                      ))}
                    </View>
                    <View className={styles['title']}>
                      {intl.formatMessage({ id: 'order.neibuzhuangtai', defaultMessage: '内部状态' })}
                    </View>
                    <View className={styles['radioBoxCon']}>
                      {internalState.map((item: any) => (
                        <View
                          className={
                            checkRadio.innerStatus === item.id ? styles['radioActive'] : styles['radioBoxCon-radio']
                          }
                          key={item.id}
                          onClick={() => handleState('innerStatus', item.id)}
                        >
                          {item.text}
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <View className={styles['more']} onClick={() => setmore(true)}>
                    {intl.formatMessage({
                      id: 'order.dianjizhakangengduoshaixuan',
                      defaultMessage: '点击查看更多筛选',
                    })}
                  </View>
                )}
              </View>
            </ScrollView>
            {/* onClick={()} */}
            <View className={styles['FilterModalfoot']}>
              <View className={styles['filterBtn']} onClick={() => handleSubmit(false)}>
                {intl.formatMessage({ id: 'order.zhongzhi', defaultMessage: '重置' })}
              </View>
              <View className={styles['filterText']} onClick={() => handleSubmit(true)}>
                {intl.formatMessage({ id: 'order.queding', defaultMessage: '确定' })}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
export default FilterModal
