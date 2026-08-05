/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 13:47:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-26 15:10:29
 * @Description: 新增/修改 优惠券表单
 */
import React, { useState, useMemo, useEffect } from 'react'
import { Spin, Button, message } from 'antd'
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, Radio, DatePicker, ArrayTable } from '@apps/formily'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import type { Moment } from 'moment'
import moment from 'moment'
import { MERCHANT_COUPON_TYPE_VOUCHER } from '@/constants/const/marketing'
import {
  getMarketingCouponPlatformWaitAuditGet,
  postMarketingCouponPlatformWaitAuditAdd,
  postMarketingCouponPlatformWaitAuditUpdate,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import FormilyRangeTime from '@/components/RangeTime/FormilyRangeTime'
import schema from './schema'
import { createEffects } from './effects'
import type { ProductItemType } from '../GoodsDrawer'
import CascaderFormItem from '../CascaderFormItem'
import ApplicableGoodsFormItem from '../ApplicableGoodsFormItem'
import TofuCheckGroup from '../../../components/FormilyFieldItem/TofuCheckGroup'
import MemberCheckboxGroup from '../../../components/FormilyFieldItem/MemberCheckboxGroup'
import ApplicableList from '../../../components/FormilyFieldItem/ApplicableList'
import CategoriesList from '../../../components/FormilyFieldItem/CategoriesList'

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
    conditionGetTotal: string | undefined
    /**
     * 每日可领取
     */
    conditionGetDay: string | undefined
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
  invalidDay: string | undefined
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
  /**
   * 实用会员类型
   */
  memberTypes: number[]
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
  const { id, editable = true } = props
  const [couponInfo, setCouponInfo] = useState<CouponInfoType>({} as any)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [typeValue, setTypeValue] = useState<undefined | number>(undefined)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const getCouponDetail = () => {
    if (!id) {
      // @ts-ignore
      setCouponInfo({ effectiveType: 1 })
      return
    }
    setInfoLoading(true)
    getMarketingCouponPlatformWaitAuditGet({
      id: `${id}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const {
            id,
            status,
            statusName,
            suitableCommoditySkuList,
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
            memberTypes,
            effectiveType,
            ...rest
          } = res.data

          setCouponInfo({
            goodsList: suitableCommoditySkuList as any,
            applicationMemberLevel: suitableMemberLevelTypes?.map((item) => item.id),
            suitableMemberTypes: suitableMemberTypes?.map((item) => item.value),
            suitableMallTypes: suitableMallTypes?.map((item) => item.id),
            denomination: `${denomination}`,
            quantity: `${quantity}`,
            releaseTimeStart: moment(releaseTimeStart),
            releaseTimeEnd: moment(releaseTimeEnd),
            effectiveTimeStart: effectiveTimeStart ? moment(effectiveTimeStart) : null,
            effectiveTimeEnd: effectiveTimeEnd ? moment(effectiveTimeEnd) : null,
            invalidDay: invalidDay !== null ? `${invalidDay}` : undefined,
            useConditionMoney: `${useConditionMoney}`,
            receiveCondition: {
              conditionGetTotal: conditionGetTotal ? `${conditionGetTotal}` : undefined,
              conditionGetDay: conditionGetDay ? `${conditionGetDay}` : undefined,
            },
            memberTypes: memberTypes ? memberTypes.map((item) => item.value) : [],
            effectiveType: effectiveType || 1,
            ...rest,
          })

          setTimeout(() => {
            formActions.setFieldValue(
              'suitableMemberTypes',
              suitableMemberTypes?.map((item) => item.value),
            )
          }, 100)
        }
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getCouponDetail()
  }, [])

  const anchorsArr = [
    {
      key: 'basicInfo',
      label: '基本信息',
    },
    {
      key: 'couponRules',
      label: '优惠券规则',
    },
    {
      key: 'applicableShopList',
      label: '适用商城',
    },
    typeValue === MERCHANT_COUPON_TYPE_VOUCHER
      ? {
          key: 'applicableGoods',
          label: '适用商品',
        }
      : null,
    {
      key: 'applicableMember',
      label: '适用用户',
    },
  ].filter(Boolean) as any

  // 删除商品项
  const handleRemoveItem = (index: number) => {
    console.log('删除商品', index)
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

    const payload = {
      conditionGetDay: receiveCondition ? +(receiveCondition.conditionGetDay as string) : undefined,
      conditionGetTotal: receiveCondition ? +(receiveCondition.conditionGetTotal as string) : undefined,
      useConditionMoney: +useConditionMoney,
      quantity: +quantity,
      invalidDay: +(invalidDay as string),
      denomination: +denomination,
      releaseTimeStart: releaseTimeStart.valueOf(),
      releaseTimeEnd: releaseTimeEnd.valueOf(),
      effectiveTimeStart: effectiveTimeStart ? effectiveTimeStart.valueOf() : undefined,
      effectiveTimeEnd: effectiveTimeEnd ? effectiveTimeEnd.valueOf() : undefined,
      suitableMemberLevelTypes: applicationMemberLevel,
      suitableCommoditySkuList,
      ...restValue,
    }

    if (!id) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: '正在添加，请稍候...',
        duration: 0,
      })
      postMarketingCouponPlatformWaitAuditAdd(payload, {
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
        content: '正在修改，请稍候...',
        duration: 0,
      })
      postMarketingCouponPlatformWaitAuditUpdate(
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
        title={`${!id ? '新增' : '编辑'}平台优惠券`}
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
            保存
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
