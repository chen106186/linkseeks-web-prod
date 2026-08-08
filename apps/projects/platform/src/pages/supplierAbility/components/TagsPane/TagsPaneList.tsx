/**
 * @Description: 标签面板列表
 */
import React from 'react'
import { ActiveKeyType } from './typings'
import TagsPaneContext from './TagsPaneContext'
import './index.less'

export interface TagsPaneListProps {
  /**
   * 当前激活的面板
   */
  activeKey: ActiveKeyType
}

const TagsPaneList: React.FC<TagsPaneListProps> = (props: TagsPaneListProps) => {
  const { activeKey } = props

  const { tags } = React.useContext(TagsPaneContext)

  const activeIndex = tags.findIndex((tab) => tab.key === activeKey)

  return (
    <div className="tagsPane-pane-content">
      {tags.map((tab) => {
        return React.cloneElement(tab.node, {
          key: tab.key,
          tabKey: tab.key,
          active: tab.key === activeKey,
        })
      })}
    </div>
  )
}

export default TagsPaneList
