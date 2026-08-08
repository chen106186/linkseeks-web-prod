import { LineTitle, PageHeaderWrapper } from '@apps/components'
import { useTabLink } from './hooks/useTabLink'
import { Descriptions, Image, Space, Steps, Table, Tag, Tooltip, Tree } from '@linkseeks/ui'
import { CardWrapper, SubTitleWrapper } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import DetailLayoutWrapper from './components/DetailLayoutWrapper'
import DetailItemWrapper from './components/DetailItemWrapper'
import { useEffect, useMemo, useState } from 'react'
import { usePageStatus } from '../hooks'
import { getManageContentNoticePage } from '@apps/apis'
import {
  GetProductCommodityGetCommodityResponse,
  getProductCommodityGetCommodity,
  getProductCommodityPlatformGetCommodityCheckRecord,
  getLogisticsSelectListFreightTemplate,
  getLogisticsFreightTemplateGet,
} from '@apps/apis'
import {
  COMMDITY_TYPE_TEXTS,
  DELIVERY_TYPE_TEXTS,
  FREIGHT_TYPE_TEXTS,
  PRICE_TYPE_TEXTS,
  CATEGORY_ATTR_NAME_TEXT_PREFIX,
  SPECS_ATTR_NAME_TEXT_PREFIX,
  PRICE_TYPE_ENUM,
  COMMODITY_CATEGORY_TYPE_MAPS,
} from './constants'
import { detailTransform } from './transformer/detail'
import ProductPreviewBlock from './components/productPreviewBlock'
import { useRequestApi } from '@linkseeks/hooks'
import moment from 'moment'
import { PriceDataModal } from './models/PriceDispatch'
import { EyeFillIcon } from '@linkseeks/icons'
import { SpecsDetailTable } from './components'

export const renderPrice = (priceDataModal: PriceDataModal, priceType: PRICE_TYPE_ENUM) => {
  if (!priceDataModal) {
    return ''
  }
  if (priceDataModal.isStep) {
    // 是阶梯价
    const stepPrice = priceDataModal.outputStepPrice()
    if (stepPrice) {
      const stepPriceList: {
        numberMin: string
        numberMax: string
        price: number
      }[] = []
      for (const stepKey of Object.keys(stepPrice)) {
        const [numberMin, numberMax] = stepKey.split('-')
        stepPriceList.push({
          numberMin,
          numberMax,
          price: Number(stepPrice[stepKey]),
        })
      }
      const sortStepPriceList = stepPriceList.sort((a, b) => (a.price > b.price ? 1 : -1))

      return sortStepPriceList.map((stepItem) => {
        return (
          <p key={`${stepItem.numberMin}-${stepItem.numberMax}`}>
            {stepItem.numberMin} - {stepItem.numberMax}: ￥ {stepItem.price}
          </p>
        )
      })
    }
  } else {
    if (priceDataModal?.getPriceWithCurrency) {
      return priceDataModal?.getPriceWithCurrency(priceType)
    }
    return ''
  }
}

// 副单位价格
export const renderSubPrice = (priceRate: number, record: any, priceType: PRICE_TYPE_ENUM) => {
  if (!priceRate) {
    return ''
  }
  const priceDataModal: PriceDataModal = record.unitPrice
  if (priceDataModal.isStep) {
    const stepSubPrice = priceDataModal.outputStepSubPrice()
    return Object.keys(stepSubPrice).map((stepKey) => {
      const [numberMin, numberMax] = stepKey.split('-')
      return (
        <p key={stepKey}>
          {numberMin} - {numberMax}: ￥ {stepSubPrice[stepKey]}
        </p>
      )
    })
  } else {
    return priceDataModal?.getSubPriceWithCurrency(priceType)
  }
}

const renderProductAttr = (attrs: any) => {
  if (attrs) {
    return (
      <DetailLayoutWrapper title="" isPadding={false}>
        {Object.keys(attrs).map((key) => {
          const [attrKey, attrKeyName] = key.split('-')
          if (attrKeyName) {
            return (
              <DetailItemWrapper key={attrKeyName} label={attrKeyName}>
                {attrs[key].join(',')}
              </DetailItemWrapper>
            )
          } else {
            return (
              <DetailItemWrapper key={key} label={key}>
                {attrs[key].join(',')}
              </DetailItemWrapper>
            )
          }
        })}
      </DetailLayoutWrapper>
    )
  } else {
    return null
  }
}

const ProductDetailWrapper = ({ buttonExtra }: { buttonExtra?: any }) => {
  const { tabItems } = useTabLink()
  const translate = useWebIntl()
  const { id } = usePageStatus()
  const [productData, setProductData] = useState<GetProductCommodityGetCommodityResponse>(null as any)
  const { data: checkRecord } = useRequestApi(getProductCommodityPlatformGetCommodityCheckRecord, {
    defaultParams: [{ commodityId: id }],
  })

  // 运费模板列表
  const { data: freightTemplateList } = useRequestApi(getLogisticsSelectListFreightTemplate)
  const [freightTemplateName, setFreightTemplateName] = useState('')
  useEffect(() => {
    if (id) {
      getProductCommodityGetCommodity({ id }).then((res) => {
        if (res.code === 1000) {
          const data = detailTransform(res.data)
          setProductData(data as any)
        }
      })
    }
  }, [id])

  const getFreightTemplatById = (id: number) => {
    getLogisticsFreightTemplateGet({ id: String(id) }).then((res) => {
      if (res.code === 1000 && res.data) {
        setFreightTemplateName(res.data?.name)
      }
    })
  }

  useEffect(() => {
    if (productData?.logistics.useTemplate) {
      getFreightTemplatById(productData?.logistics.templateId)
    }
  }, [productData, freightTemplateList])

  const checkRecordColumns = [
    {
      title: translate('web.resource.commodity.liuzhuanxuhao'),
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: translate('web.common.controlRole'),
      key: 'memberRoleName',
      dataIndex: 'memberRoleName',
    },
    {
      title: translate('web.common.control'),
      key: 'operationName',
      dataIndex: 'operationName',
    },
    {
      title: translate('web.common.status'),
      key: 'statusName',
      dataIndex: 'statusName',
    },
    {
      title: translate('web.common.controlTime'),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (value) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: translate('web.common.shenheyijian'),
      key: 'checkRemark',
      dataIndex: 'checkRemark',
    },
  ]

  const getAreaName = (node: any) => {
    const name = node.name

    if (node.children) {
      return name + getAreaName(node.children)
    }

    return name
  }
  const getFreightTemplateLabel = (useTemplate) => {
    return useTemplate
      ? translate('web.resource.commodity.yunfeimuban')
      : translate('web.resource.commodity.shifoushiyongyunfeimuban')
  }
  useEffect(() => {
    getManageContentNoticePage({ current: '1', pageSize: '10', columnType: '7', status: '2' }).then(
      ({ data: { data } }) => {
        setRyxy(
          data.map((item) => {
            return { label: item.title, value: item.id }
          }),
        )
      },
    )
  }, [])
  const [rylx] = useState([
    { label: '非认养', value: 0 },
    { label: '第三方溯源', value: 1 },
    { label: '平台溯源', value: 2 },
  ])
  const [ryxy, setRyxy] = useState([])
  return (
    <PageHeaderWrapper backDom items={tabItems} loading={!productData} extra={buttonExtra}>
      <DetailLayoutWrapper id="1" title={translate('web.common.jibenxinxi')}>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinzhutu')}>
          <Image src={productData?.mainPic} width={64} />
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.name')}>{productData?.name}</DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.pinleileixing')}>
          {productData?.customerCategoryType}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinpinlei')}>
          {productData?.customerCategoryFullName}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinbiaoyu')}>
          {productData?.slogan}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinpinpai')}>
          {productData?.brandName}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinmaidian')}>
          {productData?.sellingPoint?.join(',')}
        </DetailItemWrapper>
        {productData?.salesAreaList && (
          <DetailItemWrapper label={translate('web.resource.commodity.xiaoshouquyu')}>
            <Space>
              <Tooltip
                color="#00957e"
                title={
                  <>
                    <h6 style={{ color: '#fff', marginBottom: 16 }}>
                      【{productData?.salesAreaTemplate?.limitWayName}】
                    </h6>
                    <Tree
                      treeData={productData?.salesAreaList as any}
                      fieldNames={{ key: 'id', children: 'children', title: 'name' }}
                      style={{ height: '300px', overflow: 'auto' }}
                      defaultExpandAll
                      selectable={false}
                    ></Tree>
                    {/* {productData?.salesAreaList.map((v) => getAreaName(v)).join(',')} */}
                  </>
                }
              >
                <Tag
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  type="secondPrimary"
                  icon={<EyeFillIcon size={14}></EyeFillIcon>}
                >
                  {productData?.salesAreaTemplate?.name}
                </Tag>
              </Tooltip>
            </Space>
          </DetailItemWrapper>
        )}
        <DetailItemWrapper label={translate('web.resource.commodity.shangpinbianma')}>
          {productData?.code}
        </DetailItemWrapper>
        <DetailItemWrapper span={1} label={translate('web.resource.commodity.yishangjiashancheng')}>
          <Space wrap>
            {productData?.commodityShopList?.map((v) => (
              <Tag key={v.shopId}>{v.name}</Tag>
            ))}
          </Space>
        </DetailItemWrapper>
      </DetailLayoutWrapper>

      <DetailLayoutWrapper id="2" title={translate('web.resource.commodity.shanpinshezhi')}>
        <DetailItemWrapper label={translate('web.resource.commodity.jiliangdanwei')}>
          {productData?.unitName}
        </DetailItemWrapper>
        {productData?.subUnitName && (
          <DetailItemWrapper label={translate('web.resource.commodity.jiliangfudanwei')}>
            {productData?.subUnitName}
          </DetailItemWrapper>
        )}

        <DetailItemWrapper label={translate('web.resource.commodity.zuixiaoqiding')}>
          {productData?.minOrder}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpinleixing')}>
          {COMMDITY_TYPE_TEXTS[productData?.type]}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.kuajingdianshan')}>
          {productData?.isCrossBorder ? translate('web.common.shi') : translate('web.common.fou')}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.shanpindingjia')}>
          {PRICE_TYPE_TEXTS[productData?.priceType]}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.payment.huiyuanzhekou')}>
          {productData?.isMemberPrice ? translate('web.common.shi') : translate('web.common.fou')}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.payment.shuilv')}>
          {productData?.taxRate + '%'}
        </DetailItemWrapper>
        <DetailItemWrapper label="认领类型">
          {rylx.find((item) => item.value == productData?.adoptionType)?.label}
        </DetailItemWrapper>
        <DetailItemWrapper label="认养合作方">{productData?.adoptionPartner}</DetailItemWrapper>
        <DetailItemWrapper label="我的权益链接">{productData?.adoptionTraceUrl}</DetailItemWrapper>
        <DetailItemWrapper label="认养证书图片">
          {productData?.adoptionCertificatePic && <Image src={productData?.adoptionCertificatePic} width={64} />}
        </DetailItemWrapper>
        <DetailItemWrapper label="认养协议">
          {ryxy.find((item) => item.value == productData?.adoptionAgreementId)?.label}
        </DetailItemWrapper>
      </DetailLayoutWrapper>

      <CardWrapper id="3" title={translate('web.resource.commodity.shanpinshuxing')}>
        <SubTitleWrapper title={translate('web.resource.commodity.leimushuxing')}>
          {renderProductAttr(productData?.[CATEGORY_ATTR_NAME_TEXT_PREFIX])}
        </SubTitleWrapper>

        <SubTitleWrapper title={translate('web.resource.commodity.guigeshuxing')}>
          {productData && renderProductAttr(productData[SPECS_ATTR_NAME_TEXT_PREFIX])}
        </SubTitleWrapper>
      </CardWrapper>

      <CardWrapper id="4" title={translate('web.resource.commodity.guigeshezhi')}>
        <SpecsDetailTable productData={productData} />
      </CardWrapper>

      <CardWrapper id="5" title={translate('web.resource.commodity.shanpinxiangqing')}>
        {productData?.commodityRemarkList && <ProductPreviewBlock contentArea={productData?.commodityRemarkList} />}
      </CardWrapper>

      <DetailLayoutWrapper id="6" title={translate('web.resource.logistics.wuliuxinxi')}>
        {productData?.sendCycle && (
          <DetailItemWrapper label={translate('web.resource.commodity.fahuozhouqi')}>
            {translate('web.resource.commodity.xiadanhou') +
              productData?.sendCycle +
              translate('web.resource.commodity.fahuo')}
          </DetailItemWrapper>
        )}

        <DetailItemWrapper label={translate('web.resource.logistics.peisongfangshi')}>
          {DELIVERY_TYPE_TEXTS[productData?.logistics.deliveryType]}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.yunfeifangshi')}>
          {FREIGHT_TYPE_TEXTS[productData?.logistics.carriageType]}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.zhongliang')}>
          {productData?.logistics.weight}
        </DetailItemWrapper>
        <DetailItemWrapper label={getFreightTemplateLabel(productData?.logistics.useTemplate)}>
          {productData?.logistics.useTemplate ? freightTemplateName : translate('web.common.fou')}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.fahuo_zitidizhi')}>
          {productData?.logistics.sendAddress}
        </DetailItemWrapper>
      </DetailLayoutWrapper>

      <DetailLayoutWrapper id="7" title={translate('web.common.qitaxinxi')}>
        <DetailItemWrapper label={translate('web.resource.commodity.maitou')}>{productData?.marks}</DetailItemWrapper>

        <DetailItemWrapper label={translate('web.resource.commodity.shouhoufuwu')}>
          {productData?.afterService}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.baozhuangqingdan')}>
          {productData?.packing}
        </DetailItemWrapper>
      </DetailLayoutWrapper>

      <DetailLayoutWrapper id="8" title={translate('web.resource.commodity.seoyouhua')}>
        <DetailItemWrapper label={translate('web.common.title')}>{productData?.title}</DetailItemWrapper>

        <DetailItemWrapper label={translate('web.resource.commodity.miaoshu')}>
          {productData?.description}
        </DetailItemWrapper>
        <DetailItemWrapper label={translate('web.resource.commodity.guanjianci')}>
          {productData?.keywords}
        </DetailItemWrapper>
      </DetailLayoutWrapper>

      <CardWrapper id="9" title={translate('web.common.liuzhuangjindu')}>
        <Steps progressDot current={Number(productData?.status) - 1}>
          <Steps.Step
            title={translate('web.resource.commodity.tijiaoshenhe')}
            description={translate('web.resource.member.gongyingshang')}
          />
          <Steps.Step
            title={translate('web.common.approved')}
            description={translate('web.resource.member.gongyingshang')}
          />
          <Steps.Step title={translate('web.resource.commodity.wancheng')} />
        </Steps>
      </CardWrapper>

      <CardWrapper id="10" title={translate('web.common.shenhelishi')}>
        {checkRecord && <Table columns={checkRecordColumns} dataSource={checkRecord} rowKey="id" />}
      </CardWrapper>
    </PageHeaderWrapper>
  )
}

export default ProductDetailWrapper
