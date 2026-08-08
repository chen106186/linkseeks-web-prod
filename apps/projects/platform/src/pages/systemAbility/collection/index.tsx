import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { useQuery } from '@linkseeks/router-core'
import Commodity from './commodity/view'
import Information from './information/view'
import Shops from './shops/view'
import Purchase from './purchase/view'
import Logistics from './logistics/view'
import Process from './process/view'
import { Tabs } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

const { TabPane } = Tabs

interface CollectionPropsType {
  location: any
}

const Collection: React.FC<CollectionPropsType> = (props) => {
  const intl = useIntl()
  const { type } = useQuery()
  const [tabKey, setTabKey] = useState<string>('commodity')

  useEffect(() => {
    if (type) {
      setTabKey(type)
    }
  }, [type])

  const handleChange = (key) => {
    setTabKey(key)
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.collection_wrap}>
        <Tabs activeKey={tabKey} className={styles.collection_tabs} onChange={handleChange}>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.commodityCollection' })} key="commodity">
            <Commodity />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.shopCollection' })} key="shops">
            <Shops />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.newsCollection' })} key="information">
            <Information />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.doorCollection' })} key="srm">
            <Purchase />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.logisticsCollection' })} key="logistics">
            <Logistics />
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'systemSetting.collection.processorCollection' })} key="manufacture">
            <Process />
          </TabPane>
        </Tabs>
      </div>
    </PageHeaderWrapper>
  )
}

export default Collection
