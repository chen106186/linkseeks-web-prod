import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesRepairGoodsPageToBeVerifyStepTwo } from '@apps/apis'

const RepairPr2: React.FC = () => {
  return (
    <ExchangeApplyView request={getAftersalesRepairGoodsPageToBeVerifyStepTwo} pageType="repairPr2" rowKey="applyId" />
  )
}

export default RepairPr2
