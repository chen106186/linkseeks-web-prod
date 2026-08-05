/**
 * @Description: 标签
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Tag, Popconfirm, Input, message } from 'antd'
import type { InputRef } from 'antd'
import { CloseOutlined, PlusOutlined, HolderOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { ReactSortable, ItemInterface, Sortable, Store } from 'react-sortablejs'
import { ActiveKeyType, TagsPane } from './typings'
import { toArray } from './utils/typeUtil'
import TagsPaneContext from './TagsPaneContext'
import { TagsPaneProps } from './Pane'
import TagsPaneList from './TagsPaneList'
import './index.less'
import { useWebIntl } from '@apps/locales'

export interface TagsProps {
  /**
   * 当前激活的面板
   */
  activeKey?: ActiveKeyType
  /**
   * 默认激活的面板
   */
  defaultActiveKey?: ActiveKeyType
  /**
   * 切换面板的回调
   */
  onChange?: (activeKey: ActiveKeyType) => void
  /**
   * Tabs大小，可选值 default、large，默认 default
   */
  size?: 'default' | 'large'
  /**
   * 确认关闭触发事件
   */
  onRemove?: (tagKey: ActiveKeyType) => void
  /**
   * 可添加的
   */
  addible?: boolean
  /**
   * 确认添加标签触发事件
   */
  onAdd?: (tagName: string) => void
  /**
   * 拖拽结束触发回调
   */
  onSort?: (tagKey: ActiveKeyType, newIndex: number, oldIndex: number) => void
  /**
   * 拓展内容
   */
  extra?: React.ReactNode
  /**
   * 确认生成标签前触发的钩子，若返回 false 则停止触发请求
   */
  onBeforeConfirm?: (tagName: string) => boolean | Promise<boolean>

  children?: React.ReactNode
}

function parseTagList(children: React.ReactNode): TagsPane[] {
  return toArray(children)
    .map((node: React.ReactElement<TagsPaneProps>) => {
      if (React.isValidElement(node)) {
        const key = node.key !== undefined ? String(node.key) : undefined
        return {
          key,
          ...node.props,
          node,
          id: key,
        }
      }
      return null
    })
    .filter((tag) => tag)
}

const Tags: React.FC<TagsProps> = (props) => {
  const {
    activeKey,
    defaultActiveKey,
    onChange,
    size = 'default',
    onRemove,
    addible,
    onAdd,
    onSort,
    extra,
    onBeforeConfirm,
    children,
  } = props

  const tags = parseTagList(children)

  const [internalKey, setInternalKey] = useState<ActiveKeyType | undefined>(
    () => tags.find((tag) => tag.key === activeKey || defaultActiveKey)?.key || tags[0]?.key,
  )
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const inputRef = useRef<InputRef>(null)

  const translate = useWebIntl()
  useEffect(() => {
    if ('activeKey' in props && activeKey !== undefined) {
      setInternalKey(activeKey)
    }
  }, [activeKey])

  useEffect(() => {
    if (internalKey === undefined) {
      setInternalKey(tags.find((tag) => tag.key === (activeKey || defaultActiveKey))?.key || tags[0]?.key)
    }
  }, [tags.map((tag) => tag.key).join('_'), activeKey])

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  const triggerChange = (nextKey: ActiveKeyType) => {
    onChange?.(nextKey)
  }

  const handleClickTagsItem = (nextKey: ActiveKeyType) => {
    if (!('activeKey' in props)) {
      setInternalKey(nextKey)
    }
    triggerChange(nextKey)
  }

  const handleDeleteTag = (tagKey: ActiveKeyType, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove?.(tagKey)
      message.success('已成功删除分组')
    }
  }

  const handleShowInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = async () => {
    if (inputValue && tags.findIndex((item) => item.name === inputValue) !== -1) {
      message.warning('已存在同名分组')
      return
    }
    if (onBeforeConfirm) {
      const flag = await onBeforeConfirm?.(inputValue)
      if (!flag) return
    }

    if (inputValue) {
      onAdd?.(inputValue)
    }
    setInputVisible(false)
    setInputValue('')
  }

  const handleDragEnd = (evt: Sortable.SortableEvent) => {
    onSort?.(evt.item.dataset.id, evt.newIndex, evt.oldIndex)
  }

  const fieldContextValue = useMemo(
    () => ({
      activeKey: internalKey,
      tags,
    }),
    [internalKey, tags],
  )

  return (
    <TagsPaneContext.Provider value={fieldContextValue}>
      <div className="tagsPane">
        <div className="tagsPane-head">
          <div className="tagsPane-tags">
            <ReactSortable
              list={tags as ItemInterface[]}
              setList={() => {}}
              handle=".tagsPane-tags-item-drag-icon"
              onEnd={handleDragEnd}
              className="tagsPane-tags-sortable"
              animation={200}
            >
              {tags.map((item) => (
                <div
                  className={classNames(
                    'tagsPane-tags-item',
                    {
                      'tagsPane-tags-item__active': item.key === internalKey,
                    },
                    `tagsPane-tags-item__${size}`,
                  )}
                  onClick={() => handleClickTagsItem(item.key)}
                  key={item.key}
                >
                  <Tag>
                    {item.sortable ? <HolderOutlined className="tagsPane-tags-item-drag-icon" /> : null}
                    {item.name}
                    {item.closable ? (
                      <Popconfirm
                        title={translate('web.resource.member.quedingshanchutishi')}
                        onConfirm={(e) => handleDeleteTag(item.key, e)}
                        okText={translate('web.common.confirmEmpty')}
                        cancelText={translate('web.common.cancelEmpty')}
                      >
                        <CloseOutlined className="tagsPane-tags-item-close-icon" />
                      </Popconfirm>
                    ) : null}
                  </Tag>
                </div>
              ))}
            </ReactSortable>
            {/* {tags.map((item) => (
              <div
                className={classNames(
                  'tagsPane-tags-item',
                  {
                    'tagsPane-tags-item__active': item.key === internalKey,
                  },
                  `tagsPane-tags-item__${size}`,
                )}
                onClick={() => handleClickTagsItem(item.key)}
                key={item.key}
              >
                <Tag>
                  <HolderOutlined
                    className="tagsPane-tags-item-drag-icon"
                  />
                  {item.name}
                  {item.closable ? (
                    <Popconfirm
                      title="确定要删除这个分组吗？"
                      onConfirm={() => handleDeleteTag(item.key)}
                      okText="确 定"
                      cancelText="取 消"
                    >
                      <CloseOutlined
                        className="tagsPane-tags-item-close-icon"
                      />
                    </Popconfirm>
                  ) : null}
                </Tag>
              </div>
            ))} */}
            <div className={classNames('tagsPane-tags-item', `tagsPane-tags-item__${size}`)}>
              {inputVisible && (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  className="tagsPane-tags-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {addible && !inputVisible && (
                <Tag className="tagsPane-tags-plus" onClick={handleShowInput}>
                  <PlusOutlined /> {translate('web.resource.member.tianjiafenzu')}
                </Tag>
              )}
            </div>
          </div>
          {extra ? <div className="tagsPane-head-extra">{extra}</div> : null}
        </div>
        <TagsPaneList activeKey={internalKey} />
      </div>
    </TagsPaneContext.Provider>
  )
}

export default Tags
