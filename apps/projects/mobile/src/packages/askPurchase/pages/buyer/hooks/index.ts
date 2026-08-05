import { useRef, useState } from 'react'
import {
  postTradeMobileAskPurchaseDelete,
  postTradeMobileAskPurchasePublish,
  PostTradeMobileAskPurchasePageResponseDetail,
  postTradeMobileAskPurchaseInvalid,
  postTradeMobileAskPurchasePageQuote,
  postTradeMobileAskPurchaseEndQuote,
  PostTradeMobileAskPurchasePageQuoteResponseDetail,
  getTradeMobileAskPurchasePriceComparisonInfo,
  GetTradeAskPurchasePriceComparisonInfoResponse,
  getTradeMobileAskPurchaseQuoteRankList,
  GetTradeMobileAskPurchaseQuoteRankListResponse,
  postTradeMobileAskPurchaseAwardBid,
  postTradeMobileAskPurchaseAwardBidAudit,
} from '@apps/apis'
import { Toast } from '@apps/mobile-ui'
import { useMobileIntl } from '@apps/locales'

const useBuyerList = () => {
  const [modalTitle, setModalTitle] = useState<string>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false)
  const [optionType, setOptionType] = useState<
    'stop' | 'invalid' | 'delete' | 'awrad' | 'publish' | 'audit' | 'confirmAwrad' | 'createOrder'
  >('invalid')
  const [optionItem, setOptionItem] = useState<PostTradeMobileAskPurchasePageResponseDetail>()
  const [optionReson, setOptionReson] = useState<string>()
  // 报价列表
  const [quoteList, setQuoteList] = useState<PostTradeMobileAskPurchasePageQuoteResponseDetail[]>([])
  // 比价列表
  const [parityList, setParityList] = useState<GetTradeAskPurchasePriceComparisonInfoResponse>([])
  // 排行列表
  const [rankList, setRankList] = useState<GetTradeMobileAskPurchaseQuoteRankListResponse>([])
  const [expandIds, setExpandIds] = useState<number[]>([])
  const [selectAwardItem, setSelectAwardItem] = useState<number>()
  const clickState = useRef<boolean>(false)
  const translate = useMobileIntl()

  /**
   * 查询报价单列表
   * @param askPurchaseId
   */
  const fetchQuoteList = (askPurchaseId: number) => {
    postTradeMobileAskPurchasePageQuote({ askPurchaseId, innerStatusList: [5, 8, 9] }).then((res) => {
      if (res.code === 1000 && res.data && res.data.data.length > 0) {
        setQuoteList(res.data.data)
      }
    })
  }

  /**
   * 查看比价信息
   * @param id
   */
  const fetchParityList = (id: string) => {
    getTradeMobileAskPurchasePriceComparisonInfo({ id }).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setParityList(res.data)
      }
    })
  }

  /**
   * 报价排行列表
   */
  const fetchQuoteRankList = (id: string, status: number) => {
    getTradeMobileAskPurchaseQuoteRankList({ id }).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setRankList(res.data)
        if (status === 6 || status === 7) {
          const awardBidQuoteId = res.data.find((item) => item.awardBid)?.quoteId
          if (awardBidQuoteId) {
            setSelectAwardItem(awardBidQuoteId)
          }
        }
      }
    })
  }

  /**
   * 发布
   * @param id
   * @returns
   */
  const handlePublish = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchasePublish({ ids: [id] }, { ctlType: 'none' })
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.resource.askPurchase.fabuchenggong'),
        icon: 'none',
        duration: 3000,
      })
      clickState.current = false
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      clickState.current = false
      return false
    }
  }

  const handleAwardBid = async (id: number, quoteId: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseAwardBid({ id, quoteId }, { ctlType: 'none' })
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.common.caozuochenggong'),
        icon: 'none',
        duration: 3000,
      })
      clickState.current = false
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      clickState.current = false
      return false
    }
  }

  const handleAudit = async (id: number, agree?: number, reason?: string) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseAwardBidAudit({ id, agree, reason }, { ctlType: 'none' })
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.common.caozuochenggong'),
        icon: 'none',
        duration: 3000,
      })
      clickState.current = false
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      clickState.current = false
      return false
    }
  }

  /**
   * 作废
   */
  const handleInvalid = async (id: number, remark: string) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseInvalid({ id, remark }, { ctlType: 'none' })
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.common.caozuochenggong'),
        icon: 'none',
        duration: 3000,
      })
      clickState.current = false
      setOptionModalVisible(false)
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      clickState.current = false
      return false
    }
  }

  /**
   * 中止
   */
  const handleStop = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseEndQuote({ id }, { ctlType: 'none' })
    clickState.current = false
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.common.caozuochenggong'),
        icon: 'none',
      })
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      return false
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseDelete({ id }, { ctlType: 'none' })
    clickState.current = false
    if (res.code === 1000) {
      Toast.show({
        title: translate('mobile.common.shanchuchenggong'),
        icon: 'none',
      })
      return true
    } else {
      Toast.show({
        title: res.message,
        icon: 'none',
      })
      return false
    }
  }

  return {
    optionItem,
    modalVisible,
    optionModalVisible,
    modalTitle,
    optionReson,
    optionType,
    quoteList,
    expandIds,
    parityList,
    rankList,
    selectAwardItem,
    setSelectAwardItem,
    setOptionType,
    setOptionReson,
    setOptionItem,
    setOptionModalVisible,
    setModalVisible,
    setModalTitle,
    setExpandIds,
    handleDeleteItem,
    handlePublish,
    handleInvalid,
    handleStop,
    fetchQuoteList,
    fetchParityList,
    fetchQuoteRankList,
    handleAwardBid,
    handleAudit,
  }
}

export default useBuyerList
