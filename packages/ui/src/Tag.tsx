import React from 'react'
import ClassNames from 'classnames'
import { Tag as AntdTag, TagProps as AntdTagProps } from 'antd'
import { colorPrimary, secondPrimary } from './styles/theme/variables'
export interface TagProps extends AntdTagProps {
  type?: 'primary' | 'secondPrimary'
}

const colorMaps = {
  primary: colorPrimary,
  secondPrimary,
}
const Tag = (props: TagProps) => {
  const { className, type, ...reset } = props

  const mixinClassName = ClassNames('ui-tag', className, `ui-tag-${type}`)

  return <AntdTag className={mixinClassName} bordered={false} {...reset} />
}

export default Tag
