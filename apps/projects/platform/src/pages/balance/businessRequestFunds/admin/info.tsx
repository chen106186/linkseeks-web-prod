import React, { useEffect, useState, useMemo } from 'react'
import { Form, Button, Row, Col, Input, Select, DatePicker, Radio, Table, Space, Typography, message } from 'antd'
import type { ColumnType } from 'antd/lib/table/interface'
import { CheckCircleOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation, usePrompt } from '@linkseeks/router-core'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { authService } from '@apps/services'

import StatusTag from '@/components/StatusTag'
import {
  getSettlementBusinessReconciliationItemPayType,
  getSettlementBusinessApplyAmountApplyAmountRowList,
  getSettlementPlatformSettlementTypeList,
  postSettlementBusinessApplyAmountSaveApplyAmount,
  getSettlementCorporateAccountConfig,
  getSettlementBusinessApplyAmountItemApplyAmountType,
  getSettlementBusinessApplyAmountDetailApplyAmount,
  postSettlementBusinessApplyAmountUpdate,
} from '@apps/apis'
import PeripheralLayout from '@/pages/procurementAbility/components/detail'
import { Card } from '@linkseeks/ui'

import WriteOffDrawer from '../../components/WriteOffDrawer'
import ContractDrawer from '../components/contractDrawer'
import MemberDrawer from '../components/memberDrawer'
import RequestFundsDrawer from '../components/requestFundsDrawer'

import styles from './add.less'
const { Text, Link } = Typography

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
}
const intl = getIntl()
const TABLINK = [
  { id: 'basicLayout', title: intl.formatMessage({ id: 'balance.jibenxinxi' }) },
  {
    id: 'billLayout',
    title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.billLayout' }),
  },
]

const reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{0,3}$)/

const createMonthOrDays = (number: number, type: string) => {
  const _list = []
  for (let i = 1; i <= number; i++) {
    _list.push({
      label:
        type === 'month'
          ? intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.createMonthOrDays.month', data: i })
          : intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.createMonthOrDays.days', data: i }),
      value: i,
    })
  }
  return _list
}

const DAYSLIST = createMonthOrDays(31, 'days')
const MONTHSLIST = createMonthOrDays(12, 'month')

/** 订单类 */
const ORDER_TYPE = 1
/** 合同类 */
const CONTRACT_TYPE = 2

const Add = () => {
  const { id, no } = useQuery()
  const { state, pathname } = useLocation()
  const _state: any = state
  const [form] = Form.useForm()
  const getApplyType = (name: string) => {
    let value = 2
    if (name) {
      if (name.substring(name.length - 2) === '合同') {
        value = CONTRACT_TYPE
      } else {
        value = ORDER_TYPE
      }
      form.setFieldsValue({
        documentType: value,
      })
    }
    return value
  }

  const { memberId, memberRoleId, memberName: name } = authService.getAuth() || {}
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [payWayData, setPayWayData] = useState<any>([])
  const [payWay, setPayWay] = useState<number>(1)
  const [dataSource, setDataSource] = useState<any>(_state?.data ?? {})
  const [tabelSource, setTabelSource] = useState<any>([])
  const [applyOptions, setApplyOptions] = useState<any>(
    path === 'funds' || path === 'editFunds'
      ? [{ label: _state?.data?.applyTypeName, value: _state?.data?.applyType }]
      : [],
  )
  const [applyType, setApplyType] = useState<number>(getApplyType(applyOptions[0]?.label))
  const [moneyPayWayOptions, setMoneyPayWayOptions] = useState<any>([])
  const [writeOffDrawer, setWriteOffDrawer] = useState<boolean>(false)
  const [contractDrawerVisible, setContractDrawerVisible] = useState<boolean>(false)
  const [memberDrawerVisible, setMemberDrawerVisible] = useState<boolean>(false)
  const [requestFundsDrawerVisible, setRequestFundsDrawerVisible] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [documentType, setDocumentType] = useState<number>(getApplyType(applyOptions[0]?.label))
  const [writeOffData, setWriteOffData] = useState<any>({})
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const _tabs = useMemo(() => {
    const _list = []
    TABLINK.forEach((item) => {
      _list.push(item)
    })
    return _list
  }, [pathPci])

  const _title = useMemo(() => {
    switch (path) {
      case 'add':
        return intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.title.1' })
      case 'edit':
        return intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.title.2' })
      case 'funds':
      case 'fundsEdit':
        return intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.title.3' })
    }
  }, [path])

  const _isFunds = useMemo(() => {
    return path !== 'add' && path !== 'edit'
  }, [path])

  const _isAdd = useMemo(() => {
    return path === 'add' || path === 'funds'
  }, [path])

  useEffect(() => {
    getSettlementBusinessReconciliationItemPayType().then((res) => {
      if (res.code === 1000) {
        setPayWayData(res.data)
      }
    })
    getSettlementPlatformSettlementTypeList().then((res) => {
      if (res.code === 1000) {
        setMoneyPayWayOptions(
          res.data.map((item) => {
            return { label: item.methodName, value: item.methodCode }
          }),
        )
      }
    })
    if (_state?.data?.vendorMemberId) {
      form.setFieldsValue({
        applyAbstract: _state?.data.applyAbstract,
        payee: _state?.data.payee,
        settlementTime: moment(_state?.data.settlementTime),
        expectPayTime: moment(_state?.data.expectPayTime),
      })
      setTabelSource(_state?.data.rows)
    }
    if (!_isFunds) {
      console.log(123131)
      getSettlementBusinessApplyAmountItemApplyAmountType().then((res) => {
        if (res.code === 1000) {
          if (!id) {
            form.setFieldsValue({ applyType: res.data[0].id })
          }
          setApplyOptions(
            res.data.map((item) => {
              return { label: item.text, value: item.id }
            }),
          )
        }
      })
    }
    if (!_isAdd) {
      const _params: any = {
        applyAmountId: id,
        applyNo: no,
      }
      getSettlementBusinessApplyAmountDetailApplyAmount(_params).then((res) => {
        if (res.code === 1000) {
          const data = res.data
          form.setFieldsValue({
            applyType: data.applyType,
            applyAbstract: data.applyAbstract,
            expectPayTime: moment(data.expectPayTime),
            settlementTime: data.settlementTime ? moment(data.settlementTime) : undefined,
            payWay: data.payWay,
            moneyPayWay: data.moneyPayWay,
            payMonth: data.payMonth,
            payDate: data.payDate,
            payee: data.payee,
            remark: data.remark,
          })
          if (_isFunds) {
            setApplyOptions([{ label: data.applyTypeName, value: data.applyType }])
          }
          setDataSource(data)
        }
      })
      getSettlementBusinessApplyAmountApplyAmountRowList({
        ..._params,
        current: 1,
        pageSize: 10000,
      }).then((res) => {
        if (res.code === 1000) {
          setTabelSource(res.data.data)
        }
      })
    }
  }, [])

  const _mapTablePriceByKey = (key: string) => {
    let _val = 0
    tabelSource.forEach((item: any) => {
      _val += item[key] || 0
    })
    return _val
  }

  const _handlePayWay = (e: any) => {
    const _value = e.target.value
    form.setFieldsValue({
      payWay: _value,
      payMonth: null,
      payDate: null,
    })
    setPayWay(_value)
  }

  const _handleSelectDetails = () => {
    if (documentType === 1) {
      setRequestFundsDrawerVisible(!requestFundsDrawerVisible)
    } else {
      if (dataSource?.vendorMemberId) {
        setContractDrawerVisible(!contractDrawerVisible)
      } else {
        message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.message.1' }))
      }
    }
  }

  const _handleWriteOff = (record: any) => {
    setWriteOffData(record)
    setWriteOffDrawer(true)
  }

  const _handleWriteOffOk = (rows: any[]) => {
    const _tabelSource = [...tabelSource]
    const _i = _tabelSource.findIndex((item) => item.billId === writeOffData.billId)
    const _item = { ..._tabelSource[_i] }
    _item.writeOffRecords = rows
    const _writeOffAmount = rows.map((item) => item?.writeOffAmount ?? 0).reduce((p, r) => p + r, 0)
    _item.writeOffAmount = _writeOffAmount
    _item.applyPayment = _item.reconciliationAmount - _writeOffAmount
    _tabelSource[_i] = _item
    setTabelSource(_tabelSource)
    setWriteOffDrawer(false)
  }

  const _handleOk = () => {
    form.validateFields().then((formRes) => {
      let _flag = false
      if (formRes.applyType !== 1) {
        // {id: 9, text: "采购询价合同", typeFlag: 1}
        // {id: 11, text: "采购招标合同", typeFlag: 1}
        // {id: 10, text: "采购竞价合同", typeFlag: 1}
        // {id: 12, text: "采购请购单", typeFlag: 2}
        // {id: 14, text: "请购单合同", typeFlag: 1}
        // {id: 15, text: "手工物料订单", typeFlag: 0}
        // {id: 16, text: "物料样品订单", typeFlag: 0}
        // {id: 17, text: "商品样品订单", typeFlag: 0}
        // {id: 18, text: "框架合同订单", typeFlag: 0}
        const orderTypes = [12, 15, 16, 17, 18]
        if (orderTypes.includes(formRes.applyType)) {
          _flag = true
        }
        if (_flag) {
          if (tabelSource.filter((item) => item.billType === 1).length <= 0) {
            message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.message.2' }))
            return false
          }
        } else {
          if (tabelSource.filter((item) => item.billType === 2).length <= 0) {
            message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.message.3' }))
            return false
          }
        }
      }
      let _tableSource = [...tabelSource]
      if (!_isFunds) {
        _tableSource = _tableSource.map((item) => {
          return { ...item, sourceContractId: 0, writeOffAmount: 0, reconciliationAmount: 0 }
        })
      }
      const _params = {
        ...dataSource,
        ...formRes,
        rows: _tableSource,
        settlementTime: formatTimeString(formRes.settlementTime, 'YYYY-MM-DD'),
        expectPayTime: formatTimeString(formRes.expectPayTime, 'YYYY-MM-DD'),
        payer: name,
        buyerMemberId: memberId,
        buyerRoleId: memberRoleId,
      }
      setSubmitLoading(true)
      if (_isAdd) {
        postSettlementBusinessApplyAmountSaveApplyAmount(_params)
          .then((res) => {
            if (res.code === 1000) {
              setUnsaved(false)
              setTimeout(() => {
                if (_isFunds) {
                  history.redirect('/balance/businessRequestFunds/admin')
                } else {
                  history.goBack()
                }
              }, 800)
            } else {
              setSubmitLoading(false)
            }
          })
          .catch(() => {
            setSubmitLoading(false)
          })
      } else {
        _params.id = id
        postSettlementBusinessApplyAmountUpdate(_params)
          .then((res) => {
            if (res.code === 1000) {
              setUnsaved(false)
              setTimeout(() => {
                history.goBack()
              }, 800)
            } else {
              setSubmitLoading(false)
            }
          })
          .catch(() => {
            setSubmitLoading(false)
          })
      }
    })
  }

  const _handleMemberOk = (record: any) => {
    const _params = {
      memberId: record.memberId,
      memberRoleId: record.roleId,
    }
    getSettlementCorporateAccountConfig(_params).then((res) => {
      if (res.code !== 1000) {
        message.error(intl.formatMessage({ id: res.code, defaultMessage: res.message }))
        return
      }
      const data = res.data
      const _dataSource = { ...dataSource }
      _dataSource.payee = record.name
      _dataSource.vendorMemberId = record.memberId
      _dataSource.vendorRoleId = record.roleId
      _dataSource.accountName = data.name
      _dataSource.bankDeposit = data.bankDeposit
      _dataSource.bankAccount = data.bankAccount
      form.setFieldsValue({ payee: record.name })
      setDataSource(_dataSource)
      setMemberDrawerVisible(false)
    })
  }

  const _returnTopButton = () => {
    return (
      <Button type="primary" loading={submitLoading} icon={<CheckCircleOutlined />} onClick={_handleOk}>
        {intl.formatMessage({ id: 'balance.baocun' })}
      </Button>
    )
  }

  const _extraItem = useMemo(() => {
    switch (payWay) {
      case 1:
        return null
      case 2:
        return (
          <>
            <Col>
              <Form.Item>
                {intl.formatMessage({
                  id: 'balance.businessRequestFunds.admin.add.payMonth.label',
                })}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="payMonth"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'balance.businessRequestFunds.admin.add.payMonth.message',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'balance.businessRequestFunds.admin.add.payMonth.placeholder',
                  })}
                  options={MONTHSLIST}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                {intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.payDate.label' })}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="payDate"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'balance.businessRequestFunds.admin.add.payDate.message',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'balance.businessRequestFunds.admin.add.payDate.placeholder',
                  })}
                  options={DAYSLIST}
                />
              </Form.Item>
            </Col>
          </>
        )
      case 3:
        return (
          <>
            <Col>
              <Form.Item>
                {intl.formatMessage({
                  id: 'balance.businessRequestFunds.admin.add.payDate.label.2',
                })}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="payDate"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'balance.businessRequestFunds.admin.add.payDate.2.message.1',
                    }),
                  },
                  {
                    validator: (_, value) => {
                      if (!/(^[1-9]\d*$)/.test(value)) {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.payDate.2.message.2',
                            }),
                          ),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'balance.businessRequestFunds.admin.add.payDate.2.placeholder',
                  })}
                  addonAfter={intl.formatMessage({
                    id: 'balance.businessRequestFunds.admin.add.payDate.2.addonAfter',
                  })}
                />
              </Form.Item>
            </Col>
          </>
        )
      case 4:
        return (
          <>
            <Col>
              <Form.Item>
                {intl.formatMessage({
                  id: 'balance.businessRequestFunds.admin.add.payDate.3.label',
                })}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="payDate"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'balance.businessRequestFunds.admin.add.payDate.3.message',
                    }),
                  },
                ]}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'balance.businessRequestFunds.admin.add.payDate.3.placeholder',
                  })}
                  options={DAYSLIST}
                />
              </Form.Item>
            </Col>
          </>
        )
    }
  }, [payWay])

  const _changeNumbers = (record: any, value: any) => {
    const _val = value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')
    const _dataSource = [...tabelSource]
    const _i = _dataSource.findIndex(
      (item) => `applyPayment${item.billNo}_${item.taxRate}` === `applyPayment${record.billNo}_${record.taxRate}`,
    )
    const _item = { ..._dataSource[_i] }
    _item.applyPayment = Number(_val)
    _dataSource[_i] = _item
    setTabelSource(_dataSource)
  }

  /** 删除列表 */
  const handleRemove = (index: number, record: any) => {
    const data = [...tabelSource]
    data.splice(index, 1)
    form.setFieldsValue({ [`applyPayment${record.billNo}_${record.taxRate}`]: null })
    setTabelSource(data)
  }

  const handleRecordOk = (rows: any) => {
    const _documentTypeList = tabelSource
      .filter((item) => item.billType === documentType)
      .map((item) => `${item.billType}_${item.billId}_${item.taxRate}`)
    let _flag = false
    for (let i = 0; i < rows.length; i++) {
      if (_documentTypeList.includes(`${rows[i].billType}_${rows[i].billId}_${rows[i].taxRate}`)) {
        _flag = true
        break
      }
    }
    if (_flag) {
      message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.message' }))
      return false
    }
    let _rows = [...rows]
    _rows = _rows.map((item) => {
      return {
        ...item,
        applyPayment: item?.applyPayment ?? Number(item.billAmount - item.paid - item.appliedUnpaid),
      }
    })
    const _tabelSource = [...tabelSource].concat(_rows)
    setTabelSource(_tabelSource)
    _handleSelectDetails()
  }

  const _handleOpen = (record: any) => {
    if (record.billType === 1) {
      history.open(`/orderAbility/purchaseOrder/orderList/detail?id=${record.billId}`)
    } else if (record.billType === 2) {
      history.open(`/contract/manage/QueryList/QueryListdetails?contractId=${record.billId}`)
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.columns.billNo' }),
      key: 'billNo',
      dataIndex: 'billNo',
      fixed: 'left',
      width: 100,
      render: (text: any, record: any) => (
        <Link
          onClick={() => {
            _handleOpen(record)
          }}
          style={{ padding: 0 }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.columns.billAbstract',
      }),
      key: 'billAbstract',
      dataIndex: 'billAbstract',
      width: 300,
      render: (text: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.columns.billTypeName',
      }),
      key: 'billTypeName',
      dataIndex: 'billTypeName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.columns.billTime' }),
      key: 'billTime',
      dataIndex: 'billTime',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.columns.billStatus',
      }),
      key: 'billStatus',
      dataIndex: 'billStatus',
      width: 150,
      render: (text: any) => <StatusTag type="default" title={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.columns.billAmount',
      }),
      key: 'billAmount',
      dataIndex: 'billAmount',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.columns.taxRate' }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      width: 150,
      render: (text: any) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.fou' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.columns.paid' }),
      key: 'paid',
      dataIndex: 'paid',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.columns.appliedUnpaid',
      }),
      key: 'appliedUnpaid',
      dataIndex: 'appliedUnpaid',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: (
        <Space direction="vertical">
          {intl.formatMessage({
            id: 'balance.businessRequestFunds.admin.add.columns.applyPayment',
          })}
          <Text type="secondary">
            ({intl.formatMessage({ id: 'common.money' })} {priceFormat(_mapTablePriceByKey('applyPayment'))})
          </Text>
        </Space>
      ),
      key: 'applyPayment',
      dataIndex: 'applyPayment',
      fixed: 'right',
      width: 150,
      render: (text: any, record: any) => (
        <Form.Item
          name={`applyPayment${record.billNo}_${record.taxRate}`}
          style={{ margin: 0 }}
          rules={[
            {
              validator: (_, value) => {
                if (!reg.test(value)) {
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.columns.applyPayment.validator.1',
                      }),
                    ),
                  )
                }
                if (value > record.billAmount - record.paid - record.appliedUnpaid) {
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.columns.applyPayment.validator.2',
                      }),
                    ),
                  )
                }
                if (value <= 0 || !value) {
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.columns.applyPayment.validator.3',
                      }),
                    ),
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input
            type="number"
            addonBefore={intl.formatMessage({ id: 'common.money' })}
            value={record.applyPayment}
            max={record.billAmount - record.paid - record.appliedUnpaid}
            onChange={(e) => {
              _changeNumbers(record, e.target.value)
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.columns.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      render: (_, record: any, index: number) => (
        <Link
          onClick={() => {
            handleRemove(index, record)
          }}
        >
          {intl.formatMessage({
            id: 'balance.businessRequestFunds.admin.add.columns.operate.button',
          })}
        </Link>
      ),
    },
  ]

  const fundsColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billNo',
      }),
      key: 'billNo',
      dataIndex: 'billNo',
      fixed: 'left',
      width: 100,
      render: (text: any) => <Link>{text}</Link>,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billAbstract',
      }),
      key: 'billAbstract',
      dataIndex: 'billAbstract',
      width: 300,
      render: (text: any) => (
        <Space direction="vertical" style={{ width: 300 }}>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billTypeName',
      }),
      key: 'billTypeName',
      dataIndex: 'billTypeName',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billTime',
      }),
      key: 'billTime',
      dataIndex: 'billTime',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billStatus',
      }),
      key: 'billStatus',
      dataIndex: 'billStatus',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.billAmount',
      }),
      key: 'billAmount',
      dataIndex: 'billAmount',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.taxRate',
      }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      width: 150,
      render: (text: any) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.fou' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.fundsColumns.paid' }),
      key: 'paid',
      dataIndex: 'paid',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.appliedUnpaid',
      }),
      key: 'appliedUnpaid',
      dataIndex: 'appliedUnpaid',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: (
        <Space direction="vertical">
          {intl.formatMessage({
            id: 'balance.businessRequestFunds.admin.add.fundsColumns.reconciliationAmount',
          })}
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })} {priceFormat(_mapTablePriceByKey('reconciliationAmount'))}
          </Text>
        </Space>
      ),
      key: 'reconciliationAmount',
      dataIndex: 'reconciliationAmount',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: (
        <Space direction="vertical">
          {intl.formatMessage({
            id: 'balance.businessRequestFunds.admin.add.fundsColumns.applyPayment',
          })}
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })} {priceFormat(_mapTablePriceByKey('applyPayment'))}
          </Text>
        </Space>
      ),
      key: 'applyPayment',
      dataIndex: 'applyPayment',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: (
        <Space direction="vertical">
          {intl.formatMessage({
            id: 'balance.businessRequestFunds.admin.add.fundsColumns.writeOffAmount',
          })}
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })} {priceFormat(_mapTablePriceByKey('writeOffAmount'))}
          </Text>
        </Space>
      ),
      key: 'writeOffAmount',
      dataIndex: 'writeOffAmount',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.businessRequestFunds.admin.add.fundsColumns.operate',
      }),
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      render: (_, record: any) =>
        record.canWriteOffFlag && (
          <Link
            onClick={() => {
              _handleWriteOff(record)
            }}
          >
            {intl.formatMessage({
              id: 'balance.businessRequestFunds.admin.add.fundsColumns.operate.button',
            })}
          </Link>
        ),
    },
  ]

  const disabledDate = (current) => {
    return current && current < moment().endOf('day')
  }

  const _handleApplyTypeChange = (value: any, options) => {
    setDocumentType(getApplyType(options.label))
    form.setFieldsValue({ applyType: value })
    setApplyType(value)
  }

  useEffect(() => {
    if (!_isFunds) {
      tabelSource.forEach((item) => {
        form.setFieldsValue({
          [`applyPayment${item.billNo}_${item.taxRate}`]: item.applyPayment || null,
        })
      })
    }
  }, [tabelSource])

  useEffect(() => {
    if (!_isFunds) {
      tabelSource.forEach((item) => {
        form.setFieldsValue({ [`applyPayment${item.billNo}_${item.taxRate}`]: null })
      })
      setTabelSource([])
    }
  }, [applyType])

  return (
    <>
      <PeripheralLayout
        no={_title}
        tabLink={_tabs}
        effect={_returnTopButton()}
        hideBar={true}
        components={
          <Form
            {...layout}
            form={form}
            initialValues={{
              payWay: 1,
              documentType: getApplyType(applyOptions[0]?.label),
              applyType: 1,
              moneyPayWay: 1,
            }}
          >
            <Card id="basicLayout" title={intl.formatMessage({ id: 'balance.jibenxinxi' })}>
              <Row gutter={[8, 8]} justify="space-between">
                <Col span={11}>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.applyAbstract',
                        })}
                        name="applyAbstract"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.applyAbstract.message',
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.applyAbstract.message',
                          })}
                          maxLength={60}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.applyType',
                        })}
                        name="applyType"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.applyType.message',
                            }),
                          },
                        ]}
                      >
                        <Select
                          onChange={_handleApplyTypeChange}
                          placeholder={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.applyType.message',
                          })}
                          disabled={!_isAdd}
                          options={applyOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.expectPayTime',
                        })}
                        name="expectPayTime"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.expectPayTime.message',
                            }),
                          },
                        ]}
                      >
                        <DatePicker
                          placeholder={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.expectPayTime.message',
                          })}
                          style={{ width: '100%' }}
                          disabledDate={disabledDate}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.4' })}
                        name="payWay"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({ id: 'balance.qingxuanzejiesuanfangshi' }),
                          },
                        ]}
                        className={styles['invoice-type']}
                      >
                        <Radio.Group value={payWay} onChange={_handlePayWay}>
                          <Space size={[8, 16]} wrap>
                            {payWayData?.map((item) => (
                              <Radio value={item.id} key={`radioButton_${item.id}`}>
                                {item.text}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  {payWay !== 1 && (
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Form.Item label=" " style={{ margin: 0 }}>
                          <Row gutter={[8, 8]}>{_extraItem}</Row>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.components.confirmAccount.text.1',
                        })}
                        name="settlementTime"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.qingxuanzejiesuanriqi',
                              defaultMessage: '请选择结算日期',
                            }),
                          },
                        ]}
                      >
                        <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.moneyPayWay',
                        })}
                        name="moneyPayWay"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.moneyPayWay.message',
                            }),
                          },
                        ]}
                      >
                        <Select
                          placeholder={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.moneyPayWay.message',
                          })}
                          options={moneyPayWayOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.remark',
                        })}
                        name="remark"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.remark.message',
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.remark.message',
                          })}
                          maxLength={80}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={11}>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'balance.businessRequestFunds.admin.add.form.payee',
                        })}
                        name="payee"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.payee.message',
                            }),
                          },
                        ]}
                      >
                        <Input
                          className={styles.revise_style}
                          readOnly
                          maxLength={80}
                          addonAfter={
                            <Button
                              disabled={_isFunds || !_isAdd}
                              type="primary"
                              icon={<LinkOutlined />}
                              onClick={() => {
                                setMemberDrawerVisible(true)
                              }}
                            />
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Form.Item
                      label={intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.form.accountName',
                      })}
                    >
                      {dataSource.accountName}
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      label={intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.form.bankAccount',
                      })}
                    >
                      {dataSource.bankAccount}
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      label={intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.form.bankDeposit',
                      })}
                    >
                      {dataSource.bankDeposit}
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      label={intl.formatMessage({
                        id: 'balance.businessRequestFunds.admin.add.form.applyPayment',
                      })}
                    >
                      {intl.formatMessage({ id: 'common.money' })}{' '}
                      {priceFormat(_mapTablePriceByKey('applyPayment') || _mapTablePriceByKey('applyAmount'))}
                    </Form.Item>
                  </Row>
                  {_isFunds && (
                    <>
                      <Row>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.writeOffAmount',
                          })}
                        >
                          {intl.formatMessage({ id: 'common.money' })}{' '}
                          {priceFormat(_mapTablePriceByKey('writeOffAmount'))}
                        </Form.Item>
                      </Row>
                      <Row>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.reconciliationNo',
                          })}
                        >
                          <Link>{dataSource.reconciliationNo}</Link>
                        </Form.Item>
                      </Row>
                      <Row>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'balance.businessRequestFunds.admin.add.form.invoiceMessages',
                          })}
                        >
                          {dataSource?.invoiceMessages ? (
                            <>
                              {dataSource?.invoiceMessages?.numbers.map((item) => (
                                <div>
                                  {item.invoiceNumber} | {item.invoiceDate.slice(0, 10)} |{' '}
                                  {intl.formatMessage({ id: 'common.money' })}
                                  {item.invoiceMoney}
                                </div>
                              ))}
                            </>
                          ) : (
                            '-'
                          )}
                        </Form.Item>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
            <Card
              id="billLayout"
              title={intl.formatMessage({
                id: 'balance.businessRequestFunds.admin.add.billLayout',
              })}
            >
              {!_isFunds ? (
                <>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <Form.Item
                        // label={intl.formatMessage({ id: 'balance.businessRequestFunds.admin.add.form.documentType' })}
                        name="documentType"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'balance.businessRequestFunds.admin.add.form.documentType.message',
                            }),
                          },
                        ]}
                        className={styles['invoice-type']}
                      >
                        <Radio.Group onChange={(e) => setDocumentType(e.target.value)}>
                          <Space size={[8, 16]} wrap>
                            <Radio
                              disabled={
                                getApplyType(applyOptions.filter((_item) => _item.value === applyType)[0]?.label) ===
                                CONTRACT_TYPE
                              }
                              value={1}
                            >
                              {intl.formatMessage({
                                id: 'balance.businessRequestFunds.admin.add.form.documentType.radio.1',
                              })}
                            </Radio>
                            <Radio
                              disabled={
                                getApplyType(applyOptions.filter((_item) => _item.value === applyType)[0]?.label) ===
                                ORDER_TYPE
                              }
                              value={2}
                            >
                              {intl.formatMessage({
                                id: 'balance.businessRequestFunds.admin.add.form.documentType.radio.2',
                              })}
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    type="dashed"
                    block
                    style={{
                      marginBottom: '24px',
                    }}
                    icon={<PlusOutlined />}
                    onClick={_handleSelectDetails}
                  >
                    {intl.formatMessage({ id: 'balance.xuanze' })}
                  </Button>
                </>
              ) : null}
              <Table
                dataSource={tabelSource}
                columns={_isFunds ? fundsColumns : columns}
                scroll={{ x: 1300 }}
                pagination={false}
              />
            </Card>
          </Form>
        }
      />
      <WriteOffDrawer
        visible={writeOffDrawer}
        record={writeOffData}
        editAble={true}
        onClose={() => {
          setWriteOffDrawer(false)
        }}
        onOk={_handleWriteOffOk}
      />
      <MemberDrawer
        visible={memberDrawerVisible}
        onClose={() => {
          setMemberDrawerVisible(false)
        }}
        onOk={_handleMemberOk}
      />
      <ContractDrawer
        visible={contractDrawerVisible}
        applyType={form.getFieldValue('applyType')}
        partyBMemberId={dataSource?.vendorMemberId}
        partyBRoleId={dataSource?.vendorRoleId}
        onClose={() => {
          setContractDrawerVisible(false)
        }}
        onOk={handleRecordOk}
      />
      <RequestFundsDrawer
        visible={requestFundsDrawerVisible}
        applyType={form.getFieldValue('applyType')}
        onClose={() => {
          setRequestFundsDrawerVisible(false)
        }}
        onOk={handleRecordOk}
      />
    </>
  )
}
export default Add
