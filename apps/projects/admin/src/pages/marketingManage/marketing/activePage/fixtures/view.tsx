import { useRef, useState } from 'react'
import { message, Spin, Tabs } from 'antd'
import { BrickProvider, ModuleTree } from '@apps/design-react'
import className from 'classnames'
import Toolbar from '../components/Toolbar'
import ToolbarSubmit from '../components/Toolbar/toolbarSubmit'
import configs from '../common/configs/pageConfigs'
import WebDesignPanel from '../components/WebDesignPanel'
import WebEditPanel from '../components/WebEditPanel'
import { RenovationProvider } from '../common/context/shopContext'
import useGetWebLayout from '../common/hooks/useGetWebLayout'
import WebScale from '../components/WebScale'
import { usePageStatus } from '@/hooks/usePageStatus'
import Module from '../components/ComponentTree/web'
import useSaveData from '../common/hooks/useSaveData'
import styles from './web.less'

const TabPane = Tabs.TabPane

interface IProps {
  type: 'preview' | 'edit'
}

const Web: React.FC<IProps> = (props) => {
  const { type = 'edit' } = props
  const el = useRef<HTMLDivElement>(null)
  const { id } = usePageStatus()
  const [scale, setScale] = useState(0.75)
  const { saving, onSave } = useSaveData({ id: +id, environment: 'web' })
  const [leftBarVisible] = useState<boolean>(true)
  const { detail = {}, loading } = useGetWebLayout(type)

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
                type={type}
                title={type === 'preview' ? '平台活动页预览' : '平台活动页装修'}
                extra={
                  type === 'edit' ? (
                    <ToolbarSubmit loading={saving} onSubmit={onSave}>
                      保存
                    </ToolbarSubmit>
                  ) : null
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
                  <TabPane tab={'组件树'} key="1">
                    <ModuleTree />
                  </TabPane>
                  <TabPane tab={'模块'} key="2">
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
                  }}
                >
                  <WebDesignPanel theme={'theme-mall-science'} isPreview={type === 'preview'} />
                </div>
              </div>
            </div>
            <div className={styles.rightSide}>
              {type !== 'preview' && (
                <RenovationProvider value={{ shopId: detail?.shopId }}>
                  <WebEditPanel />
                </RenovationProvider>
              )}
            </div>
            <WebScale scaleValue={scale as 0.75} onChange={onChangeScale} />
          </div>
        </BrickProvider>
      </Spin>
      {(loading && <div className={styles.loading}>正在加载中</div>) || null}
    </div>
  )
}

export default Web
