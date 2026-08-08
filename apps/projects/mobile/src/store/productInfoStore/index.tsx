import { action, makeObservable, observable } from 'mobx';
import { ProductInfoStoreModel } from './model';
import { RootStoreModel } from '../rootStore/model';

export default class ProductInfoStore implements ProductInfoStoreModel {
  private rootStore: RootStoreModel;

  productInfo: any = null;

  /** 采购订单新增入库单选择商品 */
  selectProductItem: any = null;

  /** 采购订单选择商品的ids */
  selectProductItemKeys: [] = [];

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      productInfo: observable,
      setProductInfo: action.bound,

      selectProductItem: observable,
      selectProductItemKeys: observable,
      setSelectProductItem: action.bound,
      setSelectProductItemKeys: action.bound,
    });
    this.rootStore = rootStore;
  }

  setProductInfo(payInfo: { [key: string]: any }) {
    this.productInfo = payInfo
  }

  setSelectProductItem(data: []) {
    this.selectProductItem = data;
  }

  setSelectProductItemKeys(keys: []) {
    this.selectProductItemKeys = keys;
  }
}
