import { getAftersalesReplaceGoodsPageToBeAddReplaceGoodsStorage } from '@apps/apis'
import ExchangeReceived from '../components/ExchangeReceived'
const ExchangePrAddWarehousing: React.FC = () => (
  <ExchangeReceived
    request={getAftersalesReplaceGoodsPageToBeAddReplaceGoodsStorage}
    pageType="exchangePrAddWarehousing"
  />
)

export default ExchangePrAddWarehousing
