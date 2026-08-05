import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { Form, Button, message, Space } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { PageHeaderWrapper } from '@apps/components'
import BasicInfoLatyout from './components/basicInfo'
import InquiryProductLayout from './components/inquiryProduct'
import TradeTermsLayout from './components/tradeTerms'
import { SaveOutlined } from '@ant-design/icons'
import AttachLayout from './components/attach'
import { getCookie } from '@/utils/cookie'
import { getOrderCacheGet } from '@apps/apis'
import { getTradeInquiryGetUpperMemberCommodity, getTradeInquiryListDetails } from '@apps/apis'
const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

interface AddedFormLayoutProps {
  /** 商城id */
  shopId?: number
  /** 是否编辑 */
  isEdit?: boolean
  /** id */
  id?: number
  /** 提交的接口 */
  fetchRequest?: () => Promise<unknown>
  /** 本地缓存的名称 */
  spam?: string
  /** 标题 */
  title?: string
  /** 二次询价 */
  two?: boolean
  /** 商城来询价 */
  rfq?: boolean
  /** 二次询价地址显示 */
  isDefault?: boolean
}

const AddedFormLayout: React.FC<AddedFormLayoutProps> = (props: any) => {
  const { isEdit, id, fetchRequest, spam, title, two, shopId, rfq, isDefault } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [memberInfo, setMenberInfo] = useState<any>({})
  const [fullAddress, setFullAddress] = useState<any>({})
  const [inquiryProduct, setInquiryProduct] = useState<any[]>([])
  const [enclosureUrls, setEnclosureUrls] = useState<any[]>([])

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'dealAbility.ninhaiyouweibaocundenei' }) })

  const handleSubmit = () => {
    setLoading(true)
    form
      .validateFields()
      .then((res) => {
        const params: any = {
          details: res.details,
          deliveryTime: res.deliveryTime && moment(res.deliveryTime).format('x'),
          quotationAsTime: res.quotationAsTime && moment(res.quotationAsTime).format('x'),
          memberName: res.memberName,
          memberId: memberInfo.memberId,
          memberRoleId: memberInfo.roleId,
          memberRoleName: memberInfo.roleName,
          fullAddress: fullAddress.fullAddress,
          fullAddressId: fullAddress.fullAddressId,
          offer: res.offer,
          paymentType: res.paymentType,
          taxes: res.taxes,
          logistics: res.logistics,
          packRequire: res.packRequire,
          otherRequire: res.otherRequire,
          enclosureUrls: res.enclosureUrls,
          inquiryListProductRequests: res.inquiryListProductRequests,
          contactName: res.contactName,
          contactPhone: res.contactPhone,
          phoneCode: res.phoneCode,
          shopId: res.shopId,
        }
        if (id && !two) {
          params.id = id
        }
        fetchRequest({ ...params })
          .then((res) => {
            if (res.code !== 1000) {
              setLoading(false)
              return
            }
            setUnsaved(false)
            setLoading(false)
            setTimeout(() => {
              if (two || rfq) {
                history.push(`/dealAbility/productInquiry/waitAddInquiry`)
                return
              }
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

  const getMemberInfo = (value) => {
    form.setFieldsValue({ memberName: value.name, shopId: undefined })
    setMenberInfo(value)
    setInquiryProduct([])
    form.setFieldsValue({
      inquiryListProductRequests: [],
    })
  }

  const getInquiryProduct = (data) => {
    setInquiryProduct(data)
    form.setFieldsValue({
      inquiryListProductRequests: data.map((item) => ({
        ...item,
        logistics: {
          ...item?.logistics,
          sendAddress: item?.logistics?.sendAddressId,
        },
      })),
    })
  }

  const getFullAddress = (info) => {
    const address = {
      fullAddress: `${info.name} ${info.fullAddress} ${info.phone}`,
      fullAddressId: info.id,
    }
    setFullAddress(address)
  }

  const getEnclosureUrls = (data) => {
    setEnclosureUrls(data)
    form.setFieldsValue({
      enclosureUrls: data,
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

  const getCacheOrderInfoByKey = (key: string) => {
    return new Promise((resolve) => {
      getOrderCacheGet({ key })
        .then((res) => {
          message.destroy()
          if (res.data) {
            resolve(JSON.parse(res.data))
          } else {
            resolve(undefined)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  const getContacts = (value) => {
    form.setFieldsValue({
      contactName: value.name,
      contactPhone: value.phone,
      phoneCode: value.phoneCode || 86,
    })
  }

  /** B端跳来询价 */
  const handleB2B = async () => {
    const data: any = await getCacheOrderInfoByKey(spam)
    console.log(data, 10086)
    if (!data) return
    const inquiryListProductRequests: any[] = []
    inquiryListProductRequests.push({
      commodityId: id,
      productId: data.id,
      imgUrl: data.imgUrl,
      productName: data.name,
      category: data.category,
      brand: data.brandName,
      unit: data.unitName,
      purchaseCount: 1,
      logistics: data.logistics,
      memberId: data.memberId,
      memberRoleId: data.memberRoleId,
      taxRate: data.taxRate,
      upperMemberId: data.upperMemberId,
      upperMemberName: data.upperMemberName,
      upperMemberRoleId: data.upperMemberRoleId,
      upperMemberRoleName: data.upperMemberRoleName,
    })
    setMenberInfo({
      memberId: data.memberId,
      roleId: data.memberRoleId,
      roleName: data.memberName,
    })
    form.setFieldsValue({
      ...data,
      shopId: Number(shopId),
      logistics: '',
      inquiryListProductRequests: inquiryListProductRequests,
    })
    setInquiryProduct(inquiryListProductRequests)
  }
  /** 二次询价 */
  const handleInquiry = async () => {
    await getTradeInquiryListDetails({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      const inquiryListProductRequests: any[] = []
      setEnclosureUrls(data.enclosureUrls)
      setFullAddress({
        fullAddress: data.fullAddress,
        fullAddressId: data.fullAddressId,
      })
      if (two) {
        getTradeInquiryGetUpperMemberCommodity({ inquiryId: id }).then((res) => {
          if (res.code !== 1000) {
            return
          }
          res.data.commodityList.forEach((item: any) => {
            inquiryListProductRequests.push({
              commodityId: item.commodityId,
              productId: item.id,
              imgUrl: item.mainPic,
              productName: item.name,
              category: item.customerCategoryName,
              brand: item.brandName,
              unit: item.unitName,
              purchaseCount: item.purchaseCount,
              logistics: item.logistics || {},
              memberId: item.memberId,
              memberRoleId: item.memberRoleId,
              taxRate: item.taxRate,
              upperMemberId: item.upperMemberId,
              upperMemberName: item.upperMemberName,
              upperMemberRoleId: item.upperMemberRoleId,
              upperMemberRoleName: item.upperMemberRoleName,
            })
          })

          setMenberInfo({
            memberId: res.data.memberId,
            roleId: res.data.memberRoleId,
            roleName: res.data.memberRoleName,
          })
          setInquiryProduct(inquiryListProductRequests)

          form.setFieldsValue({
            ...data,
            deliveryTime: moment(data.deliveryTime),
            quotationAsTime: moment(data.quotationAsTime),
            inquiryListProductRequests: inquiryListProductRequests,
            enclosureUrls: data.enclosureUrls,
            memberName: res.data.memberName,
          })
        })
      } else {
        setMenberInfo({
          memberId: data.memberId,
          roleId: data.memberRoleId,
          roleName: data.memberName,
        })
        setInquiryProduct(data.inquiryListProductRequests)
        form.setFieldsValue({
          ...res.data,
          deliveryTime: moment(data.deliveryTime),
          quotationAsTime: moment(data.quotationAsTime),
          inquiryListProductRequests: data.inquiryListProductRequests,
          enclosureUrls: data.enclosureUrls,
        })
      }
    })
  }

  /** 回显数据 */
  const handleEcho = useCallback(async () => {
    if (isEdit && spam) {
      handleB2B()
    } else if (isEdit) {
      handleInquiry()
    }
  }, [isEdit])

  useEffect(() => {
    handleEcho()
  }, [isEdit])

  return (
    <Fragment>
      <PageHeaderWrapper
        title={title}
        items={[
          { key: 'basicInfoLayout', label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }) },
          { key: 'inquiryProductLayout', label: intl.formatMessage({ id: 'dealAbility.xunjiashangpin' }) },
          { key: 'tradeTermsLayout', label: intl.formatMessage({ id: 'dealAbility.jiaoyitiaojian' }) },
          { key: 'attachLayout', label: intl.formatMessage({ id: 'dealAbility.fujian' }) },
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
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <Space direction="vertical" size={16} style={{ width: '100%', display: 'flex' }}>
            <BasicInfoLatyout getMemberInfo={getMemberInfo} memb={memberInfo} isEdit={spam || two} />
            <InquiryProductLayout
              isEdit={two}
              form={form}
              getInquiryProduct={getInquiryProduct}
              member={memberInfo}
              setInquiryProduct={inquiryProduct}
            />
            <TradeTermsLayout
              isEdit={isEdit}
              isDefault={isDefault}
              getFullAddress={getFullAddress}
              getContacts={getContacts}
              fullAddress={fullAddress}
            />
            <AttachLayout
              enclosureUrls={enclosureUrls}
              getEnclosureUrls={getEnclosureUrls}
              removeEnclosureUrls={removeEnclosureUrls}
            />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Fragment>
  )
}

export default AddedFormLayout
