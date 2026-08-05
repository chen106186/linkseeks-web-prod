import React from "react"
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons"

const createRichTextUtils = () => {
  return {
    text(...args) {
      return React.createElement('span', {}, ...args)
    },
    link(text: string, href: string, target: "_blank" | "_self" | "_parent" | "_top") {
      return React.createElement('a', { href, target }, text)
    },
    gray(text: string) {
      return React.createElement(
        'span',
        { style: { color: 'gray', margin: '0 3px' } },
        text
      )
    },
    red(text: string) {
      return React.createElement(
        'span',
        { style: { color: 'red', margin: '0 3px' } },
        text
      )
    },
    help(text: string, offset = 3) {
      return React.createElement(
        Tooltip,
        { title: text },
        <QuestionCircleOutlined
          style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }}
        />
      )
    },
    tips(text: string, tips: string) {
      return React.createElement(
        Tooltip,
        { title: tips },
        <span style={{ margin: '0 3px', cursor: 'default' }}>{text}</span>
      )
    }
  }
}

export default createRichTextUtils
