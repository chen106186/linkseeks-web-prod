import React, { useState, useEffect, useMemo } from 'react'
import { Form, Button, Space } from 'antd'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/components/DetailLayout/components/context'
import BasicInfoLayout from './components/basicInfo'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import ProductQuoteLayout, { fetchPublishedShopById } from './components/productQuote'
import OtherExplainLayout from './components/otherExplain'
import AttachLayout from './components/attach'
import { SaveOutlined } from '@ant-design/icons'
import { getTradeAskPurchaseQuoteAskPurchaseDetail, getTradeAskPurchaseAskPurchaseQuoteDetail } from '@apps/apis'
import AuditProcess from '@/components/AuditProcess'
import { usePrompt, useQuery } from '@linkseeks/router-core'
import moment from 'moment'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}
interface AddedFormLayoutProps {
  /** 是否编辑 */
  isEdit?: boolean
  /** 提交的接口 */
  fetchRequest?: () => Promise<unknown>
  /** 本地缓存的名称 */
  spam?: string | boolean
  /** 标题 */
  title?: string
  quoteId?: number
}

const AddedFormLayout: React.FC<AddedFormLayoutProps> = (props: any) => {
  const { fetchRequest, quoteId, title } = props
  const [form] = Form.useForm()
  const { id } = useQuery()
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState({})
  const [productQuote, setProductQuote] = useState([])
  const [enclosureUrls, setEnclosureUrls] = useState<any[]>([])
  const [currency, setCurrency] = useState<any>({})
  const [purchaseDetail, setPurchaseDetail] = useState<any>({})
  const [quoteGoods, setQuoteGoods] = useState<any[]>([])
  const translate = useWebIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  // 各方要求，新增时写死。
  const tasks = [
    {
      taskStep: 1,
      taskName: translate('web.resource.order.addOfferTasksStep1'),
      roleName: translate('web.common.admin'),
      properties: {},
    },
    {
      taskStep: 2,
      taskName: translate('web.resource.order.addOfferTasksStep2'),
      roleName: translate('web.common.admin'),
      properties: {},
    },
    {
      taskStep: 3,
      taskName: translate('web.resource.order.addOfferTasksStep3'),
      roleName: translate('web.common.admin'),
      properties: {},
    },
    {
      taskStep: 4,
      taskName: translate('web.resource.order.addOfferTasksStep4'),
      roleName: translate('web.common.admin'),
      properties: {},
    },
  ]

  const fnInitMessage = (data) => {
    form.setFieldsValue({
      name: data.name, // 报价单摘要
      contactName: data.contactName, // 联系人姓名
      contactCountryCode: data.contactCountryCode, // 联系人电话
      contactMobile: data.contactMobile, // 联系人电话
      currencyName: data.currencyName, // 币种
      enclosureUrls: data.enclosureUrls, // 附件
      deliverRemark: data.deliverRemark, // 交付说明
      paymentRemark: data.paymentRemark, //  付款说明
      taxesRemark: data.taxesRemark, // 税费说明
      logisticsRemark: data.logisticsRemark, // 物流说明
      packageRemark: data.packageRemark, // 包装说明
      otherRemark: data.otherRemark, // 其他说明
      currencyId: data.currencyName, // 币种id
    })
    const obj = {
      label: data.currencyName,
      value: data.currencyId,
    }

    setCurrency(obj)
    setEnclosureUrls(data.enclosureUrls)
  }

  const finInitQuoteGoods = async (list: any[]) => {
    const result: any[] = []
    for (const item of list) {
      const shopList = await fetchPublishedShopById(item.commodityId)
      result.push({
        ...item,
        publishedShops: shopList,
      })
    }
    setQuoteGoods(result)
  }

  useEffect(() => {
    if (id) {
      getTradeAskPurchaseQuoteAskPurchaseDetail({ askPurchaseId: id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setPurchaseDetail(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    } else if (quoteId) {
      getTradeAskPurchaseAskPurchaseQuoteDetail({ id: quoteId })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setPurchaseDetail(res.data)
          fnInitMessage(res.data)
          finInitQuoteGoods(res.data.askPurchaseQuoteGoodsResponses)
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  const fnGetssss = () => {
    const desc = productQuote.map((item: any) => {
      return {
        goodsId: item.goodsId || 1, // 物料id
        goodsNo: item.goodsNo, // 物料编号
        goodsName: item.goodsName, // 物料名称
        specification: item.specification, // 规格
        categoryId: item.categoryId || 1, // 品类id
        categoryName: item.categoryName, // 品类名称
        brandId: item.brandId || 1, // 品牌id
        brandName: item.brandName, // 品牌名称
        shopId: item.shopId, // 商城id
        shopName: item.shopName, // 商城名称
        unit: item.unit, // 单位
        num: item.num, // 求购数量
        commodityId: item.commodityId, // 关联商品id
        skuId: item.skuId, // 关联商品skuId
        commodityName: item.commodityName, // 关联商品名称
        includeTax: item.includeTax, // 是否含税,0:不含税,1:含税
        taxRate: item.taxRate, // 税率,eg.10,标识含10%的税率
        unitPriceWithTax: item.unitPriceWithTax, // 含税单价
        unitPriceWithoutTax: item.unitPriceWithoutTax, // 不含税单价
        totalPriceWithTax: item.totalPriceWithTax, // 含税金额
        totalPriceWithoutTax: item.totalPriceWithoutTax, // 不含税金额
        quoteStartTime: item.quoteStartTime, // 报价有效开始时间
        quoteEndTime: item.quoteEndTime, // 报价有效结束时间
      }
    })
    return desc
  }

  const handleSubmit = () => {
    const obj = form.getFieldsValue()
    setLoading(true)
    form
      .validateFields()
      .then((res) => {
        const params: any = {
          id: quoteId || '',
          askPurchaseId: quoteId ? purchaseDetail.askPurchaseId : purchaseDetail.id,
          askPurchaseNo: purchaseDetail.askPurchaseNo,
          name: res.name, // 报价单摘要
          contactCountryCode: res.contactCountryCode, // 联系人国家代码,eg.中国+86
          contactMobile: res.contactMobile, // 联系人号码
          contactName: res.contactName, // 联系人名字
          currencyId: currency.value, // 币种id
          currencyName: currency.label, // 币种名称
          enclosureUrls: res.enclosureUrls, // 附件链接集合
          deliverRemark: res.deliverRemark, // 交付说明
          paymentRemark: res.paymentRemark, // 付款说明
          taxesRemark: res.taxesRemark, // 税费说明
          logisticsRemark: res.logisticsRemark, // 物流说明
          packageRemark: res.packageRemark, // 包装说明
          otherRemark: res.otherRemark, // 其他说明
          inquiryListProductRequests: fnGetssss(),
          askPurchaseQuoteGoodsRequests: fnGetssss(),
        }
        fetchRequest({ ...params })
          .then((res) => {
            // 枷锁防止爆破
            setTimeout(() => {
              setLoading(false)
            }, 500)
            if (res.code === 1000) {
              setUnsaved(false)
              setTimeout(() => {
                history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer`)
              }, 200)
            }
          })
          .catch((_error) => {
            setLoading(false)
          })
      })
      .catch((_error) => {
        console.log(_error, '_error')
        setLoading(false)
      })
  }

  const getEnclosureUrls = (data) => {
    const result = enclosureUrls && enclosureUrls.length > 0 ? [...enclosureUrls, ...data] : data
    setEnclosureUrls(result)
    form.setFieldsValue({
      enclosureUrls: result,
    })
  }

  const removeEnclosureUrls = (index) => {
    const files = [...enclosureUrls]
    files.splice(index, 1)
    setEnclosureUrls(files)
    form.setFieldsValue({
      enclosureUrls: files,
    })
  }

  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }

  const basicEffcect = useMemo(() => {
    if (purchaseDetail) {
      return [
        {
          col: [
            {
              label: translate('web.resource.deal.duiyingxuqiudanhao'),
              extra: (
                <Link to={`/dealAbility/wangBuyOffer/list/detail?id=${purchaseDetail.id}`}>
                  {purchaseDetail.askPurchaseNo}
                </Link>
              ),
            },
            {
              label: translate('web.resource.deal.gongyingshangmingcheng'),
              extra: purchaseDetail.memberName,
            },
          ],
        },
        {
          col: [
            {
              label: translate('web.resource.mall.baojiajiezhishijian'),
              extra: purchaseDetail.quoteEndTime ? format(purchaseDetail.quoteEndTime) : '',
            },
            {
              label: translate('web.resource.member.danjushijian'),
              extra: purchaseDetail.billTime ? format(purchaseDetail.billTime) : '',
            },
          ],
        },
      ]
    }
    return []
  }, [purchaseDetail])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        title={title}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'dealAbility.baocun' })}
          </Button>
        }
        items={[
          {
            key: 'progressOfFlow',
            label: intl.formatMessage({ id: 'dealAbility.liuzhuanjilu' }),
          },
          {
            key: 'sourceInfo',
            label: translate('web.resource.deal.xuqiudanxinxi'),
          },
          {
            key: 'basicInfoLayout',
            label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }),
          },
          {
            key: 'productQuoteLayout',
            label: intl.formatMessage({ id: 'dealAbility.baojia' }),
          },
          {
            key: 'otherExplainLayout',
            label: intl.formatMessage({ id: 'dealAbility.qitashuoming' }),
          },
          {
            key: 'attachLayout',
            label: intl.formatMessage({ id: 'dealAbility.fujian' }),
          },
        ]}
      >
        <Form
          {...layout}
          colon={false}
          form={form}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <Space direction="vertical" style={{ display: 'flex', width: '100%' }} size={16}>
            <AuditProcess
              id="progressOfFlow"
              customTitleKey="taskName"
              customKey="taskStep"
              initRadioValue={'inner'}
              innerVerifyCurrent={0}
              innerVerifySteps={tasks}
            />
            <BasicLayout
              id="sourceInfo"
              title={translate('web.resource.deal.xuqiudanxinxi')}
              effect={basicEffcect}
              span={12}
            />
            <BasicInfoLayout purchaseDetail={purchaseDetail} form={form} setCurrency={setCurrency} />
            <ProductQuoteLayout
              productQuote={quoteId ? quoteGoods : purchaseDetail.askPurchaseGoodsResponses}
              form={form}
              setProductQuote={setProductQuote}
            />
            <OtherExplainLayout form={form} />
            <AttachLayout
              enclosureUrls={enclosureUrls}
              getEnclosureUrls={getEnclosureUrls}
              removeEnclosureUrls={removeEnclosureUrls}
            />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}
export default AddedFormLayout
