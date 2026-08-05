/** 新增平台营销活动 */
import React, { Fragment, useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Space } from '@linkseeks/ui'
import { useLocation, usePrompt } from '@linkseeks/router-core'
import { Form, Button } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
import BasicInfoLayout from './components/basicLayout'
import RulesLayout from './components/rulesLayout'
import { SaveOutlined } from '@ant-design/icons'
import PartakeUserLayout from './components/partakeUserLayout'
import ShopLayout from './components/shopLayout'
import moment from 'moment'
import ApplyMemberLayout from './components/applyMember'
import { useEventEmitter } from '@linkseeks/hooks'
import PrizeListLayout from './components/prizeListLayout'
import { isEmpty } from 'lodash'
import {
  getMarketingMerchantActivityGetActivityTypeList,
  getMarketingPlatformActivityDetail,
  postMarketingPlatformActivitySave,
  postMarketingPlatformActivityUpdate,
} from '@apps/apis'
import { AVTIVITY_TYPE_LOTTERY } from '@/constants/const/marketing'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const Link = [
  { key: 'basicInfoLayout', label: '基本信息' },
  { key: 'rulesLayout', label: '活动规则' },
  { key: 'partakeUserLayout', label: '参与用户' },
  { key: 'shopLayout', label: '适用商城' },
  { key: 'applyMemberLayout', label: '适用会员' },
]

type objType = {
  lable: string
  value: number
}

const AddedMarketing = (props: { isEdit?: boolean }) => {
  const { isEdit = false } = props
  const { id } = usePageStatus()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [shopList, setShopList] = useState<any[]>([])
  const [dataView, setDataView] = useState<any>({})
  const [memberLevelList, setMemberLevelList] = useState<any[]>([])
  const focus$ = useEventEmitter()
  /** 活动类型 */
  const [memberType, setMemberType] = useState<any[]>([])
  const [value, setValue] = useState<number>()
  const [tabLink, setTabLink] = useState<any[]>(Link)
  const [prizeList, setPrizeList] = useState<any[]>([])
  const [avtivityTypes, setAvtivityTypes] = useState<objType[]>([])
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const handleSubmit = () => {
    form
      .validateFields()
      .then((res: any) => {
        setLoading(true)
        console.log(memberLevelList, [...memberLevelList])
        const params: any = {
          newMember: res.allUser.includes(1) ? 1 : 0,
          oldMember: res.allUser.includes(2) ? 1 : 0,
          enterpriseMember: res.allMemberType.includes(1) ? 1 : 0,
          personalMember: res.allMemberType.includes(2) ? 1 : 0,
          activityDefined: res.activityDefined,
          activityName: res.activityName,
          activitySignUpType: res.activitySignUpType,
          activityType: res.activityType,
          shopList: res.shopList,
          startTime: Number(moment(res.startTime).format('x')),
          endTime: Number(moment(res.endTime).format('x')),
          signUpStartTime: Number(moment(res.signUpStartTime).format('x')),
          signUpEndTime: Number(moment(res.signUpEndTime).format('x')),
          inviteType: res.inviteType,
          inviteList: res.inviteList,
          memberLevelList,
        }

        // if (res['activityDefined']['assembleTime']) {
        //   params['activityDefined'].assembleTime = Number(moment(res['activityDefined']['assembleTime']).format('x'));
        // }
        if (res['activityDefined']['startTime']) {
          params['activityDefined']['startTime'] = Number(moment(res['activityDefined']['startTime']).format('x'))
        }
        if (res['activityDefined']['endTime']) {
          params['activityDefined']['endTime'] = Number(moment(res['activityDefined']['endTime']).format('x'))
        }
        if (res['activityDefined']['extractAttemptUserTime']) {
          params['activityDefined']['extractAttemptUserTime'] = Number(
            moment(res['activityDefined']['extractAttemptUserTime']).format('x'),
          )
        }
        if (res['activityDefined']['attemptEndTime']) {
          params['activityDefined']['attemptEndTime'] = Number(
            moment(res['activityDefined']['attemptEndTime']).format('x'),
          )
        }
        if (res['activityDefined']['depositPayStartTime']) {
          params['activityDefined']['depositPayStartTime'] = Number(
            moment(res['activityDefined']['depositPayStartTime']).format('x'),
          )
        }
        if (res['activityDefined']['depositPayEndTime']) {
          params['activityDefined']['depositPayEndTime'] = Number(
            moment(res['activityDefined']['depositPayEndTime']).format('x'),
          )
        }
        if (res['activityDefined']['balancePaymentPayStartTime']) {
          params['activityDefined']['balancePaymentPayStartTime'] = Number(
            moment(res['activityDefined']['balancePaymentPayStartTime']).format('x'),
          )
        }
        if (res['activityDefined']['balancePaymentPayEndTime']) {
          params['activityDefined']['balancePaymentPayEndTime'] = Number(
            moment(res['activityDefined']['balancePaymentPayEndTime']).format('x'),
          )
        }
        if (res['activityDefined']['deliverTime']) {
          params['activityDefined']['deliverTime'] = Number(moment(res['activityDefined']['deliverTime']).format('x'))
        }
        id && (params.id = Number(id))
        const fieldApi = path === 'add' ? postMarketingPlatformActivitySave : postMarketingPlatformActivityUpdate
        fieldApi(params)
          .then((resolve) => {
            if (resolve.code !== 1000) {
              setLoading(false)
              return
            }
            setUnsaved(false)
            setLoading(false)
            setTimeout(() => {
              history.goBack()
            }, 200)
          })
          .catch((_e) => {
            setLoading(false)
          })
      })
      .catch((_e) => {
        setLoading(false)
      })
  }

  const handleGetShopList = (mall) => {
    console.log(mall, 10086)
    const shopList = mall.filter((item) => item.checked)
    form.setFieldsValue({
      shopList: shopList.map((item) => {
        return {
          shopId: item.id,
          shopName: item.name,
          logo: item.logoUrl,
          environment: item.environment,
        }
      }),
    })
  }

  useEffect(() => {
    getMarketingMerchantActivityGetActivityTypeList().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setAvtivityTypes(
        res.data
          .filter((_item: any) => ![15, 13, 6].includes(_item.status))
          .map((_item: any) => {
            return {
              lable: _item.name,
              value: _item.status,
            }
          }),
      )
    })
  }, [])

  useEffect(() => {
    if (id && !isEmpty(avtivityTypes)) {
      getMarketingPlatformActivityDetail({ id })
        .then((res: any) => {
          if (res.code !== 1000) {
            return
          }
          const { data } = res
          const option: any =
            !isEmpty(avtivityTypes) &&
            avtivityTypes
              .filter((item) => item.value === data.activityType)
              .map((_item) => {
                return {
                  value: _item.value,
                  children: _item.lable,
                }
              })[0]
          focus$.emit(option)
          // if (data['activityDefined']['assembleTime']) {
          //   data['activityDefined']['assembleTime'] = moment(data['activityDefined']['assembleTime']);
          // }
          if (data['activityDefined']['startTime']) {
            data['activityDefined']['startTime'] = moment(data['activityDefined']['startTime'])
          }
          if (data['activityDefined']['endTime']) {
            data['activityDefined']['endTime'] = moment(data['activityDefined']['endTime'])
          }
          if (data['activityDefined']['extractAttemptUserTime']) {
            data['activityDefined']['extractAttemptUserTime'] = moment(
              data['activityDefined']['extractAttemptUserTime'],
            )
          }
          if (data['activityDefined']['attemptEndTime']) {
            data['activityDefined']['attemptEndTime'] = moment(data['activityDefined']['attemptEndTime'])
          }
          if (data['activityDefined']['depositPayStartTime']) {
            data['activityDefined']['depositPayStartTime'] = moment(data['activityDefined']['depositPayStartTime'])
          }
          if (data['activityDefined']['depositPayEndTime']) {
            data['activityDefined']['depositPayEndTime'] = moment(data['activityDefined']['depositPayEndTime'])
          }
          if (data['activityDefined']['balancePaymentPayStartTime']) {
            data['activityDefined']['balancePaymentPayStartTime'] = moment(
              data['activityDefined']['balancePaymentPayStartTime'],
            )
          }
          if (data['activityDefined']['balancePaymentPayEndTime']) {
            data['activityDefined']['balancePaymentPayEndTime'] = moment(
              data['activityDefined']['balancePaymentPayEndTime'],
            )
          }
          if (data['activityDefined']['deliverTime']) {
            data['activityDefined']['deliverTime'] = moment(data['activityDefined']['deliverTime'])
          }
          if (data['activityDefined']['prizeList']) {
            setPrizeList(data['activityDefined']['prizeList'])
          }
          form.setFieldsValue({
            allUser: [data.newMember && 1, data.oldMember && 2],
            allMemberType: [data.enterpriseMember && 1, data.personalMember && 2],
            activityDefined: data.activityDefined,
            activityName: data.activityName,
            activitySignUpType: data.activitySignUpType,
            activityType: data.activityType,
            shopList: data.shopList,
            startTime: moment(data.startTime),
            endTime: moment(data.endTime),
            signUpStartTime: moment(data.signUpStartTime),
            signUpEndTime: moment(data.signUpEndTime),
            inviteType: data.inviteType,
            inviteList: data.inviteList,
            memberLevelList: data.memberLevelList.map((item) => {
              return item.memberLevelId
            }),
          })
          setMemberLevelList(data.memberLevelList)
          setShopList(data.shopList)
          setMemberType([data.enterpriseMember && 1, data.personalMember && 2])
          setDataView({
            inviteType: data.inviteType,
            inviteList: data.inviteList,
          })
        })
        .catch((_e) => {})
    } else {
      form.setFieldsValue({
        inviteType: 1,
      })
    }
  }, [avtivityTypes])

  const getInviteList = (record) => {
    form.setFieldsValue({
      inviteList: record,
    })
  }

  const handleGetLevel = (levels) => {
    const list = levels.map((item) => {
      return {
        id: item.id,
        memberLevelId: item.id,
        memberType: item.memberType,
        memberTypeName: item.memberTypeName,
        roleType: item.roleType,
        roleTypeName: item.roleTypeName,
        roleId: item.roleId,
        roleName: item.roleName,
        level: item.level,
        levelType: item.levelType,
        levelTypeName: item.levelTypeName,
        levelTag: item.levelTag,
      }
    })
    setMemberLevelList([...list])
  }

  focus$.useSubscription((val: any) => {
    if (val.value === 10) {
      setTabLink([
        { key: 'basicInfoLayout', label: '基本信息' },
        { key: 'rulesLayout', label: '活动规则' },
        { key: 'activityProductLayout', label: '奖品设置' },
        { key: 'partakeUserLayout', label: '参与用户' },
        { key: 'shopLayout', label: '适用商城' },
        { key: 'applyMemberLayout', label: '适用会员' },
      ])
    } else {
      setTabLink(Link)
    }
    setValue(val.value)
    form.resetFields(['activityDefined'])
  })

  return (
    <Fragment>
      <PageHeaderWrapper
        title={isEdit ? '编辑平台营销活动' : '新增平台营销活动'}
        isAnchor
        items={tabLink}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            保存
          </Button>
        }
      >
        <Form form={form} {...layout} style={{ marginTop: -12 }}>
          <Space direction="vertical" size="middle">
            <BasicInfoLayout
              avtivityTypes={avtivityTypes}
              form={form}
              focus$={focus$}
              isEdit={path === 'edit' ? true : false}
            />
            <RulesLayout form={form} focus$={focus$} />
            {value === AVTIVITY_TYPE_LOTTERY && <PrizeListLayout form={form} prizeList={prizeList} focus$={value} />}
            <PartakeUserLayout onGetLevel={handleGetLevel} onSetLevel={memberLevelList} setMemberType={memberType} />
            <ShopLayout onGetShopList={handleGetShopList} onSetShopList={shopList} />
            <ApplyMemberLayout dataView={dataView} getInviteList={getInviteList} />
          </Space>
        </Form>
      </PageHeaderWrapper>
      {/* <Prompt when={unsaved} message="您还有未保存的内容，是否确定要离开？" /> */}
    </Fragment>
  )
}
export default AddedMarketing
