import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Tabs, Button, Card, Badge } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import Basic from './components/basic'
import Offer from './components/offer'
import Explain from './components/explain'
import File from './components/file'
import { authService } from '@apps/services'
import {
  getPurchaseQuotedPriceDetails,
  getPurchaseQuotedPricePurchaseInquiryDetails,
  postPurchaseQuotedPriceAdd,
  postPurchaseQuotedPriceUpdate,
} from '@apps/apis'
import { useLocation, useQuery } from '@linkseeks/router-core'
import { message } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

const { TabPane } = Tabs
const intl = getIntl()
const AddForm = () => {
  const { id, number, turn, type } = useQuery()
  const { pathname } = useLocation()
  const [loading, setLoading] = useState<boolean>(false)
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<any>({})
  /** 当前报价轮次 */
  const [round, setRound] = useState<number>(Number(turn))
  /** 点击报价信息切换的轮次 */
  const [checkRound, setCheckRound] = useState<number>()
  /** 基本信息 */
  const [basic, setbasic] = useState<any>({})
  /** 报价信息 */
  const [offer, setoffer] = useState<any>({})
  /** 报价说明 */
  const [explain, setexplain] = useState<any>({})
  const [badge, setbadge] = useState<any>([0, 0, 0, 0])
  const translate = useWebIntl()

  const TabFormErrors = (props) => {
    return (
      <Badge size="small" count={props.dot} offset={[6, -5]}>
        {props.children}
      </Badge>
    )
  }

  /**必填没填写出现角标 */
  const getError = (num: number, idx: number) => {
    const data = [...badge]
    data[idx] = num
    setbadge(data)
    if (num !== 0) {
      setLoading(false)
    }
  }

  /** 获取各模块的数据 */
  const currentBasic = useRef<any>({})
  const currentExplain = useRef<any>({})
  const currentOffer = useRef<any>({})
  const currentFile = useRef<any>({})

  /** 报价说明切换效果 */
  const forEachQuotedPriceTurnList = (data: any, key: number) => {
    let params: any = {}
    data.forEach((item) => {
      if (Number(item.turn) === Number(key)) {
        params = { ...item }
      }
    })
    return params
  }

  const handleOtherCallBack = useCallback((data: any, key: number) => {
    setexplain(forEachQuotedPriceTurnList(data, key))
  }, [])

  useEffect(() => {
    let link: any
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    if (type === 'quote') {
      link = getPurchaseQuotedPricePurchaseInquiryDetails
    } else if ((path === 'add' || path === 'edit') && id && number) {
      link = getPurchaseQuotedPriceDetails
    }
    link(params)
      .then((res) => {
        if (res.code === 1000) {
          const params: any = { ...res.data }
          const basicInfo: any = { ...basic }
          const offerInfo: any = { ...offer }
          basicInfo.id = params.purchaseInquiryId || params.id
          basicInfo.quotedPriceId = params.quotedPriceId
          basicInfo.number = params.purchaseInquiryNo
          basicInfo.contacts = params.contacts
          basicInfo.purchaseInquiryNo = params.purchaseInquiryNo
          basicInfo.quotedPriceNo = params.quotedPriceNo
          basicInfo.memberName = params.memberName
          basicInfo.offerEndTime = params.offerEndTime
          basicInfo.createTime = params.createTime
          basicInfo.externalState = params.externalState
          basicInfo.interiorStateName = params.interiorStateName
          basicInfo.externalStateName = params.externalStateName
          basicInfo.interiorState = params.interiorState
          offerInfo.id = params.id
          if (path === 'edit') {
            offerInfo.materiels = params.quotedPriceProducts
            offerInfo.turn = turn
            ;(basicInfo.quotedDetails = params.quotedDetails), (basicInfo.telPrefix = params.telPrefix)
            basicInfo.tel = params.tel
            setCheckRound(Number(turn))
            handleOtherCallBack(params.quotedPriceTurnList, turn)
          } else {
            offerInfo.materiels = params.materiels
            offerInfo.turn = params.turn
            setRound(params.turn ? Number(params.turn + 1) : 1)
            setCheckRound(params.turn ? Number(params.turn + 1) : 1)
            handleOtherCallBack(params.quotedPriceTurnList, params.turn + 1)
          }
          setbasic(basicInfo)
          setoffer(offerInfo)
          setDataSource(params)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }, [])

  const handleSubmit = async () => {
    const { memberId, memberRoleId, userName } = authService.getAuth()
    const basicRef = await currentBasic.current.get()
    const explainRef = await currentExplain.current.get()
    const offerRef = await currentOffer.current.get()
    const fileRef = await currentFile.current.get()
    setLoading(true)

    if (basicRef.state && explainRef.state && offerRef.state && fileRef.state) {
      // 添加关联商品校验
      if (offerRef.data.some((item) => !item.productId)) {
        message.warning(translate('web.resource.order.qingxuanzeguanlianbaojiashangpin'))
        setLoading(false)
        return
      }
      const params = {
        quotedDetails: basicRef.data.quotedDetails,
        tel: basicRef.data.tel,
        telPrefix: basicRef.data.telPrefix,
        contacts: basicRef.data.contacts,
        ...explainRef.data,
        detailss: offerRef.data,
        enclosureUrls: fileRef.data,
      }
      if (path === 'edit') {
        params.id = Number(id)
        await postPurchaseQuotedPriceUpdate({ ...params })
          .then((res) => {
            if (res.code === 1000) {
              history.goBack()
            } else {
              setLoading(false)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        if (basic.quotedPriceId) {
          params.quotedPriceId = basic.quotedPriceId
        }
        params.purchaseInquiryId = id
        params.purchaseInquiryNo = number
        params.memberName = userName
        params.memberId = memberId
        params.memberRoleId = memberRoleId
        await postPurchaseQuotedPriceAdd({ ...params })
          .then((res) => {
            if (res.code === 1000) {
              // history.goBack()
              history.push(`/procurementAbility/offter/addOffter`)
            } else {
              setLoading(false)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } else {
      setLoading(false)
    }
  }

  /** 获取报价信息当前点击的轮次 */
  const handleGetKey = (count: number) => {
    setCheckRound(count)
    handleOtherCallBack(dataSource.quotedPriceTurnList, count)
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button loading={loading} type="primary" onClick={handleSubmit}>
          {' '}
          {intl.formatMessage({ id: 'detail.purchase.save' })}
        </Button>
      }
    >
      <Card>
        <Tabs type="card">
          <TabPane
            key="1"
            tab={
              <TabFormErrors dot={badge[0]}>{intl.formatMessage({ id: 'detail.purchase.basicLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <Basic fetchdata={basic} currentRef={currentBasic} onBadge={getError} />
          </TabPane>
          <TabPane
            key="2"
            tab={
              <TabFormErrors dot={badge[1]}>{intl.formatMessage({ id: 'detail.purchase.offerLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <Offer getKey={handleGetKey} fetchdata={offer} currentRef={currentOffer} name={path} onBadge={getError} />
          </TabPane>
          <TabPane
            key="3"
            tab={
              <TabFormErrors dot={badge[2]}>{intl.formatMessage({ id: 'detail.purchase.offerExplain' })}</TabFormErrors>
            }
            forceRender
          >
            <Explain
              round={round}
              checkRound={checkRound}
              fetchdata={explain}
              currentRef={currentExplain}
              onBadge={getError}
            />
          </TabPane>
          <TabPane key="4" tab={intl.formatMessage({ id: 'detail.purchase.file' })} forceRender>
            <File round={round} checkRound={checkRound} fetchdata={explain} currentRef={currentFile} />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}
export default AddForm
