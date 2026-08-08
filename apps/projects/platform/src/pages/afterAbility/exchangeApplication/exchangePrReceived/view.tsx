import { getAftersalesReplaceGoodsPageToBeReplaceReceiveGoods } from '@apps/apis'

import ExchangeReceived from '../components/ExchangeReceived'
const ExchangePrReceived = () => {
  return (
    <ExchangeReceived request={getAftersalesReplaceGoodsPageToBeReplaceReceiveGoods} pageType="exchangePrReceived" />
  )
}
export default ExchangePrReceived
