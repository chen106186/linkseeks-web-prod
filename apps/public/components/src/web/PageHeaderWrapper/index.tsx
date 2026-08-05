import React, { useEffect, isValidElement, useState, useMemo, PropsWithChildren, Fragment } from 'react'
import { Anchor, Tabs } from '@linkseeks/ui'
import { ArrowLeftIcon } from '@linkseeks/icons'
import { history } from '@linkseeks/router-manager'
import { getCurrentRouter, useLocation } from '@linkseeks/router-core'
import cx from 'classnames'
import Loading from '../Loading'
import useAuthMenu from '@apps/services/auth/useAuthMenu'
import raf from './raf'
import './index.less'

const activeAnchorClassName = 'ant-anchor-link-active'

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document
  /** Scroll end callback */
  callback?: () => any
  /** Animation duration, default as 450 */
  duration?: number
}

export type tabLink = {
  label: string
  key: string
}

export interface PageHeaderWrapperProps {
  style?: React.CSSProperties
  bodyStyle?: React.CSSProperties
  className?: string
  /** 返回按钮：显示默认的返回按钮或者自定义返回按钮 */
  backDom?: boolean | React.ReactNode
  /** 标题 */
  title?: string | React.ReactNode
  /** 子标题  */
  subTitle?: string | React.ReactNode
  titleIcon?: string
  /** PageHeader 的页脚是否锚点 */
  isAnchor?: boolean
  /** 锚点模式下affix 固定模式 */
  affix?: boolean
  /** PageHeader 的页脚是否标签页 */
  isTabs?: boolean
  /** 锚点或标签页数据     */
  items?: Array<tabLink>
  /** PageHeader 的页脚，一般用于渲染 TabBar */
  footer?: React.ReactNode
  /** 操作区，位于 title 行的行尾 */
  extra?: React.ReactNode
  /** 标题内容 */
  content?: React.ReactNode
  /**
   * 自定义dom id值
   */
  customContainer?: string
  /** 标签页切换时触发 */
  onTabChange?: (key: string) => void
  /** 返回按钮事件 */
  onBack?: () => void
  /**
   * 内容区域的loading
   */
  loading?: boolean
}

/**
 * view 页面默认不显示返回按钮，'detail', 'edit', 'add‘页面默认显示返回按钮
 */
const backDomDefault = (pathname: string) => {
  const trueKeys = ['detail', 'edit', 'add']
  if (pathname && typeof pathname === 'string') {
    const splitPathList = pathname.split('/')
    const lastPath = splitPathList[splitPathList.length - 1]
    return trueKeys.includes(lastPath) ? true : false
  }
  return false
}

const PageHeaderWrapper: React.FC<PropsWithChildren<PageHeaderWrapperProps>> = (props) => {
  const { pathname } = useLocation()
  const {
    affix = false,
    style,
    bodyStyle,
    className,
    title,
    subTitle,
    titleIcon,
    isAnchor = true,
    isTabs,
    items = [],
    extra,
    children,
    backDom = backDomDefault(pathname),
    content,
    footer,
    customContainer,
    loading,
    onTabChange,
    onBack,
  } = props
  const currentRouter = getCurrentRouter(pathname)
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined)
  const [currLink, setCurrLink] = useState(activeAnchorClassName)
  const [activeKey, setActiveKey] = useState<string>(items && items.length > 0 ? items[0].key : '')

  const { getCurrentMenu } = useAuthMenu()

  const getCurrentContainer = () => {
    return document.getElementById(customContainer || 'page-header-main') || window
  }

  useEffect(() => {
    setTargetOffset(window.innerHeight / 6)
  }, [])

  const backButton = useMemo(() => {
    if (typeof backDom === 'boolean' && !backDom) {
      return null
    } else if (isValidElement(backDom)) {
      return backDom
    }
    return (
      <ArrowLeftIcon
        className="page-header-back"
        onClick={() => {
          if (onBack) {
            onBack()
          } else {
            history.back()
          }
        }}
      />
    )
  }, [backDom])

  const anchorTitleExtra = useMemo(() => {
    if (!subTitle) return null
    return (
      <Fragment>
        <div className="page-header-title-split"></div>
        {isValidElement(subTitle) ? subTitle : <span className="page-header-title-extra">{subTitle}</span>}
      </Fragment>
    )
  }, [subTitle])

  const pageHeaderFooter = useMemo(() => {
    // 自定义底部
    if (footer) {
      return <div className="page-header-footer">{footer}</div>
    }

    // 标签页
    if (isTabs && Array.isArray(items) && items.length > 0) {
      return (
        <div className="page-header-footer">
          <Tabs
            items={items}
            className="page-header-tabs"
            accessKey={activeKey}
            onChange={(key) => {
              setActiveKey(key)
              onTabChange?.(key)
            }}
          />
        </div>
      )
    }

    // 锚点
    if (isAnchor && Array.isArray(items) && items.length > 0) {
      return (
        <div className="page-header-footer">
          {items.map((item, index) => (
            <Anchor.Link
              className={cx(!index && currLink)}
              key={`link${index + 1}`}
              href={`#${item.key}`}
              title={<div className="page-header-link-title">{item.label}</div>}
            />
          ))}
        </div>
      )
    }

    return null
  }, [isAnchor, isTabs, items, footer, currLink])

  const pageHeaderTitle = useMemo(() => {
    if (!title) {
      // 由于按钮列表无法国际化，所以直接使用本地文案
      const item = getCurrentMenu(pathname)
      if (item) {
        return item.title
      } else {
        return currentRouter?.title
      }
    }
    return title
  }, [title, pathname])

  /** the event */
  const onChange = (link) => {
    if (link && currLink) {
      setCurrLink('')
    } else {
      setCurrLink(activeAnchorClassName)
    }
  }

  const onClick = (e) => {
    e.preventDefault()
  }

  const isWindow = (obj: any) => {
    return obj !== null && obj !== undefined && obj === obj.window
  }

  const getScroll = (target: HTMLElement | Window | Document | null, top: boolean): number => {
    if (typeof window === 'undefined') {
      return 0
    }
    const method = top ? 'scrollTop' : 'scrollLeft'
    let result = 0
    if (isWindow(target)) {
      result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset']
    } else if (target instanceof Document) {
      result = target.documentElement[method]
    } else if (target) {
      result = (target as HTMLElement)[method]
    }
    if (target && !isWindow(target) && typeof result !== 'number') {
      result = ((target as HTMLElement).ownerDocument || (target as Document)).documentElement?.[method]
    }
    return result
  }

  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    const cc = c - b
    t /= d / 2
    if (t < 1) {
      return (cc / 2) * t * t * t + b
    }
    return (cc / 2) * ((t -= 2) * t * t + 2) + b
  }

  const scrollTo = (y: number, options: ScrollToOptions = {}) => {
    const { getContainer = () => window, callback, duration = 450 } = options
    const container = getContainer()
    const scrollTop = getScroll(container, true)
    const startTime = Date.now()

    const frameFunc = () => {
      const timestamp = Date.now()
      const time = timestamp - startTime
      const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
      if (isWindow(container)) {
        ;(container as Window).scrollTo(window.scrollX, nextScrollTop)
      } else if (container instanceof Document || container.constructor.name === 'HTMLDocument') {
        ;(container as Document).documentElement.scrollTop = nextScrollTop
      } else {
        ;(container as HTMLElement).scrollTop = nextScrollTop
      }
      if (time < duration) {
        raf(frameFunc)
      } else if (typeof callback === 'function') {
        callback()
      }
    }
    raf(frameFunc)
  }

  const handleClick = (link: string) => {
    const anchorLink = document.getElementById(link)
    const scrollTop = (anchorLink?.offsetTop || 0) - 140

    scrollTo(scrollTop, {
      getContainer: getCurrentContainer,
    })
  }

  return (
    <div style={style} className={cx('page-header', className)}>
      <Anchor
        className="page-header-wrap"
        affix={affix}
        targetOffset={targetOffset}
        getContainer={getCurrentContainer}
        onChange={onChange}
        onClick={onClick}
      >
        {/* 头部信息 */}
        <div className="page-header-title-wrap">
          <div className="page-header-title">
            <div className="page-header-title-box">
              {backButton}
              {titleIcon && (
                <div className="page-header-title-icon">
                  <img src={titleIcon} />
                </div>
              )}
              <span className="page-header-title-context">
                {pageHeaderTitle}
                {anchorTitleExtra}
              </span>
            </div>
            {extra && <div className="page-header-extra">{extra}</div>}
          </div>
          {content && <div className="page-header-content">{content}</div>}
          {pageHeaderFooter}
        </div>
      </Anchor>
      <div style={bodyStyle} className="page-header-main" id="page-header-main">
        {loading ? <Loading /> : children}
      </div>
    </div>
  )
}

export default PageHeaderWrapper
