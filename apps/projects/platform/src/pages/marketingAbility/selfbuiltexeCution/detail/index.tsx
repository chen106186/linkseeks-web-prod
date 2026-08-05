import { useIntl } from '@linkseeks/i18n'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Badge, Button, Typography, Image, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import GeneralLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'

import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import { isEmpty } from 'lodash'
import {
  remindLayout,
  RemindLayoutProps,
} from '@/pages/marketingAbility/paltformSign/readySubmitExamine/components/productListLayout/remind'
import {
  getMarketingAbilityActivityExecuteMerchantDetail,
  getMarketingAbilityActivityExecuteMerchantDetailGoodsExecuteDetailPage,
  getMarketingAbilityActivityExecuteMerchantDetailGoodsPage,
} from '@apps/apis'
import { Columns } from '../../common/columns'
import { ACTIVITYTYPENAME, GeneralEffect } from '../../common/constants'
import { InnerStatusColor } from '../../common/tagColor'
import ListModalLayout from '../../components/listModalLayout'
import CouponsListLayout from '../../components/couponsListLayout'
import { ACTIVITY_TYPE_13, ACTIVITY_TYPE_15, ACTIVITY_TYPE_6 } from '@/constants/marketing'
import TableModal from '@/pages/transaction/components/tableModal'
import { ColumnType } from 'antd/lib/table/interface'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { getCommodityWebShopWebAll } from '@apps/apis'
import { useQuery } from '@linkseeks/router-core'
const { onFormMount$ } = FormEffectHooks

/** 订单 */
const ORDER_TYPE = 1

/** 退货订单 */
const REFUND_TYPE = 2

const DetialLayout = () => {
  const intl = useIntl()
  const { id } = useQuery()
  // 赠送促销/换购/套餐 显示执行明细
  const showExecution = true
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  const [value, setValue] = useState<number>(1)
  const [remind, setRemind] = useState<RemindLayoutProps>({})
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [tableModalVisible, setTableModalVisible] = useState<boolean>(false)
  const [idata, setIdata] = useState<any[]>([])

  const [param, setParam] = useState<any>({})

  const toggle = (flag: boolean, info?) => {
    if (info) {
      setParam({
        belongType: 2,
        activityId: id,
        skuId: info.skuId,
      })
    }
    setTableModalVisible(flag)
  }

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'paltformSign.activityID' }), extra: data.id },
          { label: `${intl.formatMessage({ id: 'paltformSign.theNameOfTheEvent' })}`, extra: data.activityName },
          { label: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`, extra: data.activityTypeName },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`,
            extra: <Badge status={InnerStatusColor(data.innerStatus)} text={data.innerStatusName} />,
          },
        ],
      },
      {
        col: [
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activitiesStartTime' })}`,
            extra: formatTimeString(data.startTime),
          },
          {
            label: `${intl.formatMessage({ id: 'paltformSign.activityOverTime' })}`,
            extra: formatTimeString(data.endTime),
          },
          { label: `${intl.formatMessage({ id: 'selfManagement.memberName' })}`, extra: data.memberName },
          {
            label: `${intl.formatMessage({ id: 'selfManagement.creationTime' })}`,
            extra: formatTimeString(data.createTime),
          },
        ],
      },
    ])
  }

  const handleGeneralEffect = (data: any, int?: number) => {
    console.log(data, 10086)
    if (!isEmpty(data)) {
      setGeneralEffect(GeneralEffect(int, data))
    }
  }

  const fetchDataSource = useCallback(async () => {
    await getMarketingAbilityActivityExecuteMerchantDetail({ id } as any)
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        let { data } = res
        if (data.activityType === 6) {
          setRemind(remindLayout(data.activityType, data.activityDefined.giveType, data.activityDefined.giftType))
        }
        if (data.activityType === 13) {
          setRemind(remindLayout(data.activityType, data.activityDefined.swapType))
        }
        if (data.activityType === 15) {
          setRemind(remindLayout(data.activityType))
        }
        setDataSource(data)
        handleBasicEffect(data)
        setValue(data.activityType)
        handleGeneralEffect(data.activityDefined, data.activityType)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handlCollocation = (record) => {
    const tableRecord: any = { ...record }
    if (remind.value !== 1 && tableRecord.couponGroupList !== undefined) {
      setCollocation(tableRecord.couponGroupList)
    } else if (remind.value === 1 && tableRecord.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(tableRecord.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setListModalVisible(true)
  }

  const columns = useMemo(() => {
    return Columns[value]?.({ value, handlCollocation, showExecution, toggle })
  }, [value])

  const coulumsList = useMemo(() => {
    if (value !== ACTIVITY_TYPE_6 && value !== ACTIVITY_TYPE_13 && value !== ACTIVITY_TYPE_15) {
      return columns.concat([
        {
          title: intl.formatMessage({ id: 'marketingAbility.canyukehushu' }),
          key: 'customerCount',
          dataIndex: 'customerCount',
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.salesNum' }),
          key: 'salesNum',
          dataIndex: 'salesNum',
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.amount' }),
          key: 'amount',
          dataIndex: 'amount',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.operation' }),
          key: 'operation',
          dataIndex: 'operation',
          render: (_text, _record) => (
            <Button type="link" style={{ padding: 0 }} onClick={() => toggle(true, _record)}>
              {intl.formatMessage({ id: 'marketingAbility.zhixingmingxi' })}
            </Button>
          ),
        },
      ])
    } else if (value === ACTIVITY_TYPE_6 || value === ACTIVITY_TYPE_13 || value === ACTIVITY_TYPE_15) {
      return [
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.productID' })}`,
          key: 'productId',
          dataIndex: 'productId',
          render: (text) => (
            <Typography.Link target="_blank" href={`/commodityAbility/commodity/products/detail?id=${text}`}>
              {text}
            </Typography.Link>
          ),
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.commodityImages' })}`,
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.nameOfCommodity' })}`,
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.category' })}`,
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.brand' })}`,
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.unit' })}`,
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.commodityPrices' })}`,
          key: 'price',
          dataIndex: 'price',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.individualPurchaseQuantity' })}`,
          key: 'restrictNum',
          dataIndex: 'restrictNum',
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.numberPurchasingActivities' })}`,
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.canyukehushu' }),
          key: 'customerCount',
          dataIndex: 'customerCount',
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.salesNum' }),
          key: 'salesNum',
          dataIndex: 'salesNum',
        },
        {
          title: intl.formatMessage({ id: 'marketingAbility.amount' }),
          key: 'amount',
          dataIndex: 'amount',
          render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
        },
        {
          title: `${intl.formatMessage({ id: 'marketingAbility.operation' })}`,
          key: 'operation',
          dataIndex: 'operation',
          render: (_text, _record) => (
            <>
              {value === 6 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  {intl.formatMessage({ id: 'marketingAbility.viewTheGift' })}
                </Button>
              )}
              {value === 13 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  {intl.formatMessage({ id: 'marketingAbility.checkForGoods' })}
                </Button>
              )}
              {value === 15 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  {intl.formatMessage({ id: 'marketingAbility.viewTheCollocationOfGoods' })}
                </Button>
              )}
              {showExecution && (
                <Button type="link" style={{ padding: 0 }} onClick={() => toggle(true, _record)}>
                  {intl.formatMessage({ id: 'marketingAbility.zhixingmingxi' })}
                </Button>
              )}
            </>
          ),
        },
      ]
    }
  }, [value])

  const isHasTax = (tax: number) => {
    const taxText =
      tax === 1
        ? intl.formatMessage({ id: 'marketingAbility.true' })
        : intl.formatMessage({ id: 'marketingAbility.false' })
    return taxText
  }

  const hasQuantity = (DATA: any[], name?: string, name1?: string) => {
    let buy_no = 0
    let refund_no = 0
    if (!isEmpty(DATA)) {
      DATA.forEach((item) => {
        if (item.recordType === ORDER_TYPE && name) {
          buy_no += Number(item[name])
        } else if (item.recordType === REFUND_TYPE && name1) {
          refund_no += Number(item[name1].toString().split('-')[1])
          console.log(typeof item[name1], item[name1])
        }
      })
    }
    return buy_no - refund_no
  }

  const tableModalColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'marketingAbility.orderId' }),
      key: 'orderId',
      dataIndex: 'orderId',
      render: (_text, _r) => (
        <>
          {_r.recordType === 1 && (
            <Button type="link" target="_blank" href={`/orderAbility/saleOrder/orderList/detail?id=${_r.orderId}`}>
              {_r.orderNo}
            </Button>
          )}
          {_r.recordType === 2 && (
            <Button type="link" target="_blank" href={`/afterAbility/returnManage/returnQuery/detail?id=${_text}`}>
              {_r.orderNo}
            </Button>
          )}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.recordTypeName' }),
      key: 'recordTypeName',
      dataIndex: 'recordTypeName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.shopName' }),
      key: 'shopName',
      dataIndex: 'shopName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.memberName' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.orderTime' }),
      key: 'orderTime',
      dataIndex: 'orderTime',
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.statusName' }),
      key: 'statusName',
      dataIndex: 'statusName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.isHasTax' }),
      key: 'isHasTax',
      dataIndex: 'isHasTax',
      render: (text, record) => `${isHasTax(text)} / ${record.taxRate || 0}%`,
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>{intl.formatMessage({ id: 'marketingAbility.quantity' })}</Typography.Text>
          <Typography.Text type="secondary">{hasQuantity(idata, 'quantity', 'quantity')}</Typography.Text>
        </Space>
      ),
      key: 'quantity',
      dataIndex: 'quantity',
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>{intl.formatMessage({ id: 'marketingAbility.skuPrice' })}</Typography.Text>
          <Typography.Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
            {Number(hasQuantity(idata, 'skuPrice')).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'skuPrice',
      dataIndex: 'skuPrice',
      render: (text, record) =>
        record.recordType === ORDER_TYPE
          ? `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`
          : '-',
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>{intl.formatMessage({ id: 'marketingAbility.amountP' })}</Typography.Text>
          <Typography.Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
            {Number(hasQuantity(idata, 'amount', 'amount')).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${Number(text).toFixed(2)}`,
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>{intl.formatMessage({ id: 'marketingAbility.discountPrice' })}</Typography.Text>
          <Typography.Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
            {(Number(hasQuantity(idata, 'skuPrice')) - Number(hasQuantity(idata, 'amount'))).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'discountPrice',
      dataIndex: 'discountPrice',
      render: (_text, record) =>
        record.recordType === ORDER_TYPE
          ? `${intl.formatMessage({ id: 'common.money' })}${(record.skuPrice - record.amount).toFixed(2)}`
          : '-',
    },
  ]

  const fetchData = useCallback(
    (params?: any) => {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(fetch)) {
          const payload = {
            ...params,
            ...param,
          }
          if (payload.startTime) {
            payload.startTime = new Date(payload.startTime).getTime()
          }
          if (payload.endTime) {
            payload.endTime = new Date(payload.endTime).getTime()
          }
          getMarketingAbilityActivityExecuteMerchantDetailGoodsExecuteDetailPage(payload)
            .then((res) => {
              resolve(res.data)
              setIdata(res.data.data)
            })
            .catch((error) => {
              console.warn(error)
            })
          return
        }
        resolve({
          code: 1000,
          data: fetch,
        })
      })
    },
    [param],
  )

  const useStateEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      /** 活动类型 */
      getCommodityWebShopWebAll({ isMemberType: true }, { ctlType: 'none' })
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.id }
          })
          linkage.enum('shopId', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
    })
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.id}
        title={dataSource.activityName}
        items={[
          { key: 'basicLayout', label: `${intl.formatMessage({ id: 'paltformSign.theBasicInformation' })}` },
          { key: 'activityRuleLayout', label: `${intl.formatMessage({ id: 'paltformSign.activityRules' })}` },
          { key: 'activityProductLayout', label: `${intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}` },
        ]}
      >
        <Space direction="vertical" size={16}>
          <BasicLayout effect={basicEffect} span={12} />
          <GeneralLayout
            span={12}
            visible
            title={`${intl.formatMessage({ id: 'paltformSign.activityRules' })}-${
              ACTIVITYTYPENAME[dataSource.activityType]
            }`}
            anchor="activityRuleLayout"
            effect={generalEffect}
          />
          <ListLayout
            anchor="activityProductLayout"
            ids={{ activityId: id }}
            title={intl.formatMessage({ id: 'paltformSign.activitiesOfGoods' })}
            fetch={getMarketingAbilityActivityExecuteMerchantDetailGoodsPage}
            columns={coulumsList}
          />
        </Space>
      </PageHeaderWrapper>
      {/* 查看搭配商品 */}
      {!isEmpty(remind) && remind.value === 1 && (
        <ListModalLayout
          title={remind.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      {/* 查看优惠券 */}
      {!isEmpty(remind) && remind.value !== 1 && (
        <CouponsListLayout
          title={remind.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      <TableModal
        title={intl.formatMessage({ id: 'marketingAbility.zhixingmingxi' })}
        modalType="Drawer"
        width={1200}
        visible={tableModalVisible}
        columns={tableModalColumns}
        tableProps={{
          rowKey: (record) => `${record.orderNo}`,
        }}
        ctl={false}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
          useStateEffects()
        }}
        schema={{
          type: 'object',
          properties: {
            mageLayout: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'space-between',
                },
              },
              properties: {
                orderNo: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'marketingAbility.orderId' }),
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'Flex-Layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  marginRight: 20,
                },
              },
              properties: {
                memberName: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'marketingAbility.memberName' }),
                    allowClear: true,
                    style: {
                      width: 160,
                    },
                  },
                },
                '[startTime,endTime]': {
                  type: 'daterange',
                  'x-component-props': {
                    placeholder: [
                      `${intl.formatMessage({ id: 'paltformSign.theStartTime' })}`,
                      `${intl.formatMessage({ id: 'paltformSign.theEndOfTime' })}`,
                    ],
                    allowClear: true,
                    style: {
                      width: 240,
                    },
                  },
                },
                recordType: {
                  type: 'string',
                  default: undefined,
                  enum: [
                    { label: intl.formatMessage({ id: 'marketingAbility.order' }), value: 1 },
                    { label: intl.formatMessage({ id: 'marketingAbility.returned' }), value: 2 },
                  ],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'marketingAbility.recordTypeName' }),
                    allowClear: true,
                    style: {
                      width: 160,
                    },
                  },
                },
                shopId: {
                  type: 'string',
                  default: undefined,
                  enum: [],
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'marketingAbility.shopName' }),
                    allowClear: true,
                    style: {
                      width: 160,
                    },
                  },
                },
                submit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: `${intl.formatMessage({ id: 'marketingAbility.chaxun' })}`,
                  },
                },
              },
            },
          },
        }}
        fetchData={fetchData}
        onClose={() => toggle(false, null)}
        onOk={() => toggle(false, null)}
        mode="radio"
      />
    </Context.Provider>
  )
}
export default DetialLayout
