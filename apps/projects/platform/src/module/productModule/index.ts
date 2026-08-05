import { GetProductCommodityGetCommodityResponse } from '@apps/apis'
import { GetProductMaterielGetMaterielListResponseDetail } from '@apps/apis'

export interface IBasicFormParam {
  brandId: number
  brandName: string
  commodityAreaList: string[][]
  customerCategoryId: string[]
  customerCategoryName: string
  name: string
  sellingPoint: string[]
  slogan: string
}

export interface IPriceAttributeParam {
  unitId: number
  unitName: string
  subUnitId: number
  subUnitName: string
  minOrder: number
  isMemberPrice: boolean
  priceType: number
  isTax: boolean
  taxRate: number
  isCrossBorder: boolean
}

export interface IOtherParam {
  isInvoice: boolean
  marks: string
  packing: string
  afterService: string
  title: string
  keywords: string
  description: string
}

interface InnerAttributeValueList {
  id: any
  customerAttributeValueId: number
  value: string
}

export interface IProductSelectAttribute {
  customerAttribute: { id: number }
  attributeName: string
  customerAttributeId: number
  customerAttributeValueList: InnerAttributeValueList[]
  isPrice: boolean
  isDate: boolean
}

export interface IDecsParams {
  id?: number
  video: string[]
  image: string[]
  word: string[]
}

export interface IPage {
  current: number
  pageSize: number
}

export interface IProductModule {
  productInfoByEdit: GetProductCommodityGetCommodityResponse
  attributeLists: any[]
  productName: string
  selectCategoryId: any
  selectBrandId: any
  productSelectAttribute: IProductSelectAttribute[] //商品属性传输数据
  selectedGoods: GetProductMaterielGetMaterielListResponseDetail[]
  tableDataSource: any[]
  priceAttributeParams: any[] // 价格设置的传输数据
  productAttributeAndImageParams: any[] //价格属性包含图片的传输数据
  areaOption: any[] // 省市数据
  currentPageInStore: IPage
  tabClickItem: any[]
  productPriceType: any
  isRecombination: boolean

  setAttributeLists(lists: any[]): void
  setProductName(name: string): void
  setSelectCategoryId(datas: any[]): void
  setSelectBrandId(datas: any[]): void
  setProductSelectAttribute(list: IProductSelectAttribute[]): void
  setSelectedGoods(lists: GetProductMaterielGetMaterielListResponseDetail[]): void
  setTableDataSource<T>(datas: T[]): void
  clearData(data: any[]): void
  setPriceAttributeParams<T>(datas: T[]): void
  setProductAttributeAndImageParams(datas: any[]): void
  setAreaOption(datas: any[]): void
  setProductInfoByEdit(data: GetProductCommodityGetCommodityResponse): void
  setCurrentPageInStore(data: IPage): void
  setTabClickItem(data: any): void
  setProductPriceType(data: any): void
  setIsRecombination(data: boolean): void
}
