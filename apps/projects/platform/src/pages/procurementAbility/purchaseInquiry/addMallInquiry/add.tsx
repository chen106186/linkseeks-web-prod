import React, { useState, useRef, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { Tabs, Card, Button, Badge } from 'antd'
import Basic from './components/basic'
import Material from './components/material'
import Condition from './components/condition'
import Demand from './components/demand'
import File from './components/file'
import ReturnEle from '@/components/ReturnEle'
import { authService } from '@apps/services'
import {
  getPurchasePurchaseInquiryDetails,
  GetPurchasePurchaseInquiryDetailsResponse,
  PostPurchasePurchaseInquiryAddRequest,
  postPurchasePurchaseInquiryAdd,
  postPurchasePurchaseInquiryUpdate,
} from '@apps/apis'
import { useQuery, useLocation } from '@linkseeks/router-core'
const { TabPane } = Tabs

const TabFormErrors = (props) => {
  return (
    <Badge size="small" count={props.dot} offset={[6, -5]}>
      {props.children}
    </Badge>
  )
}
const intl = getIntl()
const AddForm = () => {
  const { id, number } = useQuery()
  const { memberId, memberRoleId, userName } = authService.getAuth()
  /** 基本信息 */
  const [basic, setBasic] = useState<any>({})
  /** 添加采购物料 */
  const [material, setMaterial] = useState<any>({})
  /** 交易条件 */
  const [condition, setCondition] = useState<any>({})
  /** 需求对接 */
  const [demand, setDemand] = useState<any>({})
  /** 附件 */
  const [file, setfile] = useState<any>([])
  const [badge, setbadge] = useState<any>([0, 0, 0, 0])
  const [loading, setLoading] = useState<boolean>(false)

  /** 拿表单数据的 */
  const currentBasic = useRef<any>({})
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
    if (basicRef.state && materialRef.state && conditionRef.state && demandRef.state && fileRef.state) {
      const params: PostPurchasePurchaseInquiryAddRequest = {
        memberId,
        memberRoleId,
        memberName: userName,
        details: basicRef.data.details,
        areas: basicRef.data.requisitionFormAddress,
        priceContrast: basicRef.data.priceContrast,
        purchaseType: basicRef.data.purchaseType,
        ...materialRef.data,
        ...conditionRef.data,
        ...demandRef.data,
        transactionUurls: fileRef.data,
        shopType: 1,
      }
      let res: {
        code: number
        message: string
        time: number
      } = null
      if (id) {
        res = await postPurchasePurchaseInquiryUpdate({ id, ...params })
      } else {
        res = await postPurchasePurchaseInquiryAdd({ ...params })
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
      getPurchasePurchaseInquiryDetails(parmas)
        .then((res: any) => {
          if (res.code === 1000) {
            const params: GetPurchasePurchaseInquiryDetailsResponse = res.data
            const basicInfo: GetPurchasePurchaseInquiryDetailsResponse = { ...basic }
            const materialInfo: GetPurchasePurchaseInquiryDetailsResponse = { ...material }
            const conditionInfo: GetPurchasePurchaseInquiryDetailsResponse = { ...condition }
            const demandInfo: GetPurchasePurchaseInquiryDetailsResponse = { ...demand }
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
            basicInfo.createMemberName = params.createMemberName
            basicInfo.memberName = params.memberName
            basicInfo.purchaseInquiryNo = params.purchaseInquiryNo
            basicInfo.createTime = params.createTime
            basicInfo.externalState = params.externalState
            basicInfo.interiorState = params.interiorState
            setBasic(basicInfo)
            materialInfo.materielMode = params.materielMode
            materialInfo.materiels = params.materiels
            setMaterial(materialInfo)
            conditionInfo.deliveryTime = params.deliveryTime
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
            demandInfo.demandMembers = params.demandMembers
            setDemand(demandInfo)
            params.transactionUurls && setfile(params.transactionUurls)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [id, number])
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
                {intl.formatMessage({ id: 'detail.purchase.addMaterialLayout' })}
              </TabFormErrors>
            }
            forceRender
          >
            <Material currentRef={currentMaterial} fetchdata={material} onBadge={getError} />
          </TabPane>
          {/* 交易条件 */}
          <TabPane
            key="3"
            tab={
              <TabFormErrors dot={badge[2]}>
                {intl.formatMessage({ id: 'detail.purchase.conditionLayout' })}
              </TabFormErrors>
            }
            forceRender
          >
            <Condition currentRef={currentCondition} fetchdata={condition} onBadge={getError} />
          </TabPane>
          {/* 需求对接 */}
          <TabPane
            key="4"
            tab={
              <TabFormErrors dot={badge[3]}>{intl.formatMessage({ id: 'detail.purchase.demandLayout' })}</TabFormErrors>
            }
            forceRender
          >
            <Demand currentRef={currentDemand} fetchdata={demand} onBadge={getError} />
          </TabPane>
          <TabPane key="5" tab={intl.formatMessage({ id: 'detail.purchase.file' })} forceRender>
            <File fetchdata={file} currentRef={currentFile} />
          </TabPane>
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}
export default AddForm
