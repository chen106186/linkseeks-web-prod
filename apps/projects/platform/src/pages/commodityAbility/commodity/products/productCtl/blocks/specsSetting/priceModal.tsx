import { useMemoizedFn, useToggle } from '@linkseeks/hooks'
import { PlusCircleIcon } from '@linkseeks/icons'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Switch, message } from '@linkseeks/ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
import { MinusOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash'
import {
  useSubUnitIdField,
  useProductForm,
  PriceDataModal,
  usePriceTypeField,
  PRICE_TYPE_ENUM,
} from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'
const PriceModal = forwardRef((_, ref) => {
  const [visible, toggle] = useToggle()
  const [priceType, setPriceType] = useState('')
  const [form] = Form.useForm()
  const { formInstance, setSpecsSettingDataSource } = useProductForm()
  const subUnitIdValue = useSubUnitIdField(formInstance)
  const jtSwitch = Form.useWatch('switchPrice', form)
  const unitPriceValue = Form.useWatch('unitPrice', form)
  const priceRateValue = Form.useWatch('priceRate', form)
  const ladderRangeValue = Form.useWatch('ladderRange', form)
  const priceIndex = useRef<number | undefined>(0)
  const priceTypeValue = usePriceTypeField(formInstance)
  const minOrderValue = Form.useWatch('minOrder', formInstance)
  const intl = useIntl()
  const translate = useWebIntl()
  const isPointPrice = useMemo(() => {
    return priceTypeValue === PRICE_TYPE_ENUM.POINT_GOODS_PRICE
  }, [priceTypeValue])
  useImperativeHandle(ref, () => {
    return {
      toggle(type: string, record: any, index?: number) {
        if (type === 'batch') {
          // 批量
          setPriceType(
            isPointPrice
              ? translate('web.resource.commodity.piliangshezhijifen')
              : translate('web.resource.commodity.piliangshezhijiage'),
          )
          form.resetFields()
        } else {
          // 单项设置
          setPriceType(
            isPointPrice
              ? translate('web.resource.commodity.shezhijifen')
              : translate('web.resource.commodity.shezhijiage'),
          )
          const filedValue = cloneDeep(record)
          const priceDataModal: PriceDataModal = filedValue.unitPrice
          if (priceDataModal) {
            if (priceDataModal.isStep) {
              form.setFieldValue('switchPrice', true)
              filedValue.ladderRange = priceDataModal.getStepPrice()
              filedValue.priceRate = priceDataModal.getSubPriceRate()
            } else {
              filedValue.unitPrice = priceDataModal.getPrice()
              filedValue.priceRate = priceDataModal.getSubPriceRate()
            }
          }
          form.setFieldsValue(filedValue)
        }
        priceIndex.current = index
        toggle()
      },
    }
  })

  const handleSubmit = (values) => {
    // 如果是阶梯价，那么第一个价格值必须大于等于外层的最小起订
    if (values.switchPrice) {
      const [firstItem] = values.ladderRange
      if (firstItem) {
        if (Number(firstItem.numberMin) < Number(minOrderValue)) {
          message.error(`${translate('web.resource.commodity.jietijiatishi')} - ${minOrderValue}`)
        }
      }
    }
    setSpecsSettingDataSource((prevSource) => {
      const newSource = [...prevSource]
      const { ladderRange, priceRate = 0, unitPrice, switchPrice } = values
      const priceDataModal = new PriceDataModal()

      if (priceIndex.current === undefined) {
        // 批量设置
        return newSource.map((v) => {
          if (switchPrice) {
            // 是阶梯价
            priceDataModal.isStep = true
            priceDataModal.setStepPrice(ladderRange)

            v.unitPrice = priceDataModal
            if (priceRate) {
              priceDataModal.setSubPriceRate(priceRate)
              priceDataModal.setStepSubPrice(ladderRange)
              v.priceRate = priceRate
            }
          } else {
            // 非阶梯价
            priceDataModal.setPrice(unitPrice)
            v.unitPrice = priceDataModal
            if (priceRate) {
              priceDataModal.setSubPriceRate(priceRate)
              v.priceRate = priceRate
            }
          }
          return v
        })
      } else {
        // 单独设置
        const target = [...newSource]
        if (switchPrice) {
          // 是阶梯价
          priceDataModal.isStep = true
          priceDataModal.setStepPrice(ladderRange)
          target[priceIndex.current].unitPrice = priceDataModal
          if (priceRate) {
            // 是否存在副单位
            priceDataModal.setSubPriceRate(priceRate)
            priceDataModal.setStepSubPrice(ladderRange)
            target[priceIndex.current].priceRate = priceRate
          }
        } else {
          // 非阶梯价
          priceDataModal.setPrice(unitPrice)
          target[priceIndex.current].unitPrice = priceDataModal
          if (priceRate) {
            priceDataModal.setSubPriceRate(priceRate)
            target[priceIndex.current].priceRate = priceRate
          }
        }
        return target
      }
    })
    toggle()
  }

  /**
   * 校验最大值必须大于最小值
   */
  const validatorStepCompare = (r, v, callback) => {
    const filedName = r.field.split('.')
    filedName.pop()
    const value = form.getFieldValue(filedName)

    if (Number(value['numberMax']) > Number(value['numberMin'])) {
      callback()
    } else {
      callback(translate('web.resource.commodity.zuidazhi'))
    }
  }
  // 阶梯价
  const renderAddPrice = () => {
    return (
      <Form.Item
        name="ladderRange"
        label=""
        shouldUpdate={true}
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.ladderRange.message',
            }),
          },
        ]}
      >
        <Row>
          <Col span={20}>
            <Row>
              <Col span={7}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian1')}</span>
              </Col>
              <Col span={7}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian2')}</span>
              </Col>
              <Col span={10}>
                <span className={styles.label}>
                  {isPointPrice ? translate('web.resource.commodity.jifen') : translate('web.common.danjia')}
                  <i className={styles.redStar}>*</i>
                </span>
              </Col>
            </Row>
          </Col>
          {subUnitIdValue && (
            <Col span={4}>
              <span className={styles.label}>
                {intl.formatMessage({
                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.ladderRange.col.3',
                })}
              </span>
            </Col>
          )}
        </Row>
        <Form.List name="ladderRange">
          {(fields, { add, remove }) => {
            if (!fields.length) {
              add()
            }
            return (
              <div>
                <div>
                  {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                    const minDisabled = index !== 0
                    const minInitValue = index === 0 ? 1 : Number(ladderRangeValue?.[index - 1]?.numberMax) + 1

                    const handleChange = (e) => {
                      const value = e.target.value
                      const readyIndex = index + 1
                      if (fields.length !== 1 && readyIndex !== fields.length) {
                        form.setFieldValue(['ladderRange', readyIndex, 'numberMin'], Number(value) + 1)
                      }
                    }
                    return (
                      <Row key={key} gutter={[0, 10]}>
                        <Col span={16} style={{ display: 'flex' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberMin']}
                            initialValue={minInitValue}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.message.1',
                                }),
                              },
                              {
                                pattern: /^\d+(\.\d{1,3})?$/,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.message.2',
                                }),
                              },
                            ]}
                          >
                            <Input
                              disabled={true}
                              placeholder={intl.formatMessage({
                                id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMin.placeholder',
                              })}
                            />
                          </Form.Item>
                          <Button type="text">~</Button>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberMax']}
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.message.1',
                                }),
                              },
                              {
                                pattern: /^\d+(\.\d{1,3})?$/,
                                message: intl.formatMessage({
                                  id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.message.2',
                                }),
                              },
                              {
                                validator: validatorStepCompare,
                              },
                            ]}
                          >
                            <Input
                              placeholder={intl.formatMessage({
                                id: 'commodity.products.addProductsItem.priceAttributeForm.modal.form.numberMax.placeholder',
                              })}
                              onChange={handleChange}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'numberPrice']}
                            rules={[
                              {
                                required: true,
                                message: isPointPrice
                                  ? translate.formatFormInputTip(translate('web.resource.commodity.jifen'))
                                  : translate.formatFormInputTip(translate('web.common.danjia')),
                              },
                              {
                                pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
                                message: isPointPrice
                                  ? translate('web.resource.commodity.jifenxiaoshu')
                                  : translate('web.resource.commodity.danjiaxiaoshu'),
                              },
                            ]}
                            style={{ marginLeft: 20 }}
                          >
                            <InputNumber
                              min={0}
                              placeholder={
                                isPointPrice
                                  ? translate.formatFormInputTip(translate('web.resource.commodity.jifen'))
                                  : translate.formatFormInputTip(translate('web.common.danjia'))
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {key > 0 && (
                            <Button style={{ marginLeft: 16 }} onClick={() => remove(name)} icon={<MinusOutlined />} />
                          )}
                        </Col>
                        <Col span={4}>
                          {priceRateValue && ladderRangeValue[index]?.numberPrice
                            ? (priceRateValue * ladderRangeValue[index].numberPrice) / 100
                            : null}
                        </Col>
                      </Row>
                    )
                  })}
                </div>
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: '100%' }} icon={<PlusCircleIcon />} />
                </Form.Item>
              </div>
            )
          }}
        </Form.List>
      </Form.Item>
    )
  }

  const countSubPrice = useMemo(() => {
    if (!unitPriceValue || !priceRateValue) {
      return 0
    } else {
      return parseFloat(((unitPriceValue * priceRateValue) / 100).toFixed(4))
    }
  }, [unitPriceValue, priceRateValue])

  const renderPrice = useMemoizedFn(() => {
    return (
      <>
        <Form.Item
          name="unitPrice"
          label={isPointPrice ? translate('web.resource.commodity.jifen') : translate('web.common.danjia')}
          rules={[
            {
              required: true,
            },
            {
              pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
              message: intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.uniquePrice.rule.2' }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        {subUnitIdValue && (
          <>
            <Form.Item
              name="priceRate"
              label={
                isPointPrice
                  ? translate('web.resource.commodity.fujifenhuansuan')
                  : translate('web.resource.commodity.fudanweihuansuan')
              }
            >
              <Input addonAfter="%" style={{ width: 100 }} />
            </Form.Item>
            <Form.Item
              name="subUnitPrice"
              label={
                isPointPrice
                  ? translate('web.resource.commodity.fudanweijifen')
                  : translate('web.resource.commodity.fudanweidanjia')
              }
            >
              <span>{countSubPrice}</span>
            </Form.Item>
          </>
        )}
      </>
    )
  })
  const renderSubPrice = useMemoizedFn(() => {
    if (subUnitIdValue) {
      return (
        <>
          <Form.Item name="priceRate" label={isPointPrice ? '副单位积分换算比率' : '副单位换算比率'} rules={[{}]}>
            <Input addonAfter="%" style={{ width: 100 }} />
          </Form.Item>

          {renderAddPrice()}
        </>
      )
    } else {
      return renderAddPrice()
    }
  })

  return (
    <Modal title={priceType} onCancel={toggle} onOk={() => form.submit()} closable open={visible} destroyOnClose>
      <Form labelCol={{ span: 6 }} labelAlign="left" form={form} onFinish={handleSubmit} preserve={false}>
        <Form.Item
          name="switchPrice"
          label={
            isPointPrice
              ? translate('web.resource.commodity.jietijifen')
              : translate('web.resource.commodity.jietijiage')
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        {jtSwitch ? renderSubPrice() : renderPrice()}
      </Form>
    </Modal>
  )
})

export default PriceModal
