import React, { useRef, useState } from 'react'
import { message, Spin, Tabs } from 'antd'
import { BrickProvider, ModuleTree } from '@apps/design-react'
import className from 'classnames'
import Toolbar from '../components/Toolbar'
import styles from './web.less'
import { useIntl } from '@linkseeks/i18n'
import ToolbarSubmit from '../components/Toolbar/toolbarSubmit'
import configs from '../common/configs/pageConfigs'
import WebDesignPanel from '../components/WebDesignPanel'
import WebEditPanel from '../components/WebEditPanel'
import { RenovationProvider } from '../common/context/shopContext'
import useGetWebLayout from '../common/hooks/useGetWebLayout'
import useDraggable from '../common/hooks/useDrag'
import WebScale from '../components/WebScale'
import { usePageStatus } from '@/hooks/usePageStatus'
import Module from '../components/ComponentTree/web'
import useSaveData from '../common/hooks/useSaveData'

const TabPane = Tabs.TabPane

const Web = () => {
  const el = useRef<HTMLDivElement>(null)
  // useDraggable(el);
  const { id } = usePageStatus()
  const [scale, setScale] = useState(0.75)
  const { saving, onSave } = useSaveData({ id: +id, environment: 'web' })
  const [leftBarVisible, setLeftBarVisible] = useState<boolean>(true)

  const { detail, loading } = useGetWebLayout()
  const intl = useIntl()

  const onChangeScale = (value: number) => {
    setScale(value)
  }

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        <BrickProvider
          config={configs}
          warn={(msg: string) => {
            message.warning(msg)
          }}
        >
          <div className={styles.page}>
            <div className={styles.header}>
              <Toolbar
                title={intl.formatMessage({ id: 'activityPage.editingShopActivityPage' })}
                extra={
                  <ToolbarSubmit loading={saving} onSubmit={onSave}>
                    {intl.formatMessage({ id: 'activePage.save' })}
                  </ToolbarSubmit>
                }
              />
            </div>
            <div
              className={className(styles.leftBar, {
                [styles['left-bar-show']]: leftBarVisible,
              })}
            >
              <div className={styles['module-tree']}>
                <Tabs>
                  <TabPane tab={intl.formatMessage({ id: 'activityPage.alreadyAdd' })} key="1">
                    <ModuleTree />
                  </TabPane>
                  <TabPane tab={intl.formatMessage({ id: 'activityPage.allModules' })} key="2">
                    <div className={styles.module}>
                      <Module />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
            <div className={styles['screen-view']} ref={el}>
              <div className={styles['screen-view-inner']}>
                <div
                  className={styles['screen-view-content']}
                  style={{
                    transform: `scale(${scale})`,
                    // marginLeft: `-${(SCREEN_VIEW_WIDTH * scale) / 2}px`,
                    // marginTop: `-${(1600 * scale) / 2}px`
                  }}
                >
                  <WebDesignPanel theme={'theme-mall-science'} />
                </div>
              </div>
            </div>
            <div className={styles.rightSide}>
              <RenovationProvider value={{ shopId: detail?.shopId }}>
                <WebEditPanel />
              </RenovationProvider>
            </div>
            <WebScale scaleValue={scale as 0.75} onChange={onChangeScale} />
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

export default Web
