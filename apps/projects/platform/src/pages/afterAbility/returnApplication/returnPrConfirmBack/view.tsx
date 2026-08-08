import { getAftersalesReturnGoodsPageToBeConfirmReturnGoodsReceipt } from '@apps/apis'
import ReturnApplicationView from '../components/returnApplicationView'
const ReturnPrConfirmBack: React.FC = () => {
  return (
    <ReturnApplicationView
      request={getAftersalesReturnGoodsPageToBeConfirmReturnGoodsReceipt}
      pageType="returnPrConfirmBack"
    />
  )
}

export default ReturnPrConfirmBack
