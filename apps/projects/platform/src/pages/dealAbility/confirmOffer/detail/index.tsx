import React, { Fragment, useEffect, useState } from 'react'
import { Button, Tag, Badge, Typography, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { formatTimeString } from '@/utils'
import { CheckCircleOutlined, LinkOutlined } from '@ant-design/icons'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import ProgressLayout from '@/pages/transaction/components/detailLayout/components/progressLayout'
import BasicLayout from '@/pages/transaction/components/detailLayout/components/basicLayout'
import ListLayout from '@/pages/transaction/components/detailLayout/components/listLayout'
import GeneralLayout from '@/pages/transaction/components/detailLayout/components/generalLayout'
import RecordLyout from '@/pages/transaction/components/detailLayout/components/recordLyout'
import ModalOperate from '@/pages/transaction/components/modalOperate'
import { jumpDefaultMall } from '@/constants'
import AuditLayout from './audit'
import {
  getTradeInquiryDetails,
  getTradeNotarizeEnquiryProductQuotationDetails,
  postTradeNotarizeEnquiryQuotedPriceAffirm,
  postTradeNotarizeEnquiryQuotedPriceAudit,
  postTradeNotarizeEnquiryQuotedPriceAuditTwo,
  postTradeNotarizeEnquiryQuotedPriceSubmit,
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

const ConfirmOfferDetail = ({ pathPci }) => {
  const { id, submit } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  // const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 3])
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [otherEffect, setOtherEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)

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
          { label: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }), extra: data.supplyMembersName },
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
    await getTradeNotarizeEnquiryProductQuotationDetails({ id })
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
              jumpDefaultMall(`/shop/${data.memberId}_${data.memberRoleId}/commodity/detail/${data.commodityId}`)
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
  ]

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'waitSubmitAuditOffer':
        fetchSoure = postTradeNotarizeEnquiryQuotedPriceSubmit
        break
      case 'waitAuditInquiryOne':
        fetchSoure = postTradeNotarizeEnquiryQuotedPriceAudit
        break
      case 'waitAuditInquiryTwo':
        fetchSoure = postTradeNotarizeEnquiryQuotedPriceAuditTwo
        break
      case 'waitSubmitOffer':
        fetchSoure = postTradeNotarizeEnquiryQuotedPriceAffirm
        break
    }
    return fetchSoure
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        subTitle={dataSource.quotationNo}
        title={dataSource.details}
        items={TABLINK}
        extra={
          <>
            {(path === 'detail' || submit) && (
              <Button onClick={() => setVisible(true)} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
              </Button>
            )}
          </>
        }
      >
        <Space direction="vertical" size={16} style={{ display: 'flex' }}>
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
        </Space>
      </PageHeaderWrapper>
      {pathPci === 'waitSubmitOffer' ? (
        <AuditLayout id={id} visible={visible} onCancel={() => setVisible(false)} onOk={() => history.goBack()} />
      ) : (
        <ModalOperate
          id={id}
          title={intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
          modalType="audit"
          visible={visible}
          fetch={fetchLink()}
          onCancel={() => setVisible(false)}
          onOk={() => history.goBack()}
        />
      )}
    </Context.Provider>
  )
}

export default ConfirmOfferDetail
