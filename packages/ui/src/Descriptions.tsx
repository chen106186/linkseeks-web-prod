import React from 'react'
import { Descriptions as AntdDescriptions, DescriptionsProps as AntdDescriptionsProps } from 'antd'

export interface DescriptionsProps extends AntdDescriptionsProps {}

const Descriptions = (props: DescriptionsProps) => {
  return <AntdDescriptions className="ui-descriptions" {...props} />
}

Descriptions.Item = AntdDescriptions.Item

export default Descriptions
