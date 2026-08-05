import ExchangeApplyView from '../../components/ExchangeApplyView'
import { getAftersalesRepairGoodsPageToBeConfirm } from '@apps/apis'

const RepairPrConfirm: React.FC = () => {
  return (
    <ExchangeApplyView request={getAftersalesRepairGoodsPageToBeConfirm} pageType="repairPrConfirm" rowKey="applyId" />
  )
}

export default RepairPrConfirm
