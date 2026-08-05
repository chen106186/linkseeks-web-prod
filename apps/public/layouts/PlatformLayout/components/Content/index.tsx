import { Outlet, getCurrentRouter, useLocation, useRouter, useOutlet, KeepAlive } from '@linkseeks/router-core'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Layout } from '@linkseeks/ui'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import style from './index.less'
import LayoutHeader from '../Header'
import TitleHeader from '../TitleHeader'
import Footer from '../Footer'

const { Content } = Layout
/** 页面中的布局容器, 这里还是实验性的，不确定未来会不会用到 (应该会) */
const LayoutContext = createContext({} as any)

const useLayout = () => useContext(LayoutContext)

interface IProps {
  /**
   * 自定义头部右边
   */
  rightContentRender?: () => React.ReactNode
}

const LayoutContent: React.FC<IProps> = (props) => {
  const { rightContentRender } = props
  const layoutValue = {}
  const location = useLocation()
  const currentRouter = getCurrentRouter(location.pathname)
  const outlet = useOutlet()
  return (
    <LayoutContext.Provider value={props}>
      <Layout>
        <Helmet>
          <title>{currentRouter?.title}</title>
        </Helmet>
        <LayoutHeader rightContentRender={rightContentRender} />
        <Content className={style.scrollbar}>
          {currentRouter?.headerMeta !== false && <TitleHeader />}
          {/* <KeepAlive activeName={location.pathname} cache={currentRouter.cache || false}> */}
          <div
            id="layout-content"
            className={cx(style['content'], currentRouter?.paddingMeta === false && style['no-padding'])}
          >
            {outlet}
          </div>
          {/* </KeepAlive> */}
        </Content>
        <Footer />
      </Layout>
    </LayoutContext.Provider>
  )
}

export default LayoutContent
