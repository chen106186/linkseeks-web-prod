/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 17:23:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 14:44:49
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
} from '@/constants/const/marketing'
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
import BacisInfo, { PropsType as BacisInfoPropsType } from '../BacisInfo'
import CouponRules, { PropsType as CouponRulesPropsType } from '../CouponRules'
import ApplicableGoods, { ListItemDataType } from '../ApplicableGoods'
import ApplicableShopList from '../ApplicableShopList'
import ApplicableCategories from '../ApplicableCategories'
import ApplicableBrands from '../ApplicableBrands'
import ApplicableMember, { ApplicationMemberLevelType, SuitableMemberType } from '../ApplicableMember'
import InnerFlowRecords from '../InnerFlowRecords'

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
    /**
     * 适用会员类型
     */
    memberTypes: SuitableMemberType[]
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

  const anchorsArr = [
    {
      key: 'verifySteps',
      label: '流转进度',
    },
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
    dataSource?.type === MERCHANT_COUPON_TYPE_PRODUCT || dataSource?.type === MERCHANT_COUPON_TYPE_VOUCHER
      ? {
          key: 'applicableGoods',
          label: '适用商品',
        }
      : null,
    dataSource?.type === MERCHANT_COUPON_TYPE_CATEGORY
      ? {
          key: 'applicableCategories',
          label: '适用品类',
        }
      : null,
    dataSource?.type === MERCHANT_COUPON_TYPE_BRAND
      ? {
          key: 'applicableBrands',
          label: '适用品牌',
        }
      : null,
    {
      key: 'applicableMember',
      label: '适用商城',
    },
    {
      key: 'innerFlowRecords',
      label: '单据流转记录',
    },
  ].filter(Boolean) as any

  const categories = useMemo(() => {
    return normalizeCategoryList(dataSource?.suitableCategoryList!)
  }, [dataSource?.suitableCategoryList])

  const shopList = useMemo(() => {
    return normalizeShopList(dataSource?.suitableMallTypes!)
  }, [dataSource?.suitableMallTypes])

  const brandList = useMemo(() => {
    return normalizeBrandList(dataSource?.suitableBrandList!)
  }, [dataSource?.suitableBrandList])

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper title={dataSource?.name} items={anchorsArr} extra={extra}>
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
                  conditionGetDay: dataSource?.conditionGetDay as number,
                  conditionGetTotal: dataSource?.conditionGetTotal as number,
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
                <ApplicableGoods dataSource={dataSource?.suitableCommoditySkuList!} />
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
                  memberTypes: dataSource?.memberTypes,
                  applicationMemberLevel: dataSource?.suitableMemberLevelTypes!.map(
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
