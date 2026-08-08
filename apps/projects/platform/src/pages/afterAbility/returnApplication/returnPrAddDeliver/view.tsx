import { getAftersalesReturnGoodsPageToBeAddReturnDeliveryGoods } from '@apps/apis'

import ReturnApplicationView from '../components/returnApplicationView'

const ReturnPrAddDeliver: React.FC = () => {
  return (
    <ReturnApplicationView
      request={getAftersalesReturnGoodsPageToBeAddReturnDeliveryGoods}
      pageType="returnPrAddDeliver"
    />
  )
}

export default ReturnPrAddDeliver
