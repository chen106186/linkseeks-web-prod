import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  getLogisticsShipperAddressGet,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import AddressDrawer from './AddressDrawer'
import { getWebIntl } from '@apps/locales'

export { default as AddressDrawer } from './AddressDrawer'

const translate = getWebIntl()
export const ReceiverAddress = (props) => {
  return (
    <AddressDrawer
      title={{
        label: translate('web.resource.logistics.shouhuoren'),
        name: 'receiverName',
      }}
      {...props}
      addressListRequest={(val) => {
        return getLogisticsSelectListReceiverAddress(val)
      }}
      sumbitRequest={{
        update: (val) => {
          return postLogisticsReceiverAddressUpdate(val)
        },
        add: (val) => {
          return postLogisticsReceiverAddressAdd(val)
        },
        info: (val) => {
          return getLogisticsReceiverAddressGet(val)
        },
      }}
    />
  )
}

export const ShipperAddress = (props) => {
  return (
    <AddressDrawer
      title={{
        label: translate('web.resource.logistics.fahuoren'),
        name: 'shipperName',
      }}
      {...props}
      addressListRequest={(val) => {
        return getLogisticsSelectListShipperAddress(val)
      }}
      sumbitRequest={{
        update: (val) => {
          return postLogisticsShipperAddressUpdate(val)
        },
        add: (val) => {
          return postLogisticsShipperAddressAdd(val)
        },
        info: (val) => {
          return getLogisticsShipperAddressGet(val)
        },
      }}
    />
  )
}

export const FormatValue = (addr) => {
  let result = `${addr?.fullAddress ?? ''} ${addr?.shipperName ? addr?.shipperName ?? '' : addr?.receiverName ?? ''} ${
    addr?.phone ?? ''
  }`
  return result
}
