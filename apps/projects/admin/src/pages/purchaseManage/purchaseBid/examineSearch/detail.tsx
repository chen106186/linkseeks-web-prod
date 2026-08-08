import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { CheckCircleOutlined } from '@ant-design/icons'

import { GlobalConfig } from '@/global/config'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'

import { Context } from '../../purchaseAbility/components/detail/components/context'
import PeripheralLayout from '../../purchaseAbility/components/detail'
import ProgressLayout from '../../purchaseAbility/components/detail/components/progressCommonLayout'
import RecordCommonLayout from '../../purchaseAbility/components/detail/components/recordCommonLayout'
import MaterialLayout from '../../purchaseAbility/components/detail/components/materialLayout'
import DemandLayout from '../../purchaseAbility/components/detail/components/purchaseBidDemandLayout'
import BidCommonLayout from '../../purchaseAbility/components/detail/components/bidCommonLayout'
import ModalOperate from '../../purchaseAbility/components/modalOperate'
import BidProgressDrawer from '../../purchaseAbility/components/detail/components/bidProgressDrawer'
import QuotationDetailsDrawer from '../../purchaseAbility/components/detail/components/quotationDetailsDrawer'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR } from '../../purchaseAbility/constants/purchaseBid'
import {
  getPurchaseBiddingPlatformDetails,
  getPurchaseBiddingPlatformMaterielPage,
  getPurchaseBiddingPlatformMemberPage,
  getPurchaseBiddingQuotedPriceDetaild,
  postPurchaseBiddingPlatformExamine,
  getCommodityShopListShopByReq,
} from '@apps/apis'

const transforType = {
  1: '是',
  0: '否',
}

const TABLINK = [
  { id: 'progressLayout', title: '流转进度' },
  { id: 'bidResultLayout', title: '竞价结果', include: ['search'] },
  { id: 'basicLayout', title: '基本信息' },
  { id: 'materialLayout', title: '采购物料', include: ['search', 'examineSearch'] },
  { id: 'bidRulesLayout', title: '竞价规则', include: ['search', 'examineSearch'] },
  { id: 'signUpLayout', title: '报名要求', include: ['search', 'examineSearch'] },
  { id: 'signUpMsgLayout', title: '报名信息', include: ['search'] },
  { id: 'conditionLayout', title: '交易条件', include: ['search', 'examineSearch'] },
  { id: 'fileLayout', title: '附件', include: ['search', 'examineSearch'] },
  { id: 'demandLayout', title: '需求对接', include: ['search', 'examineSearch'] },
  { id: 'resultLayout', title: '授标结果', include: ['search'] },
  { id: 'recordLayout', title: '流转记录' },
]

const SearchDetail = () => {
  const {
    id,
    number,
    action, //是否显示审核按钮
  } = useQuery()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  // 报价明细
  const [quotationDetailsVisible, setQuotationDetailsVisible] = useState<boolean>(false)
  // 竞价过程
  const [progressVisible, setProgressVisible] = useState<boolean>(false)
  const [quotationDetailsId, setQuotationDetailsId] = useState<number>()
  const [dataSource, setDataSource] = useState<any>({})
  // 流转数据数据
  const [progressEffect, setProgressEffect] = useState<any>([])
  // 基本信息数据
  const [basicEffect, setBasicEffect] = useState<any>([])
  // 竞价结果数据
  const [resultEffect, setResultEffect] = useState<any>([])
  // 竞价规则数据
  const [rulesEffect, setRulesEffect] = useState<any>([])
  // 报名要求
  const [signUpEffect, setSignUpEffect] = useState<any>([])
  // 交易条件
  const [conditionEffect, setConditionEffect] = useState<any>([])
  // 需求对接
  const [storeList, setStoreList] = useState<any[]>([])
  // 授标结果
  const [awardResult, setAwardResult] = useState<any>({})

  // 生成tabs

  const _tabs = useMemo(() => {
    const _list: any = []
    TABLINK.forEach((item) => {
      if (!item.include || item.include.includes(pathPci)) {
        _list.push(item)
      }
    })
    return _list
  }, [pathPci])

  const handleProgressEffect = (data: any) => {
    const _list = [{ title: '外部流转', state: 1, logs: data.externalLogStates }]
    setProgressEffect(_list)
  }

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '竞价单号', extra: data.biddingNo, type: 'text' },
          { label: '竞价单摘要', extra: data.details, type: 'text' },
          {
            label: '外部状态',
            extra: <StatusTag type={BID_EXTERNALSTATE_COLOR(data.externalState)} title={data.externalStateName} />,
            type: 'text',
          },
          // { label: '内部状态', extra: <Badge status={BID_INTERNALSTATE_COLOR[data.interiorState]} text={data.interiorStateName} />, type: 'text' },
        ],
      },
      {
        col: [
          { label: '会员名称', extra: data.createMemberName, type: 'text' },
          {
            label: '适用地市',
            extra: data.areas || [],
            type: 'area',
            tips: '设置了归属地市后，此商品可根据地市进行筛选，未设置时默认为所有地市',
          },
        ],
      },
      {
        col: [{ label: '单据时间', extra: formatTimeString(data.createTime), type: 'text' }],
      },
    ])
  }

  const handleResultEffect = (data: any) => {
    setResultEffect([
      {
        col: [{ label: '中标公示', extra: data.awardResults, type: 'text' }],
      },
      {
        col: [{ label: '中标通知', extra: data.awardResults, type: 'text' }],
      },
    ])
  }

  const handleRulesEffect = (data: any) => {
    setRulesEffect([
      {
        col: [
          {
            label: '竞价时间',
            extra: `${formatTimeString(data.biddingStartTime)} 至 ${formatTimeString(data.biddingEndTime)}`,
            type: 'text',
          },
          {
            label: '起拍价',
            extra: data.startingPrice ? `¥ ${priceFormat(data.startingPrice)}` : '-',
            type: 'text',
            tips: '初始起拍价，首次报价要低于或等于起拍价',
          },
          {
            label: '目标价',
            extra: data.targetPrice ? `¥ ${priceFormat(data.targetPrice)}` : '-',
            type: 'text',
            tips: '期望成交价格',
          },
        ],
      },
      {
        col: [
          {
            label: '最小价差',
            extra: data.minPrice ? `¥ ${priceFormat(data.minPrice)}` : '-',
            type: 'text',
            tips: '每次报价降价幅度须大于或等于最小价差',
          },
          {
            label: '允许报价次数',
            extra: data.allowPurchaseCount,
            type: 'text',
            tips: '允许每个供应商最多可以报价的次数',
          },
        ],
      },
      {
        col: [
          {
            label: '公开当前最低报价',
            extra: transforType[data.isOpenPurchase],
            type: 'text',
            tips: '选择公开当前最低报价，竞价过程中将供应商所报当前最低价在竞价页面即时公开。',
            isMix: ['公开当前最低', '报价'],
          },
          {
            label: '公开报价排名',
            extra: transforType[data.isOpenRanking],
            type: 'text',
            tips: '选择公开报价排名，竞价过程中将供应商当前报价排名在竞价页面即时公开。',
          },
        ],
      },
    ])
  }

  const handleSignUpEffect = (data: any) => {
    setSignUpEffect([
      {
        col: [
          {
            label: '报名要求时间',
            extra: `${formatTimeString(data.startSignUp)} 至 ${formatTimeString(data.endSignUp)}`,
            type: 'text',
          },
          { label: '报名要求', extra: data.demand, type: 'text' },
        ],
      },
      {
        col: [{ label: '报名要求附件', extra: data.demandUrls, type: 'files' }],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          { label: '交付日期', extra: formatTimeString(data.deliver), type: 'text' },
          { label: '交付地址', extra: data.address, type: 'text' },
          { label: '报价要求', extra: data.offer, type: 'text' },
        ],
      },
      {
        col: [
          { label: '付款方式', extra: data.paymentType, type: 'text' },
          { label: '税费要求', extra: data.taxes, type: 'text' },
          { label: '物流要求', extra: data.logistics, type: 'text' },
        ],
      },
      {
        col: [
          { label: '包装要求', extra: data.packRequire, type: 'text' },
          { label: '其他要求', extra: data.otherRequire, type: 'text' },
        ],
      },
    ])
  }

  const handleAwardResult = (data: any) => {
    setAwardResult({
      list: data.awardsFruits || [],
      signUpIdea: data.signUpIdea,
      returnUrls: data.returnUrls,
    })
  }

  const fetchShopList = (): Promise<any[]> => {
    return new Promise((resolve) => {
      getCommodityShopListShopByReq({ type: '2' })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  const fetchDataSource = async () => {
    const shopList = await fetchShopList()
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }

    const _fetch = getPurchaseBiddingPlatformDetails

    await _fetch({ ...params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      if (data.shopIds) {
        const ids = data.shopIds
        const filterStore = shopList.filter((item) => ids.indexOf(item.id) !== -1)
        setStoreList([...filterStore])
      }
      setDataSource(data)
      handleProgressEffect(data)
      handleResultEffect(data)
      handleBasicEffect(data)
      handleRulesEffect(data)
      handleSignUpEffect(data)
      handleConditionEffect(data)
      handleAwardResult(data)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const _returnTopButton = () => {
    if (action) {
      switch (pathPci) {
        case 'examineSearch':
          return (
            <Button onClick={() => setVisible(true)} type="primary">
              <CheckCircleOutlined /> 单据审核
            </Button>
          )
        default:
          return null
      }
    } else {
      return null
    }
  }

  const fetchLink = () => {
    return postPurchaseBiddingPlatformExamine
  }

  const _returnBidResultLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
        return <BidCommonLayout layoutId="bidResultLayout" title="竞价结果" effect={resultEffect} />
      default:
        return null
    }
  }, [pathPci, resultEffect])

  const _returnMaterialLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return <MaterialLayout id={id} number={number} fetch={getPurchaseBiddingPlatformMaterielPage} />
      default:
        return null
    }
  }, [pathPci, id, number])

  const _returnBidRulesLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return <BidCommonLayout layoutId="bidRulesLayout" title="竞价规则" effect={rulesEffect} />
      default:
        return null
    }
  }, [pathPci, rulesEffect])

  const _returnSignUpLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return <BidCommonLayout layoutId="signUpLayout" title="报名要求" effect={signUpEffect} />
      default:
        return null
    }
  }, [pathPci, signUpEffect])

  const _returnSignUpMsgLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
        return (
          <BidCommonLayout
            layoutId="signUpMsgLayout"
            title="报名信息"
            layoutType="msg"
            effect={dataSource.sginUpInfos || []}
          />
        )
      default:
        return null
    }
  }, [pathPci, dataSource])

  const _returnConditionLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return <BidCommonLayout layoutId="conditionLayout" title="交易条件" effect={conditionEffect} />
      default:
        return null
    }
  }, [pathPci, conditionEffect])

  const _returnFileLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return (
          <BidCommonLayout
            layoutId="fileLayout"
            title="附件"
            effect={[
              {
                col: [{ label: '附件', extra: dataSource.urls, type: 'files' }],
              },
            ]}
          />
        )
      default:
        return null
    }
  }, [pathPci, dataSource])

  const _returnDemandLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'examineSearch':
        return (
          <DemandLayout
            bidId={id}
            number={number}
            fetch={getPurchaseBiddingPlatformMemberPage}
            storeList={storeList}
            title="对接方式"
          />
        )
      default:
        return null
    }
  }, [pathPci, id, number, storeList])

  const _openQuotationDetailsDrawer = (_id: number) => {
    setQuotationDetailsId(_id)
    setQuotationDetailsVisible(true)
  }

  const _returnResultLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
        return (
          <BidCommonLayout
            layoutId="resultLayout"
            title="授标结果"
            layoutType="result"
            checkDetailFunc={_openQuotationDetailsDrawer}
            effect={awardResult}
            extra={
              <Button
                type="link"
                onClick={() => {
                  setProgressVisible(true)
                }}
              >
                查看竞价过程
              </Button>
            }
          />
        )
      default:
        return null
    }
  }, [pathPci, awardResult])

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.biddingNo}
        tabLink={_tabs}
        effect={_returnTopButton()}
        components={
          <Fragment>
            <ProgressLayout effect={progressEffect} />
            {_returnBidResultLayout}
            <BidCommonLayout layoutId="basicLayout" title="基本信息" effect={basicEffect} />
            {_returnMaterialLayout}
            {_returnBidRulesLayout}
            {_returnSignUpLayout}
            {_returnSignUpMsgLayout}
            {_returnConditionLayout}
            {_returnFileLayout}
            {_returnDemandLayout}
            {_returnResultLayout}
            <RecordCommonLayout
              externalColors={BID_EXTERNALSTATE_COLOR}
              internalColors={BID_INTERNALSTATE_COLOR}
              interStatus={false}
            />
          </Fragment>
        }
      />
      <ModalOperate
        id={id}
        title="单据审核"
        modalType="audit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />
      <QuotationDetailsDrawer
        fetch={getPurchaseBiddingQuotedPriceDetaild}
        quotationDetailsId={quotationDetailsId}
        number={number}
        effects="id"
        title="报价明细"
        visible={quotationDetailsVisible}
        onClose={() => setQuotationDetailsVisible(false)}
      />
      <BidProgressDrawer
        awardProcess={dataSource?.awardProcess ?? []}
        visible={progressVisible}
        onClose={() => setProgressVisible(false)}
      />
    </Context.Provider>
  )
}
export default SearchDetail
