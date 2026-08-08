/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 13:47:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-23 17:05:07
 * @Description: 新增/修改 优惠券表单
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Spin, Button, message } from 'antd'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Radio, DatePicker, ArrayTable } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import moment, { Moment } from 'moment'
import {
  MERCHANT_COUPON_TYPE_UNIVERSAL,
  MERCHANT_COUPON_TYPE_CATEGORY,
  MERCHANT_COUPON_TYPE_BRAND,
  MERCHANT_COUPON_TYPE_PRODUCT,
  MERCHANT_COUPON_TYPE_VOUCHER,
} from '@/constants/marketing'
import {
  getMarketingCouponWaitAuditGet,
  postMarketingCouponWaitAuditAdd,
  postMarketingCouponWaitAuditUpdate,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import FormilyRangeTime from '@/components/RangeTime/FormilyRangeTime'
import schema from './schema'
import { createEffects } from './effects'
import { ProductItemType } from '../GoodsDrawer'
import CascaderFormItem from '../CascaderFormItem'
import ApplicableGoodsFormItem from '../ApplicableGoodsFormItem'
import TofuCheckGroup from '../../../../components/FormilyFieldItem/TofuCheckGroup'
import MemberCheckboxGroup from '../../../../components/FormilyFieldItem/MemberCheckboxGroup'
import ApplicableList from '../../../../components/FormilyFieldItem/ApplicableList'
import CategoriesList from '../../../../components/FormilyFieldItem/CategoriesList'
import styles from './index.less'

const formActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$ } = FormEffectHooks

export type SubmitValueType = {
  /**
   * 优惠券类型
   */
  type: number
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 券面额
   */
  denomination: string
  /**
   * 发券数量
   */
  quantity: string
  /**
   * 领(发)券起始时间
   */
  releaseTimeStart: Moment
  /**
   * 领(发)券结束时间
   */
  releaseTimeEnd: Moment
  /**
   * 领券方式
   */
  getWay: number
  /**
   * 券有效期
   */
  effectiveType: number
  /**
   * 领券条件
   */
  receiveCondition: {
    /**
     * 每会员ID总共可领取
     */
    conditionGetTotal: string
    /**
     * 每日可领取
     */
    conditionGetDay: string
  }
  /**
   * 券有效期起始时间
   */
  effectiveTimeStart: Moment | null
  /**
   * 券有效期结束时间
   */
  effectiveTimeEnd: Moment | null
  /**
   * 自领取后多少天内失效
   */
  invalidDay: string
  /**
   * 使用条件
   */
  useConditionMoney: string
  /**
   * 使用说明
   */
  useConditionDesc: string
  /**
   * 适用商品
   */
  goodsList?: ProductItemType[]
  /**
   * 适用品类
   */
  applicableCategories?: {
    category: number[][]
  }[]
  /**
   * 适用品牌
   */
  applicableBrands?: {
    brand: number
  }[]
  /**
   * 适用会员
   */
  suitableMemberTypes: number[]
  /**
   * 适用会员等级
   */
  applicationMemberLevel: number[]
  /**
   * 适用商城
   */
  suitableMallTypes: number[]
}

export type CouponInfoType = SubmitValueType & {}

interface IProps {
  /**
   * 数据id
   */
  id?: number
  /**
   * 是否可编辑
   */
  editable?: boolean
}

const CouponForm: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const { id, editable = true } = props
  const [couponInfo, setCouponInfo] = useState<CouponInfoType>({
    effectiveType: 1,
  } as any)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [typeValue, setTypeValue] = useState<undefined | number>(undefined)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const getCouponDetail = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMarketingCouponWaitAuditGet({
      id: `${id}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const {
            id,
            status,
            statusName,
            suitableCommoditySkuList,
            suitableCategoryList,
            suitableBrandList,
            suitableMallTypes,
            suitableMemberLevelTypes,
            suitableMemberTypes,
            denomination,
            quantity,
            releaseTimeStart,
            releaseTimeEnd,
            effectiveTimeStart,
            effectiveTimeEnd,
            invalidDay,
            useConditionMoney,
            conditionGetTotal,
            conditionGetDay,
            createTime,
            taskSteps,
            history,
            ...rest
          } = res.data

          setCouponInfo({
            goodsList: suitableCommoditySkuList as any,
            applicableCategories: (suitableCategoryList as any)?.map((item) => ({
              category: item.map((category) => `${category.id}`),
            })),
            applicableBrands: suitableBrandList?.map((item) => ({ brand: item.id })),
            applicationMemberLevel: suitableMemberLevelTypes?.map((item) => item.id),
            suitableMemberTypes: suitableMemberTypes?.map((item) => item.value),
            suitableMallTypes: suitableMallTypes?.map((item) => item.id),
            denomination: `${denomination}`,
            quantity: `${quantity}`,
            releaseTimeStart: releaseTimeStart ? moment(releaseTimeStart) : null,
            releaseTimeEnd: releaseTimeEnd ? moment(releaseTimeEnd) : null,
            effectiveTimeStart: effectiveTimeStart ? moment(effectiveTimeStart) : null,
            effectiveTimeEnd: effectiveTimeEnd ? moment(effectiveTimeEnd) : null,
            invalidDay: invalidDay !== null ? `${invalidDay}` : undefined,
            useConditionMoney: `${useConditionMoney}`,
            receiveCondition: {
              conditionGetTotal: conditionGetTotal ? `${conditionGetTotal}` : undefined,
              conditionGetDay: conditionGetDay ? `${conditionGetDay}` : undefined,
            },
            ...rest,
          })
        }
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getCouponDetail()
  }, [])

  const anchorsArr: any[] = [
    {
      key: 'basicInfo',
      label: `${intl.formatMessage({ id: 'merchantCoupon.baseInfo' })}`,
    },
    {
      key: 'couponRules',
      label: intl.formatMessage({ id: 'merchantCoupon.couponRules' }),
    },
    {
      key: 'applicableShopList',
      label: `${intl.formatMessage({ id: 'merchantCoupon.suitMall' })}`,
    },
    typeValue === MERCHANT_COUPON_TYPE_PRODUCT || typeValue === MERCHANT_COUPON_TYPE_VOUCHER
      ? {
          key: 'applicableGoods',
          label: `${intl.formatMessage({ id: 'merchantCoupon.suitCommodity' })}`,
        }
      : null,
    typeValue === MERCHANT_COUPON_TYPE_CATEGORY
      ? {
          key: 'applicableCategories',
          label: `${intl.formatMessage({ id: 'merchantCoupon.suitVariable' })}`,
        }
      : null,
    typeValue === MERCHANT_COUPON_TYPE_BRAND
      ? {
          key: 'applicableBrands',
          label: `${intl.formatMessage({ id: 'merchantCoupon.suitBrand' })}`,
        }
      : null,
    {
      key: 'applicableMember',
      label: `${intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}`,
    },
  ].filter(Boolean)

  // 删除商品项
  const handleRemoveItem = (index: number) => {
    console.log(`${intl.formatMessage({ id: 'merchantCoupon.deleteGoods' })}`, index)
  }

  const renderTableItemRemove = (index: number) => (
    <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleRemoveItem(index)} />
  )

  const handleSubmit = (values: SubmitValueType) => {
    const {
      receiveCondition,
      useConditionMoney,
      quantity,
      invalidDay,
      denomination,
      applicableBrands,
      applicableCategories,
      applicationMemberLevel,
      releaseTimeStart,
      releaseTimeEnd,
      effectiveTimeStart,
      effectiveTimeEnd,
      goodsList,
      ...restValue
    } = values

    const suitableCommoditySkuList = goodsList?.map((item) => ({
      id: item.id,
      commodityId: item.commodityId,
      name: item.name,
      mainPic: item.mainPic,
      customerCategoryName: item.customerCategoryName,
      brandName: item.brandName,
      unitName: item.unitName,
      unitPrice: item.unitPrice,
    }))

    const suitableCategoryList: any = applicableCategories?.map((item) => item.category)

    const suitableBrandList: any = applicableBrands?.map((item) => item.brand)

    const payload = {
      conditionGetDay: receiveCondition ? +receiveCondition.conditionGetDay : undefined,
      conditionGetTotal: receiveCondition ? +receiveCondition.conditionGetTotal : undefined,
      useConditionMoney: +useConditionMoney,
      quantity: +quantity,
      invalidDay: +invalidDay,
      denomination: +denomination,
      releaseTimeStart: releaseTimeStart.valueOf(),
      releaseTimeEnd: releaseTimeEnd.valueOf(),
      effectiveTimeStart: effectiveTimeStart ? effectiveTimeStart.valueOf() : undefined,
      effectiveTimeEnd: effectiveTimeEnd ? effectiveTimeEnd.valueOf() : undefined,
      suitableMemberLevelTypes: applicationMemberLevel,
      suitableCommoditySkuList,
      suitableCategoryList,
      suitableBrandList,
      ...restValue,
    }

    if (!id) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'merchantCoupon.waitingPleaseWait' }),
        duration: 0,
      })
      postMarketingCouponWaitAuditAdd(payload, {
        timeout: 0,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    } else {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'merchantCoupon.modifingPleaseWait' }),
        duration: 0,
      })
      postMarketingCouponWaitAuditUpdate(
        {
          id,
          ...payload,
        },
        {
          timeout: 0,
        },
      )
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    }
  }

  const useFields = (): any =>
    useMemo(
      () => ({
        TofuCheckGroup,
        MemberCheckboxGroup,
        ApplicableList,
      }),
      [],
    )

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={`${
          !id
            ? `${intl.formatMessage({ id: 'merchantCoupon.add' })}`
            : `${intl.formatMessage({ id: 'merchantCoupon.edit' })}`
        }${intl.formatMessage({ id: 'merchantCoupon.BusinessCoupon' })}`}
        isAnchor
        items={anchorsArr}
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<SaveOutlined />}
            loading={submitLoading}
            onClick={() => formActions.submit()}
          >
            {intl.formatMessage({ id: 'merchantCoupon.save' })}
          </Button>,
        ]}
      >
        <NiceForm
          previewPlaceholder=" "
          onSubmit={handleSubmit}
          actions={formActions}
          initialValues={couponInfo}
          components={{
            RadioGroup: Radio.Group,
            RangePicker: DatePicker.RangePicker,
            ArrayTable,
            CategoriesList,
            CascaderFormItem,
            ApplicableGoodsFormItem,
            FormilyRangeTime,
          }}
          expressionScope={{
            renderTableItemRemove,
          }}
          fields={useFields()}
          effects={($, actions) => {
            createEffects($, actions)

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })

            onFieldValueChange$('type').subscribe((state) => {
              setTypeValue(state.value)
            })
          }}
          schema={schema}
          editable={!!editable}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default CouponForm
