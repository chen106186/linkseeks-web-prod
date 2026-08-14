import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Tabs, TabsPane, View } from '@apps/mobile-ui'
import AutoComplete from '@/components/NavBar'
import Search from '@/components/Search'
import Router from '@/utils/router'
import MallTabBottom from '@/components/MallTabBottom'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import ClassifyTab from './components/classifyTab'
import BrandList from './components/brandList'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const ClassifyView: React.FC<{}> = () => {
  const [current, setCurrent] = useState<number>(0)
  const $router = getCurrentInstance()
  const { hasTab, layoutType, categoryId, showBack = false } = $router.router?.params || {}
  const intl = useIntl()
  usePageInit()
  const handleTabsClick = (e) => {
    setCurrent(e)
  }
  return (
    <MallTabBottom layoutType={layoutType as LAYOUT_TYPE} visible={hasTab === 'true'} activeUrl="extra/classify">
      <View className={styles['classify-container']}>
        <AutoComplete
          title={
            <Search
              placeholder={intl.formatMessage({
                id: 'classify_header_search_placeholder',
              })}
              background="#FDF9F5"
              innerBackground="#FCF7F1"
              editable={false}
              onClick={() =>
                Router.navigateTo('extra/search', {
                  type: 1,
                })
              }
            />
          }
          showBack={showBack as boolean}
          greedy
        />
        <Tabs
          current={current}
          tabList={[
            {
              title: intl.formatMessage({
                id: 'classify_tab_title_category',
              }),
            },
            // {
            //   title: intl.formatMessage({
            //     id: 'classify_tab_title_brand',
            //   }),
            // },
          ]}
          onClick={handleTabsClick}
          height="100%"
        >
          <TabsPane current={current} index={0}>
            <ClassifyTab categoryId={categoryId} />
          </TabsPane>
          <TabsPane current={current} index={1}>
            <BrandList />
          </TabsPane>
        </Tabs>
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(ClassifyView)
