import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesRepairGoodsPageToBeVerifyStepOne } from '@apps/apis'

const RepairPr1: React.FC = () => {
  return (
    <ExchangeApplyView request={getAftersalesRepairGoodsPageToBeVerifyStepOne} pageType="repairPr1" rowKey="applyId" />
  )
}

export default RepairPr1
