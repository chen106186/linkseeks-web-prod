import { getAftersalesReturnGoodsPageToBeAddLogisticsByConsumer } from '@apps/apis'

import ReturnApplicationView from '../components/returnApplicationView'

const ReturnPrAddLogistics: React.FC = () => {
  return (
    <ReturnApplicationView
      request={getAftersalesReturnGoodsPageToBeAddLogisticsByConsumer}
      pageType="returnPrAddLogistics"
    />
  )
}

export default ReturnPrAddLogistics
