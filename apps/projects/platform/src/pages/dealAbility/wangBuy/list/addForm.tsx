import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { Form, Button, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import BasicInfoLatyout from './components/basicInfo'
import InquiryProductLayout from './components/inquiryProduct'
import TradeTermsLayout from './components/tradeTerms'
import { SaveOutlined } from '@ant-design/icons'
import AttachLayout from './components/attach'
import { getTradeAskPurchaseDetail } from '@apps/apis'
import DemandWarp from './components/demandWarp'
import { usePrompt } from '@linkseeks/router-core'
import { useWebIntl } from '@apps/locales'
import { PageHeaderWrapper } from '@apps/components'

const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

interface AddedFormLayoutProps {
  /** 商城id */
  shopId?: string | string[]
  /** 是否编辑 */
  isEdit?: boolean
  /** id */
  id?: string | string[]
  /** 提交的接口 */
  fetchRequest?: () => Promise<unknown>
  /** 本地缓存的名称 */
  spam?: string | string[]
  /** 标题 */
  title?: string
  /** 二次询价 */
  two?: boolean
  /** 商城来询价 */
  rfq?: boolean
}

const fnResetMemberRequests = (rowCol) => {
  const mapList = rowCol.map((item) => {
    return {
      ...item,
      memberId: item.memberId,
      memberRoleId: item.roleId,
      memberName: item.name,
      memberType: item.memberTypeName,
      memberRoleName: item.roleName,
      memberGrade: item.levelTag,
    }
  })
  return mapList
}

const AddedFormLayout: React.FC<AddedFormLayoutProps> = (props: any) => {
  const { isEdit, id, fetchRequest, title, two, shopId, rfq } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [fullAddress, setFullAddress] = useState<any>({})
  const [dataMessage, setDataMessage] = useState<any>({})
  const [enclosureUrls, setEnclosureUrls] = useState<any[]>([])
  const [otherMessage, setOtherMessage] = useState<any>({})
  const translate = useWebIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const handleSubmit = () => {
    setLoading(true)
    form
      .validateFields()
      .then((res) => {
        const params: any = {
          id: id ? id : '', // id为空：新增,id不为空：修改
          name: res.name, // 需求单摘要
          askPurchaseGoodsRequests: res.askPurchaseGoodsRequests, // 求购物料 ,AskPurchaseGoodsRequest
          publishType: res.type, // 发布类型,1:商城,2:指定会员,@seeAskPurchasePublishTypeEnum
          askPurchaseShopRequests: res.type === 1 ? res.shopIds : [], // 发布商城
          askPurchaseMemberRequests: res.type === 2 ? fnResetMemberRequests(res.rowCol) : [], // 指定的会员
          deliverTime: moment(res.deliveryTime).format('YYYY-MM-DD HH:mm:ss'), // 交付时间
          quoteEndTime: moment(res.quotationAsTime).format('YYYY-MM-DD HH:mm:ss'), // 报价截止时间
          deliverAddress: fullAddress.fullAddress, // 交付地址
          deliverAddressId: fullAddress.fullAddressId, // 交付地址id
          deliverAddrProvinceCode: fullAddress.deliverAddrProvinceCode,
          deliverAddrCityCode: fullAddress.deliverAddrCityCode,
          deliverAddrDistrictCode: fullAddress.deliverAddrDistrictCode,
          contactUserId: otherMessage.userId, // 联系人Id
          contactName: res.contactName, // 联系人名称
          contactCountryCode: res.phoneCode, // 联系人国家代码,eg.中国+86
          contactMobile: res.contactPhone, // 联系人手机号码
          quoteRequire: res.offer, // 报价要求
          paymentWay: res.paymentType, // 付款方式
          taxesRequire: res.taxes, // 税费要求
          logisticsRequire: res.logistics, // 物流要求
          packageRequire: res.packRequire, // 包装要求
          otherRequire: res.otherRequire, // 其他要求
          enclosureUrls: res.enclosureUrls, // 附件链接集合 ,EnclosureUrlsRequest
        }
        // if (id && !two) {
        //   params.id = id
        // }
        fetchRequest({ ...params })
          .then((res) => {
            if (res.code !== 1000) {
              setLoading(false)
              return
            }
            setUnsaved(false)
            setLoading(false)
            if (two || rfq) {
              history.push(`/dealAbility/productInquiry/waitAddInquiry`)
              return
            }
            setTimeout(() => {
              history.goBack()
            }, 200)
          })
          .catch((_error) => {
            setLoading(false)
          })
      })
      .catch((_error) => {
        setLoading(false)
      })
  }

  const getFullAddress = (info) => {
    const address = {
      fullAddress: `${info.name ? info.name : ''} ${info.fullAddress ? info.fullAddress : ''} `,
      fullAddressId: info.id,
      deliverAddrProvinceCode: info.provinceCode,
      deliverAddrCityCode: info.cityCode,
      deliverAddrDistrictCode: info.districtCode,
    }
    setFullAddress(address)
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

  const getContacts = (value) => {
    form.setFieldsValue({
      userId: value.userId,
      contactName: value.name,
      contactPhone: value.phone,
      phoneCode: value.phoneCode || '+86',
    })
    const descOther = { ...otherMessage, userId: value.userId }
    setOtherMessage(descOther)
  }
  /** 修改求购 */
  const handleInquiry = () => {
    if (!id) {
      return
    }

    getTradeAskPurchaseDetail({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      setEnclosureUrls(data.enclosureUrls)
      setDataMessage(data)
      form.setFieldsValue({
        name: data.name,
        deliverAddress: {
          id: data.deliverAddressId,
        },
        askPurchaseGoodsRequests: data.askPurchaseGoodsResponses,
        paymentType: data.paymentWay,
        offer: data.quoteRequire,
        taxes: data.taxesRequire,
        logistics: data.logisticsRequire,
        packRequire: data.packageRequire,
        otherRequire: data.otherRequire,
        deliveryTime: moment(data.deliverTime),
        quotationAsTime: moment(data.quoteEndTime),
        type: data.publishType,
        shopIds: data.askPurchaseShopResponses || [],
      })
    })
  }

  useEffect(() => {
    handleInquiry()
  }, [isEdit])

  return (
    <Fragment>
      <PageHeaderWrapper
        title={title}
        items={[
          { key: 'basicInfoLayout', label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }) },
          {
            key: 'inquiryProductLayout',
            label: translate('web.resource.deal.xunyuanwuliao'),
          },
          {
            key: 'tradeTermsLayout',
            label: intl.formatMessage({ id: 'dealAbility.jiaoyitiaojian' }),
          },
          { key: 'attachLayout', label: intl.formatMessage({ id: 'dealAbility.fujian' }) },
          { key: 'publiceType', label: translate('web.resource.deal.xuqiuduijie') },
        ]}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'dealAbility.baocun' })}
          </Button>
        }
      >
        <Form
          {...layout}
          colon={false}
          form={form}
          onValuesChange={(changeValue, values) => {
            if (!unsaved) {
              setUnsaved(true)
            }
            if ('phoneCode' in changeValue) {
              form.setFieldsValue({ contactPhone: null })
            }
          }}
        >
          <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
            <BasicInfoLatyout />
            <InquiryProductLayout form={form} dataMessage={dataMessage} />
            <TradeTermsLayout
              isEdit={isEdit}
              getFullAddress={getFullAddress}
              getContacts={getContacts}
              fullAddress={fullAddress}
            />
            <AttachLayout
              enclosureUrls={enclosureUrls}
              getEnclosureUrls={getEnclosureUrls}
              removeEnclosureUrls={removeEnclosureUrls}
            />
            <DemandWarp
              form={form}
              shopList={dataMessage.askPurchaseShopResponses}
              askPurchaseMemberResponses={dataMessage.askPurchaseMemberResponses}
            />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Fragment>
  )
}

export default AddedFormLayout
