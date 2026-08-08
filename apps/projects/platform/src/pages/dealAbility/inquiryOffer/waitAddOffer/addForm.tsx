import React, { useState, useEffect } from 'react'
import { Form, Button, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { PageHeaderWrapper } from '@apps/components'
import BasicInfoLayout from './components/basicInfo'
import ProductQuoteLayout from './components/productQuote'
import OtherExplainLayout from './components/otherExplain'
import AttachLayout from './components/attach'
import { SaveOutlined } from '@ant-design/icons'
import { getTradeProductInquiryDetails, getTradeProductQuotationDetails } from '@apps/apis'
const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}
interface AddedFormLayoutProps {
  /** 是否编辑 */
  isEdit?: boolean
  /** id */
  id?: number
  /** 提交的接口 */
  fetchRequest?: () => Promise<unknown>
  /** 本地缓存的名称 */
  spam?: string | boolean
  /** 标题 */
  title?: string
}

const AddedFormLayout: React.FC<AddedFormLayoutProps> = (props: any) => {
  const { isEdit, id, fetchRequest, spam, title } = props
  const [form] = Form.useForm()
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState({})
  const [productQuote, setProductQuote] = useState([])
  const [enclosureUrls, setEnclosureUrls] = useState<any[]>([])
  const [inquiry, setInquiry] = useState<any>({})

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'dealAbility.ninhaiyouweibaocundenei' }) })

  const count = (num: any, price: any) => {
    let money: any = null
    money = Number(price) * 1 * Number(num)
    return Number(money).toFixed(2)
  }

  useEffect(() => {
    if (id && !spam) {
      getTradeProductQuotationDetails({ id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          getTradeProductInquiryDetails({ id: res.data.inquiryListId.toString() })
            .then((resolve) => {
              if (resolve.code !== 1000) {
                return
              }
              const { inquiryListProductRequests } = resolve.data
              inquiryListProductRequests.forEach((item: any) => {
                item.money = count(item.purchaseCount, item.price)
              })
              setInquiry({
                inquiryListId: res.data.inquiryListId,
                inquiryListNo: res.data.inquiryListNo,
              })
              setProductQuote(inquiryListProductRequests)
              setEnclosureUrls(res.data.enclosureUrls)
              form.setFieldsValue({
                ...res.data,
                inquiryListProductRequests: inquiryListProductRequests,
                enclosureUrls: res.data.enclosureUrls,
              })
            })
            .catch((error) => {
              console.warn(error)
            })
          setDataSource(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    } else if (id && spam) {
      getTradeProductInquiryDetails({ id })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setDataSource(res.data)
          setProductQuote(res.data.inquiryListProductRequests)
          if (isEdit) {
            form.setFieldsValue({
              ...res.data,
              inquiryListProductRequests: res.data.inquiryListProductRequests,
            })
          } else {
            form.setFieldsValue({
              inquiryListNo: res.data.inquiryListNo,
              inquiryListProductRequests: res.data.inquiryListProductRequests,
            })
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  const handleSubmit = () => {
    setLoading(true)
    form
      .validateFields()
      .then((res) => {
        const params: any = {
          details: res.details,
          inquiryListNo: res.inquiryListNo,
          deliveryInstructions: res.deliveryInstructions,
          minimumOrder: res.minimumOrder,
          paymentType: res.paymentType,
          taxes: res.taxes,
          logistics: res.logistics,
          packRequire: res.packRequire,
          otherRequire: res.otherRequire,
          enclosureUrls: res.enclosureUrls,
          inquiryListProductRequests: res.inquiryListProductRequests,
          inquiryListId: inquiry.inquiryListId || id,
          contactName: res.contactName,
          contactPhone: res.contactPhone,
          phoneCode: res.phoneCode,
        }
        if (id && !spam) {
          params.id = id
        }
        fetchRequest({ ...params })
          .then((res) => {
            if (res.code !== 1000) {
              setLoading(false)
              return
            }
            setUnsaved(false)
            setTimeout(() => {
              history.goBack()
            }, 300)
          })
          .catch((_error) => {
            setLoading(false)
          })
      })
      .catch((_error) => {
        setLoading(false)
      })
  }

  const getInquiryInfo = (value) => {
    form.setFieldsValue({ inquiryListNo: value.orderNo })
    setInquiry({
      inquiryListId: value.orderId,
      inquiryListNo: value.orderNo,
    })
    getTradeProductInquiryDetails({ id: value.orderId.toString() })
      .then((resolve) => {
        if (resolve.code !== 1000) {
          return
        }
        const { inquiryListProductRequests } = resolve.data
        inquiryListProductRequests.forEach((item: any) => {
          item.money = count(item.purchaseCount, item.price)
        })
        setDataSource(resolve.data)
        setProductQuote(inquiryListProductRequests)
        form.setFieldsValue({
          inquiryListProductRequests: inquiryListProductRequests,
        })
      })
      .catch((error) => {
        console.warn(error)
      })
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

  const getContacts = (value) => {
    form.setFieldsValue({
      contactName: value.name,
      contactPhone: value.phone,
      phoneCode: value.phoneCode || 86,
    })
  }

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        title={title}
        items={[
          { key: 'basicInfoLayout', label: intl.formatMessage({ id: 'dealAbility.jibenxinxi' }) },
          { key: 'productQuoteLayout', label: intl.formatMessage({ id: 'dealAbility.shangpinbaojia' }) },
          { key: 'otherExplainLayout', label: intl.formatMessage({ id: 'dealAbility.qitashuoming' }) },
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
          <BasicInfoLayout getInquiryInfo={getInquiryInfo} inq={inquiry} isEdit={spam} />
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <ProductQuoteLayout setProductQuote={productQuote} form={form} />
            <OtherExplainLayout getContacts={getContacts} />
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
