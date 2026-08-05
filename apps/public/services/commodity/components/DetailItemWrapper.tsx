import { Col, Descriptions, Row } from '@linkseeks/ui'
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item'

export interface DetailItemWrapperProps extends DescriptionsItemProps {}
const DetailItemWrapper = (props: DescriptionsItemProps) => {
  const { children, label, span } = props
  const renderLabel = () => {
    return label
  }
  return (
    <Descriptions.Item span={span} label={renderLabel()}>
      {children}
    </Descriptions.Item>
  )
}

export default DetailItemWrapper
