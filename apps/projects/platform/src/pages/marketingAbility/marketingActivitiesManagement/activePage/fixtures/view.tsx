import { useIntl } from '@linkseeks/i18n'
import { useState } from 'react'
import { Spin, message, Tabs } from 'antd'
import { BrickProvider, ModuleTree } from '@apps/design-react'
import MobileDesignPanel from './components/MobileDesignPanel'
import Toolbar from './components/Toolbar'
import styles from './index.less'
import EditPanel from './components/EditPanel/editPanelForm'
import configs from './common/configs/pageConfigs'
import Module from './components/ComponentTree/web'
import ToolbarSubmit from './components/Toolbar/toolbarSubmit'
import { RenovationProvider } from './common/context/shopContext'
import { usePageStatus } from '@/hooks/usePageStatus'
import useGetLayout from './common/hooks/useGetLayout'
import useSaveData from './common/hooks/useSaveData'

const { TabPane } = Tabs

const Fixtures = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { detail, loading } = useGetLayout()
  const { saving, onSave } = useSaveData({ id: +id })

  return (
    <div className={styles.page}>
      <Spin spinning={loading}>
        <BrickProvider
          config={configs}
          warn={(msg: string) => {
            message.warning(msg)
          }}
        >
          <div className={styles['wrapper']}>
            <Toolbar
              title={intl.formatMessage({ id: 'activityPage.editingShopActivityPage' })}
              extra={
                <ToolbarSubmit loading={saving} onSubmit={onSave}>
                  {intl.formatMessage({ id: 'activePage.save' })}
                </ToolbarSubmit>
              }
            />
            <div className={styles['content']}>
              <div className={styles.tree}>
                <Tabs>
                  <TabPane tab={intl.formatMessage({ id: 'activityPage.alreadyAdd' })} key="1">
                    <ModuleTree />
                  </TabPane>
                  <TabPane tab={intl.formatMessage({ id: 'activityPage.allModules' })} key="2">
                    <div className={styles.module}>
                      <Module isWeb={false} />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
              <div className={styles['app-wrapper']}>
                <div className={styles['app-canvas-container']}>
                  <MobileDesignPanel theme={'theme-mall-science'} onlyEidt />
                </div>
              </div>
              <RenovationProvider value={{ shopId: detail?.shopId }}>
                <EditPanel />
              </RenovationProvider>
            </div>
          </div>
        </BrickProvider>
      </Spin>
      {(loading && (
        <div className={styles.loading}>
          {intl.formatMessage({ id: 'activePage.loading', defaultMessage: '正在加载中' })}
        </div>
      )) ||
        null}
    </div>
  )
}

export default Fixtures
