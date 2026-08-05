import { action, makeObservable, observable } from 'mobx'
import { RootStoreModel } from '../rootStore/model'
import { WorkBenchStoreModel, menuType, IMenudatas, IModuleData } from './model'
import { getOssUrlPath } from '@apps/constants'

const inquiry = getOssUrlPath('/miniprogram/assets/images/inquiry.png')
const quotation = getOssUrlPath('/miniprogram/assets/images/quotation.png')
const purchase = getOssUrlPath('/miniprogram/assets/images/purchase.png')
const demand = getOssUrlPath('/miniprogram/assets/images/demand.png')
const demandQuotation = getOssUrlPath('/miniprogram/assets/images/demandQuotation.png')
const replace = getOssUrlPath('/miniprogram/assets/images/replace.png')
const returnImage = getOssUrlPath('/miniprogram/assets/images/returns.png')
const repair = getOssUrlPath('/miniprogram/assets/images/repair.png')
const electronicSign = getOssUrlPath('/miniprogram/assets/images/electronicSign.png')
const balance = getOssUrlPath('/miniprogram/assets/images/balance.png')
const creditUser = getOssUrlPath('/miniprogram/assets/images/creditUser.png')

export default class WorkBenchStore implements WorkBenchStoreModel {
  private rootStore: RootStoreModel

  alwaysUserMenu: menuType[] = [
    {
      icon: inquiry,
      text: '商品询价记录',
      url: 'GoodsRfqRecord',
    },
    {
      icon: quotation,
      text: '报价单查询',
      url: 'QuoteInquire',
    },
    {
      icon: purchase,
      text: '采购订单',
      url: 'PurchaseOrderInquire',
    },
  ]

  balanceMenu: any[] = ['balance', 'creditUser']

  otherMenu: IMenudatas[] = [
    {
      title: '交易管理',
      dataSource: [
        {
          icon: inquiry,
          text: '商品询价记录',
          url: 'GoodsRfqRecord',
        },
        {
          icon: quotation,
          text: '报价单查询',
          url: 'QuoteInquire',
        },
        {
          icon: purchase,
          text: '采购订单',
          url: 'PurchaseOrderInquire',
        },
      ],
    },
    {
      title: '求购管理',
      dataSource: [
        {
          icon: demand,
          text: '需求查询',
          url: null,
        },
        {
          icon: demandQuotation,
          text: '需求报价单查询',
          url: null,
        },
      ],
    },
    {
      title: '售后管理',
      dataSource: [
        {
          icon: replace,
          text: '换货记录',
          url: null,
        },
        {
          icon: returnImage,
          text: '退货记录',
          url: null,
        },
        {
          icon: repair,
          text: '维修记录',
          url: 'RepairRecords',
        },
      ],
    },
    {
      title: '业务申请',
      dataSource: [
        {
          icon: electronicSign,
          text: '电子签章',
          url: 'Promotion',
        },
      ],
    },
  ]

  /**
   * 所有模块
   */
  allModules: IModuleData[] = [
    {
      title: '交易管理',
      dataSource: [
        {
          icon: inquiry,
          text: '商品询价记录',
          checked: true,
          dataIndex: 'inquiry',
        },
        {
          icon: quotation,
          text: '报价单查询',
          checked: true,
          dataIndex: 'quotation',
        },
        {
          icon: purchase,
          text: '采购订单',
          checked: true,
          dataIndex: 'purchase',
        },
      ],
    },
    {
      title: '支付账号',
      dataSource: [
        {
          icon: balance,
          text: '资金账户',
          checked: true,
          dataIndex: 'balance',
        },
        {
          icon: creditUser,
          text: '授信账户',
          checked: true,
          dataIndex: 'creditUser',
        },
      ],
    },
    {
      title: '求购管理',
      dataSource: [
        {
          icon: demand,
          text: '需求查询',
          checked: true,
          dataIndex: 'demand',
        },
        {
          icon: demandQuotation,
          text: '需求报价单查询',
          checked: true,
          dataIndex: 'demandQuotation',
        },
      ],
    },
    {
      title: '售后管理',
      dataSource: [
        {
          icon: replace,
          text: '换货记录',
          checked: true,
          dataIndex: 'replace',
        },
        {
          icon: returnImage,
          text: '退货记录',
          checked: true,
          dataIndex: 'returnImage',
        },
        {
          icon: repair,
          text: '维修记录',
          checked: true,
          dataIndex: 'RepairRecords',
        },
      ],
    },
    {
      title: '业务申请',
      dataSource: [
        {
          icon: electronicSign,
          text: '电子签章',
          checked: true,
          dataIndex: 'electronicSign',
        },
      ],
    },
  ]

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      alwaysUserMenu: observable,
      otherMenu: observable,
      balanceMenu: observable,
      allModules: observable,
      changeModulesVisible: action.bound,
      changeOtherMenu: action.bound,
    })
    this.rootStore = rootStore
  }

  /**
   * 修改模块显示
   */
  changeModulesVisible(params: any) {
    const { checked, dataIndex, parentIndex } = params
    const all = [...this.allModules]
    const temp = all[parentIndex]
    const targetIndex = temp.dataSource.findIndex((_item) => _item.dataIndex === dataIndex)
    const targetValue = temp.dataSource[targetIndex]
    temp.dataSource[targetIndex] = {
      ...targetValue,
      checked,
    }
    all.splice(parentIndex, 1, temp)
    this.allModules = all
  }

  /**
   * 改变工作台首页显示的menu
   */
  changeOtherMenu() {
    const modules = this.allModules.filter((_item) => _item.title !== '支付账号')
    const res = modules
      .map((_item) => ({
        ..._item,
        dataSource: _item.dataSource.filter((_row) => _row.checked),
      }))
      .filter((_item) => _item.dataSource.length)
    this.otherMenu = res
    const balanceModules = this.allModules.filter((_item) => _item.title === '支付账号')[0]
    this.balanceMenu = balanceModules.dataSource.filter((_item) => _item.checked).map((_item) => _item.dataIndex)
  }
}
