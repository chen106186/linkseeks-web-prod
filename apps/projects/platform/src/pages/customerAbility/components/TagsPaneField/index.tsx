/**
 * @Description: 标签Field组件
 */
import React, { useState, useEffect } from 'react'
import { Badge } from 'antd'
import {
  SchemaField,
  FormPath,
  useFormEffects,
  FormEffectHooks,
  createAsyncFormActions,
  FormItemShallowProvider,
} from '@apps/formily'
import { toArr } from '@apps/formily'
import TagsPane from '../TagsPane'
import { TagsPaneProps } from '../TagsPane/Pane'
import { TagsProps } from '../TagsPane/Tags'
import './index.less'

const { onFormChange$ } = FormEffectHooks

const formActions = createAsyncFormActions()

const parseChildrenErrors = (errors: any, target: string) => {
  return errors.filter(({ path }) => {
    return FormPath.parse(path).includes(target)
  })
}

export interface TagsPaneFieldProps extends Omit<TagsProps, 'onChange'> {
  /**
   * 标签
   */
  tags: TagsPaneProps[]
  /**
   * 标签是否可关闭的
   */
  closable?: boolean
  /**
   * onTagsChange
   */
  onTagsChange?: (newTags: TagsPaneProps[], type: 'remove' | 'add') => void
}

const addErrorBadge = (tab: React.ReactNode, currentPath: FormPath, childrenErrors: any[]) => {
  const currentErrors = childrenErrors.filter(({ path }) => {
    return FormPath.parse(path).includes(currentPath)
  })
  if (currentErrors.length > 0) {
    return (
      <Badge offset={[12, 0]} count={currentErrors.length} className="tags-pane-badge">
        {tab}
      </Badge>
    )
  }
  return tab
}

const TagsPaneField = (props) => {
  const { schema, path, value, mutators } = props
  const [internalActiveKey, setInternalActiveKey] = useState<string>()
  const [internalTags, setInternalTags] = useState<TagsPaneProps[]>([])
  const [childrenErrors, setChildrenErrors] = useState([])

  const componentProps: TagsPaneFieldProps = schema.getExtendsComponentProps() || {}
  const { tags, activeKey, closable, onTagsChange, ...restProps } = componentProps

  useEffect(() => {
    if ('activeKey' in componentProps) {
      setInternalActiveKey(activeKey)
    }
  }, [activeKey])

  useEffect(() => {
    if ('tags' in componentProps) {
      setInternalTags(tags)
    }
  }, [tags])

  useFormEffects(({ hasChanged }) => {
    onFormChange$().subscribe((formState) => {
      const errorsChanged = hasChanged(formState, 'errors')
      if (errorsChanged) {
        setChildrenErrors(parseChildrenErrors(formState.errors, path))
      }
    })
  })

  const handleTagsChange = (nextKey: string) => {
    setInternalActiveKey(nextKey)
  }

  const handleRemove = (tagKey: string) => {
    const originRemoveFunc: any = restProps.onRemove

    let newActiveKey = internalActiveKey
    let lastIndex = -1
    internalTags.forEach((tag, i) => {
      if (tag.key === tagKey) {
        lastIndex = i - 1
      }
    })
    const newTags = [...internalTags]
    const index = internalTags.findIndex((item) => item.key === tagKey)
    if (index !== -1) {
      newTags.splice(index, 1)
      if (newTags.length && newActiveKey === tagKey) {
        if (lastIndex >= 0) {
          newActiveKey = newTags[lastIndex].key
        } else {
          newActiveKey = newTags[0].key
        }
      }
      setInternalTags(newTags)
      setInternalActiveKey(newActiveKey)
      mutators.remove(index)

      onTagsChange?.(newTags, 'remove')
    }

    if (originRemoveFunc) {
      originRemoveFunc(tagKey)
    }
  }

  const handleAdd = (tagName: string) => {
    const originAddFunc: any = restProps.onAdd

    // 防止输入纯空格字符串
    if (tagName.trim().length) {
      const lastIndex = Math.random().toFixed(16).slice(2, 10)
      const newTags = [
        ...internalTags,
        {
          name: tagName,
          key: `${lastIndex}`,
        },
      ]
      setInternalTags(newTags)
      setInternalActiveKey(`${lastIndex}`)
      mutators.push(schema.items.getEmptyValue())

      onTagsChange?.(newTags, 'add')
    }

    if (originAddFunc) {
      originAddFunc(tagName)
    }
  }

  if (!tags) {
    return null
  }

  return (
    <div>
      <TagsPane
        onChange={handleTagsChange}
        activeKey={internalActiveKey}
        {...restProps}
        onRemove={handleRemove}
        onAdd={handleAdd}
      >
        {toArr(value)?.map((_, index) => {
          const currentTag = internalTags[index]
          if (!currentTag) {
            return null
          }
          const { key, name, ...rest } = currentTag
          const currentPath = FormPath.parse(path).concat(index)
          return (
            <TagsPane.Pane
              name={internalActiveKey === key ? name : addErrorBadge(name, currentPath, childrenErrors)}
              key={`${key}`}
              closable={closable}
              {...rest}
              forceRender
            >
              <FormItemShallowProvider
                key={currentPath.toString()}
                label={undefined}
                labelCol={undefined}
                wrapperCol={undefined}
              >
                <SchemaField path={currentPath} schema={schema.items} />
              </FormItemShallowProvider>
            </TagsPane.Pane>
          )
        })}
      </TagsPane>
    </div>
  )
}

TagsPaneField.isFieldComponent = true

export default TagsPaneField
