import React, { useEffect, useState } from 'react'
import {
  Drawer,
  Row,
  Col,
  Button,
  Form,
  Input,
  Divider,
  Upload,
  Anchor,
  message,
  Cascader,
  Spin,
  InputNumber,
  Typography,
} from 'antd'
import style from './index.less'
import { ColumnType } from 'antd/lib/table/interface'
import { DeleteOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import TableModal from '@/pages/transaction/components/tableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import UploadProps from '@/constants/uploadProps'
import {
  getProductMaterielGetMaterielList,
  getProductPlatformGetCategoryTree,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { downloadFileByNameAndUrl } from '@apps/utils'
const intl = getIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '110px' } },
  labelAlign: 'left',
}
const { Link } = Anchor

interface Iprops {
  flag: boolean
  onClose: () => void
  onConfirm?(e: any)
  /** 编辑的数据 */
  edit?: any
  /** 查看 */
  preview?: boolean
}

const DrawerWrite: React.FC<Iprops> = (props: any) => {
  const { flag, onClose, onConfirm, edit, preview } = props
  const [form] = Form.useForm()
  const [visible, setVisile] = useState<boolean>(false)
  const [loading, setloading] = useState(false)
  const [files, setFiles] = useState([])
  const [selected, setselected] = useState<string>('')
  const [product, setProduct] = useState<any>({})
  const [category, setcategory] = useState([])
  /** 选择货品点击 */
  const confirm = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const selectRow = selectRowRecord
    if (selectRow.length > 0) {
      const data: any = selectRow[0]
      if (data.customerCategory.category) {
        const fullId = data.customerCategory.category.fullId
        const ids = fullId.replace(/\b(0+)/gi, '').split('.')
        form.setFieldsValue({
          ids: ids.join(',').split(','),
        })
      } else {
        form.setFieldsValue({
          ids: data.ids,
        })
      }

      form.setFieldsValue({
        number: data.code,
        name: data.name,
        model: data.type,
        brand: data.brand && data.brand.name,
        unit: data.unitName,
      })
      setProduct(data)
      setVisile(false)
    } else {
      message.error('请选择货品!')
    }
  }
  /**查询品类树 */
  const searchCategoryTree = (id: any) => {
    return new Promise((resolve) => {
      getProductPlatformGetCategoryTree({ rootNodeId: id })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }).then((data: any) => {
      console.log(data)
      setcategory(data)
    })
  }
  /**查询品类信息--包括品类、属性、属性值 */
  const getCategoryById = (val: any, selectedOptions?: any) => {
    if (selectedOptions.length > 0) {
      const name = selectedOptions[selectedOptions.length - 1]
      setselected(name.title)
      console.log(name)
    }
  }
  /** 提交表单 */
  const handleSubmit = () => {
    form
      .validateFields()
      .then((res: any) => {
        const data = {
          goodsId: Object.keys(product).length > 0 && product.id,
          itemNo: Object.keys(product).length > 0 ? product.code : res.number,
          number: Object.keys(product).length > 0 ? product.code : res.number,
          name: Object.keys(product).length > 0 ? product.name : res.name,
          category: Object.keys(product).length > 0 && product.customerCategory.name,
          ids: res.ids,
          brand: res.brand,
          model: res.model,
          purchaseCount: res.purchaseCount,
          unit: res.unit,
          urls: files,
        }
        onConfirm(data)
        form.resetFields()
        setFiles([])
      })
      .catch((error) => {
        console.log(error)
      })
  }
  /** 取消提交 */
  const handleClose = () => {
    form.resetFields()
    setFiles([])
    onClose()
  }

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message21' }))
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
  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
  }

  useEffect(() => {
    form.resetFields()
    setFiles([])
    searchCategoryTree(null)
    if (!isEmpty(edit)) {
      console.log(edit)
      form.setFieldsValue({
        number: edit.number,
        name: edit.name,
        model: edit.model,
        brand: edit.brand,
        unit: edit.unit,
        ids: edit.ids,
        purchaseCount: edit.purchaseCount,
      })
      setFiles(edit.urls)
    }
  }, [flag])

  const fetchGoodsData = (params: any) => {
    return new Promise((resolve) => {
      getProductMaterielGetMaterielList(params)
        .then((res) => {
          const { data } = res
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  const toggle = (flag: boolean) => {
    setVisile(flag)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.code' }),
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.productName' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'customerCategory',
      dataIndex: 'customerCategory',
      render: (text: any) => <span>{text && Object.keys(text).length > 0 && text.name}</span>,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
      render: (text: any) => <span>{text && Object.keys(text).length > 0 && text.name}</span>,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      key: 'unitName',
      dataIndex: 'unitName',
    },
  ]

  return (
    <>
      <Drawer
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle2' })}
        visible={flag}
        placement="right"
        width="45%"
        onClose={handleClose}
        className={style.drawer}
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
              <Button onClick={handleSubmit} type="primary">
                {intl.formatMessage({ id: 'detail.purchase.confirm' })}
              </Button>
            </div>
          ) : null
        }
      >
        <Row>
          <Col span={6}>
            <Anchor affix getContainer={() => document.getElementById('current')}>
              <Link href="#basic" title={intl.formatMessage({ id: 'detail.purchase.basicLayout' })} />
              <Link href="#number" title={intl.formatMessage({ id: 'detail.purchase.purchaseCount' })} />
              <Link href="#file" title={intl.formatMessage({ id: 'detail.purchase.file' })} />
            </Anchor>
          </Col>
          <Col
            span={18}
            id="current"
            style={{
              height: '100%',
              padding: '16px',
              overflowY: 'scroll',
              borderLeft: '1px solid #F4F5F7',
            }}
          >
            <Form {...layout} form={form}>
              {/* 基本信息 */}
              <Form.Item
                id="basic"
                label={
                  <>
                    <Divider
                      type="vertical"
                      style={{
                        width: '2px',
                        height: '16px',
                        margin: '0px 5px 0px 0px',
                        backgroundColor: '#00A98F',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#909399',
                      }}
                    >
                      {intl.formatMessage({ id: 'detail.purchase.basicLayout' })}
                    </span>
                  </>
                }
              />
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.code' })}
                name="number"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message24' }) }]}
              >
                <Input.Search
                  readOnly
                  enterButton={
                    <Button disabled={preview}>
                      <LinkOutlined /> {intl.formatMessage({ id: 'detail.purchase.select' })}
                    </Button>
                  }
                  onSearch={() => setVisile(true)}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.productName' })}
                name="name"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message26' }) }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.nameCode' })}
                name="model"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message27' }) }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.customerCategory' })}
                name="ids"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message28' }) }]}
              >
                <Cascader
                  disabled
                  options={category}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  placeholder={intl.formatMessage({ id: 'detail.purchase.message28' })}
                  notFoundContent={<Spin size="small" />}
                  onChange={getCategoryById}
                />
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'detail.purchase.brand' })} name="brand">
                <Input disabled={preview} />
              </Form.Item>
              {/* 采购数量 */}
              <Form.Item
                id="number"
                label={
                  <>
                    <Divider
                      type="vertical"
                      style={{
                        width: '2px',
                        height: '16px',
                        margin: '0px 5px 0px 0px',
                        backgroundColor: '#00A98F',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#909399',
                      }}
                    >
                      {intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}
                    </span>
                  </>
                }
              />
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.unitName' })}
                name="unit"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message29' }) }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}
                name="purchaseCount"
                rules={[{ required: true, message: intl.formatMessage({ id: 'detail.purchase.message30' }) }]}
              >
                <InputNumber disabled={preview} min={1} style={{ width: '100%' }} />
              </Form.Item>
              {/* 附件 */}
              <Form.Item
                id="file"
                label={
                  <>
                    <Divider
                      type="vertical"
                      style={{
                        width: '2px',
                        height: '16px',
                        margin: '0px 5px 0px 0px',
                        backgroundColor: '#00A98F',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#909399',
                      }}
                    >
                      {intl.formatMessage({ id: 'detail.purchase.file' })}
                    </span>
                  </>
                }
              />
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
                <Upload
                  {...UploadProps}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                  beforeUpload={beforeDocUpload}
                  onChange={handleChange}
                >
                  <Button disabled={preview} loading={loading} icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
                  </Button>
                  <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.placeholder2' })}</div>
                </Upload>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Drawer>
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle1' })}
        mode="radio"
        tableProps={{
          rowKey: 'id',
        }}
        fetchData={fetchGoodsData}
        onClose={() => toggle(false)}
        onOk={confirm}
        columns={columns}
        effects={($, actions) => {
          actions.reset()
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'detail.purchase.productName' }),
                    align: 'flex-left',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 20,
                },
              },
              properties: {
                PRO_LAYOUT: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-mega-props': {
                    span: 5,
                  },
                  'x-component-props': {
                    inline: true,
                  },
                  properties: {
                    code: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.code' }),
                      },
                    },
                    customerCategoryId: {
                      type: 'string',
                      'x-component': 'SearchSelect',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message28' }),
                        className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
                        fetchSearch: getProductSelectGetSelectCustomerCategory,
                        style: {
                          width: 160,
                        },
                      },
                    },
                    brandId: {
                      type: 'string',
                      'x-component': 'SearchSelect',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message31' }),
                        fetchSearch: getProductSelectGetSelectBrand,
                        style: {
                          width: 160,
                        },
                      },
                    },
                    type: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
                      },
                    },
                  },
                },
                sumbit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: intl.formatMessage({ id: 'detail.purchase.search' }),
                  },
                },
              },
            },
          },
        }}
      />
    </>
  )
}
export default DrawerWrite
