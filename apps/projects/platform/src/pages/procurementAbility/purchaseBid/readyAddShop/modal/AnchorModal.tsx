import React, { useEffect, useState } from 'react'
import { Drawer, Form, Input, Button, Cascader, Spin, InputNumber, Typography, Upload, message } from 'antd'
import style from './AnchorModal.less'
import cx from 'classnames'
import { DeleteOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons'
import UploadProps from '@/constants/uploadProps'
import { isEmpty } from 'lodash'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import TableModal from '@/pages/transaction/components/tableModal'
import { ColumnType } from 'antd/lib/table'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductMaterielGetMaterielList,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useAsyncCascader, fetchTreeData } from '../../../effect'
import { downloadFileByNameAndUrl } from '@apps/utils'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '110px' } },
  labelAlign: 'left',
}

interface AnchorModalProps {
  /** 列表数据 */
  dataSource?: any[]
  /** 显示隐藏 */
  visible?: boolean
  /** 是否查看数据 */
  preview?: boolean
  /** 是否编辑数据 */
  edit?: any
  /** 关闭弹窗 */
  onClose: () => void
  /** 确认 */
  onConfirm?: (e: any) => void
}
const intl = getIntl()
const AnchorModal: React.FC<AnchorModalProps> = (props: any) => {
  const [form] = Form.useForm()
  const { dataSource, visible, preview, edit, onClose, onConfirm } = props
  const [loading, setloading] = useState<boolean>(false)
  const [searchVisible, setSearchVisible] = useState<boolean>(false)
  const [isSeleted, setIsSeleted] = useState<number>(1)
  const [category, setcategory] = useState([])
  const [files, setFiles] = useState([])
  const [product, setProduct] = useState<any>({})
  const [ids, setIds] = useState<Array<number>[]>([])

  const [menu] = useState([
    { id: 1, label: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
    { id: 2, label: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }) },
    { id: 3, label: intl.formatMessage({ id: 'detail.purchase.file' }) },
  ])

  const handleClick = (id, anchorName) => {
    setIsSeleted(id)
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
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

  /**查询品类树 */
  const searchCategoryTree = (id: any) => {
    return new Promise((resolve) => {
      getProductCustomerGetCustomerCategoryTree({ rootNodeId: id })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }).then((data: any) => {
      setcategory(data)
    })
  }

  useEffect(() => {
    form.resetFields()
    setFiles([])
    setIsSeleted(1)
    searchCategoryTree(null)
    if (!isEmpty(edit)) {
      form.setFieldsValue({
        number: edit.number,
        name: edit.name,
        model: edit.model,
        brand: edit.brand,
        unit: edit.unit,
        ids: edit.ids,
        purchaseCount: edit.purchaseCount,
        goodsGroup: edit?.materialGroup,
      })
      setFiles(edit.urls)
    }
    if (!isEmpty(dataSource)) {
      const arr: Array<number>[] = []
      dataSource.forEach((item) => {
        arr.push(item.goodsId)
      })
      setIds(arr)
    } else {
      setIds([])
    }
  }, [visible])

  /** 选择货品点击 */
  const confirm = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const selectRow = selectRowRecord
    if (ids.includes(selectRow[0].id)) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message32' }))
      return
    }
    if (selectRow.length > 0) {
      const data: any = selectRow[0]
      if (data.customerCategory) {
        const fullId = data.customerCategory.fullId
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
        goodsGroup: data?.materialGroup?.name,
      })
      setProduct(data)
      setSearchVisible(false)
    } else {
      message.error(intl.formatMessage({ id: 'detail.purchase.message33' }))
    }
  }

  /** 提交表单 */
  const handleSubmit = () => {
    form
      .validateFields()
      .then((res: any) => {
        const data = {
          goodsId: Object.keys(product).length > 0 ? product.id : edit.goodsId,
          itemNo: Object.keys(product).length > 0 ? product.code : res.number,
          number: Object.keys(product).length > 0 ? product.code : res.number,
          name: Object.keys(product).length > 0 ? product.name : res.name,
          category: Object.keys(product).length > 0 ? product.customerCategory.name : edit.category,
          materialGroup: Object.keys(product).length > 0 ? product?.materialGroup?.name : edit.materialGroup,
          goodsGroup: Object.keys(product).length > 0 ? product?.materialGroup?.name : edit.materialGroup,
          ids: res.ids,
          categoryId:
            Object.keys(product).length > 0 && !isEmpty(product.customerCategory.category)
              ? product.customerCategory.category.id
              : edit.categoryId,
          memberCategoryId: Object.keys(product).length > 0 ? product.customerCategory.id : edit.memberCategoryId,
          brand: res.brand,
          model: res.model,
          purchaseCount: res.purchaseCount,
          unit: res.unit,
          urls: files,
        }
        onConfirm(data)
        setProduct([])
        form.resetFields()
        setFiles([])
      })
      .catch((error) => {
        console.log(error)
      })
  }
  /** 取消提交 */
  const handleClose = () => {
    setProduct([])
    form.resetFields()
    setFiles([])
    onClose()
  }

  const fetchGoodsData = (params: any) => {
    const materialGroupId = params.materialGroupId
      ? params.materialGroupId[params.materialGroupId.length - 1]
      : undefined
    return new Promise((resolve) => {
      getProductMaterielGetMaterielList({ ...params, materialGroupId, ids: [99] })
        .then((res) => {
          const { data } = res
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
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
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'goodsGroup',
      dataIndex: ['materialGroup', 'name'],
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
    <Drawer
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle27' })}
      width="45%"
      visible={visible}
      placement="right"
      onClose={handleClose}
      bodyStyle={{ padding: '0px' }}
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
      <div className={style.container}>
        <div className={style.menu}>
          {menu.map((item) => (
            <div
              key={item.id}
              className={cx(style.menuItem, isSeleted === item.id && style.active)}
              onClick={() => handleClick(item.id, `menu${item.id}`)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className={style.content}>
          <Form {...layout} form={form}>
            <div id="menu1">
              <div className={style.anchor}>{intl.formatMessage({ id: 'detail.purchase.basicLayout' })}</div>
              <div className={style.formItem}>
                <Form.Item
                  label={intl.formatMessage({ id: 'detail.purchase.materialCode' })}
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
                    onSearch={() => setSearchVisible(true)}
                  />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'detail.purchase.goodsGroup' })}
                  name="goodsGroup"
                  rules={[{ message: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }) }]}
                >
                  <Input disabled />
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
                  />
                </Form.Item>
                <Form.Item label={intl.formatMessage({ id: 'detail.purchase.brand' })} name="brand">
                  <Input disabled />
                </Form.Item>
              </div>
            </div>
            <div id="menu2">
              <div className={style.anchor}>{intl.formatMessage({ id: 'detail.purchase.purchaseCount' })}</div>
              <div className={style.formItem}>
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
                  rules={[
                    {
                      required: true,
                      validator: (_rule, value) => {
                        const pattern = /^-?[1-9]\d*(\.\d{1,3})?$/
                        if (!value) {
                          return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message30' })))
                        }
                        if (!pattern.test(value)) {
                          return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message34' })))
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <InputNumber disabled={preview} min={1} style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </div>
            <div id="menu3">
              <div className={style.anchor}>{intl.formatMessage({ id: 'detail.purchase.file' })}</div>
              <div className={style.formItem}>
                <Form.Item label={intl.formatMessage({ id: 'detail.purchase.file' })} name="upload">
                  <div className={style.upload_data}>
                    {files.length > 0 &&
                      files.map((v, index) => (
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
              </div>
            </div>
          </Form>
        </div>
      </div>

      {/* 选择货品 */}
      <TableModal
        modalType="Drawer"
        visible={searchVisible}
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle1' })}
        mode="radio"
        tableProps={{
          rowKey: 'id',
        }}
        fetchData={fetchGoodsData}
        onClose={() => setSearchVisible(false)}
        onOk={confirm}
        columns={columns}
        effects={($, actions) => {
          actions.reset()
          useAsyncCascader('materialGroupId', fetchTreeData)
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
                    adadded: true,
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
                    materialGroupId: {
                      type: 'string',
                      'x-component': 'Cascader',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'detail.purchase.message93' }),
                        allowClear: true,
                        fieldNames: { label: 'name', value: 'id', children: 'children' },
                        style: { width: '150px' },
                        showSearch: true,
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
    </Drawer>
  )
}
export default AnchorModal
