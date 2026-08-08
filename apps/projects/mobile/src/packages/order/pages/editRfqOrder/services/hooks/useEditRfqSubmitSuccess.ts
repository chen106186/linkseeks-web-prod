import { useEffect, useState } from 'react'
import { previewImage, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { getTradeMobileInquiryListDetails, GetTradeMobileInquiryListDetailsResponse } from '@apps/apis'

interface RouteParams {
  /**
   * 询价单id
   */
  id: string
}

const useEditRfqSubmitSuccess = () => {
  const intl = useIntl()
  const params = getCurrentInstance().preloadData as RouteParams
  const { id } = params
  const [info, setInfo] = useState<GetTradeMobileInquiryListDetailsResponse | null>(null)

  const condition = [
    {
      key: 0,
      title: intl.formatMessage({ id: 'order.jiaofushijian', defaultMessage: '交付时间' }),
      value: info && info.deliveryTime ? dateFormat(new Date(info.deliveryTime), 'YYYY-MM-DD') : '',
    },
    {
      key: 1,
      title: intl.formatMessage({ id: 'order.jiaofudizhi', defaultMessage: '交付地址' }),
      value: info && info.fullAddress ? info.fullAddress : '',
    },
    {
      key: 2,
      title: intl.formatMessage({ id: 'order.baojiajiezhishijian', defaultMessage: '报价截止时间' }),
      value: info && info.quotationAsTime ? dateFormat(new Date(info.quotationAsTime), 'YYYY-MM-DD') : '',
    },
  ]

  const other = [
    {
      key: 0,
      title: intl.formatMessage({ id: 'order.baojiayaoqiu', defaultMessage: '报价要求' }),
      value: info && info.offer ? info.offer : '',
    },
    {
      key: 1,
      title: intl.formatMessage({ id: 'order.fukuanfangshi', defaultMessage: '付款方式' }),
      value: info && info.paymentType ? info.paymentType : '',
    },
    {
      key: 2,
      title: intl.formatMessage({ id: 'order.shuifeiyaoqiu', defaultMessage: '税费要求' }),
      value: info && info.taxes ? info.taxes : '',
    },
    {
      key: 3,
      title: intl.formatMessage({ id: 'order.wuliuyaoqiu', defaultMessage: '物流要求' }),
      value: info && info.logistics ? info.logistics : '',
    },
    {
      key: 4,
      title: intl.formatMessage({ id: 'order.baozhuangyaoqiu', defaultMessage: '包装要求' }),
      value: info && info.packRequire ? info.packRequire : '',
    },
    {
      key: 5,
      title: intl.formatMessage({ id: 'order.qitayaoqiu', defaultMessage: '其他要求' }),
      value: info && info.otherRequire ? info.otherRequire : '',
    },
  ]

  const fileList: any =
    info && info.enclosureUrls ? info.enclosureUrls.map((item) => ({ uri: item.url, status: 'done' })) : []

  const getInquiryInfo = () => {
    if (!id) {
      return
    }
    getTradeMobileInquiryListDetails({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        setInfo(res.data)
      }
    })
  }

  useEffect(() => {
    getInquiryInfo()
  }, [])

  const previewImageFunc = (url) => {
    const previewImgArr: any = []
    fileList.map((item: any) => {
      previewImgArr.push(item.uri)
    })
    previewImage({
      current: url, // 当前显示图片的http链接
      urls: previewImgArr, // 需要预览的图片http链接列表
    })
  }

  const handleJumpMore = () => {
    Router.navigateTo('commodityMerge/soleSourcing/index')
  }
  return {
    info,
    condition,
    other,
    fileList,
    previewImageFunc,
    handleJumpMore,
    getInquiryInfo,
  }
}

export default useEditRfqSubmitSuccess
