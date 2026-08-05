import React, { Fragment, useEffect, useState } from 'react'
import { Button, Tag, Badge, Typography, Space, Drawer } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { formatTimeString } from '@/utils'
import { jumpDefaultMall } from '@/constants'
import { CheckCircleOutlined, LinkOutlined } from '@ant-design/icons'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import ProgressLayout from '@/pages/transaction/components/detailLayout/components/progressLayout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import GeneralLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import RecordLyout from '@/pages/transaction/components/detailLayout/components/recordLyout'
import ModalOperate from '@/pages/transaction/components/modalOperate'
import StandardTable from '@/components/StandardTable'
import { authService } from '@apps/services'
import {
  getTradeInquiryDetails,
  getTradeProductQuotationDetails,
  getTradeProductQuotationHistoryList,
  postTradeProductQuotationtAuditSubmit,
  postTradeProductQuotationtAuditSubmitTwo,
} from '@apps/apis'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
const TABLINK = [
  { key: 'progressLayout', label: intl.formatMessage({ id: 'dealAbility.liuzhuanjindu' }) },
  { key: 'basicLayout', label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }) },
  { key: 'inquiryProductLayout', label: intl.formatMessage({ id: 'dealAbility.shangpinxunjia' }) },
  { key: 'otherLayout', label: intl.formatMessage({ id: 'dealAbility.qitashuoming' }) },
  { key: 'fileLayout', label: intl.formatMessage({ id: 'dealAbility.fujian' }) },
  { key: 'recordLyout', label: intl.formatMessage({ id: 'dealAbility.liuzhuanjilu' }) },
]

const InquiryOfferDetail = ({ examineType }: { examineType?: string }) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [otherEffect, setOtherEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [commoditySkuId, setCommoditySkuId] = useState()
  const [historyVisible, setHistoryVisible] = useState<boolean>(false)

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }), extra: data.quotationNo },
          { label: intl.formatMessage({ id: 'dealAbility.baojiazhaiyao' }), extra: data.details },
          {
            label: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
            extra: <Tag color={EXTERNALSTATE_COLOR[data.externalState] || 'default'}>{data.externalStateName}</Tag>,
          },
          {
            label: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
            extra: (
              <Badge status={INTERNALSTATE_COLOR[data.interiorState] || 'default'} text={data.interiorStateName} />
            ),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.duiyingxunjiadanhao' }), extra: data.inquiryListNo },
          { label: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }), extra: data.memberName },
          {
            label: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
            extra: formatTimeString(data.quotationAsTime),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.danjushijian' }), extra: formatTimeString(data.voucherTime) },
          { label: intl.formatMessage({ id: 'dealAbility.baojialianxiren' }), extra: data.contactName },
          {
            label: intl.formatMessage({ id: 'dealAbility.lianxirendianhua' }),
            extra: (
              <>
                +{data.phoneCode}&nbsp;{data.contactPhone}
              </>
            ),
          },
        ],
      },
    ])
  }

  const handleOtherEffect = (data: any) => {
    setOtherEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.zuixiaoqiding' }), extra: data.minimumOrder },
          { label: intl.formatMessage({ id: 'dealAbility.jiaofushuoming' }), extra: data.deliveryInstructions },
          { label: intl.formatMessage({ id: 'dealAbility.fukuanshuoming' }), extra: data.paymentType },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.shuifeishuoming' }), extra: data.taxes },
          { label: intl.formatMessage({ id: 'dealAbility.wuliushuoming' }), extra: data.logistics },
          { label: intl.formatMessage({ id: 'dealAbility.baozhuangshuoming' }), extra: data.packRequire },
        ],
      },
      {
        col: [{ label: intl.formatMessage({ id: 'dealAbility.qitashuoming' }), extra: data.otherRequire }],
      },
    ])
  }

  const handleFileEffect = (data: any) => {
    setFileEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'dealAbility.fujian' }),
            extra: (
              <>
                {data.enclosureUrls &&
                  data.enclosureUrls.map((item: any, index: number) => (
                    <Typography.Link
                      style={{ display: 'block', paddingBottom: '8px' }}
                      key={`link_${index + 1}`}
                      onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                    >
                      <LinkOutlined />
                      {item.name}
                    </Typography.Link>
                  ))}
              </>
            ),
          },
        ],
      },
    ])
  }

  const fetchDataSource = async () => {
    await getTradeProductQuotationDetails({ id })
      .then((res: any) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        const { data } = res
        data.externalLogStates = data.externalQuotationStateResponses ? [...data.externalQuotationStateResponses] : null
        data.interiorLogStates = data.interiorQuotationStateResponses ? [...data.interiorQuotationStateResponses] : null
        data.externalLogs = data.externalRequisitionFormResponses ? [...data.externalRequisitionFormResponses] : null
        data.interiorLogs = data.interiorQuotationLogResponses ? [...data.interiorQuotationLogResponses] : null
        setDataSource(data)
        handleBasicEffect(data)
        handleOtherEffect(data)
        handleFileEffect(data)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinIDmingcheng' }),
      key: 'commodityId',
      dataIndex: 'commodityId',
      render: (commodityId, data) => (
        <Space direction="vertical">
          <Typography.Link
            target="_blank"
            onClick={() =>
              jumpDefaultMall(`/shop/${data.memberId}_${data.memberRoleId}/inquiry/detail/${data.commodityId}`)
            }
          >
            {commodityId}
          </Typography.Link>
          <Typography.Text>{data.productName}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliangdanwei' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (purchaseCount, data) => (
        <Space direction="vertical">
          <Typography.Text>{purchaseCount}</Typography.Text>
          <Typography.Text>{data.unit}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.hanshuishuil' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (_, record) =>
        `${
          record.taxRate ? intl.formatMessage({ id: 'dealAbility.shi' }) : intl.formatMessage({ id: 'dealAbility.fou' })
        }/${record.taxRate}%`,
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanjia' }),
      key: 'price',
      dataIndex: 'price',
      render: (price) => (
        <>
          {price
            ? `${intl.formatMessage({ id: 'common.money' })}${price.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0.00`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.jine' }),
      key: 'money',
      dataIndex: 'money',
      render: (money) => (
        <>
          {money
            ? `${intl.formatMessage({ id: 'common.money' })}${money.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0.00`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, _data, index) => (
        <Button type="link" onClick={() => handleHitory(_data)}>
          {intl.formatMessage({ id: 'dealAbility.lishibaojia' })}
        </Button>
      ),
    },
  ]

  const handleJump = (val) => {
    const { memberId } = authService.getAuth()
    if (val.quoteMemberId === memberId) {
      history.open(`/dealAbility/inquiryOffer/offerSearch/offer?id=${val.id}`)
    } else {
      history.open(`/dealAbility/confirmOffer/offerSearch/offer?id=${val.id}`)
    }
  }

  const hitoryColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinID' }),
      key: 'commodityId',
      dataIndex: 'commodityId',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinlei' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliang' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadanjia' }),
      key: 'price',
      dataIndex: 'price',
      render: (price) => (
        <>
          {price
            ? `${intl.formatMessage({ id: 'common.money' })}${price.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0.00`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }),
      key: 'quoteMemberName',
      dataIndex: 'quoteMemberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiashijian' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.baojiadan' }),
      key: 'quotationNo',
      dataIndex: 'quotationNo',
      render: (_text, _record) => (
        <Button type="link" onClick={() => handleJump(_record)}>
          {_text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
      key: 'externalStateName',
      dataIndex: 'externalStateName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
      key: 'interiorStateName',
      dataIndex: 'interiorStateName',
    },
  ]

  const handleHitory = (_data) => {
    setCommoditySkuId(_data.productId)
    setHistoryVisible(true)
  }

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (examineType) {
      case 'waitAuditOfferOne':
        fetchSoure = postTradeProductQuotationtAuditSubmit
        break
      case 'waitAuditOfferTwo':
        fetchSoure = postTradeProductQuotationtAuditSubmitTwo
        break
    }
    return fetchSoure
  }

  const fetchTableData = (params: any) => {
    return new Promise((resolve) => {
      getTradeProductQuotationHistoryList({ ...params, commoditySkuId }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        resolve(res.data)
      })
    })
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.quotationNo}
        title={dataSource.details}
        items={TABLINK}
        extra={
          <>
            {examineType && (
              <Button onClick={() => setVisible(true)} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
              </Button>
            )}
          </>
        }
      >
        <Fragment>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ListLayout
            id={id}
            anchor="inquiryProductLayout"
            title={intl.formatMessage({ id: 'dealAbility.xunjiashangpin' })}
            columns={columns}
            fetch={getTradeInquiryDetails}
          />
          <GeneralLayout
            anchor="otherLayout"
            title={intl.formatMessage({ id: 'dealAbility.qitashuoming' })}
            effect={otherEffect}
          />
          <GeneralLayout
            anchor="fileLayout"
            title={intl.formatMessage({ id: 'dealAbility.fujian' })}
            effect={fileEffect}
          />
          <RecordLyout />
        </Fragment>
      </PageHeaderWrapper>
      <ModalOperate
        id={id}
        title={intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
        modalType="audit"
        visible={visible}
        fetch={fetchLink()}
        onCancel={() => setVisible(false)}
        onOk={() => history.goBack()}
      />

      <Drawer
        width={1200}
        title={intl.formatMessage({ id: 'dealAbility.lishibaojia' })}
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        destroyOnClose
      >
        <StandardTable columns={hitoryColumns} tableProps={{ rowKey: 'id' }} fetchTableData={fetchTableData} />
      </Drawer>
    </Context.Provider>
  )
}

export default InquiryOfferDetail
