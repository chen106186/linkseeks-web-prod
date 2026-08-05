import React from 'react'
import { Editor, Element as SlateElement, Transforms, Node as SlateNode, Text } from 'slate'
import escapeHtml from 'escape-html'
import { jsx } from 'slate-hyperscript'
import { TEXT_ALIGN_TYPES, LIST_TYPES } from './constants'
// 定义一个序列化函数，该函数接受一个值并返回一个字符串。
export const serialize = (node: any) => {
  if (Text.isText(node) as any) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    if (node.italic) {
      string = `<em>${string}</em>`
    }
    if (node.underline) {
      string = `<u>${string}</u>`
    }
    if (node.code) {
      string = `<code>${string}</code>`
    }
    return string
  }
  const children = node.children.map((n) => serialize(n)).join('')
  const attr = node.align ? ` style='text-align: ${node.align}'` : ''
  switch (node.type) {
    case 'block-quote':
      return `<blockquote${attr}>${children}</blockquote>`
    case 'paragraph':
      return `<p${attr}>${children}</p>`
    case 'heading-one':
      return `<h1${attr}>${children}</h1>`
    case 'heading-two':
      return `<h2${attr}>${children}</h2>`
    case 'heading-three':
      return `<h3${attr}>${children}</h3>`
    case 'heading-four':
      return `<h4${attr}>${children}</h4>`
    case 'heading-five':
      return `<h5${attr}>${children}</h5>`
    case 'heading-six':
      return `<h6${attr}>${children}</h6>`
    case 'numbered-list':
      return `
				<ol${attr}>${children}</ol>
			`
    case 'bulleted-list':
      return `<ul${attr}>${children}</ul>`
    case 'list-item':
      return `<li${attr}>${children}</li>`
    default:
      return children
  }
}

// 定义一个反序列化函数，该函数接受一个字符串并返回一个值。
export const deserialize = (string) => {
  const document = new DOMParser().parseFromString(string, 'text/html')
  const el = document.body
  return transformHtmlString(el)
}

export const transformHtmlString = (el, attr = {}) => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', attr, el.textContent)
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const nodeAttributes: any = { ...attr }

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes.bold = true
      break
    case 'EM':
      nodeAttributes.italic = true
      break
    case 'CODE':
      nodeAttributes.code = true
      break
    case 'U':
      nodeAttributes.underline = true
      break
  }

  const children = Array.from(el.childNodes)
    .map((node) => transformHtmlString(node, nodeAttributes))
    .flat()
  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''))
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'block-quote' }, children)
    case 'P':
      return jsx('element', { type: 'paragraph' }, children)
    case 'H1':
      return jsx('element', { type: 'heading-one' }, children)
    case 'H2':
      return jsx('element', { type: 'heading-two' }, children)
    case 'H3':
      return jsx('element', { type: 'heading-three' }, children)
    case 'H4':
      return jsx('element', { type: 'heading-four' }, children)
    case 'H5':
      return jsx('element', { type: 'heading-five' }, children)
    case 'H6':
      return jsx('element', { type: 'heading-six' }, children)
    case 'OL':
      return jsx('element', { type: 'numbered-list' }, children)
    case 'UL':
      return jsx('element', { type: 'bulleted-list' }, children)
    case 'LI':
      return jsx('element', { type: 'list-item' }, children)
    default:
      return children
  }
}

export const renderNode = ({ attributes, children, element }) => {
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
/**
 * ------------- 工具栏 --------------
 */

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  )

  return !!match
}

// 切换样式
export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// 切换元素
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: any
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}
