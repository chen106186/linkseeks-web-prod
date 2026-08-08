import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesReplaceGoodsPageToBeReturnReceiveGoods } from '@apps/apis'

const ExchangePrReceived: React.FC = () => {
  return (
    <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeReturnReceiveGoods} pageType="exchangePrReceived" />
  )
}

export default ExchangePrReceived
