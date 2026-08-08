import React, { useEffect, useState } from 'react'
import { Drawer, Button, Form, Typography, message } from 'antd'
import cx from 'classnames'
import style from './index.less'
import { DeleteOutlined, LinkOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { getProductCommodityGetCommodityAttributeByCommoditySkuId } from '@apps/apis'
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

const CrossSellProducts: React.FC<IProps> = (props: any) => {
  const { rel, preview, visible, record, onClose, onClick } = props
  const [flag, setFlag] = useState<boolean>(false)
  const [product, setProduct] = useState<any>({})
  const [attribute, setAttribute] = useState<any>([])
  const [files, setFiles] = useState([])
  const [loading, setloading] = useState(false)
  const [productId, setProductId] = useState<number>(0)
  const [isSeleted, setIsSeleted] = useState<any>(1)

  const resetValue = () => {
    setProduct({})
    setAttribute([])
    setIsSeleted(1)
  }

  /**报价商品属性 */
  const GetCommodityAttribute = (id) => {
    getProductCommodityGetCommodityAttributeByCommoditySkuId({ commoditySkuId: id }).then((res) => {
      if (res.code === 1000) {
        let { data } = res || {}
        setAttribute(data)
      }
    })
  }

  /**选择报价商品回调  */
  const handleSelectPrduct = (params: any) => {
    if (params) {
      setProduct(params)
      GetCommodityAttribute(params.id)
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
    onClick({
      product,
      attribute,
      files,
    })
    setProductId(0)
    setFiles([])
    resetValue()
  }

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error('上传文件大小不超过 20M!')
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
    console.log(index, 10086)
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
        customerCategoryName: record.customerCategoryName,
      })
      GetCommodityAttribute(record.productId)
      record.enclosureUrls && setFiles(record.enclosureUrls)
    }
  }, [preview, record])

  useEffect(() => {
    if (rel && Object.keys(record).length > 0) {
      setProduct({
        id: record.productId,
        name: record.productName,
        brandName: record.productBrand,
        customerCategoryName: record.customerCategoryName,
      })
      if (record.productId) {
        GetCommodityAttribute(record.productId)
      }
      record.enclosureUrls && setFiles(record.enclosureUrls)
    }
  }, [rel, record])

  const handleSelProduct = (data) => {
    console.log(data)
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
        title="关联报价商品"
        placement="right"
        width={800}
        className={style.drawer}
        visible={visible}
        onClose={handleClose}
        destroyOnClose
        footer={
          !preview ? (
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={handleClose} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={handleConfirm} type="primary">
                确定
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
              基本信息
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
              className={cx(style.menuItem, isSeleted === 99 && style.active)}
              onClick={() => handleClick(99, 'menu99')}
            >
              附件
            </div>
          </div>
          <div className={style.content}>
            <Form {...layout}>
              <div id="menu1">
                <div className={style.anchor}>基本信息</div>
                <div className={style.formItem}>
                  {record && (
                    <div className={style.box}>
                      <div className={style.title}>对应采购物料</div>
                      <div className={style.content1}>
                        <div className={style.row}>
                          <span className={style.label}>物料编号：</span>
                          <span className={style.col}>{record.number}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>品牌：</span>
                          <span className={style.col}>{record.brand}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>物料名称：</span>
                          <span className={style.col}>{record.name}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>品类：</span>
                          <span className={style.col}>{record.category}</span>
                        </div>
                        <div className={style.row}>
                          <span className={style.label}>规格型号：</span>
                          <span className={style.col}>{record.model}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={cx(style.box, style.boxBlue)}>
                    <div className={cx(style.title, style.tagBlue)}>
                      报价商品
                      <Text type="danger">*</Text>
                    </div>
                    <div className={style.content1}>
                      {Object.keys(product).length > 0 && (
                        <>
                          <div className={style.row}>
                            <span className={style.label}>商品名称：</span>
                            <span className={style.col}>{product.name}</span>
                          </div>
                          <div className={style.row}>
                            <span className={style.label}>品牌：</span>
                            <span className={style.col}>{product.brandName}</span>
                          </div>
                          <div className={style.row}>
                            <span className={style.label}>品类：</span>
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
                          选择商品
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
              <div id="menu99">
                <div className={style.anchor}>附件</div>
                <div className={style.formItem}>
                  <Form.Item label="附件" name="upload">
                    <div className={style.upload_data}>
                      {files.length > 0 &&
                        files.map((v: any, index) => (
                          <div key={index} className={style.upload_item}>
                            <div className={style.upload_left}>
                              <Typography.Link
                                style={{ display: 'block' }}
                                key={`link_${index + 1}`}
                                // href={`/api/support/file/download?fileName=${v.name}&fileUrl=${v.url}`}
                                // target="_blank"
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
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default CrossSellProducts
