/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-04 11:33:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-22 14:56:42
 * @Description: 单据表单组件，提供基础的表单内容，单据明细相关由外部传入控制
 */
import React, { useEffect, useState } from 'react'
import { Button, Spin } from 'antd'
import {
  createFormActions,
  IFormExtendsEffectSelector,
  ISchemaFormActions,
  ISchemaFormAsyncActions,
} from '@apps/formily'
import { Radio, ArrayTable } from '@apps/formily'
import {
  DOC_TYPE_PURCHASE_RECEIPT,
  DOC_TYPE_SALES_INVOICE,
  DOC_TYPE_PROCESS_RECEIPT,
  DOC_TYPE_PROCESS_INVOICE,
  DOC_TYPE_RETURN_INVOICE,
  DOC_TYPE_RETURN_RECEIPT,
  DOC_TYPE_EXCHANGE_RETURN_INVOICE,
  DOC_TYPE_EXCHANGE_RETURN_RECEIPT,
  DOC_TYPE_EXCHANGE_INVOICE,
  DOC_TYPE_EXCHANGE_RECEIPT,
} from '@/constants/commodity'
import { DELIVERY_TYPE } from '@/constants/order'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import createSchema, { RelatedType } from './schema'
import { createEffects } from './effects'
import { RelatedInfoDataType, RelatedInfoType, BillSubmitValuesType } from './interface'
import { normalizeBillDetails } from './utils'
import EllipsisText from '@/formSchema/components/EllipsisText'
import { getIntl } from '@linkseeks/i18n'

export * from './interface'
const intl = getIntl()
const TITLE_MAP = {
  [DOC_TYPE_PURCHASE_RECEIPT]: intl.formatMessage({ id: 'common.caigourukudan' }),
  [DOC_TYPE_SALES_INVOICE]: intl.formatMessage({ id: 'common.xiaoshoufahuodan' }),
  [DOC_TYPE_PROCESS_RECEIPT]: intl.formatMessage({ id: 'common.jiagongrukudan' }),
  [DOC_TYPE_PROCESS_INVOICE]: intl.formatMessage({ id: 'common.jiagongfahuodan' }),
  [DOC_TYPE_RETURN_INVOICE]: intl.formatMessage({ id: 'common.tuihuofahuodan' }),
  [DOC_TYPE_RETURN_RECEIPT]: intl.formatMessage({ id: 'common.tuihuorukudan' }),
  [DOC_TYPE_EXCHANGE_RETURN_INVOICE]: intl.formatMessage({ id: 'common.huanhuotuihuofahuodan' }),
  [DOC_TYPE_EXCHANGE_RETURN_RECEIPT]: intl.formatMessage({ id: 'common.huanhuotuihuoruhuodan' }),
  [DOC_TYPE_EXCHANGE_INVOICE]: intl.formatMessage({ id: 'common.huanhuofahuodan' }),
  [DOC_TYPE_EXCHANGE_RECEIPT]: intl.formatMessage({ id: 'common.huanhuorukudan' }),
}

const formActions = createFormActions()

interface IProps {
  /**
   * 关联单据类型，退货 1 | 换货 2
   */
  relatedType: RelatedType
  /**
   * 单据类型
   */
  billType: number
  /**
   * 是否可编辑的
   */
  editable?: boolean
  /**
   * 获取对应单据详情
   */
  fetchRelatedInfo: () => Promise<RelatedInfoDataType>
  /**
   * submit loading
   */
  submitLoading?: boolean
  /**
   * 点击保存触发事件
   */
  onSubmit?: (values: BillSubmitValuesType) => void
  /**
   * 自定义的 effects事件
   */
  customEffects?: (context?: IFormExtendsEffectSelector, action?: ISchemaFormActions | ISchemaFormAsyncActions) => void
}

const BillsFormPage: React.FC<IProps> = (props: IProps) => {
  const { relatedType, billType, editable = true, fetchRelatedInfo, submitLoading, onSubmit, customEffects } = props
  const [relatedInfo, setRelatedInfo] = useState<RelatedInfoType | null>(null)
  const [relatedLoading, setRelatedLoading] = useState(false)

  const getRelatedInfo = () => {
    if (fetchRelatedInfo) {
      setRelatedLoading(true)
      fetchRelatedInfo()
        .then((res) => {
          if (res) {
            setRelatedInfo({
              ...res,
              logisticsTypeName: DELIVERY_TYPE[res.logisticsType],
              billDetails: normalizeBillDetails(res.billDetails),
            })
          }
        })
        .finally(() => {
          setRelatedLoading(false)
        })
    }
  }

  useEffect(() => {
    getRelatedInfo()
  }, [])

  const anchorsArr = [
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'stockSellStorage.jibenxinxi' }),
    },
    {
      key: 'billDetail',
      label: intl.formatMessage({ id: 'stockSellStorage.danjumingxi' }),
    },
  ]

  const handleSubmit = (values: BillSubmitValuesType) => {
    onSubmit?.(values)
  }

  return (
    <Spin spinning={relatedLoading}>
      <PageHeaderWrapper
        title={`${
          editable
            ? intl.formatMessage({ id: 'stockSellStorage.xinzeng' })
            : intl.formatMessage({ id: 'stockSellStorage.zhakan' })
        }${TITLE_MAP[billType]}`}
        items={anchorsArr}
        extra={
          <>
            {editable ? (
              <Button type="primary" loading={!!submitLoading} onClick={() => formActions.submit()}>
                {intl.formatMessage({ id: 'stockSellStorage.baocun' })}
              </Button>
            ) : null}
          </>
        }
      >
        <NiceForm
          previewPlaceholder=" "
          onSubmit={handleSubmit}
          actions={formActions}
          initialValues={relatedInfo}
          components={{
            RadioGroup: Radio.Group,
            ArrayTable,
            Text: EllipsisText,
          }}
          effects={($, actions) => {
            createEffects($, actions, !!editable)

            customEffects?.($, actions)
          }}
          schema={createSchema(relatedType, billType, relatedInfo?.orderType)}
          editable={!!editable}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default BillsFormPage
