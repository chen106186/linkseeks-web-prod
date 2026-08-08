import React from 'react'
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import { useSlate } from 'slate-react'
import {
  CodeEditIcon,
  HeadOneIcon,
  HeadTwoIcon,
  HeadThreeIcon,
  HeadFourIcon,
  HeadFiveIcon,
  HeadSixIcon,
  QuoteIcon,
} from '@linkseeks/icons'
import { toggleBlock, toggleMark, isMarkActive, isBlockActive } from '../utils'
import { TEXT_ALIGN_TYPES } from '../constants'

const iconMaps = {
  bold: <BoldOutlined />,
  italic: <ItalicOutlined />,
  underline: <UnderlineOutlined />,
  code: <CodeEditIcon />,
  head1: <HeadOneIcon />,
  head2: <HeadTwoIcon />,
  head3: <HeadThreeIcon />,
  head4: <HeadFourIcon />,
  head5: <HeadFiveIcon />,
  head6: <HeadSixIcon />,
  quote: <QuoteIcon />,
  orderedList: <OrderedListOutlined />,
  unorderedList: <UnorderedListOutlined />,
  alignLeft: <AlignLeftOutlined />,
  alignCenter: <AlignCenterOutlined />,
  alignRight: <AlignRightOutlined />,
}

export const IconMarkButton = (props) => {
  const { format, icon, type, ...resetProps } = props
  const editor = useSlate()

  const handleClick = (e) => {
    e.preventDefault()

    toggleMark(editor, format)
  }

  const style = {
    color: isMarkActive(editor, format) ? '#252d37' : '#91959b',
  }
  return (
    <span onClick={handleClick} className="cp-reditable-icon-btn" style={style} {...resetProps}>
      {iconMaps[icon]}
    </span>
  )
}

export const IconBlockButton = (props) => {
  const { format, icon, ...resetProps } = props
  const editor = useSlate()

  const handleClick = (e) => {
    e.preventDefault()
    toggleBlock(editor, format)
  }

  const style = {
    color: isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type') ? '#252d37' : '#91959b',
  }
  return (
    <span onClick={handleClick} className="cp-reditable-icon-btn" style={style} {...resetProps}>
      {iconMaps[icon]}
    </span>
  )
}
