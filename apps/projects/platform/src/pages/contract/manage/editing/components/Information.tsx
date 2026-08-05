import React, { useState, useEffect, forwardRef } from 'react'
import { Input, Select, DatePicker, Form } from 'antd'
import style from '../../../constants/styles.less'
import moment from 'moment'
import { getContractManageGetContractNo, getContractSelectCurrencyList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const { Option } = Select
const { RangePicker } = DatePicker
const intl = getIntl()
const Information = (props: any) => {
  const { currentRef, basic, oldContractId, getbasicsVO, getPicker, getroleId } = props
  const [attrValueForm] = Form.useForm()
  const [startTime, setstartTime] = useState('')
  const [endTime, setendTime] = useState('')
  const [currencyList, setCurrencyList] = useState<any>([])

  /**
   * @param {{basicsVO}} 表单数据集合
   * */
  useEffect(() => {
    basic.sourceType = String(basic.sourceType)

    getroleId(basic.partyBRoleId)
    if (basic.contractNo) {
      if (oldContractId) {
        const data = { oldContractNo: basic.contractNo }
        console.log(data, 123131, basic)
        getContractManageGetContractNo(data)
          .then((res) => {
            console.log(res.data)
            if (res.code === 1000) {
              basic.contractNo = res.data
              const rangePicker = []
              const startTimes = moment(basic.startTime)
              const endTimes = moment(basic.endTime)
              setstartTime(basic.startTime)
              setendTime(basic.endTime)
              rangePicker.push(startTimes, endTimes)
              basic.rangePicker = rangePicker
              attrValueForm.setFieldsValue(basic)
              getbasicsVO(basic)
            }
          })
          .catch(() => {})
      } else {
        const rangePicker = []
        const startTimes = moment(basic.startTime)
        const endTimes = moment(basic.endTime)
        setstartTime(basic.startTime)
        setendTime(basic.endTime)
        rangePicker.push(startTimes, endTimes)
        basic.rangePicker = rangePicker
        attrValueForm.setFieldsValue(basic)
        getbasicsVO(basic)
      }
    }
  }, [basic])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          attrValueForm
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'basic',
                data: Object.assign(res, {
                  id: oldContractId ? 0 : basic.id,
                  partyBRoleId: basic.partyBRoleId,
                  startTime,
                  endTime,
                  sourceId: basic.sourceId,
                  totalAmount: basic.totalAmount,
                  partyBMemberId: basic.partyBMemberId,
                  partyBName: basic.partyBName,
                  oldContractId: oldContractId ? basic.id : 0,
                }),
              })
            })
            .catch((error) => {
              if (error && error.errorFields) {
              }
            })
        }),
    }
  })

  /* 获取币别列表 */
  useEffect(() => {
    getContractSelectCurrencyList().then((res) => {
      if (res.code === 1000) {
        setCurrencyList(res.data)
      }
    })
  }, [])

  /* 时间选中 */
  const onChange = (value: any) => {
    console.log(value)
    const startTimes = moment(Number(value[0])).format('YYYY-MM-DD HH:mm:ss')
    const endTimes = moment(Number(value[1])).format('YYYY-MM-DD HH:mm:ss')
    setstartTime(startTimes)
    setendTime(endTimes)
    getPicker({
      startTimes,
      endTimes,
    })
  }
  const rangeConfig = {
    rules: [
      {
        type: 'array' as const,
        required: true,
        message: intl.formatMessage({ id: 'contract.qingxuanzekaishihuozhejie' }),
      },
    ],
  }
  return (
    <div className={style.revise_info}>
      <Form
        form={attrValueForm}
        name="edit_infomation"
        layout="horizontal"
        labelAlign="left"
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongbianhao' })}
          labelAlign="left"
          name="contractNo"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          initialValue={basic.contractNo}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' }),
            },
          ]}
        >
          {/* disabled */}
          <Input placeholder={intl.formatMessage({ id: 'contract.qingshuruhetongbianhao' })} disabled />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongzhaiyao' })}
          labelAlign="left"
          name="contractAbstract"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'contract.qingshuruhetongzhaiyao' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.xunyuanleixing' })}
          labelAlign="left"
          name="sourceType"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          initialValue={basic.sourceType}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingxuanzexunyuanleixing' }),
            },
          ]}
        >
          <Select disabled>
            <Option value="1">{intl.formatMessage({ id: 'contract.caigouxunjia' })}</Option>
            <Option value="2">{intl.formatMessage({ id: 'contract.caigouzhaobiao' })}</Option>
            <Option value="3">{intl.formatMessage({ id: 'contract.caigoujingjia' })}</Option>
            <Option value="4">{intl.formatMessage({ id: 'contract.purchase.title' })}</Option>
            <Option value="5">{intl.formatMessage({ id: 'contract.framework.title' })}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongyouxiaoqi' })}
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          name="rangePicker"
          {...rangeConfig}
        >
          <RangePicker style={{ width: '100%' }} onChange={(e) => onChange(e)} />
        </Form.Item>
        {basic.sourceType != 4 ? (
          <Form.Item
            label={intl.formatMessage({ id: 'contract.duiyingdanju' })}
            labelAlign="left"
            labelCol={{ span: 2 }}
            name="sourceNo"
            initialValue={basic.sourceNo ? basic.sourceNo : ''}
            wrapperCol={{ span: 8 }}
          >
            <Input placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })} disabled />
          </Form.Item>
        ) : null}

        <Form.Item
          label={intl.formatMessage({ id: 'contract.supplier' })}
          labelAlign="left"
          labelCol={{ span: 2 }}
          name="partyBName"
          initialValue={basic.partyBName ? basic.partyBName : ''}
          wrapperCol={{ span: 8 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'contract.qingxuanzeshoubiaohuiyuan' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'contract.zuichang60gezifu30ge' })} disabled />
        </Form.Item>

        {/* 币别 */}
        <Form.Item
          label={intl.formatMessage({ id: 'contract.currency' })}
          labelAlign="left"
          name="currencyType"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          initialValue={basic.currency ? basic.currency : ''}
        >
          <Select placeholder={intl.formatMessage({ id: 'contract.currency.tip' })}>
            {currencyList?.length ? currencyList.map((item) => <Option value={item.id}>{item.text}</Option>) : null}
          </Select>
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'contract.hetongjine' })}
          labelAlign="left"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
        >
          <p>{basic.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basic.totalAmount}` : ''}</p>
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(Information)
