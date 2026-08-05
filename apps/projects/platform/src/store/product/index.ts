import {action, computed, observable, runInAction} from 'mobx'
import { IProductModule, IProductSelectAttribute, IBasicFormParam, IPriceAttributeParam, IOtherParam } from '@/module/productModule'; // mobx要用到的数据类型

export interface IPage {
  current: number;
  pageSize: number;
}

export interface IDecsParams {
  id?: number;
  video: string[];
  imageList: string[]	;
  word: string[];
}

class ProductStore implements IProductModule {
  @observable public attributeLists: any[] = [];
  @observable public productName: string = "";
  @observable public brandName: string = "";
  @observable public categoryName: string = "";
  @observable public selectCategoryId: any = null;
  @observable public selectBrandId: any = null;
  @observable public productSelectAttribute: IProductSelectAttribute[] = [];
  @observable public selectedGoods: any[] = [];
  @observable public tableDataSource: any[] = [];
  @observable public priceAttributeParams: any[] = [];
  @observable public productAttributeAndImageParams: any[] = [];
  @observable public areaOption: any[] = [];
  @observable public productInfoByEdit: any;
  @observable public productDescription: IDecsParams;
  @observable public isAllAttributePic: boolean = true;  // 是否所有属性共用
  @observable public currentPageInStore: IPage = { current: null, pageSize: null };  // 页码相关
  @observable public tabClickItem: any[] = []; // tab标签页点击项
  @observable public productPriceType: any = null; // 商品价格类型
  @observable public isRecombination: boolean = false; // 编辑时 是否重新属性组合
  @observable public isCrossBorder: boolean = false; // 跨境商品
  @observable public sendCycle: number; // 品类发货周期

  /**  计算操作 **/
  // 加工接口返回的数据，用户编辑回显数据
  @computed
  public get getBasicFormParamsByEdit(): IBasicFormParam {
    return {
      brandId: this.productInfoByEdit?.brand?.id,
      brandName: this.productInfoByEdit?.brand?.name,
      name: this.productInfoByEdit?.name,
      slogan: this.productInfoByEdit?.slogan,
      sellingPoint: this.productInfoByEdit?.sellingPoint,
      commodityAreaList: this.productInfoByEdit?.commodityAreaList.map(item => [item.provinceCode, item.cityCode, item.regionCode]),
      // 兼容草稿
      customerCategoryId: this.productInfoByEdit?.draft ? this.productInfoByEdit?.customerCategoryId : this.productInfoByEdit?.customerCategory.fullId.split('.').map(item => Number(item) + ''),
      customerCategoryName: this.productInfoByEdit?.customerCategory?.fullName
    }
  }

  @computed
  public get getProductAttributeFormParamsByEdit(): any {
    let attributeArr = this.productInfoByEdit?.commodityAttributeList.map(item => item.customerAttribute)
    let attributeValueArr = this.productInfoByEdit?.commodityAttributeList.map(item => item.customerAttributeValueList)
    if(attributeArr?.length>0 && attributeValueArr?.length>0){
      let attributeIdArr = attributeArr.map(item => item.id)
      let attributeValueIdArr = attributeValueArr.map(item => item.map(_item => _item.id))
      let tempObj = {}
      // console.log(attributeArr, attributeValueArr, this.attributeLists, this.productSelectAttribute,'store Item')
      attributeIdArr.map((item, index) => {
        if(attributeValueIdArr[index].length>1){
          tempObj[item] = attributeValueIdArr[index]
        }else{
          // 类型为2如果是一个的话 为配合checkbox Group也要生成数组
          if(this.attributeLists.filter(_item => _item.id === item)[0]?.type === 2){ // 多选
            tempObj[item] = attributeValueIdArr[index]
          }
          else if(this.attributeLists.filter(_item => _item.id === item)[0]?.type === 3){ // 输入
            tempObj[item] = attributeValueArr[index][0]?.value || ''
          }
          else{
            tempObj[item] = attributeValueIdArr[index][0]
          }
        }
      })
      return tempObj
    }
  }

  @computed
  public get getPriceAttributeFormParamsByEdit(): IPriceAttributeParam {
    return {
      unitId: this.productInfoByEdit?.unitId,
      unitName: this.productInfoByEdit?.unitName,
      subUnitId: this.productInfoByEdit?.subUnitId,
      subUnitName: this.productInfoByEdit?.subUnitName,
      minOrder: this.productInfoByEdit?.minOrder,
      isMemberPrice: this.productInfoByEdit?.isMemberPrice,
      priceType: this.productInfoByEdit?.priceType,
      isTax: true,
      taxRate: this.productInfoByEdit?.taxRate,
      isCrossBorder: this.productInfoByEdit?.isCrossBorder,
    }
  }

  @computed
  public get getOtherFormParamsByEdit(): IOtherParam {
    return {
      isInvoice: this.productInfoByEdit?.isInvoice,
      marks: this.productInfoByEdit?.marks,
      packing: this.productInfoByEdit?.packing,
      afterService: this.productInfoByEdit?.afterService,
      title: this.productInfoByEdit?.title,
      keywords: this.productInfoByEdit?.keywords,
      description: this.productInfoByEdit?.description,
    }
  }

  /** 定义动作区块，外部调用，改变对应的状态 **/
  // 可以改变受观察的public值
  @action.bound
  public setAttributeLists(lists: any[]) {
    this.attributeLists = lists;
  }

  @action.bound
  public setProductName(name: string) {
    this.productName = name;
  }

  @action.bound
  public setCategoryName(name: string) {
    this.categoryName = name;
  }

  @action.bound
  public setBrandName(name: string) {
    this.brandName = name;
  }

  @action.bound
  public setSelectCategoryId(data: any) {
    this.selectCategoryId = data
  }

  @action.bound
  public setSelectBrandId(data: any) {
    this.selectBrandId = data
  }

  @action.bound
  public setProductSelectAttribute(list: any[]) {
    this.productSelectAttribute = list;
  }

  @action.bound
  public setSelectedGoods(list: any[]) {
    this.selectedGoods = list;
  }

  @action.bound
  public setTableDataSource<T>(datas: T[]) {
    this.tableDataSource = datas;
  }

  // 清空商品编辑的数据里面的属性值 用于商品编辑时品类和品牌更改导致数据变动时
  @action.bound
  public clearProductDetailsUnitPriceAndPicListInEdit(data?: any[]) {
    this.productInfoByEdit.unitPriceAndPicList = []
  }

  @action.bound
  public clearData(data?: any[]) {
    this.tableDataSource = data || [];
    this.productName = null;
    this.selectedGoods = [];
    this.productSelectAttribute = [];
    this.productInfoByEdit = null;
    this.attributeLists = [];
    this.selectCategoryId = null;
    this.selectBrandId = null;
    this.productPriceType = null;
    this.isRecombination = false;
    this.sendCycle = null;
    this.isCrossBorder = false;
  }

  // 编辑时 品类变更 清空部分数据
  @action.bound
  public clearPartData(data?: any[]) {
      this.productInfoByEdit.unitId = null;
      this.productInfoByEdit.unitName = null;
      this.productInfoByEdit.subUnitId = null;
      this.productInfoByEdit.subUnitName = null;
      this.productInfoByEdit.minOrder = null;
      this.productInfoByEdit.isMemberPrice = false;
      this.productInfoByEdit.priceType = 1;
      this.productInfoByEdit.commodityAttributeList = [];
      this.productInfoByEdit.unitPriceAndPicList = [];
      this.productInfoByEdit.isAllAttributePic = true;
      this.productInfoByEdit.commodityRemark = {};
      this.productInfoByEdit.logistics = {deliveryType:1, carriageType: 1};
      this.productInfoByEdit.isInvoice = null;
      this.productInfoByEdit.marks = null;
      this.productInfoByEdit.packing = null;
      this.productInfoByEdit.afterService = null;
  }

  @action.bound
  public setPriceAttributeParams<T>(datas: T[]) {
    this.priceAttributeParams = datas
  }

  @action.bound
  public setProductAttributeAndImageParams(datas: any[]) {
    this.productAttributeAndImageParams = datas
  }

  @action.bound
  public setAreaOption(datas: any[]) {
    this.areaOption = datas
  }

  @action.bound
  public setProductInfoByEdit(data: any) {
    this.productInfoByEdit = data
  }

  @action.bound
  public setProductDescription(data: IDecsParams) {
    this.productDescription = data
  }

  @action.bound
  public setIsAllAttributePic(data: boolean) {
    this.isAllAttributePic = data
  }

  @action.bound
  public setCurrentPageInStore(data: IPage) {
    this.currentPageInStore = data
  }

  @action.bound
  public setTabClickItem(data: any) {
    this.tabClickItem = data
  }

  @action.bound
  public setProductPriceType(data: any) {
    this.productPriceType = data
  }

  @action.bound
  public setIsRecombination(data: boolean) {
    this.isRecombination = data
  }

  @action.bound
  public setSendCycle(data: number) {
    this.sendCycle = data
  }
  // 是否跨境商品
  @action.bound
  public setIsCrossBorder(data: boolean) {
    this.isCrossBorder = data
  }

}

export default ProductStore
