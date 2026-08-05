import React, { useState, useEffect } from 'react'
import { Form, Input, Tooltip, DatePicker, Checkbox } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: any
  onBadge: (num: number, idx: number) => void
  exRef: any
}

const BidRules: React.FC<Iprops> = (props: any) => {
  const { currentRef, fetchdata, onBadge, exRef } = props
  const [isStartingPrice, setIsStartingPrice] = useState<boolean>(true)
  const [isTargetPrice, setIsTargetPrice] = useState<boolean>(true)
  const [isMinPrice, setIsMinPrice] = useState<boolean>(true)
  const [isOpenPurchase, setIsOpenPurchase] = useState<boolean>(false)
  const [isOpenRanking, setIsOpenRanking] = useState<boolean>(false)
  const [startingPrice, setStartingPrice] = useState<any>('')
  const [targetPrice, setTargetPrice] = useState<any>('')
  const [minPrice, setMinPrice] = useState<any>('')
  const [allowPurchaseCount, setAllowPurchaseCount] = useState<any>('')
  const [form] = Form.useForm()
  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              let _formData = { ...res }
              resolve({
                state: true,
                name: 'rules',
                data: {
                  biddingStartTime: moment(_formData.biddingTime[0]).format('x'),
                  biddingEndTime: moment(_formData.biddingTime[1]).format('x'),
                  isStartingPrice: Number(isStartingPrice),
                  isTargetPrice: Number(isTargetPrice),
                  isMinPrice: Number(isMinPrice),
                  isOpenPurchase: Number(isOpenPurchase),
                  isOpenRanking: Number(isOpenRanking),
                  startingPrice: _formData.startingPrice,
                  targetPrice: _formData.targetPrice,
                  allowPurchaseCount: _formData.allowPurchaseCount,
                  minPrice: _formData.minPrice,
                },
              })
              onBadge(0, 2)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 2)
              }
            })
        }),
      biddingTime: () => form.getFieldValue('biddingTime'),
    }
  })

  useEffect(() => {
    fetchdata.isStartingPrice != undefined && setIsStartingPrice(!!fetchdata.isStartingPrice)
    fetchdata.isTargetPrice != undefined && setIsTargetPrice(!!fetchdata.isTargetPrice)
    fetchdata.isMinPrice != undefined && setIsMinPrice(!!fetchdata.isMinPrice)
    setIsOpenPurchase(!!fetchdata.isOpenPurchase)
    setIsOpenRanking(!!fetchdata.isOpenRanking)
    setStartingPrice(fetchdata.startingPrice)
    setTargetPrice(fetchdata.targetPrice)
    setMinPrice(fetchdata.minPrice)
    setAllowPurchaseCount(fetchdata.allowPurchaseCount)
    form.setFieldsValue({
      biddingTime: [
        fetchdata.biddingStartTime ? moment(fetchdata.biddingStartTime) : '',
        fetchdata.biddingEndTime ? moment(fetchdata.biddingEndTime) : '',
      ],
      isStartingPrice: !!fetchdata.isStartingPrice,
      isTargetPrice: !!fetchdata.isTargetPrice,
      isMinPrice: !!fetchdata.isMinPrice,
      isOpenPurchase: !!fetchdata.isOpenPurchase,
      isOpenRanking: !!fetchdata.isOpenRanking,
      startingPrice: fetchdata.startingPrice,
      targetPrice: fetchdata.targetPrice,
      allowPurchaseCount: fetchdata.allowPurchaseCount,
      minPrice: fetchdata.minPrice,
    })
  }, [fetchdata])

  const onCheckboxChange = (e: { target: { checked: boolean } }, func: Function, name?: string) => {
    func(e.target.checked)
    if (!e.target.checked && name) {
      form.setFieldsValue({ [`${name}`]: '' })
    }
  }

  return (
    <>
      <Form {...layout} form={form} className={styles.form}>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.biddingStartTime' })}
          name="biddingTime"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'detail.purchase.message47' }) },
            () => ({
              async validator(_, value, callback) {
                let _exVal = await exRef.current.signUpTime()
                if (_exVal?.[1] && value?.[0] && moment(value?.[0]).isBefore(_exVal?.[1])) {
                  return callback(intl.formatMessage({ id: 'detail.purchase.message48' }))
                }
                if (!value?.[0] || !value?.[1]) {
                  return callback(intl.formatMessage({ id: 'detail.purchase.message47' }))
                } else {
                  return callback()
                }
              },
            }),
          ]}
        >
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={[
              intl.formatMessage({ id: 'detail.purchase.startTime1' }),
              intl.formatMessage({ id: 'detail.purchase.endTime1' }),
            ]}
            disabledDate={(current) => {
              return current && current < moment().startOf('second')
            }}
          />
        </Form.Item>
        <Form.Item
          name="isStartingPrice"
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips9' })}>
              {intl.formatMessage({ id: 'detail.purchase.startingPrice' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
        >
          <Checkbox
            checked={isStartingPrice}
            onChange={(e) => {
              onCheckboxChange(e, setIsStartingPrice, 'startingPrice')
            }}
          >
            {intl.formatMessage({ id: 'detail.purchase.isStartingPrice' })}
          </Checkbox>
        </Form.Item>
        {isStartingPrice && (
          <Form.Item
            label=" "
            name="startingPrice"
            className={styles.hidden}
            rules={[
              {
                required: isStartingPrice ? true : false,
                message: intl.formatMessage({ id: 'detail.purchase.placeholder9' }),
                type: 'number',
                whitespace: true,
                transform(value) {
                  if (value) {
                    return parseFloat(value)
                  }
                },
              },
              () => ({
                validator(_, value) {
                  if (Number(value) <= 0) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message49' })))
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input
              addonBefore={translate('web.common.currencySymbol')}
              value={startingPrice}
              placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder9' })}
              onChange={(e) => {
                let _val = e.target.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
                setStartingPrice(_val)
                form.setFieldsValue({ startingPrice: _val })
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips10' })}>
              {intl.formatMessage({ id: 'detail.purchase.targetPrice' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="isTargetPrice"
        >
          <Checkbox
            checked={isTargetPrice}
            onChange={(e) => {
              onCheckboxChange(e, setIsTargetPrice, 'targetPrice')
            }}
          >
            {intl.formatMessage({ id: 'detail.purchase.isStartingPrice1' })}
          </Checkbox>
        </Form.Item>
        {isTargetPrice && (
          <Form.Item
            label=" "
            name="targetPrice"
            className={styles.hidden}
            rules={[
              {
                required: isTargetPrice ? true : false,
                message: intl.formatMessage({ id: 'detail.purchase.placeholder10' }),
                type: 'number',
                whitespace: true,
                transform(value) {
                  if (value) {
                    return parseFloat(value)
                  }
                },
              },
              () => ({
                validator(_, value) {
                  if (Number(value) <= 0) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message50' })))
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input
              addonBefore={translate('web.common.currencySymbol')}
              value={targetPrice}
              placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder10' })}
              onChange={(e) => {
                let _val = e.target.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
                setTargetPrice(_val)
                form.setFieldsValue({ targetPrice: _val })
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips11' })}>
              {intl.formatMessage({ id: 'detail.purchase.minPrice' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="isMinPrice"
        >
          <Checkbox
            checked={isMinPrice}
            onChange={(e) => {
              onCheckboxChange(e, setIsMinPrice, 'minPrice')
            }}
          >
            {intl.formatMessage({ id: 'detail.purchase.isMinPrice' })}
          </Checkbox>
        </Form.Item>
        {isMinPrice && (
          <Form.Item
            name="minPrice"
            label=" "
            className={styles.hidden}
            rules={[
              {
                required: isMinPrice ? true : false,
                message: intl.formatMessage({ id: 'detail.purchase.placeholder11' }),
                type: 'number',
                whitespace: true,
                transform(value) {
                  if (value) {
                    return parseFloat(value)
                  }
                },
              },
              () => ({
                validator(_, value) {
                  if (Number(value) <= 0) {
                    return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message51' })))
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Input
              addonBefore={translate('web.common.currencySymbol')}
              value={minPrice}
              placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder11' })}
              onChange={(e) => {
                let _val = e.target.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
                setMinPrice(_val)
                form.setFieldsValue({ minPrice: _val })
              }}
            />
          </Form.Item>
        )}
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips12' })}>
              {intl.formatMessage({ id: 'detail.purchase.allowPurchaseCount' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="allowPurchaseCount"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'detail.purchase.message52' }),
              type: 'number',
              whitespace: true,
              pattern: new RegExp(/^[1-9]\d*$/, 'g'),
              transform(value) {
                if (value) {
                  return parseInt(value)
                }
              },
            },
            () => ({
              validator(_, value) {
                if (Number(value) <= 0) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'detail.purchase.message53' })))
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ]}
        >
          <Input
            value={allowPurchaseCount}
            placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder12' })}
            onChange={(e) => {
              let _val = e.target.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '')
              setAllowPurchaseCount(_val)
              form.setFieldsValue({ allowPurchaseCount: _val })
            }}
          />
        </Form.Item>
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips13' })}>
              {intl.formatMessage({ id: 'detail.purchase.isOpenPurchase' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="isOpenPurchase"
        >
          <Checkbox
            checked={isOpenPurchase}
            onChange={(e) => {
              onCheckboxChange(e, setIsOpenPurchase)
            }}
          >
            {intl.formatMessage({ id: 'detail.purchase.isOpenPurchase1' })}
          </Checkbox>
        </Form.Item>
        <Form.Item
          label={
            <Tooltip placement="right" title={intl.formatMessage({ id: 'detail.purchase.tips14' })}>
              {intl.formatMessage({ id: 'detail.purchase.isOpenRanking' })}
              <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
          }
          name="isOpenRanking"
        >
          <Checkbox
            checked={isOpenRanking}
            onChange={(e) => {
              onCheckboxChange(e, setIsOpenRanking)
            }}
          >
            {intl.formatMessage({ id: 'detail.purchase.isOpenRanking1' })}
          </Checkbox>
        </Form.Item>
      </Form>
    </>
  )
}
export default BidRules
