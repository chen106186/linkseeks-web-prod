import React, { useState, useRef, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { Tabs, Card, Button, Badge } from 'antd'

import ReturnEle from '@/components/ReturnEle'
import { postPurchaseBiddingUpdate, postPurchaseBiddingAdd, getPurchaseBiddingDetails } from '@apps/apis'
import { authService } from '@apps/services'

import Material from '../../purchaseInquiry/addInquiry/components/material'
import Demand from '../../purchaseInquiry/addInquiry/components/demand'

import Basic from './components/basic'
import BidRules from './components/bidRules'
import BidRequirement from './components/bidRequirement'
import Condition from './components/condition'
import File from './components/file'
import { useQuery, useLocation } from '@linkseeks/router-core'
const intl = getIntl()

const { TabPane } = Tabs

const TabFormErrors = (props) => {
  return (
    <Badge size="small" count={props.dot} offset={[6, -5]}>
      {props.children}
    </Badge>
  )
}

const AddForm = () => {
  const { id, number } = useQuery()
  const { pathname } = useLocation()
  const { memberId, memberRoleId, name } = authService.getAuth()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [isShop, setIsShop] = useState<boolean>(false)
  /** 基本信息 */
  const [basic, setBasic] = useState<any>({})
  /** 添加采购物料 */
  const [material, setMaterial] = useState<any>({})
  /** 竞价规则 */
  const [rules, setRules] = useState<any>({})
  /** 报名需求 */
  const [requirement, setRequirement] = useState<any>({})
  /** 交易条件 */
  const [condition, setCondition] = useState<any>({})
  /** 需求对接 */
  const [demand, setDemand] = useState<any>({})
  /** 附件 */
  const [file, setfile] = useState<any>([])
  const [badge, setbadge] = useState<any>([0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsShop(pathPci !== 'readyAdd')
  }, [pathPci])

  /** 拿表单数据的 */
  const currentBasic = useRef<any>({})
  const currentRules = useRef<any>({})
  const currentRequirement = useRef<any>({})
  const currentMaterial = useRef<any>({})
  const currentCondition = useRef<any>({})
  const currentDemand = useRef<any>({})
  const currentFile = useRef<any>({})

  /** 提交&修改 */
  const handleSubmit = async () => {
    setLoading(true)
    const basicRef = await currentBasic.current.get()
    const materialRef = await currentMaterial.current.get()
    const conditionRef = await currentCondition.current.get()
    const demandRef = await currentDemand.current.get()
    const fileRef = await currentFile.current.get()
    const ruleRef = await currentRules.current.get()
    const requirementRef = await currentRequirement.current.get()
    if (
      basicRef.state &&
      materialRef.state &&
      conditionRef.state &&
      demandRef.state &&
      ruleRef.state &&
      requirementRef.state
    ) {
      const params = {
        memberId,
        memberRoleId,
        memberName: name,
        details: basicRef.data.details,
        isAreas: basicRef.data.isAreas,
        areas: basicRef.data.areas,
        ...materialRef.data,
        ...conditionRef.data,
        ...demandRef.data,
        ...ruleRef.data,
        ...requirementRef.data,
        urls: [...fileRef.data],
        shopType: isShop ? 1 : 2,
      }
      let res: {
        code: number
        message: string
        time: number
      } = null
      if (id) {
        res = await postPurchaseBiddingUpdate({ id, ...params })
      } else {
        res = await postPurchaseBiddingAdd({ ...params })
      }
      if (res.code !== 1000) {
        setLoading(false)
        return
      }
      history.goBack()
    } else {
      setLoading(false)
    }
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

  /** 修改获取信息 */
  useEffect(() => {
    if (id && number) {
      const parmas = {
        id,
        number,
        current: '1',
        pageSize: '1',
      }
      getPurchaseBiddingDetails(parmas).then((res: any) => {
        if (res.code === 1000) {
          const params = res.data
          const basicInfo = { ...basic }
          const materialInfo = { ...material }
          const rulesInfo = { ...rules }
          const requirementInfo = { ...requirement }
          const conditionInfo = { ...condition }
          const demandInfo = { ...demand }
          basicInfo.details = params.details
          basicInfo.purchaseType = params.purchaseType
          basicInfo.priceContrast = params.priceContrast
          basicInfo.areas = params.areas || [
            {
              provinceCode: '',
              province: '',
              cityCode: '',
              city: '',
            },
          ]
          basicInfo.memberName = params.createMemberName
          basicInfo.biddingNo = params.biddingNo
          basicInfo.createTime = params.createTime
          basicInfo.externalState = params.externalState
          basicInfo.externalStateName = params.externalStateName
          basicInfo.interiorState = params.interiorState
          basicInfo.interiorStateName = params.interiorStateName
          setBasic(basicInfo)
          materialInfo.materielMode = params.materielMode
          materialInfo.materiels = params.materiels
          setMaterial(materialInfo)
          rulesInfo.biddingStartTime = params.biddingStartTime
          rulesInfo.biddingEndTime = params.biddingEndTime
          rulesInfo.isStartingPrice = params.isStartingPrice
          rulesInfo.isTargetPrice = params.isTargetPrice
          rulesInfo.isMinPrice = params.isMinPrice
          rulesInfo.isOpenPurchase = params.isOpenPurchase
          rulesInfo.isOpenRanking = params.isOpenRanking
          rulesInfo.startingPrice = params.startingPrice
          rulesInfo.targetPrice = params.targetPrice
          rulesInfo.allowPurchaseCount = params.allowPurchaseCount
          rulesInfo.minPrice = params.minPrice
          setRules(rulesInfo)
          requirementInfo.startSignUp = params.startSignUp
          requirementInfo.endSignUp = params.endSignUp
          requirementInfo.demand = params.demand
          requirementInfo.demandUrls = params.demandUrls
          setRequirement(requirementInfo)
          conditionInfo.deliver = params.deliver
          conditionInfo.offerEndTime = params.offerEndTime
          conditionInfo.address = params.address
          conditionInfo.addressId = params.addressId
          conditionInfo.offer = params.offer
          conditionInfo.paymentType = params.paymentType
          conditionInfo.taxes = params.taxes
          conditionInfo.logistics = params.logistics
          conditionInfo.packRequire = params.packRequire
          conditionInfo.otherRequire = params.otherRequire
          setCondition(conditionInfo)
          demandInfo.type = params.type
          demandInfo.shopIds = params.shopIds
          demandInfo.demandMembers = params.members
          setDemand(demandInfo)
          setfile([...params.urls])
        }
      })
    }
  }, [id, number])

  return (
    <PageHeaderWrapper
      extra={
        <Button loading={loading} type="primary" onClick={handleSubmit}>
          <SaveOutlined /> {intl.formatMessage({ id: 'detail.purchase.save' })}
        </Button>
      }
    >
      <Card>
        <Tabs type="card">
          {/* 基本信息 */}
          <TabPane
            key="1"
            tab={
              <TabFormErrors dot={badge[0]}>{intl.formatMessage({ id: 'detail.purchase.basicLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <Basic currentRef={currentBasic} fetchdata={basic} onBadge={getError} />
          </TabPane>
          {/* 添加采购物料 */}
          <TabPane
            key="2"
            tab={
              <TabFormErrors dot={badge[1]}>
                {intl.formatMessage({ id: 'detail.purchase.materialLayout' })}
              </TabFormErrors>
            }
            forceRender
          >
            <Material currentRef={currentMaterial} fetchdata={material} onBadge={getError} />
          </TabPane>
          {/* 竞价规则 */}
          <TabPane
            key="3"
            tab={
              <TabFormErrors dot={badge[2]}>
                {intl.formatMessage({ id: 'detail.purchase.bidRulesLayout' })}
              </TabFormErrors>
            }
            forceRender
          >
            <BidRules currentRef={currentRules} fetchdata={rules} onBadge={getError} exRef={currentRequirement} />
          </TabPane>
          {/* 报名要求 */}
          <TabPane
            key="4"
            tab={
              <TabFormErrors dot={badge[3]}>{intl.formatMessage({ id: 'detail.purchase.signUpLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <BidRequirement
              currentRef={currentRequirement}
              fetchdata={requirement}
              onBadge={getError}
              exRef={currentRules}
            />
          </TabPane>
          {/* 交易条件 */}
          <TabPane
            key="5"
            tab={
              <TabFormErrors dot={badge[4]}>
                {intl.formatMessage({ id: 'detail.purchase.conditionLayout' })}
              </TabFormErrors>
            }
            forceRender
          >
            <Condition currentRef={currentCondition} fetchdata={condition} onBadge={getError} />
          </TabPane>
          {/* 需求对接 */}
          <TabPane
            key="6"
            tab={
              <TabFormErrors dot={badge[5]}>{intl.formatMessage({ id: 'detail.purchase.demandLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <Demand
              currentRef={currentDemand}
              fetchdata={demand}
              onBadge={getError}
              badgeIndex={5}
              needOperate={false}
              isShop={isShop}
            />
          </TabPane>
          <TabPane key="7" tab={intl.formatMessage({ id: 'detail.purchase.file' })} forceRender>
            <File fetchdata={file} currentRef={currentFile} />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}
export default AddForm
