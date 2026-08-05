import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Badge, Button } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'

import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'

import { Context } from '../../components/detail/components/context'
import PeripheralLayout from '../../components/detail'
import ProgressLayout, { ProgressValue } from '../../components/detail/components/progressCommonLayout'
import RecordCommonLayout from '../../components/detail/components/recordCommonLayout'
import MaterialLayout from '../../components/detail/components/materialLayout'
import BidCommonLayout from '../../components/detail/components/bidCommonLayout'
import TableCommonLayout from '../../components/detail/components/tableCommonLayout'
import LowestQuotationRecordLayout from '../../components/detail/components/lowestQuotationRecordLayout'
import BidProgressDrawer from '../../components/detail/components/bidProgressDrawer'

import ThankModal from './components/thank'
import { useQuery, useLocation } from '@linkseeks/router-core'

import { BID_EXTERNALSTATE_COLOR, BID_INTERNALSTATE_COLOR } from '../../constants/purchaseBid'
import {
  getPurchaseOnlineBiddingAwardResultsBidding,
  getPurchaseOnlineBiddingDetails,
  getPurchaseOnlineBiddingMaterielPage,
  getPurchaseOnlineBiddingMinimumBidding,
  getPurchaseOnlineBiddingProcess,
} from '@apps/apis'
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
    id: 'winBidResultLayout',
    title: intl.formatMessage({ id: 'detail.purchase.winBidResultLayout' }),
    except: ['readySignUp', 'readyBid'],
  },
  {
    id: 'winBidMsgLayout',
    title: intl.formatMessage({ id: 'detail.purchase.bidLayout1' }),
    except: ['readySignUp', 'readyBid'],
  },
  {
    id: 'winBidDetails',
    title: intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' }),
    except: ['readySignUp', 'readyBid'],
  },
  { id: 'basicLayout', title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { id: 'materialLayout', title: intl.formatMessage({ id: 'detail.purchase.materialLayout' }) },
  { id: 'bidRulesLayout', title: intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' }) },
  { id: 'signUpLayout', title: intl.formatMessage({ id: 'detail.purchase.signUpLayout' }) },
  { id: 'conditionLayout', title: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) },
  { id: 'fileLayout', title: intl.formatMessage({ id: 'detail.purchase.file' }) },
  { id: 'quotationRecordLayout', title: intl.formatMessage({ id: 'detail.purchase.quotationRecordLayout' }) },
  { id: 'recordLayout', title: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const SearchDetail = () => {
  const { id, number, turn } = useQuery()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])

  // 竞价过程
  const [progressVisible, setProgressVisible] = useState<boolean>(false)
  const [progressData, setProgressData] = useState<any>([])
  // 详情数据
  const [dataSource, setDataSource] = useState<any>({})
  // 流转数据数据
  const [progressEffect, setProgressEffect] = useState<ProgressValue[]>([])
  // 基本信息数据
  const [basicEffect, setBasicEffect] = useState<any>([])
  // 竞价结果数据
  const [resultEffect, setResultEffect] = useState<any>([])
  // 竞价通知数据
  const [msgEffect, setMsgEffect] = useState<any>([])
  // 竞价规则数据
  const [rulesEffect, setRulesEffect] = useState<any>([])
  // 报名要求
  const [signUpEffect, setSignUpEffect] = useState<any>([])
  // 交易条件
  const [conditionEffect, setConditionEffect] = useState<any>([])
  // 感谢函
  const [thankVisAble, seTthankVisAble] = useState<boolean>(false)

  const _tabs = useMemo(() => {
    let _list = []
    TABLINK.forEach((item) => {
      if (!item.except || !item.except.includes(pathPci)) {
        _list.push(item)
      }
    })
    return _list
  }, [pathPci])

  const handleProgressEffect = (data: any) => {
    let _list = [
      {
        title: intl.formatMessage({ id: 'detail.purchase.externalLogStates' }),
        state: 1,
        logs: data.externalLogStates,
      },
      // { title: '内部流转', state: 2, logs: data.interiorLogStates }
    ]
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
          {
            label: intl.formatMessage({ id: 'detail.purchase.label' }),
            extra: data?.sumAwardPrice
              ? `${translate('web.common.currencySymbol')} ${priceFormat(data?.sumAwardPrice)}`
              : '-',
            type: 'text',
          },
        ],
      },
      {
        col: [{ label: intl.formatMessage({ id: 'detail.purchase.label1' }), extra: data?.signUpIdea, type: 'text' }],
      },
    ])
  }

  const handleMsgEffect = (data: any) => {
    setMsgEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.awardResults' }), extra: data.awardResults, type: 'text' },
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
              id: 'detail.purchase.label3',
            })} ${formatTimeString(data.biddingEndTime)}`,
            type: 'text',
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.startingPrice' }),
            extra: data.startingPrice
              ? `${translate('web.common.currencySymbol')} ${priceFormat(data.startingPrice)}`
              : '-',
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips9' }),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.targetPrice' }),
            extra: data.targetPrice
              ? `${translate('web.common.currencySymbol')} ${priceFormat(data.targetPrice)}`
              : '-',
            type: 'text',
            tips: intl.formatMessage({ id: 'detail.purchase.tips10' }),
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.minPrice' }),
            extra: data.minPrice ? `${translate('web.common.currencySymbol')} ${priceFormat(data.minPrice)}` : '-',
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
            extra: `${formatTimeString(data.startSignUp)}  ${intl.formatMessage({
              id: 'detail.purchase.label3',
            })} ${formatTimeString(data.endSignUp)}`,
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

  const fetchDataSource = async () => {
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    getPurchaseOnlineBiddingDetails({ ...params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setDataSource(data)
      handleProgressEffect(data)
      handleBasicEffect(data)
      handleRulesEffect(data)
      handleSignUpEffect(data)
      handleConditionEffect(data)
      handleResultEffect(data)
      handleMsgEffect(data)
      if (data.externalState === 99 && data.isPrize != 1 && data.isPrize != undefined && data.isPrize != null) {
        seTthankVisAble(true)
      }
    })
    getPurchaseOnlineBiddingProcess({ ...params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      setProgressData(res.data)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const _returnWinBidResultLayout = useMemo(() => {
    switch (pathPci) {
      case 'readySignUp':
      case 'readyBid':
        return null
      default:
        return (
          <BidCommonLayout
            layoutId="winBidResultLayout"
            title={intl.formatMessage({ id: 'detail.purchase.winBidResultLayout' })}
            effect={resultEffect}
          />
        )
    }
  }, [pathPci, resultEffect])

  const _returnWinBidMsgLayout = useMemo(() => {
    switch (pathPci) {
      case 'readySignUp':
      case 'readyBid':
        return null
      default:
        return (
          <BidCommonLayout
            layoutId="winBidMsgLayout"
            title={intl.formatMessage({ id: 'detail.purchase.bidLayout1' })}
            effect={msgEffect}
          />
        )
    }
  }, [pathPci, msgEffect])

  const _returnWinBidDetails = useMemo(() => {
    switch (pathPci) {
      case 'readySignUp':
      case 'readyBid':
        return null
      default:
        return (
          <TableCommonLayout
            layoutId="winBidDetails"
            layoutTitle={intl.formatMessage({ id: 'table.purchase.zhongbiaomingxi' })}
            id={id}
            number={number}
            fetch={getPurchaseOnlineBiddingAwardResultsBidding}
          />
        )
    }
  }, [id, number, pathPci])

  const _returnMaterialLayout = useMemo(() => {
    return (
      <MaterialLayout
        id={id}
        number={number}
        fetch={getPurchaseOnlineBiddingMaterielPage}
        layoutTitle={intl.formatMessage({ id: 'detail.purchase.materialLayout' })}
      />
    )
  }, [id, number])

  const _returnBidRulesLayout = useMemo(() => {
    return (
      <BidCommonLayout
        layoutId="bidRulesLayout"
        title={intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' })}
        effect={rulesEffect}
      />
    )
  }, [rulesEffect])

  const _returnSignUpLayout = useMemo(() => {
    return (
      <BidCommonLayout
        layoutId="signUpLayout"
        title={intl.formatMessage({ id: 'detail.purchase.signUpLayout' })}
        effect={signUpEffect}
      />
    )
  }, [signUpEffect])

  const _returnConditionLayout = useMemo(() => {
    return (
      <BidCommonLayout
        layoutId="conditionLayout"
        title={intl.formatMessage({ id: 'detail.purchase.conditionLayout' })}
        effect={conditionEffect}
      />
    )
  }, [conditionEffect])

  const _returnFileLayout = useMemo(() => {
    return (
      <BidCommonLayout
        layoutId="fileLayout"
        title={intl.formatMessage({ id: 'detail.purchase.file' })}
        effect={[
          {
            col: [{ label: intl.formatMessage({ id: 'detail.purchase.file' }), extra: dataSource.urls, type: 'files' }],
          },
        ]}
      />
    )
  }, [dataSource])

  const _returnLowestQuotationRecordLayout = useMemo(() => {
    return (
      <LowestQuotationRecordLayout
        id={id}
        number={number}
        layoutId="quotationRecordLayout"
        layoutTitle={intl.formatMessage({ id: 'detail.purchase.quotationRecordLayout' })}
        fetch={getPurchaseOnlineBiddingMinimumBidding}
        effect={dataSource}
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
  }, [id, number, dataSource])

  return (
    <Context.Provider value={dataSource}>
      <PeripheralLayout
        no={dataSource.biddingNo}
        tabLink={_tabs}
        components={
          <Fragment>
            <ProgressLayout effect={progressEffect} />
            {_returnWinBidResultLayout}
            {_returnWinBidMsgLayout}
            {_returnWinBidDetails}
            <BidCommonLayout
              layoutId="basicLayout"
              title={intl.formatMessage({ id: 'detail.purchase.basicLayout' })}
              effect={basicEffect}
            />
            {_returnMaterialLayout}
            {_returnBidRulesLayout}
            {_returnSignUpLayout}
            {_returnConditionLayout}
            {_returnFileLayout}
            {_returnLowestQuotationRecordLayout}
            <RecordCommonLayout externalColors={BID_EXTERNALSTATE_COLOR} internalColors={BID_INTERNALSTATE_COLOR} />
          </Fragment>
        }
      />
      <BidProgressDrawer
        awardProcess={progressData}
        visible={progressVisible}
        onClose={() => {
          setProgressVisible(false)
        }}
      />
      <ThankModal
        visible={thankVisAble}
        detail={dataSource}
        onOk={() => {
          seTthankVisAble(false)
        }}
      />
    </Context.Provider>
  )
}
export default SearchDetail
