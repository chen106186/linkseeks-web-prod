import React, { Fragment, useEffect, useState } from 'react'
import { Space, Button, Tag, Badge, Typography } from 'antd'
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
import { EyeAuthButton } from '@apps/components'
import {
  getTradeInquiryListDetails,
  postTradeInquiryDocumentsReview,
  postTradeInquiryDocumentsReviewTwo,
} from '@apps/apis'
import { getCommodityWebShopWebAll } from '@apps/apis'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
const TABLINK = [
  { key: 'progressLayout', label: intl.formatMessage({ id: 'dealAbility.liuzhuanjindu' }) },
  { key: 'basicLayout', label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }) },
  { key: 'inquiryProductLayout', label: intl.formatMessage({ id: 'dealAbility.xunjiashangpin' }) },
  { key: 'conditionLayout', label: intl.formatMessage({ id: 'dealAbility.jiaoyitiaojian' }) },
  { key: 'fileLayout', label: intl.formatMessage({ id: 'dealAbility.fujian' }) },
  { key: 'recordLyout', label: intl.formatMessage({ id: 'dealAbility.liuzhuanjilu' }) },
]

const ProductInquiryDetail = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)

  const handleBasicEffect = (data: any, shopInfo: any[]) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }), extra: data.inquiryListNo },
          { label: intl.formatMessage({ id: 'dealAbility.xunjiazhaiyao' }), extra: data.details },
          {
            label: intl.formatMessage({ id: 'dealAbility.xunjiashangcheng' }),
            extra: shopInfo.map((item) => {
              if (item.id === data.shopId) {
                return item.name
              }
            }),
          },
        ],
      },
      {
        col: [
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
          { label: intl.formatMessage({ id: 'dealAbility.beixunjiahuiyuan' }), extra: data.memberName },
          { label: intl.formatMessage({ id: 'dealAbility.danjushijian' }), extra: formatTimeString(data.voucherTime) },
        ],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.jiaofuriqi' }), extra: formatTimeString(data.deliveryTime) },
          { label: intl.formatMessage({ id: 'dealAbility.jiaofudizhi' }), extra: data.fullAddress },
          {
            label: intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' }),
            extra: formatTimeString(data.quotationAsTime),
          },
          { label: intl.formatMessage({ id: 'dealAbility.xunjialianxiren' }), extra: data.contactName },
          {
            label: intl.formatMessage({ id: 'dealAbility.lianxirendianhua' }),
            extra: (
              <>
                {data.phoneCode}&nbsp;{data.contactPhone}
              </>
            ),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.baojiayaoqiu' }), extra: data.offer },
          { label: intl.formatMessage({ id: 'dealAbility.fukuanfangshi' }), extra: data.paymentType },
          { label: intl.formatMessage({ id: 'dealAbility.shuifeiyaoqiu' }), extra: data.taxes },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'dealAbility.wuliuyaoqiu' }), extra: data.logistics },
          { label: intl.formatMessage({ id: 'dealAbility.baozhuangyaoqiu' }), extra: data.packRequire },
          { label: intl.formatMessage({ id: 'dealAbility.qitayaoqiu' }), extra: data.otherRequire },
        ],
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
    await getTradeInquiryListDetails({ id })
      .then((res: any) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        const { data } = res
        data.externalLogStates = data.externalInquiryListStateResponses
          ? [...data.externalInquiryListStateResponses]
          : null
        data.interiorLogStates = data.interiorRequisitionFormStateResponses
          ? [...data.interiorRequisitionFormStateResponses]
          : null
        data.externalLogs = data.externalInquiryListLogResponses ? [...data.externalInquiryListLogResponses] : null
        data.interiorLogs = data.interiorInquiryListLogResponses ? [...data.interiorInquiryListLogResponses] : null
        getCommodityWebShopWebAll(
          {
            environment: 1,
            isMemberType: true,
            memberId: data.memberId,
            roleId: data.memberRoleId,
          },
          { ctlType: 'none' },
        ).then((res) => {
          if (res.code !== 1000) {
            return
          }
          handleBasicEffect(data, res.data)
        })
        setDataSource(data)
        // handleBasicEffect(data);
        handleConditionEffect(data)
        handleFileEffect(data)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const handleJump = (data: any) => {
    jumpDefaultMall(`/shop/${data.memberId}_${data.memberRoleId}/inquiry/detail/${data.commodityId}`)
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'commodityId',
      dataIndex: 'commodityId',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shangpinmingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
      render: (text: any, record: any) => (
        <EyeAuthButton type="button" handleClick={() => handleJump(record)}>
          {text}
        </EyeAuthButton>
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
      title: intl.formatMessage({ id: 'dealAbility.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caigoushuliang' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
  ]

  const fetchLink = () => {
    let fetchSoure: any = null
    switch (pathPci) {
      case 'waitAuditInquiryOne':
        fetchSoure = postTradeInquiryDocumentsReview
        break
      case 'waitAuditInquiryTwo':
        fetchSoure = postTradeInquiryDocumentsReviewTwo
        break
    }
    return fetchSoure
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        backDom
        subTitle={dataSource.inquiryListNo}
        title={dataSource.details}
        items={TABLINK}
        extra={
          <>
            {(path === 'edit' || path === 'examine') && (
              <Button onClick={() => setVisible(true)} type="primary">
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'dealAbility.danjushenhe' })}
              </Button>
            )}
          </>
        }
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ListLayout
            id={id}
            anchor="inquiryProductLayout"
            title={intl.formatMessage({ id: 'dealAbility.xunjiashangpin' })}
            columns={columns}
            done
            data={dataSource.inquiryListProductRequests}
            // fetch={getTradeEnquiryProductList}
          />
          <GeneralLayout
            anchor="conditionLayout"
            title={intl.formatMessage({ id: 'dealAbility.jiaoyitiaojian' })}
            effect={conditionEffect}
          />
          <GeneralLayout
            anchor="fileLayout"
            title={intl.formatMessage({ id: 'dealAbility.fujian' })}
            effect={fileEffect}
          />
          <RecordLyout />
        </Space>
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
    </Context.Provider>
  )
}

export default ProductInquiryDetail
