import React, { useState } from 'react'
import { Button, Form } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import ProgressLayout from '@/pages/transaction/components/detailLayout/components/progressLayout'
import GeneralLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import RecordLyout from '@/pages/transaction/components/detailLayout/components/recordLyout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'
import { ACTIVITYTYPENAME, GeneralEffect } from '../../common/constants'
import ActivityUserLayout from '../../components/activityUserLayout'
import DemandLayout from '../../components/demandLayout'
import { isEmpty } from 'lodash'
import { SaveOutlined } from '@ant-design/icons'
import ProductListLayout from '../../components/productListLayout'
import {
  getMarketingPlatformActivitySignupDetail,
  getMarketingPlatformActivitySignupDetailGoodsPage,
  postMarketingPlatformActivitySignupGetFilterSkuId,
  postMarketingPlatformActivitySignupSave,
  postMarketingPlatformActivitySignupUpdate,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { Space } from '@linkseeks/ui'
const intl = getIntl()

const TABLINK = [
  { key: 'progressLayout', label: `${intl.formatMessage({ id: 'paltformSign.theCirculationProgress' })}` },
  { key: 'basicLayout', label: `${intl.formatMessage({ id: 'paltformSign.theBasicInformation' })}` },
  { key: 'activityRuleLayout', label: `${intl.formatMessage({ id: 'paltformSign.activityRules' })}` },
  { key: 'activityProductLayout', label: `${intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}` },
  { key: 'activityUserLayout', label: `${intl.formatMessage({ id: 'paltformSign.activeUsers' })}` },
  { key: 'applyMallLayout', label: `${intl.formatMessage({ id: 'paltformSign.applyToMall' })}` },
  { key: 'recordLyout', label: `${intl.formatMessage({ id: 'paltformSign.transferRecord' })}` },
]

const DetialLayout = () => {
  const { activityId, signUpId } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [value, setValue] = useState<number>(1)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [shopIdList, setShopIdList] = useState<number[]>([])
  const [signUpIds, setSignUpIds] = useState<number>()
  const [filterSkuId, setFilterSkuId] = useState<[]>([])
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  const [activityDefined, setActivityDefined] = useState<any>({})

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'paltformSign.activityID' }), extra: data.id },
          { label: `${intl.formatMessage({ id: 'paltformSign.theNameOfTheEvent' })}`, extra: data.activityName },
          { label: `${intl.formatMessage({ id: 'paltformSign.externalState' })}`, extra: data.outerStatusName },
          { label: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`, extra: data.innerStatusName },
        ],
      },
      {
        col: [
          { label: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`, extra: data.activityTypeName },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activitiesInvolvedInType' })}`,
            extra: data.activitySignUpTypeName,
          },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activitiesStartTime' })}`,
            extra: formatTimeString(data.startTime),
          },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activityOverTime' })}`,
            extra: formatTimeString(data.endTime),
          },
        ],
      },
      {
        col: [
          {
            label: `${intl.formatMessage({ id: 'paltformSign.requestTimeSigningUp' })}`,
            extra: (
              <>
                {formatTimeString(data.signUpStartTime)}~{formatTimeString(data.signUpEndTime)}
              </>
            ),
          },
        ],
      },
    ])
  }

  const handleGeneralEffect = (data: any, int?: number) => {
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const fetchDataSource = async () => {
    await getMarketingPlatformActivitySignupDetail({ activityId })
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        let { data } = res
        let externalLogStates: any = []
        let interiorLogStates: any = []
        let externalLogs: any = []
        let interiorLogs: any = []
        if (data.outerTaskStepList) {
          data.outerTaskStepList.forEach((item: any) => {
            externalLogStates.push({
              state: item.step,
              stateName: null,
              isExecute: item.isExecute,
              operationalProcess: item.taskName,
              roleName: item.roleName,
            })
          })
          data.externalLogStates = externalLogStates
        }
        if (data.innerTaskStepList) {
          data.innerTaskStepList.forEach((item: any) => {
            interiorLogStates.push({
              state: item.step,
              stateName: null,
              isExecute: item.isExecute,
              operationalProcess: item.taskName,
              roleName: item.roleName,
            })
          })
          data.interiorLogStates = interiorLogStates
        }
        if (data.outerRecordDOList) {
          data.outerRecordDOList.forEach((item: any, index: number) => {
            externalLogs.push({
              operation: item.operate,
              createTime: item.operateTime,
              roleName: item.roleName,
              auditOpinion: item.opinion,
              stateName: item.statusName,
              id: index + 1,
              state: item.status,
              step: index,
            })
          })
          data.externalLogs = externalLogs
        }
        if (data.innerRecordDOList) {
          data.innerRecordDOList.forEach((item: any, index: number) => {
            interiorLogs.push({
              department: item.department,
              position: item.jobTitle,
              operation: item.operate,
              createTime: item.operateTime,
              roleName: item.operator,
              auditOpinion: item.opinion,
              stateName: item.statusName,
              id: index + 1,
              state: item.status,
              step: index,
            })
          })
          data.interiorLogs = interiorLogs
        }
        setValue(data.activityType)
        setDataSource(data)
        handleBasicEffect(data)
        setShopIdList(
          data.shopList.map((item) => {
            return item.shopId
          }),
        )
        setActivityDefined(data.activityDefined)
        handleGeneralEffect(data.activityDefined, data.activityType)
        setSignUpIds(signUpId)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handleSubmit = () => {
    form.validateFields().then((res) => {
      const param: any = {
        activityId,
        productList: res.productList.map((item) => {
          if (item.couponGroupList) {
            return {
              ...item,
              couponGroupList: item.couponGroupList.map((_item) => {
                return {
                  ..._item,
                  list: _item.list.map((__item) => {
                    return {
                      activityGoodsId: item.productId,
                      couponId: __item.id,
                      couponName: __item.name,
                      num: __item.num || 1,
                    }
                  }),
                }
              }),
            }
          }
          return item
        }),
      }
      signUpId !== null && (param.id = signUpId)
      setLoading(true)
      const fieldApi =
        path === 'add' ? postMarketingPlatformActivitySignupSave : postMarketingPlatformActivitySignupUpdate
      fieldApi({ ...param })
        .then((res) => {
          if (res.code !== 1000) {
            setLoading(false)
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 200)
        })
        .catch((_err) => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    if (!isEmpty(dataSource)) {
      postMarketingPlatformActivitySignupGetFilterSkuId(
        {
          activityType: dataSource.activityType,
          activityDefined: dataSource.activityDefined,
          startTime: dataSource.startTime,
          endTime: dataSource.endTime,
        },
        { ctlType: 'none' },
      ).then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        setFilterSkuId(res.data.filterSkuId)
      })
    }
  }, [dataSource])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.activityId}
        title={dataSource.activityName}
        items={TABLINK}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'paltformSign.submit' })}
          </Button>
        }
      >
        <Form
          form={form}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <Space direction="vertical" style={{ display: 'flex' }} size={16}>
            <ProgressLayout />
            <BasicLayout effect={basicEffect} />
            <GeneralLayout
              visible
              title={`${intl.formatMessage({ id: 'paltformSign.activityRules' })}-${
                ACTIVITYTYPENAME[dataSource.activityType]
              }`}
              anchor="activityRuleLayout"
              effect={generalEffect}
            />
            <ProductListLayout
              getActivityDefinedBO={activityDefined}
              activityId={signUpIds && { signUpId: signUpIds }}
              form={form}
              focus$={value}
              shopIdList={shopIdList}
              filterSkuId={filterSkuId}
              fieldApi={getMarketingPlatformActivitySignupDetailGoodsPage}
            />
            <ActivityUserLayout dataScoure={dataSource} />
            <DemandLayout storeList={dataSource.shopList} />
            <RecordLyout />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}
export default DetialLayout
