import React, { useEffect, useState, useContext } from 'react'
import { Anchor } from 'antd'
import { Context } from './components/context'
import style from './index.less'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'

const activeAnchorClassName = 'ant-anchor-link-active'

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
  detail?: string
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
    } else if (!link && !currLink) {
      setCurrLink(activeAnchorClassName)
    }
  }
  const onClick = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    setTargetOffset(window.innerHeight / 6)
  }, [])

  return (
    <div className={style.wrap}>
      <Anchor
        targetOffset={targetOffset}
        onChange={onChange}
        onClick={onClick}
        getContainer={() => document.querySelector('main.ant-layout-content') as HTMLElement}
      >
        {/* 头部信息 */}
        <div style={{ flex: 1 }}>
          <div className={style.title}>
            <div className={style.titleBox}>
              {!onBack && <ArrowLeftOutlined className={style.goBack} onClick={() => history.goBack()} />}
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
                className={!index && currLink}
                key={`link${index + 1}`}
                href={`#${item.id}`}
                title={item.title}
              />
            ))}
          </div>
        </div>
      </Anchor>
      <div className={style.layout}>{components}</div>
    </div>
  )
}

export default PeripheralLayout
