import { FormInstance } from 'antd'
import DeliveryGoodTableSelect from './DeliveryGoodTableSelect'

interface DeliveryGoodTableModalProps {
  form: FormInstance
  onChange: (value) => void
  disabled?: boolean
  value?: any
}

function DeliveryGoodTableSelectSRM(props: DeliveryGoodTableModalProps) {
  return <DeliveryGoodTableSelect {...props} orderType={2} title={'选择送货物料'} />
}

export default DeliveryGoodTableSelectSRM
