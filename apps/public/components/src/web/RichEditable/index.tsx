import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Element as SlateElement, Node, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import classNames from 'classnames'
import Toolbar from './components/Toolbar'
import { deserialize, serialize } from './utils'
import './index.less'
import { IconBlockButton, IconMarkButton } from './components/IconButton'
import { useWebIntl } from '@apps/locales'
const defaultInitialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      )
    case 'heading-four':
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      )
    case 'heading-five':
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      )
    case 'heading-six':
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export interface RichEditableProps {
  value?: string
  initValue?: string
  onChange?(value: string, event): void
  className?: string
}

/**
 * 富文本编辑器，基于slate实现
 * 官网地址 https://docs.slatejs.org/
 */
const RichEditable = (props: RichEditableProps) => {
  const { value, initValue, className, onChange } = props
  const [editor] = useState(() => withReact(withHistory(createEditor())))
  const translate = useWebIntl()
  // 控制渲染元素，例如大号字体，列表
  const renderElement = useCallback((props) => <Element {...props} />, [])

  // 控制渲染本身样式，例如加粗，斜体
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const initialValue = useMemo(() => {
    return initValue ? deserialize(initValue) : defaultInitialValue
  }, [initValue])

  const handleChange = (value) => {
    const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type)
    if (isAstChange) {
      const content = value.map((node) => serialize(node))
      const parseContent = content.join('')
      onChange &&
        onChange(parseContent, {
          content,
          parseContent,
        })
    }
  }
  return (
    <div className={classNames('cp-reditable-container', className)}>
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Toolbar>
          <IconMarkButton format="bold" icon="bold" />
          <IconMarkButton format="italic" icon="italic" />
          <IconMarkButton format="underline" icon="underline" />
          <IconMarkButton format="code" icon="code" />
          <IconBlockButton format="heading-one" icon="head1" />
          <IconBlockButton format="heading-two" icon="head2" />
          <IconBlockButton format="heading-three" icon="head3" />
          <IconBlockButton format="heading-four" icon="head4" />
          <IconBlockButton format="heading-five" icon="head5" />
          <IconBlockButton format="heading-six" icon="head6" />
          <IconBlockButton format="block-quote" icon="quote" />
          <IconBlockButton format="numbered-list" icon="orderedList" />
          <IconBlockButton format="bulleted-list" icon="unorderedList" />
          <IconBlockButton format="left" icon="alignLeft" />
          <IconBlockButton format="center" icon="alignCenter" />
          <IconBlockButton format="right" icon="alignRight" />
        </Toolbar>
        <Editable
          placeholder={translate.formatFormInputTip('')}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            minHeight: 150,
            paddingLeft: 8,
            paddingRight: 8,
          }}
        />
      </Slate>
    </div>
  )
}

export default RichEditable
