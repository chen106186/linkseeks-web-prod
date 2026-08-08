import React, { Fragment, useEffect, useState } from 'react'
import { Form, Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useEventEmitter } from '@linkseeks/hooks'
import { SaveOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { Space } from '@linkseeks/ui'
import BasicInfoLayout from './components/basicInfoLayout'
import RulesLayout from './components/rulesLayout'
import ShopLayout from './components/shopLayout'
import ProductListLayout from '../../components/productListLayout'
import PartakeUserLayout from './components/partakeUserLayout'
import PrizeListLayout from './components/prizeListLayout'
import moment from 'moment'
import {
  getMarketingMerchantActivityDetail,
  getMarketingMerchantActivityDetailGoodsPage,
  getMarketingPlatformMerchantActivityGetActivityTypeList,
  postMarketingMerchantActivityGetFilterSkuId,
  postMarketingMerchantActivitySave,
  postMarketingMerchantActivityUpdate,
} from '@apps/apis'
import { isEmpty } from 'lodash'
import { getLadderPrice } from '@/utils'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '200px' } },
  labelAlign: 'left',
}

type objType = {
  lable: string
  value: number
}

const AddedMarketing = () => {
  const intl = useIntl()
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const focus$ = useEventEmitter()
  const [form] = Form.useForm()
  const [unsaved, setUnsaved] = useState<boolean>(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [shopList, setShopList] = useState<any[]>([])
  const [shopIdList, setShopIdList] = useState<number[]>([])
  const [memberLevelList, setMemberLevelList] = useState<any[]>([])
  const [memberType, setMemberType] = useState<any[]>([])
  const [activityId, setActivityId] = useState<number>()
  const [value, setValue] = useState<number>()
  const [prizeList, setPrizeList] = useState<any[]>([])
  const [avtivityTypes, setAvtivityTypes] = useState<objType[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)

  const handleGetShopList = (mall) => {
    const checkedList = mall.filter((item) => item.checked)
    const checkedShop = checkedList.map((item) => {
      return {
        shopId: item.id,
        shopName: item.name,
        logo: item.logoUrl,
        environment: item.environment,
      }
    })
    form.setFieldsValue({
      shopList: checkedShop,
    })
    setShopIdList(
      checkedShop.map((item) => {
        return item.shopId
      }),
    )
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

  const formatPrice = (productInfo: any) => {
    return {
      ...productInfo,
      price:
        typeof productInfo?.price === 'object'
          ? getLadderPrice(productInfo?.price, productInfo?.restrictNum)
          : productInfo?.price,
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((res) => {
      const params: any = {
        activityType: res.activityType,
        activityDefined: res.activityDefined,
        activityName: res.activityName,
        startTime: Number(moment(res.startTime).format('x')),
        endTime: Number(moment(res.endTime).format('x')),
        newUser: res.allUser.includes(1) ? 1 : 0,
        oldUser: res.allUser.includes(2) ? 1 : 0,
        newMember: res.allUser.includes(3) ? 1 : 0,
        oldMember: res.allUser.includes(4) ? 1 : 0,
        memberLevelList,
        shopList: res.shopList,
        productList:
          res.productList &&
          res.productList.map((item) => {
            if (item.couponGroupList) {
              return {
                ...formatPrice(item),
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
            return formatPrice(item)
          }),
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
      setLoading(true)
      path !== 'add' && (params.id = id)
      const fieldApi = path === 'add' ? postMarketingMerchantActivitySave : postMarketingMerchantActivityUpdate
      fieldApi(params)
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
        .catch((_e) => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    if (id && !isEmpty(avtivityTypes)) {
      getMarketingMerchantActivityDetail({ id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          const { data } = res
          const option: any = avtivityTypes
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
            allUser: [data.newUser && 1, data.oldUser && 2, data.newMember && 3, data.oldMember && 4],
            activityDefined: data.activityDefined,
            activityName: data.activityName,
            activityType: data.activityType,
            shopList: data.shopList,
            startTime: moment(data.startTime),
            endTime: moment(data.endTime),
            memberLevelList: data.memberLevelList.map((item) => {
              return item.memberLevelId
            }),
          })
          setActivityId(data.id)
          setShopIdList(
            data.shopList.map((item) => {
              return item.shopId
            }),
          )
          setShopList(data.shopList)
          setMemberLevelList(data.memberLevelList)
          setMemberType([data.newUser && 1, data.oldUser && 2, data.newMember && 3, data.oldMember && 4])
        })
        .catch((_e) => {})
    }
  }, [id, avtivityTypes])

  focus$.useSubscription((val: any) => {
    setValue(val.value)
    form.resetFields(['activityDefined'])
  })

  useEffect(() => {
    getMarketingPlatformMerchantActivityGetActivityTypeList().then((res) => {
      if (res.code !== 1000) {
        return
      }
      setAvtivityTypes(
        res.data.map((_item: any) => {
          return {
            lable: _item.name,
            value: _item.status,
          }
        }),
      )
    })
  }, [])

  const handleGetRule = () => {
    setRefresh(!refresh)
  }

  return (
    <Fragment>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'selfManagement.aNewMarketingCampaign' })}
        isAnchor
        items={[
          { key: 'basicInfoLayout', label: `${intl.formatMessage({ id: 'selfManagement.theBasicInformation' })}` },
          { key: 'shopLayout', label: `${intl.formatMessage({ id: 'selfManagement.applyToMall' })}` },
          { key: 'rulesLayout', label: `${intl.formatMessage({ id: 'selfManagement.activityRules' })}` },
          {
            key: 'productListLayout',
            label:
              value === 10
                ? `${intl.formatMessage({ id: 'selfManagement.thePrizeSet' })}`
                : `${intl.formatMessage({ id: 'selfManagement.activitiesOfGoods' })}`,
          },
          { key: 'partakeUserLayout', label: `${intl.formatMessage({ id: 'selfManagement.participateInTheUser' })}` },
        ]}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'selfManagement.save' })}
          </Button>
        }
      >
        <Form
          form={form}
          {...layout}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <BasicInfoLayout form={form} focus$={focus$} isEdit={path === 'edit' ? true : false} />
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <ShopLayout onGetShopList={handleGetShopList} onSetShopList={shopList} />
            <RulesLayout form={form} focus$={focus$} getRule={handleGetRule} />
            {value !== 10 && (
              <ProductListLayout
                refresh={refresh}
                itrue
                activityId={activityId && { activityId: activityId }}
                form={form}
                focus$={value}
                shopIdList={shopIdList}
                fieldApi={getMarketingMerchantActivityDetailGoodsPage}
              />
            )}
            {value === 10 && <PrizeListLayout form={form} prizeList={prizeList} focus$={value} />}
            <PartakeUserLayout onGetLevel={handleGetLevel} onSetLevel={memberLevelList} setMemberType={memberType} />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Fragment>
  )
}
export default AddedMarketing
