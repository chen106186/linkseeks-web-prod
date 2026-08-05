import { useRef, useState } from 'react'
import {
  postTradeMobileAskPurchasePageQuote,
  PostTradeMobileAskPurchasePageQuoteResponseDetail,
  getTradeMobileAskPurchasePriceComparisonInfo,
  GetTradeAskPurchasePriceComparisonInfoResponse,
  getTradeMobileAskPurchaseQuoteRankList,
  GetTradeMobileAskPurchaseQuoteRankListResponse,
  postTradeMobileAskPurchaseQuoteDelete,
  postTradeMobileAskPurchaseQuoteSubmitAudit,
  postTradeMobileAskPurchaseQuoteAuditLevel1,
  postTradeMobileAskPurchaseQuoteAuditLevel2,
  postTradeMobileAskPurchaseQuoteSubmitQuote,
  postTradeMobileAskPurchaseQuoteInvalidate,
} from '@apps/apis'
import { Toast } from '@apps/mobile-ui'
import { useMobileIntl } from '@apps/locales'

const useMerchants = () => {
  const [modalTitle, setModalTitle] = useState<string>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false)
  const [optionType, setOptionType] = useState<
    'stop' | 'invalid' | 'delete' | 'awrad' | 'publish' | 'audit' | 'submit' | 'auditLevel1' | 'auditLevel2' | 'expired'
  >('invalid')
  const [optionItem, setOptionItem] = useState<any>()
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
    postTradeMobileAskPurchasePageQuote({ askPurchaseId }).then((res) => {
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
  const fetchQuoteRankList = (id: string) => {
    getTradeMobileAskPurchaseQuoteRankList({ id }).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setRankList(res.data)
      }
    })
  }

  const handleSubmit = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseQuoteSubmitQuote({ ids: [id] }, { ctlType: 'none' })
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

  const handleAuditQuote = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseQuoteSubmitAudit({ ids: [id] }, { ctlType: 'none' })
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

  const handleAudit = async (level: 1 | 2, id: number, agree: number, remark?: string) => {
    if (clickState.current) return
    clickState.current = true
    const AUDIT_API = {
      1: postTradeMobileAskPurchaseQuoteAuditLevel1,
      2: postTradeMobileAskPurchaseQuoteAuditLevel2,
    }
    const res = await AUDIT_API[level]({ ids: [id], agree, remark }, { ctlType: 'none' })
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
   * 过期作废
   */
  const handleExpired = async (id: number) => {
    if (clickState.current) return
    clickState.current = true
    const res = await postTradeMobileAskPurchaseQuoteInvalidate({ ids: [id] } as any, { ctlType: 'none' })
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

  const handleDeleteItem = async (id: number) => {
    if (clickState.current) return
    clickState.current = true

    const res = await postTradeMobileAskPurchaseQuoteDelete({ id }, { ctlType: 'none' })
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
    fetchQuoteList,
    fetchParityList,
    fetchQuoteRankList,
    handleSubmit,
    handleAudit,
    handleExpired,
    handleAuditQuote,
  }
}

export default useMerchants
