import type { FormInstance } from 'antd'
import DeliveryGoodTableSelect from './DeliveryGoodTableSelect'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

interface DeliveryGoodTableModalProps {
  form: FormInstance
  onChange: (value) => void
  disabled?: boolean
  value?: any
}

function DeliveryGoodTableSelectB2B(props: DeliveryGoodTableModalProps) {
  return (
    <DeliveryGoodTableSelect {...props} orderType={1} title={translate('web.resource.order.xuanzesonghuoshangpin')} />
  )
}

export default DeliveryGoodTableSelectB2B
