import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Form, Table, Checkbox, Row, Col, InputNumber, Switch } from 'antd'
import { useModalTable } from '../../model/useModalTable'
import { useMemoizedFn } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
import { PlusCircleIcon } from '@linkseeks/icons'
import styles from './index.less'

const layoutSetPrice = {
  labelCol: { span: 6 },
}

export interface PriceModalProps {
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const PriceModal: React.FC<PriceModalProps> = (props) => {
  const { schemaAction, currentRef, ...restProps } = props
  const intl = useIntl()
  const translate = useWebIntl()

  const [form] = Form.useForm()
  const {
    visible,
    setVisible,
    ladderPrice,
    setLadderPrice,
    isBatchSetting,
    setIsBatchSetting,
    curretSetPriceRow,
    setCurrentSetPriceRow,
  } = useModalTable()
  const jtSwitch = Form.useWatch('ladderPrice', form)
  const ladderRangeValue = Form.useWatch('ladderRange', form)
  const minOrder = schemaAction.getFieldValue('minOrder') || 1

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        ladderPrice,
        setLadderPrice,
        isBatchSetting,
        setIsBatchSetting,
        curretSetPriceRow,
        setCurrentSetPriceRow,
      }
    }
  }, [])

  useEffect(() => {
    let record = { ...curretSetPriceRow }

    if (record && JSON.stringify(record) !== '{}' && record.id) {
      setVisible(true)
      setIsBatchSetting(false)
      form.resetFields()
      // 0-0为 非阶梯
      if (
        Object.keys(record[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })])[0] === '0-0'
      ) {
        setLadderPrice(false)
        form.setFieldsValue({
          ladderPrice: false,
          uniquePrice: Object.values(
            record[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })],
          )[0],
        })
      } else if (
        JSON.stringify(record[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })]) === '{}'
      ) {
        // {} 为新增
        setLadderPrice(false)
      } else {
        // 编辑
        setLadderPrice(true)
        let numberArray = Object.keys(
          record[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })],
        ).map((item) => item.split('-').map((_) => Number(_)))
        let priceArray = Object.values(
          record[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })],
        )
        let tempArr: any[] = []
        numberArray.map((_item, _index) => {
          tempArr.push({
            numberPrice: priceArray[_index],
            numberMin: _item[0],
            numberMax: _item[1],
          })
        })
        form.setFieldsValue({ ladderPrice: true, ladderRange: tempArr })
      }
    }
  }, [curretSetPriceRow])

  useEffect(() => {
    if (isBatchSetting) {
      form.resetFields()
      form.setFields([{ name: 'ladderPrice', value: false }])
      currentRef.current.setLadderPrice(false)
    }
  }, [isBatchSetting])

  const handlePriceOk = () => {
    form.validateFields().then((v) => {
      setVisible(false)
      let memberUnitPriceList = schemaAction.getFieldValue('memberUnitPriceList')

      const { ladderPrice, ladderRange } = v
      let _priceRange = {}
      if (ladderPrice) {
        // 判断阶梯价格
        ladderRange.length > 0 &&
          ladderRange.map((item) => {
            _priceRange[`${item.numberMin}-${item.numberMax}`] = item.numberPrice
          })
      } else {
        _priceRange['0-0'] = v.uniquePrice
      }

      let _row = {
        ...curretSetPriceRow,
        [intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })]: _priceRange,
      }
      let newTabeData: any[] = []
      if (isBatchSetting) {
        // 判断是否批量设置价格
        memberUnitPriceList.forEach((element) => {
          let __item = { ...element }
          __item[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.unitPrice' })] = _priceRange
          newTabeData.push(__item)
        })
      } else {
        memberUnitPriceList.forEach((element) => {
          if (
            element[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.index' })] ===
            curretSetPriceRow[intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.index' })]
          ) {
            newTabeData.push(_row)
          } else {
            newTabeData.push({ ...element })
          }
        })
      }

      schemaAction.setFieldValue('memberUnitPriceList', newTabeData)
    })
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

  const renderPrice = useMemoizedFn(() => {
    return (
      <>
        <Form.Item
          name="uniquePrice"
          label={translate('web.common.danjia')}
          rules={[
            {
              required: true,
              type: 'number',
              message: intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.uniquePrice.rule.1' }),
            },
            {
              pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
              message: intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.uniquePrice.rule.2' }),
            },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </>
    )
  })

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
              <Col span={10}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian1')}</span>
              </Col>
              <Col span={9}>
                <span className={styles.label}>{translate('web.resource.commodity.jiagequjian2')}</span>
              </Col>
              <Col span={5}>
                <span className={styles.label}>
                  {translate('web.common.danjia')}
                  <i className={styles.redStar}>*</i>
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.List name="ladderRange">
          {(fields, { add, remove }) => {
            if (!fields.length) {
              add()
            }
            return (
              <div>
                <div>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const minDisabled = index !== 0
                    const minInitValue = index === 0 ? minOrder : Number(ladderRangeValue?.[index - 1]?.numberMax) + 1

                    const handleChange = (e) => {
                      const value = e.target.value
                      const readyIndex = index + 1
                      if (fields.length !== 1 && readyIndex !== fields.length) {
                        form.setFieldValue(['ladderRange', readyIndex, 'numberMin'], Number(value) + 1)
                      }
                    }
                    return (
                      <Row key={key} gutter={[0, 10]}>
                        <Col span={20} style={{ display: 'flex' }}>
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
                              disabled={minDisabled}
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
                                message: translate.formatFormInputTip(translate('web.common.danjia')),
                              },
                              {
                                pattern: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$|^[0]$/,
                                message: translate('web.resource.commodity.danjiaxiaoshu'),
                              },
                            ]}
                            style={{ marginLeft: 20 }}
                          >
                            <InputNumber
                              min={0}
                              placeholder={translate.formatFormInputTip(translate('web.common.danjia'))}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          {key > 0 && (
                            <Button style={{ marginLeft: 16 }} onClick={() => remove(name)} icon={<MinusOutlined />} />
                          )}
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

  return (
    <Modal
      title={
        currentRef.current.isBatchSetting
          ? intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.title.1' })
          : intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.title.2' })
      }
      open={visible}
      onOk={handlePriceOk}
      onCancel={() => setVisible(false)}
      forceRender={true}
      {...restProps}
    >
      <Form
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="settingPrice"
        form={form}
        autoComplete="off"
        initialValues={{ ladderPrice: false }}
      >
        <Form.Item
          name="ladderPrice"
          label={intl.formatMessage({ id: 'priceManage.priceStrategy.priceModal.ladderPrice' })}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        {jtSwitch ? renderAddPrice() : renderPrice()}
      </Form>
    </Modal>
  )
}

PriceModal.defaultProps = {}

export default PriceModal
