import React, { useRef, useState, useEffect } from 'react'
import { Card, Tabs, Button, Badge, message } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import BasicInfo from './components/basicInfo'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import Material from './components/material'
import moment from 'moment'
import { isEmpty } from 'lodash'
import UploadImport from '@/components/UploadImport'
import { getPurchaseNeedPlanDetails, postPurchaseNeedPlanAdd, postPurchaseNeedPlanUpdate } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'

const { TabPane } = Tabs
const intl = getIntl()
const DemandPlanAddedForm = () => {
  const { id } = useQuery()
  /** 基本信息 */
  const [basic, setBasic] = useState<any>({})
  const [material, setMaterial] = useState<any>([])
  const [badge, setbadge] = useState<any>([0, 0])
  const [loading, setLoading] = useState<boolean>(false)

  const TabFormErrors = (props) => {
    return (
      <Badge size="small" count={props.dot} offset={[6, -5]}>
        {props.children}
      </Badge>
    )
  }

  /** 拿表单数据的 */
  const currentBasic = useRef<any>({})
  const currentMaterial = useRef<any>({})

  /**必填没填写出现角标 */
  const getError = (num: number, idx: number) => {
    const data = [...badge]
    data[idx] = num
    setbadge(data)
    if (num !== 0) {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const basicRef = await currentBasic.current.get()
    const materialRef = await currentMaterial.current.get()
    if (basicRef.state && materialRef.state) {
      const params = {
        summary: basicRef.data.summary,
        startTime: basicRef.data.startTime.format('x'),
        endTime: basicRef.data.endTime.format('x'),
        ...materialRef.data,
      }
      if (isEmpty(materialRef.data)) {
        message.error(intl.formatMessage({ id: 'detail.purchase.message10' }))
        setLoading(false)
        return
      }
      if (id) {
        await postPurchaseNeedPlanUpdate({ id, ...params })
          .then((res) => {
            if (res.code !== 1000) {
              setLoading(false)
              return
            }
            history.goBack()
            setLoading(false)
          })
          .catch((error) => {
            console.warn(error)
          })
      } else {
        await postPurchaseNeedPlanAdd({ ...params })
          .then((res) => {
            if (res.code !== 1000) {
              setLoading(false)
              return
            }
            history.goBack()
            setLoading(false)
          })
          .catch((error) => {
            console.warn(error)
          })
      }
    } else {
      setLoading(false)
    }
  }

  /** 修改获取信息 */
  useEffect(() => {
    if (id) {
      getPurchaseNeedPlanDetails({ id })
        .then((res: any) => {
          if (res.code === 1000) {
            setBasic(res.data)
            setMaterial(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [id])

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
            tab={
              <TabFormErrors dot={badge[0]}>{intl.formatMessage({ id: 'detail.purchase.basicLayout' })}</TabFormErrors>
            }
            key="1"
            forceRender
          >
            <BasicInfo currentRef={currentBasic} fetchdata={basic} onBadge={getError} />
          </TabPane>
          <TabPane
            tab={
              <TabFormErrors dot={badge[1]}>
                {intl.formatMessage({ id: 'detail.purchase.materialLayout' })}
              </TabFormErrors>
            }
            key="2"
            forceRender
          >
            <Material currentRef={currentMaterial} fetchdata={material} onBadge={getError} />
          </TabPane>
        </Tabs>
      </Card>
      <UploadImport width="400px" />
    </PageHeaderWrapper>
  )
}

export default DemandPlanAddedForm
