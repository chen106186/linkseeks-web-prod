import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesReplaceGoodsPageToBeConfirmVerify } from '@apps/apis'
const ExchangePrConfirm: React.FC = () => {
  return <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeConfirmVerify} pageType="exchangePrConfirm" />
}

export default ExchangePrConfirm
