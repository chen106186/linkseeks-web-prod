import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesRepairGoodsPageToBeSubmitBySupplier } from '@apps/apis'

const RepairPrSubmit: React.FC = () => {
  return (
    <ExchangeApplyView
      request={getAftersalesRepairGoodsPageToBeSubmitBySupplier}
      pageType="repairPrSubmit"
      rowKey="applyId"
    />
  )
}

export default RepairPrSubmit
