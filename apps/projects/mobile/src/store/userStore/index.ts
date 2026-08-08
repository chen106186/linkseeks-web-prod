import { action, makeObservable, observable, runInAction } from 'mobx'
import { getAsyncStorage, setAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { ENVIRONMENT } from '@/constants'
import {
  USER_INFO,
  TOKEN,
  ALL_MALL_LIST,
  CURRENT_CHANNEL_INFO,
  CURRENT_SELF_INFO,
  CURRENT_MALL,
} from '@/constants/storage'
import {
  postCommodityMobileShopMobileAll,
  getMemberMobileLoginReget,
  getSupportTimGetUserSig,
  getSupportTimGetUnreadMsgNum,
  getCommodityMobileShopMobileShopSelect,
} from '@apps/apis'
import { RootStoreModel } from '../rootStore/model'
// import TencentCloudChat from '@tencentcloud/chat'
import {
  UserStoreModel,
  userInfoType,
  AddressItem,
  InvoiceType,
  SuperiorChannelItemType,
  SelfMallInfoType,
  MallInfoType,
  ShopInfoType,
} from './model'
import { getLocalMallInfo, setLocalMallInfo } from '@apps/mobile-services/hooks/useEnterShopInfo'
// import { TUILogin } from '@tencentcloud/tui-core'
export default class UserStore implements UserStoreModel {
  private rootStore: RootStoreModel

  userInfo: userInfoType | null = null

  shopAndSite: ShopInfoType | null = null

  allMallList: MallInfoType[] = []

  addressItem: AddressItem | null = null

  splashImageUrl: string = ''

  guaidListUrl: string[] = []

  invoiceInfo: InvoiceType | null = null

  imReady: boolean = false

  // 联营商城列表
  mallList: any[] = []

  // 当前使用联营商城
  currentMall: any = {}
  // IM 轮询控制器
  intervalTimer: any = null
  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      userInfo: observable,
      allMallList: observable,
      shopAndSite: observable,
      fetchUserInfo: action.bound,
      fetchShopAndSite: action.bound,
      setShopAndSite: action.bound,
      setUserInfo: action.bound,
      removeUserInfo: action.bound,
      addressItem: observable,
      setAddressItem: action.bound,
      splashImageUrl: observable,
      setSplashImage: action.bound,
      guaidListUrl: observable,
      setGuaidImageList: action.bound,
      refreshUserInfo: action.bound,
      fetchStoreAllMallList: action.bound,
      invoiceInfo: observable,
      setInvoiceInfo: action.bound,
      fetchAllMallList: action.bound,
      imReady: observable,
      mallList: observable,
      currentMall: observable,
      setCurrentMall: action.bound,
      setMallList: action.bound,
    })
    this.rootStore = rootStore
    this.fetchUserInfo()
    this.fetchShopAndSite()
    this.fetchMallList()
  }

  fetchMallList = async () => {
    const { code, data } = await getCommodityMobileShopMobileShopSelect({ environment: ENVIRONMENT } as any)
    if (code === 1000) {
      this.setMallList(data.shopSelectList || [])
      getAsyncStorage(CURRENT_MALL).then((storageData) => {
        if (storageData) {
          this.setCurrentMall(storageData)
        } else {
          if (data?.shopSelectList?.length) {
            this.setCurrentMall(data.shopSelectList?.[0] || {})
          }
        }
      })
      this.setCurrentMall(data.shopSelectList?.[0] || {})
    }
  }
  // 获取站点所有商城
  fetchStoreAllMallList() {
    getAsyncStorage(ALL_MALL_LIST).then((data) => {
      this.allMallList = data
    })
  }

  // 请求接口获取所有的商城集合
  async fetchAllMallList() {
    const params: any = {
      environment: ENVIRONMENT,
    }
    const res = await postCommodityMobileShopMobileAll(params)
    await setAsyncStorage(ALL_MALL_LIST, res.data || [])
    runInAction(() => {
      if (res.code === 1000) {
        this.allMallList = res.data
      }
    })
  }

  fetchUserInfo() {
    getAsyncStorage(USER_INFO).then((data) => {
      this.userInfo = data
    })
  }

  // 从缓存中获取商城信息并注入mobx
  fetchShopAndSite() {
    const mallInfo = getLocalMallInfo()
    this.shopAndSite = mallInfo
  }

  // 设置商城和站点
  async setShopAndSite(data: ShopInfoType) {
    setLocalMallInfo(data)
    runInAction(() => {
      this.shopAndSite = data
    })
  }

  // 用户登录时，或者修改用户信息的时候更新UserInfo
  async setUserInfo(data: userInfoType) {
    await setAsyncStorage(USER_INFO, data)
    runInAction(() => {
      this.userInfo = data
    })
  }

  async removeUserInfo() {
    await removeAsyncStorage(TOKEN)
    await removeAsyncStorage(USER_INFO)
    await removeAsyncStorage(CURRENT_CHANNEL_INFO)
    // 商品分享口令生成数字
    await removeAsyncStorage('SHARE_CODE_NUM')
    runInAction(() => {
      this.userInfo = null
    })
  }

  /* 存储地址的item */
  setAddressItem(item: any) {
    this.addressItem = item
  }

  /* 设置广告屏 */
  setSplashImage(imageUrl: string) {
    this.splashImageUrl = imageUrl
  }

  /** 设置引导页 */
  setGuaidImageList(imageUrl: string[]) {
    this.guaidListUrl = imageUrl
  }

  /**
   * 重新获取用户信息
   */
  async refreshUserInfo() {
    const { code, data } = await getMemberMobileLoginReget({ shopType: '1' })
    if (code === 1000) {
      await setAsyncStorage(USER_INFO, data)
      runInAction(() => {
        this.userInfo = data
      })
    }
  }
  /** 设置发票 */
  setInvoiceInfo(invoiceItem: InvoiceType | null) {
    this.invoiceInfo = invoiceItem
  }

  setMallList(mallList: any[]) {
    this.mallList = mallList
  }
  setCurrentMall(currentMall: any) {
    this.currentMall = currentMall
  }
}
