import { FormInstance } from 'antd'
import DeliveryGoodTableSelect from './DeliveryGoodTableSelect'

interface DeliveryGoodTableModalProps {
  form: FormInstance
  onChange: (value) => void
  disabled?: boolean
  value?: any
}

function DeliveryGoodTableSelectB2B(props: DeliveryGoodTableModalProps) {
  return <DeliveryGoodTableSelect {...props} orderType={1} title={'选择送货商品'} />
}

export default DeliveryGoodTableSelectB2B
