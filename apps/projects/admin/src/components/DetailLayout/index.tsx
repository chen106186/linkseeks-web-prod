import React, { useEffect, useState, useContext } from 'react'
import { Anchor } from 'antd'
import { Context } from './components/context'
import style from './index.less'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import cs from 'classnames'
import raf from './raf'

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
  id: string
  title: string
}

export interface IProps {
  /** 返回按钮 */
  onBack?: boolean
  /** 单号 */
  no?: string | React.ReactNode
  /** 详情描述 */
  detail?: string | React.ReactNode
  /** 锚点Link */
  tabLink?: Array<tabLink>
  /** 审核操作按钮放这 */
  effect?: React.ReactNode
  /** 页面的组件 */
  components?: React.ReactNode
  /** 隐藏头部分割线 */
  hideBreak?: boolean
}

const PeripheralLayout: React.FC<IProps> = (props: any) => {
  const { onBack, no, detail, tabLink, effect, components, hideBreak } = props

  const dataSource = useContext(Context)

  /** the argument */
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined)
  const [currLink, setCurrLink] = useState(activeAnchorClassName)

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

  useEffect(() => {
    setTargetOffset(window.innerHeight / 6)
  }, [])

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
    // eslint-disable-next-line no-return-assign
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
      getContainer: () => document.getElementById('detailLayout') || window,
    })
  }

  return (
    <div className={style.wrap}>
      <Anchor className={style.anchorWrap} targetOffset={targetOffset} onChange={onChange} onClick={onClick}>
        {/* 头部信息 */}
        <div className={style.titleWrap}>
          <div className={style.title}>
            <div className={style.titleBox}>
              {!onBack && <ArrowLeftOutlined className={style.goBack} onClick={() => history.back()} />}
              <span className={style.titleContext}>
                {detail ? detail : dataSource.details}
                &nbsp;{!hideBreak && '|'}&nbsp;
                {no}
              </span>
            </div>
            {effect}
          </div>
          <div className={style.anchor}>
            {tabLink.map((item, index) => (
              <Anchor.Link
                className={cs(!index && currLink)}
                key={`link${index + 1}`}
                href={`#${item.id}`}
                title={
                  <div className={style['anchor-link-title']} onClick={() => handleClick(`${item.id}`)}>
                    {item.title}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </Anchor>
      <div className={style.layout} id="detailLayout">
        {components}
      </div>
    </div>
  )
}

export default PeripheralLayout
