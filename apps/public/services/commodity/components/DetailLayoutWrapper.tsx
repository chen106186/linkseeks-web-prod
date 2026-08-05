import { Col, Descriptions, Row } from '@linkseeks/ui'
import { CardWrapper } from '@apps/components'

interface DetailLayoutWrapperProp {
  id?: string
  children: any
  title: any
  isPadding?: boolean
}
const DetailLayoutWrapper = (props: DetailLayoutWrapperProp) => {
  const { id, children, title, isPadding = true } = props
  return (
    <CardWrapper id={id} bodyStyle={isPadding ? {} : { padding: 0 }}>
      <Descriptions title={title} column={2}>
        {children}
      </Descriptions>
    </CardWrapper>
  )
}

export default DetailLayoutWrapper
