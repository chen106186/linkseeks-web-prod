import { getAftersalesReplaceGoodsPageToBeConfirmReturnGoodsReceipt } from '@apps/apis'
import ExchangeReceived from '../components/ExchangeReceived'

const ExchangePrConfirmBack: React.FC = () => {
  return (
    <ExchangeReceived
      request={getAftersalesReplaceGoodsPageToBeConfirmReturnGoodsReceipt}
      pageType="exchangePrConfirmBack"
    />
  )
}

export default ExchangePrConfirmBack
