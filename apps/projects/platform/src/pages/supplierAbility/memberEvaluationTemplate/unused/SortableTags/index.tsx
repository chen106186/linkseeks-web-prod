import React, { useState } from 'react'
import { ItemInterface, ReactSortable } from 'react-sortablejs'
import { HolderOutlined, CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { Button, message, Popconfirm } from 'antd'
import './index.less'

export interface I_SortableTag extends ItemInterface {}

interface I_SortableTags_Props {
  /** 打开拖拽排序图标 */
  draggable?: boolean
  /** 打开关闭图标 */
  closeable?: boolean
  /** 标签列表 */
  tags?: Array<I_SortableTag>
  /** 标签列表变化回调函数 */
  onTagsChanged?: (tags: Array<I_SortableTag>) => void
}

const SortableTags: React.FC<I_SortableTags_Props> = (props) => {
  const { draggable = false, closeable = false, tags = [], onTagsChanged } = props

  const [activeTag, setActiveTag] = useState<I_SortableTag>(tags[0])

  /** 重置默认选中标签 */
  const resetActiveTag = () => setActiveTag(tags[0])

  /** 关闭某个标签回调函数 */
  const onTagClosed = (theTagReadyToClose: I_SortableTag) => {
    if (theTagReadyToClose && onTagsChanged) {
      onTagsChanged(tags.filter((tags) => tags.id !== theTagReadyToClose.id))
      if (theTagReadyToClose.id === activeTag.id) {
        resetActiveTag()
      }
      message.success('已成功删除分组')
    }
  }

  return (
    <div className="sortable_tags">
      <ReactSortable
        className="react_sortable_component"
        handle=".dragging_icon"
        animation={200}
        disabled={!draggable}
        list={tags}
        setList={(newState) => {
          if (onTagsChanged) {
            // filtered 为 true 的标签排前面
            onTagsChanged(newState.sort((a, b) => -Number(a.filtered)))
          }
        }}
      >
        {tags.map((tag) => (
          <Button
            key={tag.id}
            style={{ cursor: draggable ? 'auto' : 'pointer' }}
            className={`tag ${activeTag.id === tag.id ? '_active' : ''} ${tag.id === 0 ? 'whole' : ''}`}
            onClick={() => draggable || setActiveTag(tag)}
          >
            {/* 拖拽排序图标 */}
            {draggable && !tag.filtered && <HolderOutlined className="dragging_icon" />}
            {/* 标签名 */}
            <span className="tag_name">{tag.name}</span>
            {/* 关闭图标 */}
            {closeable && !tag.filtered && (
              <Popconfirm
                title="确定要删除这个分组吗？"
                icon={<ExclamationCircleFilled style={{ color: '#e34d59' }} />}
                onConfirm={() => onTagClosed(tag)}
                onCancel={(e) => e.stopPropagation()}
              >
                <CloseOutlined className="closing_icon" onClick={(e) => e.stopPropagation()} />
              </Popconfirm>
            )}
          </Button>
        ))}
      </ReactSortable>
    </div>
  )
}

export default SortableTags
