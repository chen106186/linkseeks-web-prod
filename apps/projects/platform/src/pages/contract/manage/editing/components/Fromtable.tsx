import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import {
  Button,
  Card,
  Tabs,
  Table,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Form,
  Checkbox,
  Drawer,
  Typography,
  Modal,
  InputNumber,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from '../index.less'
const { TextArea, Search } = Input
const { Option } = Select
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import BigNumber from 'bignumber.js'
const FormList = (props: any) => {
  const { currentRef, payPlanList, Price, form } = props
  // const [payNumArr, setpayNumArr] = useState<any>([1,])
  const [keys, setkeys] = useState<any>() // 记录上次删除的
  const [options, setoptions] = useState<any>([
    {
      value: 1,
      disabled: true,
    },
  ])
  const [payRatioErr, setPayRatioErr] = useState<boolean>(false)
  const [payAmountErr, setPayAmountErr] = useState<boolean>(false)

  const intl = getIntl()
  const [PlanList, setPlanList] = useState<any>([])
  const onblurkey = (e, name, idx) => {
    let item = [...PlanList]
    switch (name) {
      case 'payAmount':
        item[idx].payAmount = Number(item[idx].payAmount).toFixed(2)
        break
    }
    setPlanList(item)
  }
  /* 显示模态框 */
  const tabcolumns: any = [
    {
      title: intl.formatMessage({ id: 'contract.fukuancishu' }),
      dataIndex: 'payNum',
      align: 'left',
      render: (_, item, index) => {
        return (
          <Select
            style={{ width: 200 }}
            defaultValue={item.payNum}
            options={options}
            key="1"
            onChange={(e) => onSelectChange(e, 'payNum', index)}
          ></Select>
        )
      },
    },
    // {
    //   title: intl.formatMessage({ id: 'contract.fukuanjieduan' }), dataIndex: 'payStage', align: 'left',
    //   render: (_, item, index) =>
    // },
    {
      title: intl.formatMessage({ id: 'contract.fukuanjieduan' }),
      dataIndex: 'payStage',
      align: 'left',
      render: (_, item, index) => (
        <Form.Item
          name={`payStage${item.id}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEmpty' }),
            },
          ]}
          initialValue={item.payStage}
          // initialValue={text != '' ? text : ''}
        >
          <TextArea
            defaultValue={item.payStage}
            maxLength={150}
            rows={1}
            onChange={(e) => onSelectChange(e, 'payStage', index)}
          />
        </Form.Item>
      ),
    },

    {
      title: intl.formatMessage({ id: 'contract.yujifukuanshijian' }),
      dataIndex: 'expectPayTime',
      align: 'left',
      render: (_, item, index) => (
        <Form.Item
          name={`expectPayTime${item.id}`}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEmpty' }),
            },
          ]}
          initialValue={item.expectPayTime}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            defaultValue={item.expectPayTime}
            onChange={(e) => onSelectChange(e, 'expectPayTime', index)}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanbili' }),
      dataIndex: 'payRatio',
      align: 'left',
      render: (text, item, index) => (
        <Form.Item
          name={`payRatio${item.id}`}
          rules={[
            {
              required: true,
              pattern: /^((\d|[1-9]\d)(\.\d{1,3})?|100|100.000|100.00|100.0)$/,
              message: `${intl.formatMessage({
                id: 'member.memberInspection.common.schema.add.plzFillNumberNoMore100Len3',
              })}`,
            },
            ({ getFieldValue }) => ({
              validator: (_rule, value) => {
                if (payRatioErr) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'contract.payRatio100' })))
                }
                return Promise.resolve()
              },
            }),
          ]}
          initialValue={text}
        >
          <div className={styles.flex}>
            <Input
              style={{
                width: 150,
              }}
              // defaultValue={text}
              value={text}
              placeholder=""
              onBlur={(e) => onblurkey(e, 'payAmount', index)}
              onChange={(e) => onSelectChange(e, 'payRatio', index)}
            />
            <span>%</span>
          </div>
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanjine' }),
      dataIndex: 'payAmount',
      align: 'left',
      render: (text, item, index) => (
        <Form.Item
          name={`payAmount${item.id}`}
          rules={[
            {
              required: true,
              pattern: /^\d*(?:\.\d{0,2})?$/,
              message: intl.formatMessage({ id: 'payandSettle.capitalAccounts.eAccount.jinejinxianliang' }),
            },
            ({ getFieldValue }) => ({
              validator: (_rule, value) => {
                if (payAmountErr) {
                  return Promise.reject(new Error(intl.formatMessage({ id: 'contract.verify.payAmount' })))
                }
                return Promise.resolve()
              },
            }),
          ]}
          initialValue={text}
        >
          <div className={styles.flex}>
            <span>{intl.formatMessage({ id: 'common.money' })}</span>

            <Input
              style={{
                width: 130,
              }}
              placeholder=""
              value={text}
              onChange={(e) => onSelectChange(e, 'payAmount', index)}
            />
          </div>
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.fukuanfangshi' }),
      dataIndex: 'payWay',
      align: 'left',
      render: (_, item, index) => (
        <Form.Item
          name={`payParam${item.id}`}
          rules={[
            {
              required: item.payWay != 3 ? true : false,
              message: intl.formatMessage({ id: 'classAndProperty.attribute.addAttribute.form.isEmpty' }),
            },
          ]}
          initialValue={item.payParam}
        >
          <div className={styles.select}>
            <Select
              style={{ width: 208 }}
              onChange={(e) => onSelectChange(e, 'payWay', index)}
              defaultValue={String(item.payWay)}
            >
              <Option value="3" key={3}>
                {intl.formatMessage({ id: 'contract.xianjie' })}
              </Option>
              <Option value="1" key={1}>
                {intl.formatMessage({ id: 'contract.zhangqi' })}：
              </Option>
              <Option value="2" key={2}>
                {intl.formatMessage({ id: 'contract.yuejie' })}：
              </Option>
            </Select>
            {item.payWay != 3 && (
              <div className={styles.setBox}>
                {/* payParam */}
                <InputNumber
                  placeholder=""
                  defaultValue={item.payParam}
                  onChange={(e) => onSelectChange(e, 'payParam', index)}
                  width={60}
                  max={item.payWay == 2 ? 31 : 999}
                />
                <span>
                  {item.payWay == 2
                    ? intl.formatMessage({ id: 'contract.hao' })
                    : item.payWay == 1
                    ? intl.formatMessage({ id: 'contract.tian' })
                    : ''}
                </span>
              </div>
            )}
          </div>
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: '',
      align: 'center',
      key: 'x',
      render: (_, item, index) => (
        <a onClick={() => Delete(item, index)}>{intl.formatMessage({ id: 'contract.shanchu' })}</a>
      ),
    },
  ]
  /* 添加 */
  const addtable = () => {
    const data = [...PlanList]

    const random = String(data.length) + String(Math.random())

    if (keys) {
      data.push(keys)
      setkeys('')
    } else {
      data.push({
        payNum: data.length + 1,
        payStage: '',
        expectPayTime: '',
        payRatio: '',
        payAmount: '',
        payWay: '3',
        payParam: '',
        id: random,
        rowId: data.length + 1,
        disabled: false,
      })
    }

    let optionsData = data.map((item, index) => {
      return {
        value: item.payNum ? item.payNum : index + 1,
        disabled: item.payNum ? true : false,
        rowId: item.rowId,
      }
    })

    setPlanList(data)
    setoptions(optionsData)
  }
  /* 删除 */
  const Delete = (elm, idx) => {
    const dataSource = [...PlanList]
    let List = dataSource.filter((item, index) => index !== idx)
    let optionsData = options.map((keys) => {
      if (elm.payNum == keys.value) {
        keys.disabled = false
      }
      return {
        ...keys,
      }
    })
    handleItemChange(List)
    setkeys(elm)
    setPlanList(List)
    setoptions(optionsData)
  }

  /* 选中设置值 */
  const onSelectChange = (e, name, idx) => {
    let flag: boolean = false // 是否触发金额总值变化
    console.log(e, name, idx)
    let item = [...PlanList]

    // return;
    switch (name) {
      case 'payWay':
        item[idx].payWay = e
        break
      case 'payNum':
        item[idx].payNum = e

        break
      case 'expectPayTime':
        item[idx].expectPayTime = moment(e).format('YYYY-MM-DD HH:mm:ss')
        break
      case 'payStage':
        item[idx].payStage = e.target.value
        break

      case 'payRatio':
        flag = true
        item[idx].payRatio = e.target.value
        if (Price != 0) {
          item[idx].payAmount = ((e.target.value / 100) * Price).toFixed(2)
          form.setFieldsValue({
            [`payAmount${item[idx].id}`]: item[idx].payAmount,
          })
        }
        break
      case 'payAmount':
        flag = true
        if (Price != 0) {
          item[idx].payRatio = Number((e.target.value / Price) * 100).toFixed(3)
          form.setFieldsValue({
            [`payRatio${item[idx].id}`]: item[idx].payRatio,
          })
        }
        item[idx].payAmount = e.target.value
        break
      case 'payParam':
        item[idx].payParam = e
        break
    }

    setPlanList(item)
    if (flag) handleItemChange(item)
  }

  const handleItemChange = (list) => {
    let nowNum = 0
    let nowRatio = 0
    list.map((i) => {
      nowRatio = new BigNumber(+nowRatio).plus(i.payRatio || 0).toNumber()
      nowNum = new BigNumber(+nowNum).plus(i.payAmount || 0).toNumber()
    })

    if (nowRatio > 100) {
      setPayRatioErr(true)
    } else {
      setPayRatioErr(false)
    }

    if (nowNum > Price) {
      setPayAmountErr(true)
    } else {
      setPayAmountErr(false)
    }
    //触发验证
    list.map((i, k) => {
      form.validateFields(['payRatio' + i.id])
      form.validateFields(['payAmount' + i.id])
    })
  }

  useEffect(() => {
    PlanList.map((i) => {
      if (i.payAmount) {
        i.payRatio = (new BigNumber(i.payAmount || 0).div(+Price).toNumber() * 100).toFixed(2)
        form.setFieldsValue({
          [`payRatio${i.id}`]: i.payRatio,
        })
      }
    })
    setPlanList(PlanList)
    handleItemChange(PlanList)
  }, [Price])

  useEffect(() => {
    payPlanList.map((item) => {
      item.expectPayTime = moment(item.expectPayTime)
    })
    setPlanList(payPlanList)
  }, [payPlanList])

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          let res = PlanList.map((item) => {
            return {
              expectPayTime: item.expectPayTime,
              payAmount: Number(item.payAmount).toFixed(2),
              payNum: Number(item.payNum),
              payParam: item.payParam,
              payStage: item.payStage,
              payRatio: Number(item.payRatio),
              payState: item.payState,
              payWay: Number(item.payWay),
              // 付款方式: 1 - 账期，2 - 月结，3 - 现结
              payWayName: item.payWayName,
            }
          })
          resolve(res)
        }),
    }
  })

  return (
    <div className={styles.formNoStyle}>
      <Form form={form}>
        <Table
          columns={tabcolumns}
          dataSource={PlanList}
          rowKey="rowId"
          style={{
            width: '100%',
          }}
          pagination={false}
        />
      </Form>
      <div style={{ background: '#F4F5F7' }} onClick={() => addtable()}>
        <Button block type="dashed">
          <PlusOutlined />
          {intl.formatMessage({ id: 'contract.tianjiafukuanjihua' })}
        </Button>
      </div>
    </div>
  )
}

export default forwardRef(FormList)
