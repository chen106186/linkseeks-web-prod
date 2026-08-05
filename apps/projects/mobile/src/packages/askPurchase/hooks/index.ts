import { useState, useEffect } from 'react'
import { Toast } from '@apps/mobile-ui'
import uploadFileRequest from '@/utils/uploadFileRequest'
import Router from '@/utils/router'
import { limitByte } from '@/utils'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import {
  getCommoditySelectGetSelectCurrency,
  GetCommoditySelectGetSelectCurrencyResponse,
  getTradeAskPurchaseQuoteAskPurchaseDetail,
  GetTradeAskPurchaseQuoteAskPurchaseDetailResponse,
  postTradeMobileAskPurchaseQuoteSaveOrUpdate,
  getTradeMobileAskPurchaseAskPurchaseQuoteDetail,
} from '@apps/apis'
import { useMobileIntl } from '@apps/locales'
import { DataItemType } from '../components/OtherList'

const useAskPurchase = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, quoteId, refresh, PAGE } = params
  const [purchaseDetail, setPurchaseDetail] = useState<GetTradeAskPurchaseQuoteAskPurchaseDetailResponse>()
  const [query, setQuery] = useState<Record<string, any>>({})
  const [fileList, setFileList] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [currencyList, setCurrencyList] = useState<GetCommoditySelectGetSelectCurrencyResponse>([])
  const [products, setProducts] = useState<DataItemType[]>([])
  const translate = useMobileIntl()

  const getCurrency = async () => {
    const { data, code } = await getCommoditySelectGetSelectCurrency()
    if (code !== 1000) {
      return
    }
    setCurrencyList(data)
  }

  /** 寻源需求单详情 */
  const fetchContentInfo = () =>
    new Promise((resolve) => {
      if (id) {
        getTradeAskPurchaseQuoteAskPurchaseDetail({ askPurchaseId: id }).then((res) => {
          if (res.code === 1000) {
            setPurchaseDetail(res.data)
            if (!quoteId) {
              setProducts(res.data.askPurchaseGoodsResponses || [])
            }

            resolve(res.data)
          }
        })
      }
    })

  /**
   * 获取报价单信息
   */
  const fetchQuoteInfo = () => {
    if (quoteId) {
      getTradeMobileAskPurchaseAskPurchaseQuoteDetail({ id: quoteId }).then((res) => {
        if (res.code === 1000) {
          setQuery({
            name: res.data.name,
            contactMobile: res.data.contactMobile,
            contactName: res.data.contactName,
            contactCountryCode: res.data.contactCountryCode,
            currencyId: res.data.currencyId,
            currencyName: res.data.currencyName,
            deliverRemark: res.data.deliverRemark,
            paymentRemark: res.data.paymentRemark,
            taxesRemark: res.data.taxesRemark,
            logisticsRemark: res.data.taxesRemark,
            packageRemark: res.data.packageRemark,
            otherRemark: res.data.otherRemark,
            enclosureUrls: res.data.enclosureUrls,
          })
          if (res.data.enclosureUrls && res.data.enclosureUrls.length > 0) {
            setFileList(res.data.enclosureUrls)
          }
          if (res.data.askPurchaseQuoteGoodsResponses && res.data.askPurchaseQuoteGoodsResponses.length > 0) {
            setProducts(
              res.data.askPurchaseQuoteGoodsResponses.map((item) => ({
                ...item,
                quoteEndTime: item.quoteEndTime ? item.quoteEndTime.split(' ')[0] : '',
                quoteStartTime: item.quoteStartTime ? item.quoteStartTime.split(' ')[0] : '',
              })),
            )
          }
        }
      })
    }
  }

  useEffect(() => {
    getCurrency()
    /** 执行详情接口请求 */
    fetchContentInfo()
    fetchQuoteInfo()
  }, [])

  /**
   * 校验表单必填项
   * @param payload
   * @returns
   */
  const verifyParams = (payload: Record<string, any>): boolean => {
    // 必填参数key集合
    const requiredKeys = ['name', 'contactMobile', 'contactName', 'currencyId', 'currencyName']
    const requiredProductKeys = [
      'taxRate',
      'unitPriceWithTax',
      'unitPriceWithoutTax',
      'totalPriceWithTax',
      'totalPriceWithoutTax',
      'quoteStartTime',
      'quoteEndTime',
      'commodityName',
    ]
    const labelByKeyMap = {
      name: translate('mobile.resource.askPurchase.baojiadanzhaiyao'),
      contactMobile: translate('mobile.resource.askPurchase.lianxirendianhua'),
      contactName: translate('mobile.resource.askPurchase.lianxirenxingming'),
      currencyId: translate('mobile.resource.askPurchase.bizhong'),
      taxRate: translate('mobile.resource.askPurchase.shuilv'),
      unitPriceWithTax: translate('mobile.resource.askPurchase.hanshuidanjia'),
      unitPriceWithoutTax: translate('mobile.resource.askPurchase.buhanshuidanjia'),
      quoteStartTime: translate('mobile.resource.askPurchase.baojiayouxiaoqikaishishijian'),
      quoteEndTime: translate('mobile.resource.askPurchase.baojiayouxiaoqijieshushijian'),
      commodityName: translate('mobile.resource.askPurchase.guanlianbaojiashangpin'),
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

    for (const key of requiredProductKeys) {
      const list = payload['askPurchaseQuoteGoodsRequests']
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

    return true
  }

  /** 提交 */
  const handleSubmit = () => {
    if (query.name) {
      const message = limitByte(query.name, { maxByte: 60 })
      if (message) {
        Toast.show({
          title: `${translate('mobile.resource.askPurchase.baojiadanzhaiyao')}${message}`,
        })
        return
      }
    }

    const params: any = {
      ...query,
      id: quoteId,
      askPurchaseId: id,
      askPurchaseQuoteGoodsRequests: products.map((item) => ({
        ...item,
        goodsId: item.goodsId || 1, // 物料id
        includeTax: item.includeTax ?? 1,
        quoteStartTime: item.quoteStartTime ? `${item.quoteStartTime} 00:00:00` : '',
        quoteEndTime: item.quoteEndTime ? `${item.quoteEndTime} 23:59:59` : '',
      })),
      enclosureUrls: fileList,
    }
    if (!verifyParams(params)) {
      return
    }

    if (id) {
      setSubmitLoading(true)
      postTradeMobileAskPurchaseQuoteSaveOrUpdate(params, { ctlType: 'none' })
        .then((res: any) => {
          if (res.code === 1000) {
            Toast.show({
              title: translate('mobile.resource.askPurchase.xinzengbaojiachenggong'),
              icon: 'none',
            })
            if (PAGE === 'detail') {
              Router.redirectTo('askPurchase/list')
            } else {
              Router.navigateBack()
              refresh?.()
            }
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
  }

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

  const handleProductsChange = (values: DataItemType[]) => {
    setProducts(values)
  }

  return {
    query,
    fileList,
    submitLoading,
    products,
    purchaseDetail,
    currencyList,
    setQuery,
    removeFile,
    uploadFile,
    handleSubmit,
    handleProductsChange,
  }
}

export default useAskPurchase
