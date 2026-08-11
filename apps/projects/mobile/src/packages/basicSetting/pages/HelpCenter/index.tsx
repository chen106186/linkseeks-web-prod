import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import cx from 'classnames'
import Router from '@/utils/router'
import { View, Text, Icons } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { getCommodityShopHelpInfoHelpInfoEnable, getCommodityShopHelpInfoTree } from '@apps/apis'
import styles from './index.module.scss'
import { ScrollView } from '@tarojs/components'
import { useMobileIntl } from '@apps/locales'
interface HelpType {
  id: string
  parentId: string
  name: string
  checked: boolean
  sort: number
  type: null
  skipUrl: null
  children: HelpType[]
}
const HelpCenter: React.FC<any> = () => {
  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const translate = useMobileIntl()
  const [helpListData, setHelpListData] = useState<HelpType[]>([])
  // 索引
  const [activeTab, setActiveTab] = useState<number>(0)
  const getHelpInfoEnable = () => {
    getCommodityShopHelpInfoHelpInfoEnable({
      shopId: String(shopAndSite?.id),
    }).then((res) => {
      if (res.code === 1000) {
        if (Boolean(res.data)) {
          getCommodityShopHelpInfoTree({
            shopId: String(shopAndSite?.id),
          }).then((res) => {
            if (res.data && res.data.length > 0) {
              setHelpListData(res.data.sort((a, b) => a.sort - b.sort))
            }
          })
        }
      }
    })
  }
  useEffect(() => {
    getHelpInfoEnable()
  }, [])
  const skipDetails = (id) => {
    Router.navigateTo('basicSetting/HelpCenter/details', {
      id,
    })
  }
  return (
    <View className={styles['help_center_box']}>
      <View className={styles['help_greet']}>
        <View className={styles['greet_text']}>{`hello${userInfo ? `,${userInfo?.memberName} ` : ''}`}</View>
        <View className={styles['introduce']}>
          <Text className={styles['introduce_text']}>
            {translate('mobile.resource.basicSetting.woshinidezhuangshukefu')}
          </Text>
          <View className={styles['introduce_icon']}>
            <Icons name="ChevronRight" size={12} color="#C45124" />
          </View>
        </View>
      </View>
      <View className={styles['help_tabs_box']}>
        <ScrollView scrollX className={styles['help_tabs_scrollview']}>
          <View className={styles['help_tabs']}>
            {helpListData.map((menu, index) => (
              <View
                className={cx(styles['help_tab'], activeTab === index ? styles['active_help_tab'] : '')}
                key={menu.id}
                onClick={() => setActiveTab(index)}
              >
                {menu.name}
              </View>
            ))}
          </View>
        </ScrollView>
        <View className={styles['help_list']}>
          {helpListData[activeTab] &&
            helpListData[activeTab].children &&
            helpListData[activeTab].children.length > 0 &&
            helpListData[activeTab].children.map((v) => (
              <View className={styles['help_list_item']} key={v.id} onClick={() => skipDetails(v.id)}>
                <Text className={styles['help_list_item_text']}>{v.name}</Text>
                <Icons name="ChevronRight" size={16} color="#303133" />
              </View>
            ))}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(HelpCenter))
