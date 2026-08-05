import { getAftersalesReturnGoodsPageToBeReturnDeliveryGoods } from '@apps/apis'

import ReturnApplicationView from '../components/returnApplicationView'

const ReturnPrDeliver: React.FC = () => {
  return (
    <ReturnApplicationView request={getAftersalesReturnGoodsPageToBeReturnDeliveryGoods} pageType="returnPrDeliver" />
  )
}

export default ReturnPrDeliver
