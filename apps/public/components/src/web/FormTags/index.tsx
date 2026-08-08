import React, { useEffect, useRef, useState } from 'react'
import { Input, Space, Tag, Tooltip } from '@linkseeks/ui'
import { useToggle } from '@linkseeks/hooks'
import { InputRef } from 'antd'
import { PlusIcon } from '@linkseeks/icons'

import './index.global.less'
import { useWebIntl } from '@apps/locales'
export interface FormTagsProps {
  value?: any[]
  onChange?(value: any[]): void
  maxLength?: number
  maxTags?: number
  disabled?: boolean
}

const FormTags = (props: FormTagsProps) => {
  const { value = [], onChange, maxLength, maxTags = 10, disabled } = props
  const [tags, setTags] = useState<string[]>(value)
  const [inputVisible, inputToggle] = useToggle()
  const [inputValue, setInputValue] = useState('')
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const editInputRef = useRef<InputRef>(null)
  const translate = useWebIntl()
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    editInputRef.current?.focus()
  }, [inputValue])

  const handleChangeTags = (tags: string[]) => {
    setTags(tags)
    onChange && onChange(tags)
  }
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    handleChangeTags(newTags)
  }

  const showInput = () => {
    if (tags.length === maxTags) {
      return
    }
    inputToggle()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      handleChangeTags([...tags, inputValue])
    }
    inputToggle(false)
    setInputValue('')
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value)
  }

  const handleEditInputConfirm = () => {
    const newTags = [...tags]
    newTags[editInputIndex] = editInputValue
    handleChangeTags(newTags)
    setEditInputIndex(-1)
    setInputValue('')
  }

  return (
    <Space className="cp-form-tags">
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          )
        }

        const isLongTag = tag.length > 20

        const tagElem = (
          <Tag className="cp-form-tags-edit" key={tag} closable={!disabled} onClose={() => handleClose(tag)}>
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index)
                  setEditInputValue(tag)
                  e.preventDefault()
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        )

        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}

      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="cp-form-tags-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          maxLength={maxLength}
        />
      )}
      {!inputVisible && maxTags !== tags.length && !disabled && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusIcon /> {translate('web.common.add')}
        </Tag>
      )}
    </Space>
  )
}

export default FormTags
