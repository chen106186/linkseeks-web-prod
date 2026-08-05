import React, { Fragment, useEffect, useState } from 'react'
import { Form, Select, Input, InputNumber, Button } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

/**
 * 最小单位组件
 * @author: Gavin
 * @description: 定制化业务组件最小单位组件, 时间仓促写的不好，还请多多见谅
 * @returns
 */
const MinUnit = (props) => {
  const { value, originAsyncData } = props

  const [form] = Form.useForm()

  const [unitData, setUnitData] = useState<any>()
  const [addonAfter, setAddonAfter] = useState<string>('')

  useEffect(() => {
    if (value && value.length > 0) form.setFieldsValue(value[0])
    if (value?.minUnitName && addonAfter !== value?.minUnitName) {
      setAddonAfter(value?.minUnitName)
    }
  }, [value])

  useEffect(() => {
    let data =
      originAsyncData?.length &&
      originAsyncData.map((i) => ({
        label: i.name,
        value: i.id,
      }))
    setUnitData(data)
  }, [props?.originAsyncData])

  return (
    <>
      <Form
        form={form}
        style={{ width: '100%' }}
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        onValuesChange={(e, allValues) => {
          props.mutators.change(allValues)
        }}
      >
        {unitData && (
          <Fragment>
            <Form.Item name="unitId">
              <Select
                options={unitData}
                disabled={!props.editable}
                allowClear
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                onChange={(e, o) => {
                  setAddonAfter(o?.label)
                  form.setFieldValue('unitName', o?.label)
                }}
              />
            </Form.Item>
            <Form.Item name="unitName" hidden>
              <Input />
            </Form.Item>
          </Fragment>
        )}
        <Form.List name="subUnitConversionList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Form.Item {...restField} name={[name, 'unitId']} style={{ width: '25%', marginBottom: 0 }}>
                    <Select options={unitData} disabled={!props.editable} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'nums']}
                    style={{ width: 'calc(70% - 16px)', margin: '0 8px' }}
                    initialValue={1}
                  >
                    <InputNumber
                      min={1}
                      max={999999}
                      style={{ width: '100%' }}
                      addonAfter={addonAfter}
                      disabled={!props.editable}
                    />
                  </Form.Item>
                  {props.editable && <MinusCircleOutlined onClick={() => remove(name)} disabled={!props.editable} />}
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  disabled={!props.editable}
                ></Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </>
  )
}

MinUnit.isFieldComponent = true
export default MinUnit
