import ExchangeApplyView from '../../components/ExchangeApplyView'

import { getAftersalesReplaceGoodsPageToBeVerifyStepOne } from '@apps/apis'

const ExchangePr1: React.FC = () => {
  return <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeVerifyStepOne} pageType="exchangePr1" />
}

export default ExchangePr1
