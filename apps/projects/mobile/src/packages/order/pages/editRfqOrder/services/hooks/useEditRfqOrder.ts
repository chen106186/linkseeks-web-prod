import { useState, useEffect } from 'react'
import { Toast } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { setNavigationBarTitle, preload } from '@apps/mobile-services/utils/taro'
import uploadFileRequest from '@/utils/uploadFileRequest'
import Router from '@/utils/router'
import { ADD_INQUIRY, EDIT_INQUIRY_PRODUCT } from '@/constants/storage'
import { useIntl } from '@linkseeks/i18n'
import { setAsyncStorage, getAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { limitByte } from '@/utils'
import {
  getTradeMobileInquiryListDetails,
  postTradeMobileInquiryListAdd,
  postTradeMobileInquiryListUpdate,
} from '@apps/apis'
import { useMobileIntl } from '@apps/locales'

const useEditRfqOrder = (id) => {
  const [data, setData] = useState<any>({})
  const [query, setQuery] = useState<any>({
    id,
    details: '',
    fullAddress: '',
    fullAddressId: '',
    deliveryTime: '',
    quotationAsTime: '',
    voucherTime: '',
    inquiryListProductRequests: [],
    enclosureUrls: [],
  })
  const translate = useMobileIntl()
  const [other, setOther] = useState<{ [key: string]: any }>({
    offer: '',
    paymentType: '',
    taxes: '',
    logistics: '',
    packRequire: '',
    otherRequire: '',
  })
  const [fileList, setFileList] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const intl = useIntl()

  /** 询价单详情 */
  const fetchContentInfo = () =>
    new Promise((resolve) => {
      if (id) {
        getTradeMobileInquiryListDetails({ id }).then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
      } else {
        getAsyncStorage(ADD_INQUIRY).then((res) => {
          resolve(res)
        })
      }
    })

  useEffect(() => {
    /** 执行详情接口请求 */
    fetchContentInfo().then((res: any) => {
      const params = { ...query }
      const otherCondition = { ...other }
      Object.keys(params).forEach((key) => {
        params[key] = res[key] ? res[key] : ''
      })
      Object.keys(otherCondition).forEach((key) => {
        otherCondition[key] = res[key] ? res[key] : ''
      })
      setOther(otherCondition)
      setData(res)
      setQuery(params)
      if (res.enclosureUrls) {
        const file: any = []
        res.enclosureUrls.forEach((item: any) => {
          if (item.url) {
            file.push({
              url: item.url,
              status: 'done',
            })
          }
        })
        setFileList(file)
      }
    })
  }, [])

  /** 选择地址 */
  const handleAddress = () => {
    preload('addressList', addressList)
    Router.navigateTo('basicSetting/addressList')
  }
  /* 选择地址回调 */
  const addressList = (address) => {
    const parmas = { ...query }
    parmas.fullAddress = `${address.provinceName}${address.cityName}${address.districtName}${address.address}`
    parmas.fullAddressId = address.id
    setQuery(parmas)
  }

  /** 跳转填写其他条件 */
  const handleJumpOtherConditions = () => {
    preload('params', {
      offer: other.offer ? other.offer : '',
      paymentType: other.paymentType ? other.paymentType : '',
      taxes: other.taxes ? other.taxes : '',
      logistics: other.logistics ? other.logistics : '',
      packRequire: other.packRequire ? other.packRequire : '',
      otherRequire: other.otherRequire ? other.otherRequire : '',
      onSubmit: onSubmit,
    })
    Router.navigateTo('order/editRfqOtherInfo')
  }
  /* 选完之后回调 */
  const onSubmit = (e) => {
    setOther({ ...e.other })
  }
  /** 计算填写了几项条件 */
  const totalCount = () => {
    let num = 0
    const count = { ...other }
    Object.keys(count)
      .map((key: any) => ({
        value: count[key],
      }))
      .forEach((item) => {
        if (item.value !== '' && item.value !== null && item.value !== undefined) {
          num += 1
        }
      })
    return num
  }

  /** 确定时间选择 */
  const handleSelectDatePicker = (value: any, name) => {
    const params = { ...query }
    params[name] = value
    setQuery({ ...params })
  }

  /** 提交 */
  const handleSubmit = () => {
    if (query.details) {
      const message = limitByte(query.details, { maxByte: 60 })
      if (message) {
        Toast.show({
          title: `${intl.formatMessage({ id: 'order.xunjiazhaiyao', defaultMessage: '询价摘要' })}${message}`,
          icon: 'none',
        })
        return
      }
    } else {
      Toast.show({
        title: translate('mobile.resource.order.qingshuruxuqiuzhaiyao'),
        icon: 'none',
      })
      return
    }
    const params = {
      ...query,
      inquiryListProductRequests: query.inquiryListProductRequests.map((item: any) => {
        const { isDeleted, minOrder, ...rest } = item
        return rest
      }),
      ...other,
      enclosureUrls: fileList,
      //  fileList.map((item: any) => {
      //   const rest = {
      //     name: item.fileName,
      //     url: item.uri,
      //   }
      //   return rest
      // }),
    }
    params.deliveryTime = new Date(params.deliveryTime).getTime()
    params.quotationAsTime = new Date(params.quotationAsTime).getTime()

    if (id) {
      setSubmitLoading(true)
      postTradeMobileInquiryListUpdate(params)
        .then((res: any) => {
          if (res.code === 1000) {
            // navigation.goBack();
            // refresh();
            Toast.show({ title: intl.formatMessage({ id: 'order.xiugaichenggong', defaultMessage: '修改成功' }) })
          }
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    } else {
      setSubmitLoading(true)
      // const ins = Toast.show('正在加载...', {
      //   duration: 0,
      // });
      const { memberName, memberId, memberRoleId, memberRoleName } = data
      postTradeMobileInquiryListAdd({
        ...params,
        memberName,
        memberId,
        memberRoleId,
        memberRoleName,
      })
        .then((res: any) => {
          if (res.code === 1000) {
            removeAsyncStorage(ADD_INQUIRY)
            preload({
              id: res.data,
            })
            Router.navigateTo('order/editRfqSubmitSuccess')
          } else {
            Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }), icon: 'none' })
          }
          // Toast.hide(ins);
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    }
  }
  // 修改商品的回调
  const onConfirm = (value: any) => {
    const newQuery = { ...query }
    newQuery.inquiryListProductRequests = value
    setQuery(newQuery)
  }
  // 跳转修改商品页面
  const handleJumpEditProduct = async () => {
    if (id) return
    await setAsyncStorage(EDIT_INQUIRY_PRODUCT, query.inquiryListProductRequests)
    preload('params', {
      onConfirm: onConfirm,
    })
    Router.navigateTo('order/editRfqOrderProduct')
  }

  const products = query.inquiryListProductRequests.filter((item: any) => !item.isDeleted)
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
   * 获取明天的日期
   */
  const fnGetTomorrow = () => {
    const today = new Date()
    const tomorrow = today.getTime() + 24 * 60 * 60 * 1000
    return new Date(tomorrow)
  }
  /**
   * 获取明年的日期
   */
  const fnGetNextYear = () => {
    const today = new Date()
    const tomorrow = today.getTime() + 24 * 60 * 60 * 1000 * 365
    return new Date(tomorrow)
  }
  const headTagList = [
    {
      name: intl.formatMessage({ id: 'order.quanwangchangjia', defaultMessage: '全网厂家' }),
      url: getOssUrlPath('/Images/fast.png'),
    },
    {
      name: intl.formatMessage({ id: 'order.kuaisubaojia', defaultMessage: '快速报价' }),
      url: getOssUrlPath('/Images/manufactor.png'),
    },
    {
      name: intl.formatMessage({ id: 'order.kuaisubaojia', defaultMessage: '快速报价' }),
      url: getOssUrlPath('/Images/exclusive.png'),
    },
  ]

  return {
    data,
    query,
    other,
    fileList,
    submitLoading,
    headTagList,
    products,
    setQuery,
    fnGetNextYear,
    fnGetTomorrow,
    removeFile,
    uploadFile,
    handleJumpEditProduct,
    handleSelectDatePicker,
    handleSubmit,
    totalCount,
    handleJumpOtherConditions,
    handleAddress,
  }
}

export default useEditRfqOrder
