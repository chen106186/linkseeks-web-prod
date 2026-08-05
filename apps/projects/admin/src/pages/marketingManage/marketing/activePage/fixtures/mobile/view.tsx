import React, { useEffect, useState } from 'react'
import { Spin, message, Tabs } from 'antd'
import { BrickProvider, ModuleTree } from '@apps/design-react'
import MobileDesignPanel from '../../components/MobileDesignPanel'
import Toolbar from '../../components/Toolbar'
import styles from './mobile.less'
// import EditPanel from '../../components/EditPanel';
import EditPanel from '../../components/EditPanel/editPanelForm'
import configs from '../../common/configs/pageConfigs'
import useGetLayout from '../../common/hooks/useGetLayout'
import Module from '../../components/ComponentTree/web'
import ToolbarSubmit from '../../components/Toolbar/toolbarSubmit'
import { RenovationProvider } from '../../common/context/shopContext'
import { usePageStatus } from '@/hooks/usePageStatus'
import { postMarketingWebActivityPageAdorn } from '@apps/apis'
import useSaveData from '../../common/hooks/useSaveData'

const { TabPane } = Tabs

interface IProps {
  type: 'preview' | 'edit'
}

const Fixtures: React.FC<IProps> = (props) => {
  const { id } = usePageStatus()
  const { type } = props
  // const { detail, loading } = useGetData(componentConfigs as any);
  const { detail, loading } = useGetLayout(type)
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
              title={type === 'preview' ? '正在预览：平台营销活动页' : '正在编辑：平台营销活动页'}
              type={type}
              extra={
                <ToolbarSubmit loading={saving} onSubmit={onSave}>
                  保存
                </ToolbarSubmit>
              }
            />
            <div className={styles['content']}>
              <div className={styles.tree}>
                <Tabs>
                  <TabPane tab="已添加" key="1">
                    <ModuleTree />
                  </TabPane>
                  <TabPane tab="全部模块" key="2">
                    <div className={styles.module}>
                      <Module isWeb={false} />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
              <div className={styles['app-wrapper']}>
                <div className={styles['app-canvas-container']}>
                  <MobileDesignPanel theme={'theme-mall-science'} onlyEidt isPreview={type === 'preview'} />
                </div>
              </div>
              {detail && type !== 'preview' && (
                <RenovationProvider value={{ shopId: detail!.shopId }}>
                  <EditPanel />
                </RenovationProvider>
              )}
            </div>
          </div>
        </BrickProvider>
      </Spin>
    </div>
  )
}

export default Fixtures
