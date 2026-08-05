/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-29 14:08:28
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-29 14:19:19
 * @Description: 
 */
import { action, observable}  from 'mobx'
import { IEvaluationModule } from '@/module/evaluationModule';

/**
 * 供应会员评价、采购会员评价管理会员管理
 */

class EvaluationStore implements IEvaluationModule {
  @observable public supplier = {
    activeKey: '1',
  };
  
  @observable public purchaser = {
    activeKey: '1',
  };

  @action.bound
  public setSupplierActiveKey(key: string) {
    this.supplier.activeKey = key;
  }
  
  @action.bound
  public setPurchaserActiveKey(key: string) {
    this.purchaser.activeKey = key;
  }
}

export default EvaluationStore;
