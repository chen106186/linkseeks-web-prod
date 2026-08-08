import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { ScrollView } from '@tarojs/components'
import { View, Text } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import Newstab from '../../components/newsTab/index'
import Header from '@/components/NavBar'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { getCommodityMobileShopMobileCheckShopMemberOperate } from '@apps/apis'
import { getManageMobileCategoryMobileAll, getManageMobileMemberCategoryMobileAll } from '@apps/apis'
import styles from './index.module.scss'
export interface ClassifyItem {
  /**
   * 分类描述
   */
  describe: string
  /**
   * 是否推荐：0.否；1.是；
   */
  status: number
  /**
   * 级别
   */
  level: number
  /**
   * 名称
   */
  name: string
  /**
   * 父id
   */
  parentId: number
  /**
   * 第一级id（冗余字段。给第三级分类使用，第一二级没用。
   */
  firstId: number
  /**
   * 下级
   */
  list?: ClassifyItem[]
}
const ClassifyTab = () => {
  const {
    userStore: { shopAndSite },
  } = useStores()
  const intl = useIntl()
  const [dataSource, setDataSource] = useState<ClassifyItem[]>([])
  const [currentNav, setCurrentNav] = useState<any>({})
  const getClassifyTab = async () => {
    let fn: any
    const resj = await getCommodityMobileShopMobileCheckShopMemberOperate({
      shopId: shopAndSite?.id,
    })
    if (resj.data === 1) {
      // /manage/mobile/memberCategoryMobile/all
      fn = getManageMobileMemberCategoryMobileAll
    } else {
      fn = getManageMobileCategoryMobileAll
    }
    fn({
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
    }).then((res: any) => {
      const { code } = res
      if (code === 1000 && res.data && res.data.length > 0) {
        setDataSource(res.data)
        setCurrentNav(res.data[0])
      }
    })
  }
  const getData = async () => {
    getClassifyTab()
  }
  useEffect(() => {
    getData()
  }, [])
  const handleSelectNav = (record: ClassifyItem) => {
    setCurrentNav(record)
  }
  return (
    <Newstab mySel="newsClassify">
      <Header
        title={
          <Text
            style={{
              lineHeight: pxTransform(60),
              fontSize: pxTransform(14),
              textAlign: 'center',
            }}
          >
            {intl.formatMessage({
              id: 'companyNews.hangqingzixunfen',
              defaultMessage: '行情资讯分类',
            })}
          </Text>
        }
        customRenderLeft={
          <View
            style={{
              flex: 2,
            }}
          ></View>
        }
      />
      <View className={styles['nav-wrap']}>
        <View className={styles['tab']}>
          <ScrollView className={styles['tab-nav-wrap']}>
            <View className={styles['tab-nav']}>
              {dataSource.map((item: any) => (
                <View
                  key={item.id}
                  className={cx(
                    styles['tab-nav-item'],
                    currentNav.id === item.id ? styles['tab-nav-item__active'] : undefined,
                  )}
                  onClick={() => handleSelectNav(item)}
                >
                  <View
                    className={cx(
                      styles['tab-nav-item-text-wrap'],
                      currentNav.id === item.id ? styles['tab-nav-item-text-wrap__active'] : undefined,
                    )}
                  >
                    <Text
                      className={cx(
                        styles['tab-nav-item-text'],
                        currentNav.id === item.id ? styles['tab-nav-item-text__active'] : undefined,
                      )}
                    >
                      {item.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <ScrollView className={styles['tab-menu-wrap']}>
            {currentNav.recommendList ? (
              <View className={styles['tab-menu']}>
                <View className={styles['recommend']}>
                  <Text className={styles['recommend-title']}>
                    {intl.formatMessage({
                      id: 'companyNews.remenfenlei',
                      defaultMessage: '热门分类',
                    })}
                  </Text>
                </View>
                <View className={styles['recommend-tag']}>
                  {currentNav.recommendList &&
                    currentNav.recommendList.map((item: any) => (
                      <View
                        className={styles['recommend-tag-item']}
                        onClick={() =>
                          Router.navigateTo('companyNews/newsSearchList', {
                            thirdlyCategoryId: item.id,
                          })
                        }
                      >
                        <Text>{item.name}</Text>
                      </View>
                    ))}
                </View>
              </View>
            ) : (
              <></>
            )}
            {currentNav.list &&
              currentNav.list.map((item: ClassifyItem) => (
                <View className={styles['tab-menu']}>
                  <View className={styles['recommend']}>
                    <Text className={styles['recommend-title']}>{item.name}</Text>
                  </View>
                  <View className={styles['recommend-tag']}>
                    {item.list &&
                      item.list.map((items: any) => (
                        <View
                          className={styles['recommend-tag-item']}
                          onClick={() =>
                            Router.navigateTo('companyNews/newsSearchList', {
                              thirdlyCategoryId: items.id,
                            })
                          }
                        >
                          <Text>{items.name}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </Newstab>
  )
}
export default GlobalWrapper(ClassifyTab)
