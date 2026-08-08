import useStores from '@/store/useStores'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import uploadFileRequest from '@/utils/uploadFileRequest'
import {
  postTradeMobileAskPurchaseSaveOrUpdate,
  getLogisticsMobileSelectListReceiverAddress,
  GetLogisticsMobileSelectListReceiverAddressResponse,
  getMemberManageUsersPage,
  GetMemberManageUsersPageResponseDetail,
  getCommodityShopShopBList,
  GetCommodityShopShopBListResponse,
  getProductSelectGetSelectUnit,
  GetProductSelectGetSelectUnitResponse,
  getProductPlatformGetCategoryTree,
  GetProductPlatformGetCategoryTreeResponse,
  getTradeMobileAskPurchaseDetail,
} from '@apps/apis'
import { Toast } from '@apps/mobile-ui'
import { useEffect, useState } from 'react'
import Router from '@/utils/router'
import { dateFormat } from '@/utils/date'
import { limitByte } from '@/utils'
import { useMobileIntl } from '@apps/locales'

interface MemberItemType {
  memberId: number
  memberRoleId: number
  memberName: string
  memberType: string
  memberRoleName: string
  memberGrade: string
}

export interface MaterialsItemType {
  /** 物料id */
  goodsId: number
  /** 物料编号 */
  goodsNo: string
  /** 物料名称 */
  goodsName: string
  /** 规格 */
  specification: string
  /** 品类id */
  categoryId: number
  /** 品类名称 */
  categoryName: string
  /** 品牌id */
  brandId?: number
  /** 品牌名称	 */
  brandName?: string
  /** 单位 */
  unit: string
  /** 求购数量 */
  num: number
  /** 附件链接集合 */
  enclosureUrls: {
    name: string
    url: string
  }[]
}

const useAskPurchase = () => {
  const {
    userStore: { userInfo },
  } = useStores()
  const params = getCurrentInstance().preloadData as {
    id: string
    refresh: () => void
  }
  const { id, refresh } = params
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [materials, setMaterials] = useState<MaterialsItemType[]>([
    {
      goodsNo: '',
      goodsName: '',
      specification: '',
      categoryId: 0,
      categoryName: '',
      unit: '',
      num: 0,
      goodsId: 1,
      enclosureUrls: [],
    },
  ])
  const [query, setQuery] = useState<Record<string, any>>({
    contactCountryCode: '+86',
    contactName: userInfo?.userName,
    contactUserId: userInfo?.userId,
    contactMobile: userInfo?.phone,
    publishType: 1,
  })
  const [fileList, setFileList] = useState<any>([])
  const [addressList, setAddressList] = useState<GetLogisticsMobileSelectListReceiverAddressResponse>([])
  const [userList, setUserList] = useState<GetMemberManageUsersPageResponseDetail[]>([])
  const [shopList, setShopList] = useState<GetCommodityShopShopBListResponse>([])
  const [selectShops, setSelectShops] = useState<{ shopId: number; shopName: string }[]>([])
  const [selectMembers, setSelectMembers] = useState<MemberItemType[]>([])
  const [unitList, setUnitList] = useState<GetProductSelectGetSelectUnitResponse>([])
  const [categoryList, setCategoryList] = useState<GetProductPlatformGetCategoryTreeResponse>([])
  const translate = useMobileIntl()

  const fetchUnitList = (name?: string) => {
    const params = {
      name,
    }
    getProductSelectGetSelectUnit(params).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setUnitList(res.data)
      }
    })
  }

  const fetchShopList = () => {
    getCommodityShopShopBList().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setShopList(res.data)
      }
    })
  }

  const fetchUserList = () => {
    getMemberManageUsersPage().then((res) => {
      if (res.code === 1000 && res.data.data && res.data.data.length > 0) {
        setUserList(res.data.data)
      }
    })
  }

  const fetchAddressList = () => {
    getLogisticsMobileSelectListReceiverAddress().then((res) => {
      if (res.code === 1000 && res.data.length > 0) {
        setAddressList(res.data)
        const defaultItem = res.data[0]
        const params = { ...query }
        params.deliverAddressId = defaultItem.id
        params.deliverAddress = defaultItem.fullAddress
        params.deliverAddrProvinceCode = defaultItem.provinceCode
        params.deliverAddrCityCode = defaultItem.cityCode
        params.deliverAddrDistrictCode = defaultItem.districtCode
        setQuery(params)
      }
    })
  }

  useEffect(() => {
    fetchAddressList()
    fetchUserList()
    fetchShopList()
    fetchUnitList()
  }, [])

  const fetchSourceInfo = () => {
    if (id) {
      getTradeMobileAskPurchaseDetail({ id }).then((res) => {
        if (res.code === 1000) {
          setQuery({
            ...res.data,
            deliverTime: res.data.deliverTime.split(' ')[0],
            quoteEndTime: res.data.quoteEndTime,
          })
          setSelectShops(res.data.askPurchaseShopResponses || [])
          setSelectMembers(res.data.askPurchaseMemberResponses || [])
          setFileList(res.data.enclosureUrls || [])
          setMaterials(res.data.askPurchaseGoodsResponses || [])
        }
      })
    }
  }

  useEffect(() => {
    fetchSourceInfo()
  }, [id])

  // 图片上传
  const uploadFile = async (result) => {
    const uploadResult = await uploadFileRequest([result[0]])
    const FileList = [...fileList]
    FileList.push({ url: uploadResult[0].url, name: uploadResult[0].name })
    setFileList(FileList)
    return uploadResult
  }

  // 图片删除
  const removeFile = (index) => {
    const FileList = [...fileList]
    const imgUrl: any = []
    FileList.forEach((item: any, i: number) => {
      if (index != i) {
        imgUrl.push(item)
      }
    })
    setFileList(imgUrl)
  }
  /**
   * 校验表单必填项
   * @param payload
   * @returns
   */
  const verifyParams = (payload: Record<string, any>): boolean => {
    // 必填参数key集合
    const requiredKeys = ['name', 'deliverTime', 'quoteEndTime', 'contactName', 'contactMobile', 'deliverAddress']
    const requiredProductKeys = ['goodsNo', 'goodsName', 'specification', 'categoryName', 'unit', 'num']
    const labelByKeyMap = {
      name: translate('mobile.resource.askPurchase.xunyuanxuqiudanzhaiyao'),
      deliverTime: translate('mobile.resource.askPurchase.jiaofuriqi'),
      quoteEndTime: translate('mobile.resource.askPurchase.baojiajiezhiriqi'),
      contactName: translate('mobile.resource.askPurchase.lianxiren'),
      contactMobile: translate('mobile.resource.askPurchase.lianxirendianhua'),
      deliverAddress: translate('mobile.resource.askPurchase.jiaofudizhi'),
      goodsNo: translate('mobile.resource.askPurchase.wuliaobianhao'),
      goodsName: translate('mobile.resource.askPurchase.wuliaomingcheng'),
      specification: translate('mobile.resource.askPurchase.guigexinghao'),
      categoryName: translate('mobile.resource.askPurchase.pinlei'),
      unit: translate('mobile.resource.askPurchase.danwei'),
      num: translate('mobile.resource.askPurchase.xunyuanshuliang'),
    }

    for (const key of requiredProductKeys) {
      const list = payload['askPurchaseGoodsRequests']
      for (const goodsItem of list) {
        if (!goodsItem[key]) {
          Toast.show({
            title: `${translate('mobile.common.qingshuru')}${labelByKeyMap[key]}`,
            icon: 'none',
          })
          return false
        }
      }
    }

    for (const key of requiredKeys) {
      const paramItem = payload[key]
      if (!paramItem) {
        Toast.show({
          title: `${translate('mobile.common.qingshuru')}${labelByKeyMap[key]}`,
          icon: 'none',
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = () => {
    if (query.name) {
      const message = limitByte(query.name, { maxByte: 60 })
      if (message) {
        Toast.show({
          title: `${translate('mobile.resource.askPurchase.xunyuanxuqiudanzhaiyao')}${message}`,
        })
        return
      }
    }

    const payload: any = {
      ...query,
      id: id ? id : undefined,
      askPurchaseShopRequests: selectShops,
      askPurchaseMemberRequests: selectMembers,
      enclosureUrls: fileList,
      askPurchaseGoodsRequests: materials,
    }

    if (!verifyParams(payload)) {
      return
    }

    if (payload.publishType === 1 && selectShops.length === 0) {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingxuanzefabushangcheng'),
        icon: 'none',
      })
      return
    }
    if (payload.publishType === 2 && selectMembers.length === 0) {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingxuanzegongyingshang'),
        icon: 'none',
      })
      return
    }

    if (payload.quoteEndTime) {
      payload.quoteEndTime = dateFormat(new Date(payload.quoteEndTime))
    }
    if (payload.deliverTime) {
      payload.deliverTime = dateFormat(new Date(payload.deliverTime))
    }

    if (new Date(payload.quoteEndTime).getTime() >= new Date(payload.deliverTime).getTime()) {
      Toast.show({
        title: translate('mobile.resource.askPurchase.baojiajiezhishijianbixuxiaoyujiaofuriqi'),
        icon: 'none',
      })
      return
    }

    if (!payload.deliverAddrProvinceCode) {
      const addressItem = addressList.find((item) => item.id === payload.deliverAddressId)

      if (addressItem) {
        payload.deliverAddrProvinceCode = addressItem.provinceCode
        payload.deliverAddrCityCode = addressItem.cityCode
        payload.deliverAddrDistrictCode = addressItem.districtCode
      }
    }
    setSubmitLoading(true)
    postTradeMobileAskPurchaseSaveOrUpdate(payload)
      .then((res) => {
        if (res.code === 1000) {
          Toast.show({
            title: translate('mobile.resource.askPurchase.xinzengchenggong'),
            icon: 'none',
          })
          refresh?.()
          Router.navigateBack()
        } else {
          Toast.show({
            title: res.message,
            icon: 'none',
          })
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return {
    query,
    submitLoading,
    materials,
    fileList,
    addressList,
    userList,
    shopList,
    selectShops,
    selectMembers,
    unitList,
    categoryList,
    uploadFile,
    removeFile,
    setFileList,
    setQuery,
    setMaterials,
    setSelectShops,
    handleSubmit,
    setSelectMembers,
    fetchUnitList,
  }
}

export default useAskPurchase
