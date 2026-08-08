/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-10 11:36:58
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-11 10:16:12
 * @Description: 页面公用锚点头部
 */
import React, { useState, useRef, useEffect } from 'react'
import { Anchor } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import useClientRect from '@/hooks/useClientRect'
import AnchorPageItem from './Item'
import styles from './index.less'

export interface AnchorsItem {
  /**
   * 跳转标识
   */
  key: string
  /**
   * 名称
   */
  name: React.ReactNode | string
  /**
   * 个性化定制  item Title 数量
   */
  len?: number | string
}

interface IProps {
  /**
   * 标题
   */
  title: React.ReactNode
  /**
   * 右侧拓展部分
   */
  extra?: React.ReactNode
  /**
   * 锚点数据
   */
  anchors?: AnchorsItem[]
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义返回事件
   */
  onBack?: () => void
  /**
   * 自定义渲染描述区域内容
   */
  desc?: React.ReactNode
  /**
   * children
   */
  children?: React.ReactNode
  /**
   * 隐藏返回按钮
   */
  noBack?: boolean
}

const AnchorPage = (props: IProps) => {
  const { title, extra, anchors = [], customStyle, onBack, desc, children, noBack } = props
  const defaultKey = anchors.length ? `#${anchors[0].key}` : ''
  const [current, setCurrent] = useState(defaultKey)
  const [rect, measuredRef] = useClientRect()
  const [anchorsRect, anchorsRef] = useClientRect()

  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    const firstKey = anchors.length ? `#${anchors[0].key}` : ''
    if (firstKey && firstKey !== current) {
      mounted.current && setCurrent(firstKey)
    }
  }, [anchors])

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    history.goBack()
  }

  const handleAnchorChange = (currentActiveLink: string) => {
    if (currentActiveLink) {
      mounted.current && setCurrent('')
      return
    }
    if (!currentActiveLink) {
      const firstKey = anchors.length ? `#${anchors[0].key}` : ''
      mounted.current && firstKey && setCurrent(firstKey)
    }
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles['anchor-page']} style={customStyle}>
      <div className={styles['anchor-page-header']} ref={measuredRef}>
        <Anchor
          showInkInFixed={false}
          targetOffset={rect.height + anchorsRect.height}
          onChange={handleAnchorChange}
          onClick={handleAnchorClick}
          getContainer={() => document.querySelector('main.ant-layout-content') as HTMLElement}
          // getContainer={() => document.getElementsByTagName('main')[0]}
        >
          <div className={styles['anchor-page-header-main']}>
            <div className={styles['anchor-page-header-left']}>
              <div className={styles['anchor-page-header-heading']}>
                {!noBack && <ArrowLeftOutlined className={styles['anchor-page-header-back']} onClick={handleBack} />}
                <span className={styles['anchor-page-header-heading-title']}>{title}</span>
              </div>
              {desc && <div className={styles['anchor-page-header-desc']}>{desc}</div>}
              <div className={styles['anchor-page-header-content']}>
                {anchors && anchors.length ? (
                  <div className={styles['anchor-page-header-anchors']} ref={anchorsRef}>
                    {anchors.map((item, index) => (
                      <Anchor.Link
                        className={current && index === 0 ? 'ant-anchor-link-active' : null}
                        key={item.key}
                        href={`#${item.key}`}
                        title={item.len ? `${item.name}(${item.len})` : item.name}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            {extra ? <div className={styles['anchor-page-header-right']}>{extra}</div> : null}
          </div>
        </Anchor>
      </div>
      <div className={styles['anchor-page-content']}>{children}</div>
    </div>
  )
}

AnchorPage.defaultProps = {
  extra: null,
  customStyle: {},
  onBack: undefined,
  children: null,
}

AnchorPage.Item = AnchorPageItem

export default AnchorPage
