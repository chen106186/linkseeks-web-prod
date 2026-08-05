import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Button, Form, Table, InputNumber, Select, Input, Cascader } from 'antd'
import { Card } from '@linkseeks/ui'
import { ColumnType } from 'antd/lib/table/interface'
import TableModal from '@/components/TableModal'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  getProductSelectGetMemberCategory,
  getProductSelectGetMemberBrand,
  postProductMaterielGetMaterialList,
  getProductPlatformGetCategoryTree,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import UploadFilesString from './uploadFiles'
import { useAuth, useSelectUnit } from '@apps/services'
import { validatorByte } from '@/utils/regExp'

const { onFormMount$ } = FormEffectHooks
const intl = getIntl()
interface InquiryProductLayoutProps {
  /** form */
  form?: any
  dataMessage?: any
}
const { Option } = Select

interface Option {
  value: string | number
  label: string
  children?: Option[]
}

const InquiryProductLayout: React.FC<InquiryProductLayoutProps> = (props: any) => {
  const { form, dataMessage } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const { unitOptions } = useSelectUnit()
  const [categoryList, setCategoryList] = useState<Option[]>([])
  const translate = useWebIntl()
  // const [columns, setColumns] = useState([])

  const getInquiryProduct = (data) => {
    form.setFieldsValue({
      askPurchaseGoodsRequests: data,
    })
  }

  const normalizeOptions = (list: any[]): Option[] => {
    if (list && list.length > 0) {
      return list.map((node) => {
        // 创建一个新对象，包含需要的格式化字段
        const formattedNode = {
          value: node.id,
          label: node.name,
          // 递归处理子节点
          children: node.children ? normalizeOptions(node.children) : [],
        }

        // 返回格式化后的节点
        return formattedNode
      })
    }
    return []
  }

  const getCategoryOptions = () => {
    getProductPlatformGetCategoryTree().then((res) => {
      if (res.code === 1000 && res.data) {
        setCategoryList(normalizeOptions(res.data))
      }
    })
  }

  /** 改变采购数量 */
  const setInputNumber = (val, index, name) => {
    // const val = e.target.value;
    const data = [...dataSource]
    data[index][name] = val
    setDataSource(data)
    getInquiryProduct(data)
    form.setFieldsValue({
      [`${name}_${index}`]: val,
    })
  }

  /** 删除 */
  const handleDeleted = (index) => {
    const data = [...dataSource]
    data.splice(index, 1)
    setDataSource(data)
    getInquiryProduct(data)
  }

  const fnConfig = (data, index) => {
    if (data.isEdit) {
      form
        .validateFields([
          `goodsNo${index}`,
          `goodsName${index}`,
          `categoryName${index}`,
          `specification${index}`,
          `unit${index}`,
          `num${index}`,
        ])
        .then(() => {
          data.isEdit = !data.isEdit
          setDataSource([...dataSource])
          getInquiryProduct([...dataSource])
        })
    } else {
      form.setFieldsValue({
        [`goodsNo${index}`]: data[`goodsNo`],
        [`categoryId${index}`]: data[`categoryId`],
        [`categoryName${index}`]: data[`categoryName`],
        [`brandName${index}`]: data[`brandName`],
        [`goodsName${index}`]: data[`goodsName`],
        [`specification${index}`]: data[`specification`],
        [`unit${index}`]: data[`unit`],
        [`num${index}`]: data[`num`],
      })
      data.isEdit = !data.isEdit
      setDataSource([...dataSource])
      getInquiryProduct([...dataSource])
    }
  }

  const handleOnFileChange = (info: any, index: number, name: string, fileList: any[]) => {
    if (info && info.length > 0) {
      const result = fileList && fileList.length > 0 ? [...fileList, info[info.length - 1]] : [info[info.length - 1]]
      form.setFieldsValue({
        [`${name}_${index}`]: result,
      })
      const data = [...dataSource]
      data[index][name] = result
      setDataSource(data)
      getInquiryProduct(data)
    }
  }

  const onRemove = (fileIndex: number, index: number, name: string, fileList: any[]) => {
    const filterList =
      fileList && fileList.length > 0 ? fileList.filter((_, filterIndex) => filterIndex !== fileIndex) : []
    form.setFieldsValue({
      [`${name}_${index}`]: filterList,
    })
    const data = [...dataSource]
    data[index][name] = filterList
    setDataSource(data)
    getInquiryProduct(data)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      key: 'goodsNo',
      dataIndex: 'goodsNo',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`goodsNo${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'transaction_components.qingshuruwuliaobianhao',
                defaultMessage: '请输入物料编号',
              }),
            },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 40),
            },
          ]}
          style={{ marginBottom: '0px' }}
        >
          {_data.isEdit && !_data.id ? (
            <Input maxLength={40} onChange={(val) => setInputNumber(val.target.value, index, 'goodsNo')} />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      key: 'goodsName',
      dataIndex: 'goodsName',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`goodsName${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'transaction_components.qingshuruwuliaomingcheng',
                defaultMessage: '请输入物料名称',
              }),
            },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 80),
            },
          ]}
          style={{ marginBottom: '0px' }}
        >
          {_data.isEdit && !_data.id ? (
            <Input maxLength={80} onChange={(val) => setInputNumber(val.target.value, index, 'goodsName')} />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.guigexinghao',
        defaultMessage: '规格型号',
      }),
      key: 'specification',
      dataIndex: 'specification',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`specification${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'transaction_components.qingshuruguigexinghao',
                defaultMessage: '请输入规格型号',
              }),
            },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 80),
            },
          ]}
          style={{ marginBottom: '0px' }}
        >
          {_data.isEdit && !_data.id ? (
            <Input maxLength={80} onChange={(val) => setInputNumber(val.target.value, index, 'specification')} />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei', defaultMessage: '品类' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`categoryName${index}`}
          style={{ marginBottom: '0px' }}
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          {_data.isEdit && !_data.id ? (
            <Cascader
              options={categoryList}
              changeOnSelect
              onChange={(val, selectedOptions) => {
                if (selectedOptions && selectedOptions.length > 0) {
                  const lastSelectOptioin = selectedOptions[selectedOptions.length - 1]
                  setInputNumber(lastSelectOptioin.label, index, 'categoryName')
                  setInputNumber(lastSelectOptioin.value, index, 'categoryId')
                }
              }}
            />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai', defaultMessage: '品牌' }),
      key: 'brandName',
      dataIndex: 'brandName',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`brandName${index}`}
          style={{ marginBottom: '0px' }}
          rules={[
            {
              validator: (r, v, c) => validatorByte(r, v, c, 40),
            },
          ]}
        >
          {_data.isEdit && !_data.id ? (
            <Input onChange={(val) => setInputNumber(val.target.value, index, 'brandName')} />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`unit${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'transaction_components.qingxuanzedanwei',
                defaultMessage: '请选择单位',
              }),
            },
          ]}
          style={{ marginBottom: '0px' }}
        >
          {_data.isEdit && !_data.id ? (
            <Select
              style={{ width: 120 }}
              onChange={(val) => {
                setInputNumber(val, index, 'unit')
              }}
            >
              {unitOptions.map((item) => {
                return (
                  <Option key={item.value} value={item.label}>
                    {item.label}
                  </Option>
                )
              })}
            </Select>
          ) : (
            <div>{_data.unit}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: '寻源数量',
      key: 'num',
      dataIndex: 'num',
      width: 120,
      render: (text, _data, index) => (
        <Form.Item
          initialValue={text}
          name={`num${index}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'dealAbility.qingshurucaigoushuliang' }),
            },
          ]}
          style={{ marginBottom: '0px' }}
        >
          {_data.isEdit ? (
            <InputNumber
              formatter={(value: any) => {
                if (!value) return ''
                // 限制最多三位小数
                return value.replace(/(\.\d{3})\d*/, '$1')
              }}
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
              step={0.001}
              onChange={(val) => setInputNumber(val, index, 'num')}
            />
          ) : (
            <div>{text}</div>
          )}
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fujian', defaultMessage: '附件' }),
      key: 'enclosureUrls',
      dataIndex: 'enclosureUrls',
      fixed: 'right',
      width: 130,
      render: (text, _data, index) => (
        <Form.Item initialValue={text} name={`purchaseCount${index}`} style={{ marginBottom: '0px' }}>
          <UploadFilesString
            accept=".pdf,"
            size={20}
            fileList={text || []}
            onChange={(e) => {
              handleOnFileChange(e, index, 'enclosureUrls', text)
            }}
            onRemove={(e) => {
              onRemove(e, index, 'enclosureUrls', text)
            }}
            disabled={text?.length >= 5}
            visible={!!_data.isEdit}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      width: 130,
      render: (_text, _data, index) => (
        <>
          <Button type="link" onClick={() => fnConfig(_data, index)}>
            {_data.isEdit
              ? intl.formatMessage({ id: 'transaction_components.queding', defaultMessage: '确定' })
              : intl.formatMessage({ id: 'transaction_components.xiugai', defaultMessage: '修改' })}
          </Button>
          <Button type="link" onClick={() => handleDeleted(index)}>
            {intl.formatMessage({ id: 'dealAbility.shanchu' })}
          </Button>
        </>
      ),
    },
  ]
  const productColumns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaozu',
        defaultMessage: '物料组',
      }),
      dataIndex: 'materialGroup',
      key: 'materialGroup',
      render: (text: any, record: any) => {
        return text?.name
      },
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.guigexinghao',
        defaultMessage: '规格型号',
      }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei', defaultMessage: '品类' }),
      dataIndex: 'customerCategory',
      key: 'customerCategory',
      render: (text: any, record: any) => {
        return text?.name
      },
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      key: 'brand',
      render: (text: any, record: any) => {
        return text?.name
      },
    },
  ]

  const handleFetchData = useCallback(
    (params: any) => {
      return new Promise((resolve) => {
        postProductMaterielGetMaterialList({ ...params, excludeInternalStatusList: [0] }, { ctlType: 'none' })
          .then((res) => {
            if (res.code !== 1000) {
              return
            }
            resolve(res.data)
          })
          .catch((error) => {
            console.warn(error)
          })
      })
    },
    [visible],
  )

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleLogisticOnOk = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const upData = selectRowRecord.map((item, index) => {
      const descIndex = dataSource.length + index
      form.setFieldsValue({
        [`goodsNo${descIndex}`]: item.code,
        [`goodsName${descIndex}`]: item.name,
        [`specification${descIndex}`]: item.type,
        [`categoryName${descIndex}`]: item.customerCategory?.category?.name,
        [`brandName${descIndex}`]: item.brand?.name,
        [`unit${descIndex}`]: item.unitName,
        [`num${descIndex}`]: 0,
      })
      return {
        id: item.id,
        isEdit: true,
        goodsNo: item.code, // 物料编号
        goodsName: item.name, // 物料名称
        specification: item.type, // 规格型号
        categoryName: item.customerCategory?.name, // 品类
        brandName: item.brand?.name, // 品牌
        unit: item.unitName, // 单位
        num: 1, // 求购数量
      }
    })
    const desc = [...upData, ...dataSource]
    setDataSource(desc)
    getInquiryProduct(desc)
    toggle(false)
  }

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    const { getAuth } = useAuth()
    const authInfo = getAuth()
    onFormMount$().subscribe(() => {
      if (authInfo) {
        getProductSelectGetMemberCategory({
          memberId: String(authInfo.memberId),
          memberRoleId: String(authInfo.memberRoleId),
        })
          .then((res) => {
            const _enum = res.data.map((item) => {
              return {
                label: item.name,
                value: item.id,
              }
            })
            linkage.enum('customerCategoryId', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })

        getProductSelectGetMemberBrand({
          memberId: String(authInfo.memberId),
          memberRoleId: String(authInfo.memberRoleId),
        })
          .then((res) => {
            const _enum = res.data.map((item) => {
              return {
                label: item.name,
                value: item.id,
              }
            })
            linkage.enum('brandId', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })
      }
    })
  }

  const handleAddedProduct = () => {
    toggle(true)
  }

  const fnAddMaterial = () => {
    const obj = {
      isEdit: true,
    }
    dataSource.push(obj)
    const index = dataSource.length - 1
    form.resetFields([
      `goodsNo${index}`,
      `categoryId${index}`,
      `categoryName${index}`,
      `brandName${index}`,
      `goodsName${index}`,
      `specification${index}`,
      `unit${index}`,
      `num${index}`,
    ])
    setDataSource([...dataSource])
  }

  useEffect(() => {
    if (dataMessage.askPurchaseGoodsResponses) {
      setDataSource([...dataMessage.askPurchaseGoodsResponses])
    }
  }, [dataMessage])

  useEffect(() => {
    getCategoryOptions()
  }, [])

  return (
    <Card
      id="inquiryProductLayout"
      title={translate('web.resource.deal.xunyuanwuliao')}
      extra={
        <Button block type="default" onClick={fnAddMaterial}>
          {translate('web.resource.deal.tianjiaxunyuanwuliao')}
        </Button>
      }
    >
      <Fragment>
        <Form.Item
          name="askPurchaseGoodsRequests"
          rules={[
            {
              required: true,
              message: translate('web.resource.deal.qingtianjiaxunyuanwuliao'),
            },
          ]}
        >
          <Table rowKey="productId" scroll={{ x: 1500 }} columns={columns} dataSource={dataSource} pagination={false} />
        </Form.Item>
        <TableModal
          modalType="Drawer"
          visible={visible}
          title={translate('web.resource.deal.xuanzexunyuanwuliao')}
          mode={'checkbox'}
          tableProps={{
            rowKey: 'id',
          }}
          // customKey="productId"
          fetchData={handleFetchData}
          onClose={() => toggle(false)}
          onOk={handleLogisticOnOk}
          columns={productColumns}
          effects={($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            useBusinessEffects()
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
                      placeholder: intl.formatMessage({
                        id: 'transaction_components.wuliaobianhao',
                        defaultMessage: '物料编号',
                      }),
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
                    flexWrap: 'wrap',
                  },
                  colStyle: {
                    //改变间隔
                    marginRight: 20,
                  },
                },
                properties: {
                  memberName: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'transaction_components.wuliaomingcheng',
                        defaultMessage: '物料名称',
                      }),
                    },
                  },
                  xinghao: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'transaction_components.guigexinghao',
                        defaultMessage: '规格型号',
                      }),
                    },
                  },
                  wuliaozu: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({
                        id: 'transaction_components.wuliaozu',
                        defaultMessage: '物料组',
                      }),
                    },
                  },
                  customerCategoryId: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'dealAbility.qingxuanzepinlei' }),
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                  brandId: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'dealAbility.qingxuanzepinpai' }),
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                  sumbit: {
                    'x-component': 'Submit',
                    'x-mega-props': {
                      span: 1,
                    },
                    'x-component-props': {
                      children: intl.formatMessage({ id: 'dealAbility.chaxun' }),
                    },
                  },
                },
              },
            },
          }}
          value={[]}
        />
      </Fragment>
    </Card>
  )
}

export default InquiryProductLayout
