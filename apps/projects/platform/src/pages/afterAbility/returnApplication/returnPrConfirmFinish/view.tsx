import { getAftersalesReturnGoodsPageToBeComplete } from '@apps/apis'
import ReturnApplicationView from '../components/returnApplicationView'

const ReturnPrConfirmFinish: React.FC = () => {
  return <ReturnApplicationView request={getAftersalesReturnGoodsPageToBeComplete} pageType="returnPrConfirmFinish" />
}

export default ReturnPrConfirmFinish
