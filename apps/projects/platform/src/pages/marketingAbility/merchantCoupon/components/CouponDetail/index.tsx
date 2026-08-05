/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 17:23:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-22 15:40:10
 * @Description: 商家优惠券页面详情组件
 */
import React, { useMemo } from 'react'
import { Row, Col, Spin } from 'antd'
import { findLastIndexFlowState } from '@/utils'
import {
  MERCHANT_COUPON_TYPE_CATEGORY,
  MERCHANT_COUPON_TYPE_BRAND,
  MERCHANT_COUPON_TYPE_PRODUCT,
  MERCHANT_COUPON_TYPE_VOUCHER,
} from '@/constants/marketing'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import {
  normalizeCategoryList,
  CategoryItemType,
  normalizeShopList,
  ShopItemType,
  normalizeBrandList,
  BrandItemType,
} from '../../utils'
import BacisInfo, { PropsType as BacisInfoPropsType } from '../../components/BacisInfo'
import CouponRules, { PropsType as CouponRulesPropsType } from '../../components/CouponRules'
import ApplicableGoods, { ListItemDataType } from '../../components/ApplicableGoods'
import ApplicableShopList from '../../components/ApplicableShopList'
import ApplicableCategories from '../../components/ApplicableCategories'
import ApplicableBrands from '../../components/ApplicableBrands'
import ApplicableMember, { ApplicationMemberLevelType, SuitableMemberType } from '../../components/ApplicableMember'
import InnerFlowRecords from '../../components/InnerFlowRecords'
import { useIntl } from '@linkseeks/i18n'

export type SuitableMemberLevelType = Omit<ApplicationMemberLevelType, 'roleName' | 'levelTypeName'> & {
  roleTypeName: string
  memberLevelTypeName: string
}

export type DetailType = BacisInfoPropsType['dataSource'] &
  CouponRulesPropsType['dataSource'] & {
    /**
     * 优惠券名称
     */
    name: string
    /**
     * 内部流转记录
     */
    history: {
      /**
       * 操作时间
       */
      createTime: number
      /**
       * 操作人员用户Id
       */
      operatorId: number
      /**
       * 操作人员姓名
       */
      operatorName: string
      /**
       * 操作人员组织机构名称
       */
      operatorOrgName: string
      /**
       * 操作人员职位
       */
      operatorJobTitle: string
      /**
       * 操作方法
       */
      operation: string
      /**
       * 会员考评内部状态
       */
      status: number
      /**
       * 内部状态描述
       */
      statusName: string
      /**
       * 操作说明
       */
      remark: string
    }[]
    /**
     * 流转进度
     */
    taskSteps: {
      /**
       * 任务步骤
       */
      step: number
      /**
       * 任务名称
       */
      taskName: string
      /**
       * 执行当前任务的角色名称
       */
      roleName: string
      /**
       * 是否执行0-否1-是
       */
      isExecute: number
    }[]
    /**
     * 优惠券类型
     */
    type: number
    /**
     * 适用商品
     */
    suitableCommoditySkuList?: ListItemDataType[]
    /**
     * 适用品类
     */
    suitableCategoryList?: CategoryItemType[][]
    /**
     * 适用品牌
     */
    suitableBrandList?: BrandItemType[]
    /**
     * 适用商城
     */
    suitableMallTypes?: ShopItemType[]
    /**
     * 适用会员
     */
    suitableMemberLevelTypes?: SuitableMemberLevelType[]
    /**
     * 适用用户
     */
    suitableMemberTypes: SuitableMemberType[]
  }

interface IProps {
  /**
   * 数据，待定
   */
  dataSource: DetailType
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 拓展区域
   */
  extra?: React.ReactNode
}

const MerchantCouponDetail: React.FC<IProps> = (props) => {
  const { dataSource, loading = false, extra } = props
  const intl = useIntl()

  const anchorsArr = [
    {
      key: 'verifySteps',
      label: intl.formatMessage({ id: 'merchantCoupon.CirculationProgress' }),
    },
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'merchantCoupon.baseInfo' }),
    },
    {
      key: 'couponRules',
      label: intl.formatMessage({ id: 'merchantCoupon.couponRules' }),
    },
    {
      key: 'applicableShopList',
      label: intl.formatMessage({ id: 'merchantCoupon.suitMall' }),
    },
    dataSource?.type === MERCHANT_COUPON_TYPE_PRODUCT || dataSource?.type === MERCHANT_COUPON_TYPE_VOUCHER
      ? {
          key: 'applicableGoods',
          label: intl.formatMessage({ id: 'merchantCoupon.suitCommodity' }),
        }
      : null,
    dataSource?.type === MERCHANT_COUPON_TYPE_CATEGORY
      ? {
          key: 'applicableCategories',
          label: intl.formatMessage({ id: 'merchantCoupon.suitVariable' }),
        }
      : null,
    dataSource?.type === MERCHANT_COUPON_TYPE_BRAND
      ? {
          key: 'applicableBrands',
          label: intl.formatMessage({ id: 'merchantCoupon.suitBrand' }),
        }
      : null,
    {
      key: 'applicableMember',
      label: intl.formatMessage({ id: 'merchantCoupon.suitUsers' }),
    },
    {
      key: 'innerFlowRecords',
      label: intl.formatMessage({ id: 'merchantCoupon.innerFlowRecords' }),
    },
  ].filter(Boolean)

  const categories = useMemo(() => {
    return normalizeCategoryList(dataSource?.suitableCategoryList)
  }, [dataSource?.suitableCategoryList])

  const shopList = useMemo(() => {
    return normalizeShopList(dataSource?.suitableMallTypes)
  }, [dataSource?.suitableMallTypes])

  const brandList = useMemo(() => {
    return normalizeBrandList(dataSource?.suitableBrandList)
  }, [dataSource?.suitableBrandList])

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={dataSource?.name}
        items={
          anchorsArr as {
            key: string
            label: string
          }[]
        }
        extra={extra}
      >
        <Row gutter={[16, 16]}>
          {/* 流转记录 */}
          <Col span={24}>
            <div id="verifySteps">
              <AuditProcess
                innerVerifySteps={dataSource?.taskSteps.map((item) => ({
                  step: item.step,
                  stepName: item.taskName,
                  roleName: item.roleName,
                  status: item.isExecute ? 'finish' : 'wait',
                }))}
                innerVerifyCurrent={findLastIndexFlowState(dataSource?.taskSteps)}
              />
            </div>
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <BacisInfo
                dataSource={{
                  id: dataSource?.id,
                  type: dataSource?.type,
                  typeName: dataSource?.typeName,
                  releaseTimeStart: dataSource?.releaseTimeStart,
                  releaseTimeEnd: dataSource?.releaseTimeEnd,
                  name: dataSource?.name,
                  denomination: dataSource?.denomination,
                  statusName: dataSource?.statusName,
                  quantity: dataSource?.quantity,
                }}
              />
            </div>
          </Col>

          {/* 优惠券规则 */}
          <Col span={24}>
            <div id="couponRules">
              <CouponRules
                dataSource={{
                  getWay: dataSource?.getWay,
                  getWayName: dataSource?.getWayName,
                  effectiveTimeStart: dataSource?.effectiveTimeStart,
                  effectiveTimeEnd: dataSource?.effectiveTimeEnd,
                  invalidDay: dataSource?.invalidDay,
                  useConditionMoney: dataSource?.useConditionMoney,
                  useConditionDesc: dataSource?.useConditionDesc,
                  conditionGetDay: dataSource?.conditionGetDay,
                  conditionGetTotal: dataSource?.conditionGetTotal,
                }}
              />
            </div>
          </Col>

          {/* 适用商城 */}
          <Col span={24}>
            <div id="applicableShopList">
              <ApplicableShopList options={shopList} />
            </div>
          </Col>

          {/* 适用商品 */}
          {dataSource?.type === MERCHANT_COUPON_TYPE_PRODUCT || dataSource?.type === MERCHANT_COUPON_TYPE_VOUCHER ? (
            <Col span={24}>
              <div id="applicableGoods">
                <ApplicableGoods dataSource={dataSource?.suitableCommoditySkuList} />
              </div>
            </Col>
          ) : null}

          {/* 适用品类 */}
          {dataSource?.type === MERCHANT_COUPON_TYPE_CATEGORY ? (
            <Col span={24}>
              <div id="applicableCategories">
                <ApplicableCategories options={categories} />
              </div>
            </Col>
          ) : null}

          {/* 适用品牌 */}
          {dataSource?.type === MERCHANT_COUPON_TYPE_BRAND ? (
            <Col span={24}>
              <div id="applicableBrands">
                <ApplicableBrands options={brandList} />
              </div>
            </Col>
          ) : null}

          {/* 适用用户 */}
          <Col span={24}>
            <div id="applicableMember">
              <ApplicableMember
                applicableMember={{
                  suitableMemberTypes: dataSource?.suitableMemberTypes,
                  applicationMemberLevel: dataSource?.suitableMemberLevelTypes.map(
                    ({ roleTypeName, memberLevelTypeName, ...rest }) => ({
                      roleName: roleTypeName,
                      levelTypeName: memberLevelTypeName,
                      ...rest,
                    }),
                  ),
                }}
              />
            </div>
          </Col>

          {/* 流转记录 */}
          <Col span={24}>
            <div id="innerFlowRecords">
              <InnerFlowRecords dataSource={dataSource?.history.map((item, index) => ({ ...item, id: index }))} />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default React.memo(MerchantCouponDetail)
