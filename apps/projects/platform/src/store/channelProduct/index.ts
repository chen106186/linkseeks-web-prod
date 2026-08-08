import {action, computed, observable, runInAction} from 'mobx'
import { IChannelProductModule } from '@/module/channelProductModule';

export interface IRole {
  key: string;
  value: number;
  children: string;
}

export interface IChannel {
  name: string;
  memberId?: number;
}
/**
 * 渠道直采商品
 */

class ChannelProductStore implements IChannelProductModule {
  // 选择商品区块
  @observable public productSourceInStore: number = 1;
  @observable public productSelectRowInStore: any = null;
  @observable public priceType: number = null;
  @observable public productName: string = null;
  @observable public tableDataInSetPrice: any[] = null;
  @observable public selectedRole: IRole = null;
  @observable public selectChannel: any = null;
  @observable public selectedSource: number = 1;



  @action.bound
  public setProductSourceInStore(data: number) {
    this.productSourceInStore = data;
  }

  @action.bound
  public setProductSelectRowInStore(data: any) {
    this.productSelectRowInStore = data;
  }

  @action.bound
  public setPriceType(data: number){
    this.priceType = data;
  }

  @action.bound
  public setProductName(data: string){
    this.productName = data;
  }

  @action.bound
  public setTableDataInSetPrice(data: any[]){
    this.tableDataInSetPrice = data;
  }

  @action.bound
  public setSelectedRole(data: IRole){
    this.selectedRole = data;
  }

  @action.bound
  public setSelectChannel(data: any[]){
    this.selectChannel = data
  }

  @action.bound
  public setSelectSource(data: number){
    this.selectedSource = data
  }

}

export default ChannelProductStore
