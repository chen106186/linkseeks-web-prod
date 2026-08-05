import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesReplaceGoodsPageToBeConfirmReplaceGoodsReceipt } from '@apps/apis'

const ExchangePrConfirmBack: React.FC = () => {
  return (
    <ExchangeApplyView
      request={getAftersalesReplaceGoodsPageToBeConfirmReplaceGoodsReceipt}
      pageType="exchangePrConfirmBack"
    />
  )
}

export default ExchangePrConfirmBack
