import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Badge, Popconfirm, Button } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { CheckCircleOutlined } from '@ant-design/icons'

import {
  getPurchaseBiddingStaySubmitDetails,
  getPurchaseBiddingDetails,
  postPurchaseBiddingExamine,
  postPurchaseBiddingExamine1,
  postPurchaseBiddingExamine2,
  postPurchaseBiddingSubmit,
  postPurchaseBiddingExaminBiddingSignup,
  postPurchaseBiddingSubmitBidding1,
  postPurchaseBiddingSubmitBidding2,
  getPurchaseBiddingMaterielPage,
  getPurchaseBiddingMemberPage,
  postPurchaseBiddingUpdateBiddingReturn,
  postPurchaseBiddingSubmitExamineBiddingReturn,
  postPurchaseBiddingStayConfirmBidding,
  getPurchaseBiddingQuotedPriceDetaild,
  getCommodityShopListShopByReq,
} from '@apps/apis'
import { GlobalConfig } from '@/global/config'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'

import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import ProgressLayout, { ProgressValue } from '../../components/detail/components/progressCommonLayout'
import RecordCommonLayout from '../../components/detail/components/recordCommonLayout'
import MaterialLayout from '../../components/detail/components/materialLayout'
import DemandLayout from '../../components/detail/components/purchaseBidDemandLayout'
import BidCommonLayout from '../../components/detail/components/bidCommonLayout'
import ModalOperate from '../../components/modalOperate'
import BidProgressDrawer from '../../components/detail/components/bidProgressDrawer'
import QuotationDetailsDrawer from '../../components/detail/components/quotationDetailsDrawer'
import { useQuery, useLocation } from '@linkseeks/router-core'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR } from '../../constants/purchaseBid'

import ConfirmBidResultModal from '../components/confirmBidResultModal'
import SubmitResultModal from '../components/submitResultModal'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

const TABLINK = [
  { id: 'progressLayout', title: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  {
    id: 'bidResultLayout',
    title: intl.formatMessage({ id: 'detail.purchase.bidResultLayout' }),
    include: ['search', 'readyAdd', 'readyAddShop', 'readyBid'],
  },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  {
    id: 'materialLayout',
    title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readyExamineOne',
      'readyExamineTwo',
      'readySubmit',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'bidRulesLayout',
    title: intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readyExamineOne',
      'readyExamineTwo',
      'readySubmit',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'signUpLayout',
    title: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readyExamineOne',
      'readyExamineTwo',
      'readySubmit',
      'readyExamineSignUp',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'signUpMsgLayout',
    title: intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readyExamineSignUp',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'signUpFileLayout',
    title: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
    include: ['readyExamineSignUp'],
  },
  {
    id: 'conditionLayout',
    title: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readyExamineOne',
      'readyExamineTwo',
      'readySubmit',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'fileLayout',
    title: intl.formatMessage({ id: 'detail.purchase.file' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  {
    id: 'demandLayout',
    title: intl.formatMessage({ id: 'detail.purchase.demandLayout' }),
    include: ['search', 'readyAdd', 'readyAddShop', 'readyExamineOne', 'readyExamineTwo', 'readySubmit', 'readyBid'],
  },
  {
    id: 'resultLayout',
    title: intl.formatMessage({ id: 'detail.purchase.bidLayout' }),
    include: [
      'search',
      'readyAdd',
      'readyAddShop',
      'readySubmitExamineResult',
      'readyBid',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ],
  },
  { id: 'recordLayout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const SearchDetail = () => {
  const {
    id,
    number,
    signUpId, //报名ID
    button, //按钮类型
    memberName, //中标供应商
    action, //是否显示审核按钮
    createMemberId, //报名会员id
    createMemberRoleId, //报名角色id
  } = useQuery()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [visible, setVisible] = useState<boolean>(false)
  // 确认竞价结果
  const [confirmBidResultVisible, setConfirmBidResultVisible] = useState<boolean>(false)
  // 提交竞价结果
  const [uploadBidResultVisible, setUploadBidResultVisible] = useState<boolean>(false)
  // 报价明细
  const [quotationDetailsVisible, setQuotationDetailsVisible] = useState<boolean>(false)
  // 竞价过程
  const [progressVisible, setProgressVisible] = useState<boolean>(false)
  const [quotationDetailsId, setQuotationDetailsId] = useState<any>()
  const [dataSource, setDataSource] = useState<any>({})
  // 流转数据数据
  const [progressEffect, setProgressEffect] = useState<ProgressValue[]>([])
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
  const [storeList, setStoreList] = useState<Array<any>>([])
  // 授标结果
  const [awardResult, setAwardResult] = useState<any>({})

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  // 生成tabs

  const _tabs = useMemo(() => {
    let _list = []
    TABLINK.forEach((item) => {
      if (!item.include || item.include.includes(pathPci)) {
        _list.push(item)
      }
    })
    return _list
  }, [pathPci])

  const handleProgressEffect = (data: any) => {
    const _interiorLogStatesInclude = [
      'readyExamineSignUp',
      'readySubmitExamineResult',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ]
    const _examineInteriorLogStates = [
      'search',
      'readySubmitExamineResult',
      'readyExamineResultOne',
      'readyExamineResultTwo',
      'readyConfirm',
    ]
    let _list = [
      {
        title: intl.formatMessage({ id: 'detail.purchase.externalLogStates' }),
        state: 1,
        logs: data.externalLogStates,
      },
    ]
    if (!_interiorLogStatesInclude.includes(pathPci)) {
      _list.push({
        title: intl.formatMessage({ id: 'detail.purchase.interiorLogStates' }),
        state: 2,
        logs: data.interiorLogStates,
      })
    }
    if (_examineInteriorLogStates.includes(pathPci)) {
      _list.push({
        title: intl.formatMessage({ id: 'detail.purchase.examineInteriorLogStates' }),
        state: 3,
        logs: data.examineInteriorLogStates,
      })
    }
    setProgressEffect(_list)
  }

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.biddingNo' }), extra: data.biddingNo, type: 'text' },
          { label: intl.formatMessage({ id: 'detail.purchase.biddingDetails' }), extra: data.details, type: 'text' },
          {
            label: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
            extra: <StatusTag type={BID_EXTERNALSTATE_COLOR(data.externalState)} title={data.externalStateName} />,
            type: 'text',
          },
          {
            label: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
            extra: <Badge status={BID_INTERNALSTATE_COLOR(data.interiorState)} text={data.interiorStateName} />,
            type: 'text',
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.memberName' }),
            extra: data.createMemberName,
            type: 'text',
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.areas' }),
            extra: data.areas || [],
            type: 'area',
            tips: intl.formatMessage({ id: 'detail.purchase.tips4' }),
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
            extra: formatTimeString(data.createTime),
            type: 'text',
          },
        ],
      },
    ])
  }

  const handleResultEffect = (data: any) => {
    setResultEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.awardResults' }), extra: data.awardResults, type: 'text' },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }), extra: data.awardResults, type: 'text' },
        ],
      },
    ])
  }

  const handleRulesEffect = (data: any) => {
    setRulesEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.biddingStartTime' }),
            extra: `${formatTimeString(data.biddingStartTime)} ${intl.formatMessage({
              id: 'common.text.to',
            })} ${formatTimeString(data.biddingEndTime)}`,
            type: 'text',
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.startingPrice' }),
            extra: data.startingPrice
              ? `${translate('web.common.currencySymbol')} ${priceFormat(data.startingPrice)}`
              : '',
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips9' }),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.targetPrice' }),
            extra: data.targetPrice ? `${translate('web.common.currencySymbol')} ${priceFormat(data.targetPrice)}` : '',
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips10' }),
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.minPrice' }),
            extra: data.minPrice ? `${translate('web.common.currencySymbol')} ${priceFormat(data.minPrice)}` : '',
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips11' }),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.allowPurchaseCount' }),
            extra: data.allowPurchaseCount,
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips12' }),
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.isOpenPurchase' }),
            extra: transforType[data.isOpenPurchase],
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips13' }),
            isMix: [
              intl.formatMessage({ id: 'detail.purchase.isMix1' }),
              intl.formatMessage({ id: 'detail.purchase.isMix2' }),
            ],
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.isOpenRanking' }),
            extra: transforType[data.isOpenRanking],
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips14' }),
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
            label: intl.formatMessage({ id: 'detail.purchase.startSignUp' }),
            extra: `${formatTimeString(data.startSignUp)} 至 ${formatTimeString(data.endSignUp)}`,
            type: 'text',
          },
          { label: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }), extra: data.demand, type: 'text' },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.demandUrls' }), extra: data.demandUrls, type: 'files' },
        ],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
            extra: formatTimeString(data.deliver),
            type: 'text',
          },
          { label: intl.formatMessage({ id: 'detail.purchase.address' }), extra: data.address, type: 'text' },
          { label: intl.formatMessage({ id: 'detail.purchase.offerAsk' }), extra: data.offer, type: 'text' },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.paymentType' }), extra: data.paymentType, type: 'text' },
          { label: intl.formatMessage({ id: 'detail.purchase.taxesAsk' }), extra: data.taxes, type: 'text' },
          { label: intl.formatMessage({ id: 'detail.purchase.logisticsAsk' }), extra: data.logistics, type: 'text' },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.packRequireAsk' }),
            extra: data.packRequire,
            type: 'text',
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' }),
            extra: data.otherRequire,
            type: 'text',
          },
        ],
      },
    ])
  }

  const handleAwardResult = (data: any) => {
    setAwardResult({
      list: data?.awardsFruit?.memers || [],
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
    /**
     * 待新增商城采购竞价单要的是商城类型为企业商城
     * 新增采购竞价单要的是采购门户
     * 所以去掉过滤了 反正详情shopId是后端返回的 新增的时候应该做处理了
     * */
    let shopList = await fetchShopList()
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }

    const _fetch =
      pathPci === 'readySubmitExamineResult' ? getPurchaseBiddingStaySubmitDetails : getPurchaseBiddingDetails

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

  /** 提交 */
  const fetchSubmitBatch = async () => {
    let res = null
    res = await postPurchaseBiddingExamine({ id })
    if (res.code === 1000) {
      history.goBack()
    }
  }

  const _returnTopButton = () => {
    if (action) {
      switch (pathPci) {
        case 'readyAdd':
        case 'readyAddShop':
          if (button === '1') {
            return (
              <Popconfirm
                title={intl.formatMessage({ id: 'table.purchase.popconfirm1' })}
                okText={intl.formatMessage({ id: 'detail.purchase.okText' })}
                cancelText={intl.formatMessage({ id: 'detail.purchase.cancelText' })}
                onConfirm={fetchSubmitBatch}
              >
                <Button type="primary">
                  <CheckCircleOutlined /> {intl.formatMessage({ id: 'table.purchase.submit' })}
                </Button>
              </Popconfirm>
            )
          } else {
            return null
          }
        case 'readyExamineOne':
        case 'readyExamineTwo':
        case 'readyExamineSignUp':
        case 'readyExamineResultOne':
        case 'readyExamineResultTwo':
        case 'readySubmit':
          const _isSubmit = pathPci === 'readySubmit'
          return (
            <Button onClick={() => setVisible(true)} type="primary">
              <CheckCircleOutlined />{' '}
              {intl.formatMessage({ id: _isSubmit ? 'table.purchase.submit' : 'detail.purchase.modelTitle' })}
            </Button>
          )
        case 'readySubmitExamineResult':
          return (
            <Button onClick={() => setUploadBidResultVisible(true)} type="primary">
              <CheckCircleOutlined />{' '}
              {button === '1'
                ? intl.formatMessage({ id: 'table.purchase.eidt' })
                : intl.formatMessage({ id: 'table.purchase.submit' })}
              {intl.formatMessage({ id: 'detail.purchase.bidResultLayout' })}
            </Button>
          )
        case 'readyConfirm':
          return (
            <Button onClick={() => setConfirmBidResultVisible(true)} type="primary">
              <CheckCircleOutlined />
              {intl.formatMessage({ id: 'detail.purchase.modalTitle11' })}
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
    let fetchSoure: any = null
    switch (pathPci) {
      case 'readyExamineOne':
        fetchSoure = postPurchaseBiddingExamine1
        break
      case 'readyExamineTwo':
        fetchSoure = postPurchaseBiddingExamine2
        break
      case 'readySubmit':
        fetchSoure = postPurchaseBiddingSubmit
        break
      case 'readyExamineSignUp':
        fetchSoure = postPurchaseBiddingExaminBiddingSignup
        break
      case 'readyExamineResultOne':
        fetchSoure = postPurchaseBiddingSubmitBidding1
        break
      case 'readyExamineResultTwo':
        fetchSoure = postPurchaseBiddingSubmitBidding2
        break
    }
    return fetchSoure
  }

  const _returnBidResultLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyBid':
        return (
          <BidCommonLayout
            layoutId="bidResultLayout"
            title={intl.formatMessage({ id: 'detail.purchase.bidResultLayout' })}
            effect={resultEffect}
          />
        )
      default:
        return null
    }
  }, [pathPci, resultEffect])

  const _returnMaterialLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyExamineOne':
      case 'readyExamineTwo':
      case 'readySubmit':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <MaterialLayout
            id={id}
            number={number}
            fetch={getPurchaseBiddingMaterielPage}
            layoutTitle={intl.formatMessage({ id: 'detail.purchase.materialLayout' })}
          />
        )
      default:
        return null
    }
  }, [pathPci, id, number])

  const _returnBidRulesLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyExamineOne':
      case 'readyExamineTwo':
      case 'readySubmit':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="bidRulesLayout"
            title={intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' })}
            effect={rulesEffect}
          />
        )
      default:
        return null
    }
  }, [pathPci, rulesEffect])

  const _returnSignUpLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyExamineOne':
      case 'readyExamineTwo':
      case 'readySubmit':
      case 'readyExamineSignUp':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="signUpLayout"
            title={intl.formatMessage({ id: 'detail.purchase.signUpLayout' })}
            effect={signUpEffect}
          />
        )
      default:
        return null
    }
  }, [pathPci, signUpEffect])

  const _returnSignUpMsgLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="signUpMsgLayout"
            title={intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' })}
            layoutType="msg"
            effect={dataSource.sginUpInfos || []}
          />
        )
      case 'readyExamineSignUp':
        let _data: any = {}
        for (let key in dataSource.sginUpInfos) {
          if (dataSource.sginUpInfos[key].createMemberId == createMemberId) {
            _data = dataSource.sginUpInfos[key]
          }
        }
        return (
          <>
            <BidCommonLayout
              layoutId="signUpMsgLayout"
              title={intl.formatMessage({ id: 'detail.purchase.signUpMsgLayout' })}
              effect={[
                {
                  col: [
                    {
                      label: intl.formatMessage({ id: 'table.purchase.inviteMemberName' }),
                      extra: _data.createMemberName,
                      type: 'text',
                    },
                    {
                      label: intl.formatMessage({ id: 'detail.purchase.contacts' }),
                      extra: _data.contacts,
                      type: 'text',
                    },
                  ],
                },
                {
                  col: [
                    {
                      label: intl.formatMessage({ id: 'detail.purchase.telPhone' }),
                      extra: `+${_data.telPrefix} ${_data.tel}`,
                      type: 'text',
                    },
                    { label: intl.formatMessage({ id: 'detail.purchase.email' }), extra: _data.mail, type: 'text' },
                  ],
                },
                {
                  col: [
                    {
                      label: intl.formatMessage({ id: 'detail.purchase.label17' }),
                      extra: _data.address,
                      type: 'text',
                    },
                  ],
                },
              ]}
            />
            <BidCommonLayout
              layoutId="signUpFileLayout"
              title={intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' })}
              effect={[
                {
                  col: [
                    {
                      label: intl.formatMessage({ id: 'detail.purchase.signUpFileLayout' }),
                      extra: _data.enclosureUrls,
                      type: 'files',
                    },
                  ],
                },
              ]}
            />
          </>
        )
      default:
        return null
    }
  }, [pathPci, dataSource])

  const _returnConditionLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyExamineOne':
      case 'readyExamineTwo':
      case 'readySubmit':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="conditionLayout"
            title={intl.formatMessage({ id: 'detail.purchase.conditionLayout' })}
            effect={conditionEffect}
          />
        )
      default:
        return null
    }
  }, [pathPci, conditionEffect])

  const _returnFileLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="fileLayout"
            title={intl.formatMessage({ id: 'detail.purchase.file' })}
            effect={[
              {
                col: [
                  { label: intl.formatMessage({ id: 'detail.purchase.file' }), extra: dataSource.urls, type: 'files' },
                ],
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
      case 'readyAdd':
      case 'readyAddShop':
      case 'readyExamineOne':
      case 'readyExamineTwo':
      case 'readySubmit':
      case 'readyBid':
        return (
          <DemandLayout
            bidId={id}
            number={number}
            fetch={getPurchaseBiddingMemberPage}
            storeList={storeList}
            title={intl.formatMessage({ id: 'detail.purchase.jointType' })}
          />
        )
      default:
        return null
    }
  }, [pathPci, id, number, storeList])

  const _openQuotationDetailsDrawer = (data: any) => {
    setQuotationDetailsId(data)
    setQuotationDetailsVisible(true)
  }

  const _returnResultLayout = useMemo(() => {
    switch (pathPci) {
      case 'search':
      case 'readyAdd':
      case 'readyAddShop':
      case 'readySubmitExamineResult':
      case 'readyBid':
      case 'readyExamineResultOne':
      case 'readyExamineResultTwo':
      case 'readyConfirm':
        return (
          <BidCommonLayout
            layoutId="resultLayout"
            title={intl.formatMessage({ id: 'detail.purchase.bidLayout' })}
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
                {intl.formatMessage({ id: 'detail.purchase.seeBidStep' })}
              </Button>
            }
          />
        )
      default:
        return null
    }
  }, [pathPci, awardResult])

  const _handleBiddingReturn = (signUpIdea: string, urls: any) => {
    if (confirmLoading) {
      return
    }
    const _params = {
      biddingId: id,
      signUpIdea,
      urls,
    }
    const _fetch =
      button === '1' ? postPurchaseBiddingUpdateBiddingReturn : postPurchaseBiddingSubmitExamineBiddingReturn
    setConfirmLoading(true)
    _fetch(_params)
      .then((res) => {
        if (res.code === 1000) {
          history.goBack()
        }
      })
      .finally(() => setConfirmLoading(false))
  }

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
            <BidCommonLayout
              layoutId="basicLayout"
              title={intl.formatMessage({ id: 'detail.purchase.basicLayout' })}
              effect={basicEffect}
            />
            {_returnMaterialLayout}
            {_returnBidRulesLayout}
            {_returnSignUpLayout}
            {_returnSignUpMsgLayout}
            {_returnConditionLayout}
            {_returnFileLayout}
            {_returnDemandLayout}
            {_returnResultLayout}
            <RecordCommonLayout externalColors={BID_EXTERNALSTATE_COLOR} internalColors={BID_INTERNALSTATE_COLOR} />
          </Fragment>
        }
      />
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
        modalType="audit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
        createMemberId={createMemberId}
        createMemberRoleId={createMemberRoleId}
        hideAuditCancel={pathPci === 'readySubmit'}
      />
      <ConfirmBidResultModal
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle11' })}
        record={{ ...dataSource, memberName: memberName }}
        visible={confirmBidResultVisible}
        onCancel={() => setConfirmBidResultVisible(false)}
        fetch={postPurchaseBiddingStayConfirmBidding}
        onOk={() => {
          history.goBack()
        }}
      />
      <SubmitResultModal
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle12' })}
        visible={uploadBidResultVisible}
        onOk={_handleBiddingReturn}
        onCancel={() => setUploadBidResultVisible(false)}
        confirmLoading={confirmLoading}
      />
      <QuotationDetailsDrawer
        fetch={getPurchaseBiddingQuotedPriceDetaild}
        quotationDetailsId={quotationDetailsId}
        effects="id"
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle13' })}
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
