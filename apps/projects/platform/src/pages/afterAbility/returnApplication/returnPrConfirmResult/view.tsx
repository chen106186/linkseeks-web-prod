import { getAftersalesReturnGoodsPageToBeConfirmRefund } from '@apps/apis'

import ReturnApplicationView from '../components/returnApplicationView'

const ReturnPrConfirmResult: React.FC = () => {
  return (
    <ReturnApplicationView request={getAftersalesReturnGoodsPageToBeConfirmRefund} pageType="returnPrConfirmResult" />
  )
}

export default ReturnPrConfirmResult
