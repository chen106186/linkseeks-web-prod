import { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Card, Tooltip, InputNumber, Popconfirm, Cascader } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { validatorByte } from '@/utils/regExp'
import {
  getProductCustomerGetCustomerCategoryTree,
  GetProductCustomerGetCustomerCategoryTreeResponse,
  getProductMaterielGetMateriel,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCustomerCategory,
  postProductMaterielSaveOrUpdateMateriel,
} from '@apps/apis'
import { useSelectUnit } from '@apps/services'

const { Option } = Select
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 12,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 3,
    span: 12,
  },
}

const AddGoods = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [brandData, setBrandData] = useState<any>([])
  const [brandValue, setBrandValue] = useState(undefined)
  const [classData, setClassData] = useState<any>([])
  const [classValue, setClassValue] = useState(undefined)
  const [unitValue, setUnitValue] = useState(undefined)
  const [queryId, setQueryId] = useState<number>(null)
  const [isSee, setIsSee] = useState(false)
  const [customerCategoryTree, setCustomerCategoryTree] = useState<GetProductCustomerGetCustomerCategoryTreeResponse>()
  const [formData, setFormData] = useState<any>()
  const { fetchUnitOptions, unitOptions } = useSelectUnit()

  const query = useQuery()

  useEffect(() => {
    const { id, isSee } = query
    // 获取品类树
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      if (res.code === 1000) {
        // 过滤children空数组
        let { data } = res
        data.map((item) => {
          if (!item.children.length) delete item.children
        })
        setCustomerCategoryTree(data)
      }
    })

    if (id) {
      setQueryId(id)
      getProductSelectGetSelectBrand({ name: '' }).then((res) => {
        if (res.code === 1000) setBrandData(res.data)
      })
      getProductMaterielGetMateriel({ id: id }).then((res) => {
        if (res.code === 1000) {
          const { data } = res
          let initFormValue = { ...data }
          // @ts-ignore
          initFormValue.customerCategory.id = initFormValue.customerCategory.fullId
            .split('.')
            .map((item) => Number(item) + '')
          form.setFieldsValue(initFormValue)
        }
      })
      if (isSee) setIsSee(isSee)
    }
  }, [])

  const handleBrandSearch = (value?: any) => {
    // end value
    getProductSelectGetSelectBrand({ name: value }).then((res) => {
      if (res.code === 1000) setBrandData(res.data)
    })
  }
  const handleBrandChange = (value: any) => {
    setBrandValue(value)
  }
  const handleClassSearch = (value?: any) => {
    getProductSelectGetSelectCustomerCategory({ name: value }).then((res) => {
      if (res.code === 1000) setClassData(res.data)
    })
  }
  const handleClassChange = (value: any) => {
    setClassValue(value)
  }
  const handleUnitSearch = (value?: any) => {
    fetchUnitOptions(value)
  }
  const handleUnitChange = (value: any) => {
    setUnitValue(value)
  }

  const onFinish = (values: any) => {
    let v = values.customerCategory.id
    values.customerCategory = { id: v[v.length - 1] }
    postProductMaterielSaveOrUpdateMateriel({ ...values, id: queryId ? queryId : undefined }).then((res) => {
      if (res.code === 1000) history.goBack()
    })
  }

  return (
    <PageHeaderWrapper
      title={
        queryId
          ? `${
              isSee
                ? intl.formatMessage({ id: 'commodity.goods.addGoods.title.4' })
                : intl.formatMessage({ id: 'commodity.goods.addGoods.title.5' })
            }`
          : intl.formatMessage({ id: 'commodity.goods.addGoods.title.6' })
      }
    >
      <Card>
        <Form
          {...layout}
          form={form}
          name="add-goods"
          onFinish={onFinish}
          colon={false}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            name="code"
            label={intl.formatMessage({ id: 'commodity.goods.schema.goodsSchema.materialCode' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.code.message.1' }),
              },
              {
                pattern: /^(?=.*\d)(?=.*[a-z_A-Z])(?=.*[~!@#$%^&*-_])[\da-zA-Z~!@#$%^&*-_]{1,20}$/,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.code.message.2' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.code.placeholder' })}
              maxLength={20}
              disabled={isSee}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'commodity.goods.schema.goodsSchema.materialName' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.name.message' }),
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 40),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.name.placeholder' })}
              disabled={isSee}
            />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'commodity.goods.addGoods.form.type' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.type.message' }),
              },
              {
                validator: (r, v, c) => validatorByte(r, v, c, 40),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.type.placeholder' })}
              disabled={isSee}
            />
          </Form.Item>
          {/* <Form.Item
            name={['customerCategory', 'id']}
            label="品类"
            rules={[
              {
                required: true,
                message: '请填入品类'
              },
            ]}
          >
            <Select
              showSearch={true}
              showArrow={true}
              placeholder="请填入品类"
              value={classValue}
              defaultActiveFirstOption={false}
              filterOption={false}
              onSearch={handleClassSearch}
              onChange={handleClassChange}
              onFocus={()=>handleClassSearch(null)}
              notFoundContent={null}
              style={{width:'100%'}}
              disabled={isSee}
            >
              {classData.map(d => <Option value={d.id} key={d.id}>{d.name}</Option>)}
            </Select>
          </Form.Item> */}
          <Form.Item
            name={['customerCategory', 'id']}
            label={intl.formatMessage({ id: 'commodity.goods.addGoods.form.customerCategory' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.customerCategory.message' }),
              },
            ]}
          >
            <Cascader
              disabled={isSee}
              options={customerCategoryTree}
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.customerCategory.placeholder' })}
              // notFoundContent={<Spin size="small" />}
            />
          </Form.Item>
          <Form.Item
            name={['brand', 'id']}
            label={intl.formatMessage({ id: 'commodity.goods.addGoods.form.brand' })}
            // rules={[
            //   {
            //     required: true,
            //     message: '请填入品牌'
            //   },
            // ]}
          >
            {/* <Input placeholder="最长40个字符、20个汉字" /> */}
            <Select
              showSearch={true}
              showArrow={true}
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.brand.placeholder' })}
              value={brandValue}
              defaultActiveFirstOption={false}
              filterOption={false}
              onSearch={handleBrandSearch}
              onChange={handleBrandChange}
              onFocus={() => handleBrandSearch(null)}
              notFoundContent={null}
              style={{ width: '100%' }}
              disabled={isSee}
            >
              {brandData.map((d) => (
                <Option value={d.id} key={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="unitId"
            label={intl.formatMessage({ id: 'commodity.goods.addGoods.form.unitId' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.unitId.message' }),
              },
            ]}
          >
            <Select
              showSearch={true}
              showArrow={true}
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.unitId.placeholder' })}
              value={unitValue}
              defaultActiveFirstOption={false}
              filterOption={false}
              onSearch={handleUnitSearch}
              onChange={handleUnitChange}
              onFocus={() => handleUnitSearch(null)}
              notFoundContent={null}
              style={{ width: '100%' }}
              disabled={isSee}
            >
              {unitOptions.map((d) => (
                <Option value={d.value} key={d.value}>
                  {d.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="costPrice"
            // label="成本价"
            label={
              <span>
                {intl.formatMessage({ id: 'commodity.goods.addGoods.form.muluPrice' })}&nbsp;
                {/* <Tooltip title={intl.formatMessage({ id: 'commodity.goods.addGoods.form.costPrice.tooltip' })}>
                <QuestionCircleOutlined />
              </Tooltip> */}
              </span>
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.muluPrice.placeholder' }),
              },
              {
                pattern: /^\d+(\.\d{1,4})?$/,
                message: intl.formatMessage({ id: 'commodity.goods.addGoods.form.costPrice.message.2' }),
              },
            ]}
          >
            <InputNumber
              placeholder={intl.formatMessage({ id: 'commodity.goods.addGoods.form.muluPrice.placeholder' })}
              style={{ width: '100%' }}
              min={0}
              disabled={isSee}
            />
          </Form.Item>
          {!isSee && (
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'commodity.goods.addGoods.form.ctr.button.1' })}
              </Button>
              <Popconfirm
                title={intl.formatMessage({ id: 'commodity.goods.addGoods.form.ctr.button.2.popconfirm.title' })}
                okText={intl.formatMessage({ id: 'commodity.goods.addGoods.form.ctr.button.2.popconfirm.okText' })}
                cancelText={intl.formatMessage({
                  id: 'commodity.goods.addGoods.form.ctr.button.2.popconfirm.cancelText',
                })}
                onConfirm={() => history.goBack()}
              >
                <Button className={styles.ml20}>
                  {intl.formatMessage({ id: 'commodity.goods.addGoods.form.ctr.button.2' })}
                </Button>
              </Popconfirm>
            </Form.Item>
          )}
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddGoods
