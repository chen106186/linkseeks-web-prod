import React, { useEffect, useState } from 'react'
import { View, Image, Text, Icons, Tabs, TabsPane } from '@apps/mobile-ui'
import cx from 'classnames'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import styles from './index.module.scss'
import { ScrollView } from '@tarojs/components'
import { getMemberMobileDepositPageConditions, getMemberMobileModityPageConditions } from '@apps/apis'
import { useDidShow } from '@apps/mobile-services/utils/taro'
import { getOssUrlPath } from '@apps/constants'

interface Iprops {
  userInfo: any
}
let timer
const Head = (props: Iprops) => {
  const {
    createStore: { clearStore },
  } = useStores()
  const { userInfo } = props
  const [tabCurrent, setTabCurrent] = useState<number>(0)
  const [cards, setCards] = useState<any>([])
  useDidShow(() => {
    console.log('hi')
  })
  const [tabList, setTabList] = useState([
    {
      status: 0,
      id: 0,
      title: '供应商',
      img: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/srm_0618_%E4%BE%9B%E5%BA%94%E5%95%86.png',
      children: [
        {
          id: 0,
          title: '供应商基础管理',
          showMore: true,
          children: [
            {
              id: 0,
              title: '供应商录入',
              route: 'supplierAbility/supplierImport/index',
            },
            {
              id: 1,
              title: '供应商查询',
              route: 'supplierAbility/supplierManagement/index',
            },
            {
              id: 2,
              title: '待分配供应商',
              route: 'supplierAbility/supplierAssigned/index',
            },
          ],
        },
        {
          id: 1,
          title: '供应商入库审核',
          showMore: true,
          children: [],
        },
        {
          id: 2,
          title: '供应商变更审核',
          showMore: true,
          children: [],
        },
      ],
    },
    {
      status: 1,
      id: 1,
      title: '采购',
      img: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/srm_0618_%E9%87%87%E8%B4%AD.png',
      children: [
        {
          id: 0,
          title: '请购单管理',
          showMore: true,
          children: [
            {
              id: 2,
              title: '请购单查询',
              route: 'requisition/requisitionList',
            },
            {
              id: 1,
              title: '新增请购单',
              route: 'requisition/requisitionCreate',
              params: {
                needReplace: true,
              },
              fn: clearStore,
            },
            {
              id: 3,
              title: '待审核请购单(一级)',
              route: 'requisition/requisitionAuditList',
              params: {
                _tabCurrent: 2,
                status: 2,
              },
            },
            {
              id: 4,
              title: '待审核请购单(二级)',
              route: 'requisition/requisitionAuditList',
              params: {
                _tabCurrent: 3,
                status: 4,
              },
            },
            {
              id: 5,
              title: '待提交请购单',
              route: 'requisition/requisitionAuditList',
              params: {
                _tabCurrent: 4,
                status: 6,
              },
            },
            {
              id: 6,
              title: '我的采购单',
              route: 'vendor/orderList',
            },
          ],
        },
      ],
    },
    {
      status: 2,
      id: 2,
      title: '物料',
      img: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/srm_0618_%E7%89%A9%E6%96%99.png',
      children: [
        {
          id: 0,
          title: '物料管理',
          showMore: true,
          children: [
            {
              id: 1,
              title: '物料查询',
              route: 'material/materialList',
            },
            {
              id: 2,
              title: '待审核物料(一级)',
              route: 'material/materialList',
              params: {
                type: 'audit',
                _tabCurrent: 2,
                status: 2,
              },
            },
            {
              id: 3,
              title: '待审核物料(二级)',
              route: 'material/materialList',
              params: {
                type: 'audit',
                _tabCurrent: 3,
                status: 4,
              },
            },
            {
              id: 4,
              title: '待审核物料变更(一级)',
              route: 'material/materialList',
              params: {
                type: 'auditChange',
                _tabCurrent: 2,
                status: 52,
              },
            },
            {
              id: 5,
              title: '待审核物料变更(二级)',
              route: 'material/materialList',
              params: {
                type: 'auditChange',
                _tabCurrent: 3,
                status: 54,
              },
            },
          ],
        },
      ],
    },
    {
      status: 3,
      id: 3,
      title: '合同',
      img: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/srm_0618_%E5%90%88%E5%90%8C.png',
      children: [
        {
          id: 1,
          title: '合同管理',
          showMore: true,
          children: [
            {
              id: 1,
              title: '合同查询',
              route: 'contract/list',
              params: {
                contractType: 'search',
                currentKey: 0,
                innerStatusKey: 0,
              },
            },
            // {
            //   id: 2,
            //   title: '合同创建审核',
            //   route: 'contract/list',
            //   params: {
            //     contractType: 'creatAll'
            //   }
            // },
            {
              id: 2,
              title: '待提交审核合同创建',
              route: 'contract/list',
              params: {
                contractType: 'creatAll',
                currentKey: 1,
                innerStatusKey: 2,
              },
            },
            {
              id: 3,
              title: '待审核合同创建（一级）',
              route: 'contract/list',
              params: {
                contractType: 'creatAll',
                currentKey: 2,
                innerStatusKey: 3,
              },
            },
            {
              id: 4,
              title: '待审核合同创建（二级）',
              route: 'contract/list',
              params: {
                contractType: 'creatAll',
                currentKey: 3,
                innerStatusKey: 4,
              },
            },
            {
              id: 5,
              title: '待确认合同创建',
              route: 'contract/list',
              params: {
                contractType: 'creatAll',
                currentKey: 4,
                innerStatusKey: 5,
              },
            },
            // {
            //   id: 3,
            //   title: '合同签订审核',
            //   route: 'contract/list',
            //   params: {
            //     contractType: 'signAll'
            //   }
            // },
            {
              id: 6,
              title: '待提交审核合同签订',
              route: 'contract/list',
              params: {
                contractType: 'signAll',
                currentKey: 1,
                innerStatusKey: 11,
              },
            },
            {
              id: 7,
              title: '待审核合同签订（一级）',
              route: 'contract/list',
              params: {
                contractType: 'signAll',
                currentKey: 2,
                innerStatusKey: 12,
              },
            },
            {
              id: 8,
              title: '待审核合同签订（二级）',
              route: 'contract/list',
              params: {
                contractType: 'signAll',
                currentKey: 3,
                innerStatusKey: 13,
              },
            },
            {
              id: 9,
              title: '待确认合同签订',
              route: 'contract/list',
              params: {
                contractType: 'signAll',
                currentKey: 4,
                innerStatusKey: 14,
              },
            },
          ],
        },
      ],
    },
    {
      status: 4,
      id: 4,
      title: '结算',
      img: 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/srm_0618_%E7%BB%93%E7%AE%97.png',
      children: [
        {
          id: 1,
          title: '结算管理',
          showMore: true,
          children: [
            {
              id: 1,
              title: '业务请款单查询',
              route: 'settlement/settlementList',
            },
            {
              id: 2,
              title: '待提交业务请款单',
              route: 'settlement/settlementList',
              params: {
                type: 'audit',
                _tabCurrent: 1,
                status: 12,
              },
            },
            {
              id: 3,
              title: '待审核请款单(一级)',
              route: 'settlement/settlementList',
              params: {
                type: 'audit',
                _tabCurrent: 2,
                status: 14,
              },
            },
            {
              id: 4,
              title: '待审核请款单(二级)',
              route: 'settlement/settlementList',
              params: {
                type: 'audit',
                _tabCurrent: 3,
                status: 16,
              },
            },
            {
              id: 5,
              title: '待提交请款单',
              route: 'settlement/settlementList',
              params: {
                type: 'audit',
                _tabCurrent: 4,
                status: 18,
              },
            },
          ],
        },
      ],
    },
  ])
  const onTabChange = (item: any) => {
    setTabCurrent(item.id)
    setCards(item.children)
  }
  const getRoutes = async () => {
    const fn = (data, rk) => {
      if (data.code === 1000) {
        return data.data.innerStatus?.map((item) => {
          return {
            id: item.code,
            title: item.msg,
            route: `supplierAbility/${rk ? 'supplierDeposits' : 'supplierModifies'}/index`,
            params: {
              innerStatus: item.code,
            },
          }
        })
      }
    }

    const Deposit = await getMemberMobileDepositPageConditions().then((res) => {
      return fn(res, true)
    })
    const Modity = await getMemberMobileModityPageConditions().then((res) => {
      return fn(res, false)
    })

    tabList[0].children[1].children = Deposit
    tabList[0].children[2].children = Modity
    setTabList([...tabList])
  }
  useEffect(() => {
    if (userInfo || timer) {
      getRoutes()
      setCards(tabList[0].children)
      clearTimeout(timer)
    }
  }, [userInfo])

  const jump = () => {
    if (userInfo) {
      Router.navigateTo('user/userInfo')
    } else {
      Router.navigateTo('root/login')
    }
  }
  /* 展开 */
  const handleOpen = (id: number) => {
    let _cards = cards
    _cards[id]['showMore'] = !_cards[id]?.['showMore']
    setCards([..._cards])
  }
  return (
    <View className={styles['container-Head']}>
      <View className={styles['userInfo']}>
        <View className={styles['userInfo-head']}>瓴犀SRM工作台</View>
        <View className={styles['userInfo-warp']} onClick={() => jump()}>
          <Image
            className={styles['avatar']}
            src={userInfo?.logo || getOssUrlPath('/irregular/default_logod2352e564b114944b0be2dcdaade9816.png')}
          />
          <View>
            <View className={styles['name']}>
              {userInfo?.userName ? `Hi，${userInfo?.userName}` : '请登录'}
              <Icons name="ChevronRight" className={styles['Iocn']} size={12} />
            </View>
            <View className={styles['account']}>{userInfo?.account}</View>
          </View>
        </View>
      </View>
      <View style={{ display: 'flex' }}>
        <View className={styles['list_tabs']}>
          {tabList.map((item) => (
            <View style={{ background: item.id === tabCurrent ? '#fff' : '#F5F6F7' }} key={item.id}>
              <View
                className={cx(
                  styles['list_tabs-title'],
                  item.id === tabCurrent && styles['list_tabs-title_actuve'],
                  item.id === tabCurrent - 1 && styles['list_tabs-title_actuve-1'],
                  item.id === tabCurrent + 1 && styles['list_tabs-title_actuve_1'],
                )}
                onClick={() => onTabChange(item)}
              >
                <View style={{ fontSize: 0 }}>
                  <Image src={item.img} className={styles['list_tabs-title-img']} />
                </View>
                <View className={styles['list_tabs-title-text']}>
                  <Text>{item.title}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* 路由卡片 */}
        <ScrollView className={styles['list_']} scrollY>
          {cards.map((item) => (
            <View key={item.id} className={styles['list_card']}>
              <View className={styles['list_card-title']}>
                <Text className={styles['list_card-title-text']}>{item.title}</Text>
                <View
                  className={styles['materialItem-tips-operation']}
                  onClick={() => {
                    handleOpen(item.id)
                  }}
                >
                  <Icons name={item?.showMore ? 'ChevronUp' : 'ChevronDown'} size={14} color="#91959B" />
                </View>
              </View>
              {item?.showMore && (
                <View className={styles['list_card-body']}>
                  {item.children.map((val: any) => (
                    <View
                      key={val.id}
                      className={styles['list_card-body-item']}
                      onClick={() => {
                        val.fn && val.fn()
                        Router.navigateTo(val.route, val.params)
                      }}
                    >
                      {val.title}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
Head.defaultProps = {}
export default Head
