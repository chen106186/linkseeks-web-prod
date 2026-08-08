import {action, computed, observable, runInAction} from 'mobx'
import { IBidTenderModule } from '@/module/bidTenderModule';

/**
 * 招投标
 */

class BidTenderStore implements IBidTenderModule {
  // 品类
  @observable public commonCategoryData: any[] = [];
  // 单位
  @observable public commonUnitData: any[] = [];


  @action.bound
  public setCommonCategoryData(data: any[]) {
    this.commonCategoryData = data;
  }

  @action.bound
  public setCommonUnitData(data: any[]) {
    this.commonUnitData = data;
  }

  // 商品品类
  @action.bound
  public async fetchProductCategoryList(getCategoryFn, params, options?) {
    const res = await getCategoryFn(params, options || {})
    runInAction(() => {
      this.commonCategoryData = res.data || []
    })
  }

  // 获取单位
  @action.bound
  public async fetchUnitList(getUnitFn, params, options?) {
    const res = await getUnitFn(params, options || {})
    runInAction(() => {
      this.commonUnitData = res.data || []
    })
  }

}

export default BidTenderStore
