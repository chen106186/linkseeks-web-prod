export const addrFormatValue = (addr) => {
  return `${addr?.fullAddress ?? ''} ${addr?.shipperName ? addr?.shipperName : addr?.receiverName ?? ''}`
}
