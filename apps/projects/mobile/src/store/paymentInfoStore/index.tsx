import { action, makeObservable, observable } from 'mobx';
import { PaymentInfoStoreModel } from './model';
import { RootStoreModel } from '../rootStore/model';

export default class PaymentInfoStore implements PaymentInfoStoreModel {
  private rootStore: RootStoreModel;

  paymentInfo: Array<{ [key: string]: any }> = [];

  query: { [key: string]: any } = {}

  refresh: boolean = false;

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      paymentInfo: observable,
      setPaymentInfo: action.bound,

      query: observable,
      setQuery: action.bound,

      refresh: observable,
      setRefresh: action.bound,
      clearRefresh: action.bound,

    });
    this.rootStore = rootStore;
  }

  setPaymentInfo(payInfo: Array<{ [key: string]: any }>) {
    this.paymentInfo = payInfo
  }

  setQuery(data: {}) {
    this.query = data
  }

  setRefresh(flag: boolean) {
    this.refresh = flag
  }

  clearRefresh() {
    this.refresh = false
  }
}
