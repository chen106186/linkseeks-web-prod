import React, { useEffect, useState } from 'react';
import { Anchor } from 'antd';
import styles from './index.less';

const activeAnchorClassName = 'ant-anchor-link-active'

export type tabLink = {
  id: string,
  title: string
}

export interface IProps {
  /** 返回按钮 */
  onBack?: boolean,
  /** 单号 */
  no?: string | React.ReactNode,
  /** 详情描述 */
  detail?: string,
  /** 锚点Link */
  tabLink?: Array<tabLink>,
  /** 审核操作按钮放这 */
  effect?: React.ReactNode,
  /** 页面的组件 */
  components?: React.ReactNode,
  /** 隐藏头部分割线 */
  hideBreak?: boolean,
}

const TabAnchor: React.FC<IProps> = (props: any) => {
  const {
    tabLink = [],
  } = props;


  /** the argument */
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
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
    e.preventDefault();
  }

  useEffect(() => {
    setTargetOffset(window.innerHeight / 6);
  }, [])

  return (
    <div className={styles.tabAnchor}>
      <Anchor
        targetOffset={targetOffset}
        onChange={onChange}
        onClick={onClick}
      >
        {/* 头部信息 */}
        <div className={styles.tabLink}>
          {
            tabLink.map((item) => (
              <Anchor.Link
                key={item.id}
                href={`#${item.id}`}
                title={item.title}
              />
            ))
          }
        </div>
      </Anchor>
    </div>
  )
}

export default TabAnchor
