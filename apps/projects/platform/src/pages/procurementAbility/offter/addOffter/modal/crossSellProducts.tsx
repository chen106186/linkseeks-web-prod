import React, { useEffect, useState } from 'react'
import { Drawer, Button, Form, Typography, Upload, message, Input } from 'antd'
import cx from 'classnames'
import style from './index.less'
import { DeleteOutlined, LinkOutlined, PlusSquareOutlined, UploadOutlined } from '@ant-design/icons'
import SelectProduct from './selectProduct'
import UploadProps from '@/constants/uploadProps'
import {
  getProductCommodityGetCommodityAttributeByCommoditySkuId,
  getProductCommodityGetPublishedShop,
  getProductMobileShopStoreGetCommodityDetailBySkuId,
  GetProductCommodityGetPublishedShopResponse,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { Select } from '@linkseeks/ui'
import { downloadFileByNameAndUrl } from '@apps/utils'

const { Text } = Typography
export interface IProps {
  rel?: boolean
  preview?: boolean
  visible: boolean
  record: any
  onClose?: () => void
  onClick?: (e: any) => void
}

const layout: any = {
  colon: false,
  labelCol: { style: { width: '110px' } },
  labelAlign: 'left',
}
const intl = getIntl()
const CrossSellProducts: React.FC<IProps> = (props: any) => {
  const { rel, preview, visible, record, onClose, onClick } = props
  const [flag, setFlag] = useState<boolean>(false)
  const [product, setProduct] = useState<any>({})
  const [attribute, setAttribute] = useState<any>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setloading] = useState(false)
  const [productId, setProductId] = useState<number>(0)
  const [isSeleted, setIsSeleted] = useState<any>(1)
  const [shopList, setShopList] = useState<Array<{ label: string; value: number; [key: string]: any }>>([])
  const translate = useWebIntl()
  const [form] = Form.useForm()

  const resetValue = () => {
    setProduct({})
    setAttribute([])
    setIsSeleted(1)
  }

  /**报价商品属性 */
  const GetCommodityAttribute = (id) => {
    getProductCommodityGetCommodityAttributeByCommoditySkuId({ commoditySkuId: id })
      .then((res) => {
        if (res.code === 1000) {
          let { data } = res || {}
          setAttribute(data)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const fetchPublishedShop = async (commodityId: string, isSkuId = false) => {
    if (isSkuId) {
      getProductMobileShopStoreGetCommodityDetailBySkuId(
        { commoditySkuId: commodityId },
        { headers: { shopId: record.shopId } },
      ).then((res) => {
        if (res.code === 1000) {
          fetchPublishedShop(`${res.data.id}`)
        }
      })
    } else {
      getProductCommodityGetPublishedShop({ id: commodityId }).then((res) => {
        if (res.code === 1000 && res.data) {
          setShopList(
            res.data.map((item) => ({
              ...item,
              label: item.name,
              value: item.shopId,
            })),
          )
        }
      })
    }
  }

  /**选择报价商品回调  */
  const handleSelectPrduct = (params: any) => {
    console.log(params, 'params')
    if (params) {
      setProduct(params)
      GetCommodityAttribute(params.id)
      fetchPublishedShop(params.commodityId)
    }
    setFlag(false)
  }

  /** 关闭 */
  const handleClose = () => {
    onClose()
    resetValue()
    setFiles([])
    setProductId(0)
  }
  /** 确定 */
  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onClick({
        product,
        attribute,
        files,
        shopId: values.shopId,
        shopName: values.shopName,
        shopType: values.shopType,
        shopEnvironment: values.shopEnvironment,
      })
      setProductId(0)
      setFiles([])
      resetValue()
    })
  }

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message18' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    const arr: any = files
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setloading(false)
      }
    }
    setFiles([...arr])
  }

  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
  }

  useEffect(() => {
    if (preview && Object.keys(record).length > 0) {
      setProduct({
        id: record.productId,
        name: record.productName,
        brandName: record.productBrand,
        customerCategoryName: record.productCategory,
      })
      GetCommodityAttribute(record.productId)
      record.enclosureUrls && setFiles(record.enclosureUrls)
      if (record.shopId) {
        if (record.productId) {
          fetchPublishedShop(record.productId, true)
        }
        form.setFieldsValue({
          shopId: record.shopId,
          shopName: record.shopName,
          shopType: record.shopType,
          shopEnvironment: record.shopEnvironment,
        })
      }
    }
  }, [preview, record])

  useEffect(() => {
    if (rel && Object.keys(record).length > 0) {
      setProduct({
        id: record.productId,
        name: record.productName,
        brandName: record.productBrand,
        customerCategoryName: record.productCategory,
      })
      if (record.productId) {
        GetCommodityAttribute(record.productId)
      }
      record.enclosureUrls && setFiles(record.enclosureUrls)
      if (record.shopId) {
        if (record.productId) {
          fetchPublishedShop(record.productId, true)
        }
        form.setFieldsValue({
          shopId: record.shopId,
          shopName: record.shopName,
          shopType: record.shopType,
          shopEnvironment: record.shopEnvironment,
        })
      }
    }
  }, [rel, record])

  const handleSelProduct = (data) => {
    data.id && setProductId(data.id)
    data.productId && setProductId(data.productId)
    setFlag(true)
  }

  const handleClick = (id, anchorName) => {
    setIsSeleted(id)
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <Drawer
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle5' })}
        placement="right"
        width={800}
        className={style.drawer}
        open={visible}
        onClose={handleClose}
        zIndex={998}
        destroyOnClose
        footer={
          !preview ? (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={handleClose} style={{ marginRight: 8 }}>
                {intl.formatMessage({ id: 'detail.purchase.cancel' })}
              </Button>
              <Button onClick={handleConfirm} type="primary">
                {intl.formatMessage({ id: 'detail.purchase.confirm' })}
              </Button>
            </div>
          ) : null
        }
      >
        <div className={style.container}>
          <div className={style.menu}>
            <div
              className={cx(style.menuItem, isSeleted === 1 && style.active)}
              onClick={() => handleClick(1, 'menu1')}
            >
              {intl.formatMessage({ id: 'detail.purchase.basicLayout' })}
            </div>
            {attribute.length > 0 &&
              attribute.map((item: any, index: number) => (
                <div
                  key={`attribute_${index + 1}`}
                  className={cx(style.menuItem, isSeleted === Number(index + 2) && style.active)}
                  onClick={() => handleClick(Number(index + 2), `menu${index + 2}`)}
                >
                  {item.customerAttribute.name}
                </div>
              ))}
            <div
              className={cx(style.menuItem, isSeleted === 98 && style.active)}
              onClick={() => handleClick(98, 'menu98')}
            >
              {translate('web.resource.order.guanlianshangpinxiaoshoushangcheng')}
            </div>
            <div
              className={cx(style.menuItem, isSeleted === 99 && style.active)}
              onClick={() => handleClick(99, 'menu99')}
            >
              {intl.formatMessage({ id: 'detail.purchase.file' })}
            </div>
          </div>
          <div className={style.content}>
            <Form form={form} {...layout}>
              <div id="menu1">
                <div className={style.anchor}>{intl.formatMessage({ id: 'detail.purchase.basicLayout' })}</div>
                <div className={style.formItem}>
                  {record && (
                    <div className={style.box}>
                      <div className={style.title}>
                        {intl.formatMessage({ id: 'detail.purchase.purchaseMaterial' })}
                      </div>
                      <div className={style.content1}>
                        <div className={style.row}>
                          <span className={style.label}>
                            {intl.formatMessage({ id: 'detail.purchase.materialCode' })}：
                          </span>
                          <span className={style.col}>{record.number}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>{intl.formatMessage({ id: 'detail.purchase.brand' })}：</span>
                          <span className={style.col}>{record.brand}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>
                            {intl.formatMessage({ id: 'detail.purchase.materialName' })}：
                          </span>
                          <span className={style.col}>{record.name}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>
                            {intl.formatMessage({ id: 'detail.purchase.customerCategory' })}：
                          </span>
                          <span className={style.col}>{record.category}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>
                            {intl.formatMessage({ id: 'detail.purchase.nameCode' })}：
                          </span>
                          <span className={style.col}>{record.model}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={cx(style.box, style.boxBlue)}>
                    <div className={cx(style.title, style.tagBlue)}>
                      {intl.formatMessage({ id: 'contract.baojiashangpin' })}
                      <Text type="danger">*</Text>
                    </div>
                    <div className={style.content1}>
                      {Object.keys(product).length > 0 && (
                        <>
                          <div className={style.row}>
                            <span className={style.label}>
                              {intl.formatMessage({ id: 'detail.purchase.goodstName' })}：
                            </span>
                            <span className={style.col}>{product.name}</span>
                          </div>
                          <div className={style.row}>
                            <span className={style.label}>{intl.formatMessage({ id: 'detail.purchase.brand' })}：</span>
                            <span className={style.col}>{product.brandName}</span>
                          </div>
                          <div className={style.row}>
                            <span className={style.label}>
                              {intl.formatMessage({ id: 'detail.purchase.customerCategory' })}：
                            </span>
                            <span className={style.col}>{product.customerCategoryName}</span>
                          </div>
                        </>
                      )}
                      {!preview && (
                        <Button
                          onClick={() => handleSelProduct(product)}
                          block
                          type="dashed"
                          style={{ margin: '16px 0px' }}
                        >
                          <PlusSquareOutlined />
                          {intl.formatMessage({ id: 'detail.purchase.selectGoods' })}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {attribute.length > 0 &&
                attribute.map((item: any, index: number) => (
                  <div id={`menu${index + 2}`} key={`attribute_${index + 1}`}>
                    <div className={style.anchor}>{item.customerAttribute.name}</div>
                    {item.customerAttributeValueList.map((child: any, childIdx: number) => (
                      <div className={style.formItem}>
                        <Form.Item key={childIdx} label={item.customerAttribute.name} style={{ marginBottom: 0 }}>
                          <Text>{child.value}</Text>
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                ))}
              <div id="menu98">
                <div className={style.anchor}>{translate('web.resource.order.guanlianshangpinxiaoshoushangcheng')}</div>
                <div className={style.formItem}>
                  <Form.Item hidden name="shopName">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item hidden name="shopType">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item hidden name="shopEnvironment">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label={translate('web.resource.mall.shangcheng')}
                    name="shopId"
                    rules={[
                      {
                        required: true,
                        message: translate('web.common.qingxuanze'),
                      },
                    ]}
                  >
                    <Select
                      options={shopList}
                      disabled={preview}
                      onChange={(value) => {
                        const shopItem = shopList.find((item) => item.value === value)
                        if (shopItem) {
                          form.setFieldsValue({
                            shopName: shopItem?.label,
                            shopType: shopItem?.type,
                            shopEnvironment: shopItem?.environment,
                          })
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div id="menu99">
                <div className={style.anchor}>{intl.formatMessage({ id: 'detail.purchase.file' })}</div>
                <div className={style.formItem}>
                  <Form.Item label={intl.formatMessage({ id: 'detail.purchase.file' })} name="upload">
                    <div className={style.upload_data}>
                      {files.length > 0 &&
                        files.map((v: any, index) => (
                          <div key={index} className={style.upload_item}>
                            <div className={style.upload_left}>
                              <Typography.Link
                                style={{ display: 'block' }}
                                key={`link_${index + 1}`}
                                onClick={() => downloadFileByNameAndUrl(v.url, v.name)}
                              >
                                <LinkOutlined style={{ marginRight: '5px' }} />
                                {v.name}
                              </Typography.Link>
                            </div>
                            {!preview && (
                              <div className={style.upload_right} onClick={() => removeFiles(index)}>
                                <DeleteOutlined />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    {!preview && (
                      <Upload
                        {...UploadProps}
                        showUploadList={false}
                        accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                        beforeUpload={beforeDocUpload}
                        onChange={handleChange}
                      >
                        <Button loading={loading} icon={<UploadOutlined />}>
                          {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
                        </Button>
                        <div style={{ marginTop: '8px' }}>
                          {intl.formatMessage({ id: 'detail.purchase.placeholder2' })}
                        </div>
                      </Upload>
                    )}
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Drawer>
      <SelectProduct id={productId} visible={flag} onclose={() => setFlag(false)} confirm={handleSelectPrduct} />
    </>
  )
}

export default CrossSellProducts
