import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const createRichTextUtils = () => {
  return {
    text(...args) {
      return React.createElement('span', {}, ...args)
    },
    help(text: string, offset = 3) {
      return React.createElement(
        Tooltip,
        { title: text },
        <QuestionCircleOutlined style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }} />,
      )
    },
  }
}

export default createRichTextUtils
