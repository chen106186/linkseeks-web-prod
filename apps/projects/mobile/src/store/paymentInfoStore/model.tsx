export interface PaymentInfoStoreModel {
  paymentInfo: Array<{ [key: string]: any }>,
  setPaymentInfo: Function,

  query: {[key: string]: any},
  setQuery: Function,

  refresh: boolean,
  clearRefresh: () => void,
  setRefresh: (flag: boolean) => void,
}
