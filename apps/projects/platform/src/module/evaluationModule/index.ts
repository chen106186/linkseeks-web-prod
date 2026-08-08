export interface IEvaluationModule {
  // 供应会员评价管理
  supplier: {
    activeKey: string, 
  };
  
  // 采购会员评价管理
  purchaser: {
    activeKey: string, 
  };

  setSupplierActiveKey(key: string): void;

  setPurchaserActiveKey(key: string): void;
}