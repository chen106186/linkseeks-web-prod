import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesReplaceGoodsPageToBeReplaceDeliveryGoods } from '@apps/apis'

const ExchangePrDeliver: React.FC = () => {
  return (
    <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeReplaceDeliveryGoods} pageType="exchangePrDeliver" />
  )
}

export default ExchangePrDeliver
