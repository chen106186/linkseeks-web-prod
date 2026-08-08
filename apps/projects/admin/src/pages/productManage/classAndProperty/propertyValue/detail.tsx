import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Popconfirm, Button, Card, Cascader, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import ReturnEle from '@/components/ReturnEle'
import { validatorByte } from '@/utils/regExp'
import type { GetManageAreaAllResponse } from '@apps/apis'
import { getManageAreaAll } from '@apps/apis'
import { getProductPlatformGetAttributeValue, postProductPlatformSaveOrUpdateAttributeValue } from '@apps/apis'

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
}

// function formatter(params: any) {
//   // 字段title转换为name
//   params.name = params.title
//   delete params.title
//   if (params.children.length > 0) params.children.map((item: any) => formatter(item))
//   return params
// }

const AddPropertyValue: React.FC<{}> = () => {
  const [attrValueForm] = Form.useForm()
  const [formValue, setFormValue] = useState<any>({})
  const [attributeValueId, setAttributeValueId] = useState(null) // url传入 可判断是编辑/新增
  const [isSeed, setIsSeed] = useState(false) // 判断查看依据
  const [specialType, setSpecialType] = useState<any>() // 1-日期; 2-地区
  const [proviceOptions, setProviceOptions] = useState<GetManageAreaAllResponse>()
  const [areaString, setAreaString] = useState<string>()
  const query = useQuery()

  useEffect(() => {
    //获取省市区
    getManageAreaAll().then((res) => {
      if (res.code === 1000) {
        const arr = [...res.data] // 裁去最后一级别
        for (const index in arr) {
          for (const _index in arr[index].areaRespList) {
            const o = arr[index].areaRespList
            //@ts-ignore
            o[_index].areaRespList = null
          }
        }
        setProviceOptions(arr)
      }
    })

    const { attrId, attrName, attrValueId, isSee, type } = query
    if (attrId) {
      attrValueForm.setFieldsValue({ attribute: { id: Number(attrId) } })
    }
    if (attrName && attrName != 'undefined') {
      attrValueForm.setFieldsValue({ attributeName: attrName })
    }
    if (attrValueId) {
      // 编辑
      attrValueForm.setFieldsValue({ id: attrValueId })
      setAttributeValueId(attrValueId)
      getProductPlatformGetAttributeValue({ id: attrValueId }).then((res) => {
        if (res.code === 1000) {
          setFormValue(res.data)
          attrValueForm.setFieldsValue(res.data)
        }
      })
    }
    if (isSee) {
      setIsSeed(true)
    }
    if (type && type != 'undefined') {
      setSpecialType(type)
    }
  }, [])

  const handleSubmitAllSetting = () => {
    attrValueForm
      .validateFields()
      .then((values) => {
        const { attrId, attrName, type } = query

        const pararms: any = { ...values }
        delete pararms.attributeName
        if (JSON.stringify(pararms.attributeValue) === '{}') {
          delete pararms.attributeValue
        }
        if (type === '2') {
          pararms.value = areaString
        }
        if (type === '1') {
          pararms.value = '自动日期' + parseInt(Math.random() * 100 + '')
        }

        postProductPlatformSaveOrUpdateAttributeValue(pararms).then((res) => {
          if (res.code === 1000)
            // history.goBack()
            history.push(
              `/productManage/classAndProperty/propertyValue?attrId=${attrId}&attrName=${attrName}&type=${type}`,
            )
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const onCommodityAreaChange = (value: any, selected: any) => {
    const arr = selected.map((item) => item.name)

    if (arr.length > 1) {
      setAreaString(arr.join('/'))
    } else {
      setAreaString(arr.toString())
    }
  }

  return (
    <PageHeaderWrapper title={attributeValueId ? `${isSeed ? '查看属性值' : '编辑属性值'}` : '新建属性值'}>
      <Card>
        <Row gutter={[36, 36]}>
          <Col span={16}>
            <Form
              form={attrValueForm}
              name="edit_infomation"
              layout="horizontal"
              labelAlign="left"
              {...layout}
              initialValues={formValue}
              autoComplete="off"
            >
              <Row gutter={24}>
                <Col span={18} style={{ display: 'none' }}>
                  <Form.Item name="id" label="属性值ID">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name={['attribute', 'id']} label="属性ID">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  {specialType !== '1' && specialType !== '2' && (
                    <Form.Item
                      name="value"
                      label="属性值名称"
                      rules={[
                        {
                          required: true,
                          message: '输入属性值名称!',
                        },
                        {
                          validator: (r, v, c) => validatorByte(r, v, c, 12),
                        },
                      ]}
                    >
                      <Input placeholder="输入属性值名称" disabled={isSeed} />
                    </Form.Item>
                  )}
                  {specialType === '2' && (
                    <Form.Item
                      name="value"
                      label="属性值名称"
                      rules={[
                        {
                          required: true,
                          message: '输入属性值名称!',
                        },
                      ]}
                    >
                      <Cascader
                        disabled={isSeed}
                        options={proviceOptions}
                        changeOnSelect
                        onChange={onCommodityAreaChange}
                        placeholder="请选择地区"
                        fieldNames={{ label: 'name', value: 'code', children: 'areaRespList' }}
                        notFoundContent={<Spin size="small" />}
                      />
                    </Form.Item>
                  )}
                  {specialType === '1' && (
                    <Form.Item
                      name="value"
                      label="属性值名称"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: '输入属性值名称!',
                      //   },
                      // ]}
                    >
                      <span>日期属性无须设置属性值，属性值由系统自动生成。</span>
                    </Form.Item>
                  )}
                </Col>
                <Col span={18}>
                  <Form.Item name="attributeName" label="属性名称">
                    <Input disabled placeholder="输入属性名称" />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item label="状态" name="isEnable" initialValue={true}>
                    {formValue.isEnable ? (
                      <>
                        <span className="commonStatusValid" />
                        有效
                      </>
                    ) : (
                      <>
                        <span className="commonStatusInvalid" />
                        无效
                      </>
                    )}
                  </Form.Item>
                </Col>
                {!isSeed && (
                  <Col span={18}>
                    <Form.Item {...tailLayout}>
                      <Button
                        onClick={handleSubmitAllSetting}
                        type="primary"
                        style={{ marginTop: 32, marginBottom: 16, marginRight: 24 }}
                      >
                        保存
                      </Button>
                      <Popconfirm title="确定要取消吗？" okText="是" cancelText="否" onConfirm={() => history.goBack()}>
                        <Button style={{ marginTop: 32, marginBottom: 16 }}>取消</Button>
                      </Popconfirm>
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddPropertyValue
