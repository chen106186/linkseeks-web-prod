import React, { Fragment, useCallback, useMemo, useState, useRef } from 'react'
import { Badge, Button, Tag, Typography, Image, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Context } from '@/components/DetailLayout/components/context'
import { PageHeaderWrapper, ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import GeneralLayout from '@/components/DetailLayout/components/generalLayout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import { formatTimeString } from '@/utils'
import { useEffect } from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ListLayout from '@/components/DetailLayout/components/listLayout'
import { isEmpty } from 'lodash'
import { remindLayout, RemindLayoutProps } from '@/pages/marketingManage/common/remind'
import { Columns } from '../../common/columns'
import { ACTIVITYTYPENAME, GeneralEffect } from '../../common/constants'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import ListModalLayout from '../../components/listModalLayout'
import CouponsListLayout from '../../components/couponsListLayout'
import { ACTIVITY_TYPE_13, ACTIVITY_TYPE_15, ACTIVITY_TYPE_6 } from '@/constants/const/marketing'
import {
  getMarketingPlatformActivityExecuteDetail,
  getMarketingPlatformActivityExecuteDetailGoodsExecuteDetailPage,
  getMarketingPlatformActivityExecuteDetailGoodsPage,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptionsDetail'

/** 订单 */
const ORDER_TYPE = 1

/** 退货订单 */
const REFUND_TYPE = 2

const DetailLayout: React.FC = () => {
  const { id } = usePageStatus()
  // 赠送促销/换购/套餐 显示执行明细
  const showExecution = true
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [generalEffect, setGeneralEffect] = useState<any>([])
  const [value, setValue] = useState<number>(1)
  const [remind, setRemind] = useState<RemindLayoutProps>()
  const [collocation, setCollocation] = useState<any[]>([])
  const [listModalVisible, setListModalVisible] = useState<boolean>(false)
  const [idata, setIdata] = useState<any[]>([])

  const [param, setParam] = useState<any>({})
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '活动ID', extra: data.id },
          { label: '活动名称', extra: data.activityName },
          { label: '活动类型', extra: data.activityTypeName },
          { label: '活动参与类型', extra: data.activitySignUpTypeName },
          { label: '外部状态', extra: <Tag color={OuterStatusColor(data.outerStatus)}>{data.outerStatusName}</Tag> },
        ],
      },
      {
        col: [
          { label: '活动开始时间', extra: formatTimeString(data.startTime) },
          { label: '活动结束时间', extra: formatTimeString(data.endTime) },
          { label: '报名开始时间', extra: formatTimeString(data.signUpStartTime) },
          { label: '报名结束时间', extra: formatTimeString(data.signUpEndTime) },
          {
            label: '内部状态',
            extra: <Badge status={InnerStatusColor(data.innerStatus)} text={data.innerStatusName} />,
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

  const fetchDataSource = useCallback(async () => {
    await getMarketingPlatformActivityExecuteDetail({ id } as any)
      .then((res: any) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res
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
    if (remind?.value !== 1 && tableRecord.couponGroupList !== undefined) {
      setCollocation(tableRecord.couponGroupList)
    } else if (remind?.value === 1 && tableRecord.goodsSubsidiaryGroupList !== undefined) {
      setCollocation(tableRecord.goodsSubsidiaryGroupList)
    } else {
      setCollocation([])
    }
    setListModalVisible(true)
  }

  const toggle = (flag: boolean, info?) => {
    if (info) {
      setParam({
        belongType: 1,
        activityId: id,
        skuId: info.skuId,
      })
    }
    modalRef.current.setVisible(flag)
    modalRef.current?.reload()
  }

  const columns = useMemo(() => {
    return Columns[value]?.({ value, handlCollocation, showExecution, toggle })
  }, [value])

  const coulumsList = useMemo(() => {
    if (value !== ACTIVITY_TYPE_6 && value !== ACTIVITY_TYPE_13 && value !== ACTIVITY_TYPE_15) {
      return columns.concat([
        {
          title: '参与客户数',
          key: 'customerCount',
          dataIndex: 'customerCount',
        },
        {
          title: '实购数量',
          key: 'salesNum',
          dataIndex: 'salesNum',
        },
        {
          title: '实购金额',
          key: 'amount',
          dataIndex: 'amount',
          render: (text) => `￥${Number(text).toFixed(2)}`,
        },
        {
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          render: (_text, _record) => (
            <Button type="link" style={{ padding: 0 }} onClick={() => toggle(true, _record)}>
              执行明细
            </Button>
          ),
        },
      ])
    } else if (value === ACTIVITY_TYPE_6 || value === ACTIVITY_TYPE_13 || value === ACTIVITY_TYPE_15) {
      return [
        {
          title: '商品ID',
          key: 'productId',
          dataIndex: 'productId',
          render: (text) => (
            <Typography.Link target="_blank" href={`/productManage/commodity/products/detail?id=${text}`}>
              {text}
            </Typography.Link>
          ),
        },
        {
          title: '商品图片',
          key: 'productImgUrl',
          dataIndex: 'productImgUrl',
          render: (text) => <Image width={32} height={32} src={text} />,
        },
        {
          title: '商品名称',
          key: 'productName',
          dataIndex: 'productName',
        },
        {
          title: '品类',
          key: 'category',
          dataIndex: 'category',
        },
        {
          title: '品牌',
          key: 'brand',
          dataIndex: 'brand',
        },
        {
          title: '单位',
          key: 'unit',
          dataIndex: 'unit',
        },
        {
          title: '商品价格',
          key: 'price',
          dataIndex: 'price',
          render: (text) => `￥${Number(text).toFixed(2)}`,
        },
        {
          title: '个人限购数量',
          key: 'restrictNum',
          dataIndex: 'restrictNum',
        },
        {
          title: '活动限购总数量',
          key: 'restrictTotalNum',
          dataIndex: 'restrictTotalNum',
        },
        {
          title: '参与客户数',
          key: 'customerCount',
          dataIndex: 'customerCount',
        },
        {
          title: '实购数量',
          key: 'salesNum',
          dataIndex: 'salesNum',
        },
        {
          title: '实购金额',
          key: 'amount',
          dataIndex: 'amount',
          render: (text) => `￥${Number(text).toFixed(2)}`,
        },
        {
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          render: (_text, _record) => (
            <>
              {value === 6 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  查看赠品
                </Button>
              )}
              {value === 13 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  查看换购商品
                </Button>
              )}
              {value === 15 && (
                <Button type="link" onClick={() => handlCollocation(_record)}>
                  查看搭配商品
                </Button>
              )}
              {showExecution && (
                <Button type="link" style={{ padding: 0 }} onClick={() => toggle(true, _record)}>
                  执行明细
                </Button>
              )}
            </>
          ),
        },
      ]
    }
  }, [value])

  const isHasTax = (tax: number) => {
    const taxText = tax === 1 ? '是' : '否'
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

  const tableModalColumns: RecordColumns<any>[] = [
    {
      title: '单据号',
      key: 'orderId',
      dataIndex: 'orderId',
      fixed: 'left',
      searchField: {
        main: true,
        type: 'Input',
        name: 'orderNo',
      },
      render: (_text, _r) => (
        <>
          {_r.recordType === 1 && (
            <Button
              type="link"
              target="_blank"
              onClick={() => history.push(`/orderManage/list/detail?id=${_r.orderId}`)}
            >
              {_r.orderNo}
            </Button>
          )}
          {_r.recordType === 2 && (
            <Button
              type="link"
              target="_blank"
              onClick={() => history.push(`/afterManage/returnManage/query/detail?id=${_text}`)}
            >
              {_r.orderNo}
            </Button>
          )}
        </>
      ),
    },
    {
      title: '单据类型',
      key: 'recordTypeName',
      dataIndex: 'recordTypeName',
      searchField: {
        type: 'Select',
        name: 'recordType',
        valueEnum: [
          { label: '订单', value: 1 },
          { label: '退货申请单', value: 2 },
        ],
      },
    },
    {
      title: '商城',
      key: 'shopName',
      dataIndex: 'shopName',
      searchField: {
        type: 'Select',
        name: 'shopId',
      },
    },
    {
      title: '客户名称',
      key: 'memberName',
      dataIndex: 'memberName',
      searchField: 'Input',
    },
    {
      title: '单据时间',
      key: 'orderTime',
      dataIndex: 'orderTime',
      searchField: {
        type: 'DateRange',
        name: ['startTime', 'endTime'],
        placeholder: [`开始时间`, `结束时间`],
      },
      render: (text) => formatTimeString(text),
    },
    {
      title: '单据状态',
      key: 'statusName',
      dataIndex: 'statusName',
    },
    {
      title: '含税/税率',
      key: 'isHasTax',
      dataIndex: 'isHasTax',
      render: (text, record) => `${isHasTax(text)} / ${record.taxRate || 0}%`,
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>购买数量</Typography.Text>
          <Typography.Text type="secondary">{hasQuantity(idata, 'quantity', 'quantity')}</Typography.Text>
        </Space>
      ),
      key: 'quantity',
      dataIndex: 'quantity',
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>应付金额</Typography.Text>
          <Typography.Text type="secondary">￥{Number(hasQuantity(idata, 'skuPrice')).toFixed(2)}</Typography.Text>
        </Space>
      ),
      key: 'skuPrice',
      dataIndex: 'skuPrice',
      render: (text, record) => (record.recordType === ORDER_TYPE ? `￥${Number(text).toFixed(2)}` : '-'),
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>实付金额</Typography.Text>
          <Typography.Text type="secondary">
            ￥{Number(hasQuantity(idata, 'amount', 'amount')).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => `￥${Number(text).toFixed(2)}`,
    },
    {
      title: (
        <Space direction="vertical" size={0}>
          <Typography.Text>优惠金额</Typography.Text>
          <Typography.Text type="secondary">
            ￥{(Number(hasQuantity(idata, 'skuPrice')) - Number(hasQuantity(idata, 'amount'))).toFixed(2)}
          </Typography.Text>
        </Space>
      ),
      key: 'discountPrice',
      dataIndex: 'discountPrice',
      render: (_text, record) =>
        record.recordType === ORDER_TYPE ? `￥${(record.skuPrice - record.amount).toFixed(2)}` : '-',
    },
  ]

  const fetchData = useCallback(
    (params?: any) => {
      return new Promise((resolve, reject) => {
        if (!Array.isArray(fetch) && param.skuId) {
          getMarketingPlatformActivityExecuteDetailGoodsExecuteDetailPage({ ...params, ...param })
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
          data: [],
          totalCount: 0,
        })
      })
    },
    [param],
  )

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.id}
        title={dataSource.activityName}
        isAnchor
        items={[
          { key: 'basicLayout', label: '基本信息' },
          { key: 'activityRuleLayout', label: '活动规则' },
          { key: 'activityProductLayout', label: '活动商品执行情况' },
        ]}
      >
        <Space direction="vertical" size={16}>
          <BasicLayout effect={basicEffect} span={12} />
          <GeneralLayout
            span={12}
            visible
            title={`活动规则-${ACTIVITYTYPENAME[dataSource.activityType]}`}
            anchor="activityRuleLayout"
            effect={generalEffect}
          />
          <ListLayout
            anchor="activityProductLayout"
            ids={{ activityId: id }}
            title="活动商品执行情况"
            fetch={getMarketingPlatformActivityExecuteDetailGoodsPage}
            columns={coulumsList}
          />
        </Space>
      </PageHeaderWrapper>
      {/* 查看搭配商品 */}
      {!isEmpty(remind) && remind?.value === 1 && (
        <ListModalLayout
          title={remind?.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      {/* 查看优惠券 */}
      {!isEmpty(remind) && remind?.value !== 1 && (
        <CouponsListLayout
          title={remind?.modalTitle}
          remind={remind}
          visible={listModalVisible}
          value={collocation}
          isPreview
          onClose={() => setListModalVisible(false)}
        />
      )}
      <ModalFormTable
        modalType="Drawer"
        modalTitle="执行明细"
        actionRef={modalRef}
        request={fetchData}
        columns={tableModalColumns}
        rowSelectionType="radio"
        rowKey="orderNo"
        pagination={false}
        onOk={() => toggle(false, null)}
        width={1200}
        searchSelectMaps={selectData}
      />
    </Context.Provider>
  )
}
export default DetailLayout
