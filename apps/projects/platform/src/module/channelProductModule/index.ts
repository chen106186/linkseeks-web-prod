import { GetProductChannelCommodityGetCommodityUnitPriceResponse } from '@apps/apis';

export interface IRole {
  key: string;
  value: number;
  children: string;
}

export interface IChannel {
  name: string;
  memberId?: number;
}

export interface IChannelProductModule {
  productSelectRowInStore: any;
  productSourceInStore: number;
  priceType: number;
  productName: string;
  selectedRole: IRole;
  tableDataInSetPrice: GetProductChannelCommodityGetCommodityUnitPriceResponse[];
  selectChannel: any[];
  selectedSource: number;

  setProductSelectRowInStore(data: any): void;
  setProductSourceInStore(data: number): void;
  setPriceType(data: number): void;
  setProductName(data: string): void;
  setSelectedRole(data: IRole): void;
  setTableDataInSetPrice(data: GetProductChannelCommodityGetCommodityUnitPriceResponse[]): void;
  setSelectChannel(data: any): void;
  setSelectSource(data: number): void;
}
