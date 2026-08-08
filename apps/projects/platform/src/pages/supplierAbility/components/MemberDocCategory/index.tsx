/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 16:10:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:43:36
 * @Description: 会员分类信息
 */
import React, { useState } from 'react'
import { Descriptions, Button, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import CustomizeColumn, { IProps as CustomizeColumnProps } from '@/components/CustomizeColumn'
import ModifyClassifyDrawer, { ValueType, FormValueType, PartnerTypesItem } from '../ModifyClassifyDrawer'
import styles from './index.less'
import {
  getMemberSupplierAbilityMaintenanceDetailRecordClassify,
  postMemberSupplierAbilityMaintenanceDetailRecordClassifyUpdate,
} from '@apps/apis'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export type DocCategoryProps = Omit<CustomizeColumnProps, 'data' | 'columns'> & {
  /**
   * 数据源
   */
  dataSource: {
    /**
     * 会员编码
     */
    code: string
    /**
     * 合作关系名称
     */
    partnerTypeName: string
    /**
     * 单次合作金额
     */
    maxAmount: string
    /**
     * 适用区域
     */
    classifyAreas: string[]
    /**
     * 主营品类
     */
    categories: {
      /**
       * 品类信息id
       */
      id: number
      /**
       * 品类列表 ,BusinessCategoryDetailQueryVO
       */
      details: {
        /**
         * 品类层级
         */
        level?: number
        /**
         * 品类Id
         */
        categoryId?: number
        /**
         * 品类名称
         */
        name?: string
      }[]
      /**
       * 结算方式，1-现结，2-账期(按天),3-账期(按月)，4-月结
       */
      payType: number
      /**
       * 结算方式名称
       */
      payTypeName: string
      /**
       * 月，结算方式为账期(按月)时大于0
       */
      month: number
      /**
       * 每月几号，结算方式为“账期(按月)”或“月结”时大于0
       */
      monthDay: number
      /**
       * 天，结算方式为账期(按天)时大于0
       */
      days: number
      /**
       * 发票类型，1-增值税专用发票，2-普通发票，3-机动车专用发票，4-机打发票，5-定额发票
       */
      invoiceType: number
      /**
       * 发票类型名称
       */
      invoiceTypeName: string
      /**
       * 税点，百分比的分子部分
       */
      taxPoint: string
      /**
       * 预付款
       */
      advanceCharge: number
      /**
       * 预付款名称
       */
      advanceChargeName: string
      /**
       * 结算单据
       */
      settlementDocuments: number
      /**
       * 结算单据名称
       */
      settlementDocumentsName: string
      /**
       * 付款方式
       */
      paymentType: number
      /**
       * 付款方式名称
       */
      paymentTypeName: string
    }[]
    /**
     * 币别
     */
    currencyType: number
    /**
     * 币别名称
     */
    currencyTypeName: string
    /**
     * 备注
     */
    remark: string
  }
  /**
   * 审核id
   */
  validateId?: string
  /**
   * 修改渠道信息之后触发事件
   */
  onModifyAfter?: () => void
}

const MemberDocCategory: React.FC<DocCategoryProps> = (props: DocCategoryProps) => {
  const { dataSource, validateId, onModifyAfter, ...rest } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [classifyInfo, setClassifyInfo] = useState<FormValueType>()
  const [partnerTypes, setPartnerTypes] = useState<PartnerTypesItem[]>([])
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleDrawer = (flag?) => {
    setVisibleDrawer(!!flag)
  }

  const handleModifyClassify = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberSupplierAbilityMaintenanceDetailRecordClassify({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setClassifyInfo({
            code: res.data?.code,
            partnerType: res.data?.partnerType,
            maxAmount: res.data?.maxAmount,
            areaCodes: res.data?.areaCodes,
            categories: res.data?.categories.map(({ details, month, monthDay, days, taxPoint, ...rest }) => ({
              category: details?.map((item) => `${item.categoryId}`),
              month: month ? `${month}` : '',
              monthDay: monthDay ? `${monthDay}` : '',
              days: days ? `${days}` : '',
              taxPoint: +taxPoint * 100,
              ...rest,
            })),
            currencyType: res.data?.currencyType,
            remark: res.data?.remark,
          })
          setPartnerTypes(
            res.data?.partnerTypes.map((item) => ({
              value: item.id,
              label: item.text,
            })),
          )
          handleVisibleDrawer(true)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  const handleSubmit = (value: ValueType) => {
    setSubmitLoading(true)
    const payload = {
      validateId: +validateId,
      ...value,
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.components.MemberDocCategory.edit.message' }),
      duration: 0,
    })
    postMemberSupplierAbilityMaintenanceDetailRecordClassifyUpdate(payload, {
      timeout: 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleDrawer(false)
        onModifyAfter?.()
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        msg()
        setSubmitLoading(false)
      })
  }

  const data = [
    {
      title: intl.formatMessage({ id: 'supplier.components.supplierDocCategory.code' }),
      value: dataSource?.code || '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocCategory.maxAmount' }),
      value:
        dataSource && dataSource.maxAmount ? `${translate('web.common.currencySymbol')} ${dataSource.maxAmount}` : '',
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocCategory.classifyAreas' }),
      value: dataSource && dataSource.classifyAreas ? dataSource.classifyAreas.join('；') : '',
    },
    {
      title: intl.formatMessage({ id: 'supplier.components.supplierDocCategory.partnerTypeName' }),
      value: dataSource?.partnerTypeName || '',
    },
    {
      title: translate('web.resource.member.bibie'),
      value: dataSource?.currencyTypeName || '',
      columnProps: {
        span: 2,
      },
    },
    {
      title: translate('web.common.remark'),
      value: dataSource?.remark || '',
      columnProps: {
        span: 3,
      },
    },
    {
      title: intl.formatMessage({ id: 'member.components.MemberDocCategory.category' }),
      value: (
        <ul className={styles['category-list']}>
          {dataSource?.categories.map((item) => (
            <li className={styles['category-list-item']} key={item.id}>
              <Descriptions column={1}>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'member.components.MemberDocCategory.category.name' })}
                >
                  {item.details?.map((item) => item.name).join(' / ')}
                </Descriptions.Item>
                <Descriptions.Item label={translate('web.resource.member.yufukuang')}>
                  {item.advanceChargeName}
                </Descriptions.Item>
                <Descriptions.Item label={translate('web.resource.member.jiesuandanju')}>
                  {item.settlementDocumentsName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'member.components.MemberDocCategory.category.paymentDay' })}
                >
                  {`${item.payTypeName} `}
                  {item.month
                    ? `${intl.formatMessage({ id: 'member.components.MemberDocCategory.month', month: item.month })}`
                    : ''}
                  {item.monthDay
                    ? `${intl.formatMessage({
                        id: 'member.components.MemberDocCategory.monthDay',
                        monthDay: item.monthDay,
                      })}`
                    : ''}
                  {item.days
                    ? `${intl.formatMessage({ id: 'member.components.MemberDocCategory.days', days: item.days })}`
                    : ''}
                </Descriptions.Item>
                <Descriptions.Item label={translate('web.resource.member.fukuanfangshi')}>
                  {item.paymentTypeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'member.components.MemberDocCategory.category.invoiceTypeName' })}
                >
                  {item.invoiceTypeName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={intl.formatMessage({ id: 'member.components.MemberDocCategory.category.taxPoint' })}
                >
                  {item.taxPoint}%
                </Descriptions.Item>
              </Descriptions>
            </li>
          ))}
        </ul>
      ),
      columnProps: {
        span: 3,
      },
    },
  ]

  return (
    <>
      <CustomizeColumn
        title={intl.formatMessage({ id: 'member.components.MemberDocCategory.title' })}
        data={data}
        {...rest}
        extra={
          <>
            {validateId && (
              <Button type="link" loading={infoLoading} onClick={handleModifyClassify}>
                {intl.formatMessage({ id: 'member.components.MemberDocCategory.edit' })}
              </Button>
            )}
          </>
        }
      />

      <ModifyClassifyDrawer
        visible={visibleDrawer}
        onClose={() => handleVisibleDrawer(false)}
        onSubmit={handleSubmit}
        submitLoading={submitLoading}
        partnerTypes={partnerTypes}
        value={classifyInfo}
      />
    </>
  )
}

export default MemberDocCategory
