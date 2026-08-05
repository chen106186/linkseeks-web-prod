import ExchangeApplyView from '../../components/ExchangeApplyView'

import { getAftersalesReplaceGoodsPageToBeVerifyStepTwo } from '@apps/apis'

const ExchangePr2: React.FC = () => {
  return <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeVerifyStepTwo} pageType="exchangePr2" />
}

export default ExchangePr2
