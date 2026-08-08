import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Form, Button, Row, Col, Input, Table, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { priceFormat } from '@/utils/numberFomat'
import {
  getSettlementBusinessReconciliationDetailReconciliation,
  getSettlementBusinessReconciliationReconciliationRowList,
  postSettlementBusinessReconciliationUpdateReconciliation,
  postSettlementBusinessReconciliationSaveReconciliation,
  postSettlementBusinessReconciliationGenerateReconciliation,
} from '@apps/apis'
import PeripheralLayout from '@/pages/procurementAbility/components/detail'
import { Card } from '@linkseeks/ui'

import DetailDrawer from '../components/detailDrawer'
import BusinessFileLayout from '../../components/BusinessFileLayout'
import { useQuery, useLocation } from '@linkseeks/router-core'
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 24 },
  labelAlign: 'left',
}
const intl = getIntl()
const TABLINK = [
  { id: 'basicLayout', title: intl.formatMessage({ id: 'balance.jibenxinxi' }) },
  { id: 'billLayout', title: intl.formatMessage({ id: 'balance.duizhangdanmingxi' }) },
  { id: 'fileLayout', title: intl.formatMessage({ id: 'balance.fujian' }) },
]

const reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{0,3}$)/

const Add = () => {
  const { id, no } = useQuery()
  const { pathname, state } = useLocation()
  const _state: any = state
  const [form] = Form.useForm()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<any>({})
  const [tabelSource, setTabelSource] = useState<any>([])
  const [ids, setIds] = useState<any>([])
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [buyerData, setBuyerData] = useState<any>({})
  const filesRef = useRef<any>({})

  const _tabs = useMemo(() => {
    let _list = []
    TABLINK.forEach((item) => {
      // if (item.id === 'billLayout') {
      //   item.title = `${item.title}${tabelSource.length ? '' : '(' + tabelSource.length + ')'}`
      // }
      _list.push(item)
    })
    return _list
  }, [pathPci, tabelSource])

  const _title = useMemo(() => {
    switch (path) {
      case 'add':
        return intl.formatMessage({ id: 'balance.businessReconciliation.readyAdd.add.title.1' })
      case 'edit':
        return intl.formatMessage({ id: 'balance.businessReconciliation.readyAdd.add.title.2' })
      case 'preview':
        return intl.formatMessage({ id: 'balance.businessReconciliation.readyAdd.add.title.3' })
    }
  }, [path])

  const _editAble = useMemo(() => {
    return path !== 'preview'
  }, [path])

  const _returnTopButton = () => {
    return (
      <Button type="primary" loading={submitLoading} icon={<CheckCircleOutlined />} onClick={_handleSave}>
        {intl.formatMessage({ id: 'balance.baocun' })}
      </Button>
    )
  }

  const basicFormCol = [
    {
      label: intl.formatMessage({ id: 'balance.danjuzhaiyao' }),
      name: 'reconciliationAbstract',
      placeholder: intl.formatMessage({
        id: 'balance.businessReconciliation.readyAdd.add.basicFormCol.reconciliationAbstract.placeholder',
      }),
      rules: [
        {
          required: true,
          message: intl.formatMessage({
            id: 'balance.businessReconciliation.readyAdd.add.basicFormCol.reconciliationAbstract.placeholder',
          }),
        },
        {
          validator: (_, value, callback) => {
            try {
              let _str = value
              _str = _str.replace(/[\u4E00-\u9FA5]/g, 'AA')
              if (_str.length > 30 * 2) {
                callback(
                  intl.formatMessage({
                    id: 'balance.businessReconciliation.readyAdd.add.basicFormCol.reconciliationAbstract.validator',
                  }),
                )
                // return Promise.reject(new Error(`最长60个字符，30个汉字`))
              }
              callback()
            } catch (error) {
              callback()
            }
          },
        },
      ],
    },
    {
      label: intl.formatMessage({ id: 'balance.beizhu' }),
      name: 'remark',
      placeholder: intl.formatMessage({
        id: 'balance.businessReconciliation.readyAdd.add.basicFormCol.remark.placeholder',
      }),
      rules: [
        {
          validator: (_, value, callback) => {
            try {
              let _str = value
              _str = _str.replace(/[\u4E00-\u9FA5]/g, 'AA')
              if (value.length > 60 * 2) {
                callback(
                  intl.formatMessage({
                    id: 'balance.businessReconciliation.readyAdd.add.basicFormCol.remark.validator',
                  }),
                )
                // return Promise.reject(new Error(`最长120个字符`))
              }
              callback()
              // return Promise.resolve();
            } catch (error) {
              callback()
            }
          },
        },
      ],
    },
  ]

  const basicFormColRight = [
    { label: intl.formatMessage({ id: 'balance.shoukuanfang' }), name: 'payee', readOnly: true },
    { label: intl.formatMessage({ id: 'balance.fukuanfang' }), name: 'payer', readOnly: true },
    { label: intl.formatMessage({ id: 'balance.faqiduizhangfang' }), name: 'launchReconciliation', readOnly: true },
    {
      label: intl.formatMessage({ id: 'balance.duizhangzongjinehanshui' }),
      name: 'reconciliationMoneyAmount',
      readOnly: true,
    },
  ]

  useEffect(() => {
    /**编辑回显数据 */
    if (Object.keys(dataSource).length > 0) {
      form.setFieldsValue({
        ...dataSource,
      })
    }
  }, [dataSource])

  const _getDetail = () => {
    const _params: any = {
      reconciliationId: id,
      reconciliationNo: no,
    }
    getSettlementBusinessReconciliationDetailReconciliation(_params).then((res) => {
      if (res.code === 1000) {
        const data = res.data
        setDataSource(data)
      }
    })
  }

  const _getRowList = () => {
    const params: any = {
      current: 1,
      pageSize: 9999,
      reconciliationId: id,
      reconciliationNo: no,
    }
    getSettlementBusinessReconciliationReconciliationRowList(params).then((res) => {
      if (res.code === 1000) {
        const data = res.data.data
        let _fields = {}
        for (let key in data) {
          _fields[`currentReconciliationQuantity_${data[key].orderNo}_${data[key].productId}`] =
            data[key]['currentReconciliationQuantity']
        }
        form.setFieldsValue(_fields)
        setTabelSource(data)
      }
    })
  }

  useEffect(() => {
    if (_editAble) {
      setUnsaved(true)
      if (path === 'add') {
        const _params: any = { orderVOS: _state?.rows }
        postSettlementBusinessReconciliationGenerateReconciliation(_params).then((res) => {
          if (res.code === 1000) {
            const data = res.data
            setDataSource(data)
            setTabelSource(data.rows)
            setBuyerData({
              buyerMemberId: _state?.rows?.[0]?.buyerMemberId,
              buyerRoleId: _state?.rows?.[0]?.buyerRoleId,
            })
          }
        })
      } else {
        _getDetail()
        _getRowList()
      }
    } else {
      _getDetail()
      _getRowList()
    }
  }, [])

  const _changeNumbers = (record: any, value: any) => {
    let _val = value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')
    let _dataSource = [...tabelSource]
    const _i = _dataSource.findIndex((item) => item.productId === record.productId)
    let _item = { ..._dataSource[_i] }
    _item.currentReconciliationQuantity = Number(_val)
    _item.currentMoney = _val * Number(record.billType === 3 ? -record.price : record.price)
    _dataSource[_i] = _item
    setTabelSource(_dataSource)
  }

  /** 删除列表 */
  const handleRemove = (index: number, record: any) => {
    const data = [...tabelSource]
    data.splice(index, 1)
    form.setFieldsValue({ [`currentReconciliationQuantity_${record.orderNo}_${record.productId}`]: null })
    setTabelSource(data)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.dingdanhao' }),
      key: 'orderNo',
      dataIndex: 'orderNo',
      width: 100,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'balance.yujijiesuanriqi' }),
      key: 'expectPayTime',
      dataIndex: 'expectPayTime',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.fahuopici' }),
      key: 'deliveryBatch',
      dataIndex: 'deliveryBatch',
      width: 100,
      render: (text: any, record: any) =>
        intl.formatMessage({
          id: 'balance.businessReconciliation.readyAdd.add.columns.deliveryBatch.text',
          data: text,
        }),
    },
    {
      title: intl.formatMessage({ id: 'balance.fahuodanhao' }),
      key: 'deliveryNo',
      dataIndex: 'deliveryNo',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.shouhuodanhao' }),
      key: 'receiveNo',
      dataIndex: 'receiveNo',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.wuliaobianhao' }),
      key: 'productNo',
      dataIndex: 'productNo',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.wuliaomingcheng' }),
      key: 'productName',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'balance.guigexinghao' }),
      key: 'spec',
      dataIndex: 'spec',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.pinlei' }),
      key: 'category',
      dataIndex: 'category',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.pinpai' }),
      key: 'brand',
      dataIndex: 'brand',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.danwei' }),
      key: 'unit',
      dataIndex: 'unit',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.hanshuishuil' }),
      key: 'taxRate',
      dataIndex: 'taxRate',
      width: 100,
      render: (text: any) => {
        return text > 0
          ? `${intl.formatMessage({ id: 'balance.shi' })}/${text}%`
          : intl.formatMessage({ id: 'balance.fou' })
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.danjia' }),
      key: 'price',
      dataIndex: 'price',
      width: 100,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.daiduizhangshuliang' }),
      key: 'reconciliationQuantity',
      dataIndex: 'reconciliationQuantity',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'balance.benciduizhangshuliang' }),
      key: 'currentReconciliationQuantity',
      dataIndex: 'currentReconciliationQuantity',
      width: 150,
      render: (text: any, record: any, index: number) =>
        _editAble ? (
          <Form.Item
            name={`currentReconciliationQuantity_${record.orderNo}_${record.productId}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'balance.qingshuruduizhangshuliang' }) },
              {
                validator: (_, value) => {
                  if (!reg.test(value)) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'balance.businessReconciliation.readyAdd.add.columns.currentReconciliationQuantity.validator.1',
                        }),
                      ),
                    )
                  }
                  if (value > record.reconciliationQuantity) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'balance.businessReconciliation.readyAdd.add.columns.currentReconciliationQuantity.validator.2',
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
              max={record.reconciliationQuantity}
              value={record.currentReconciliationQuantity}
              onChange={(e) => {
                _changeNumbers(record, e.target.value)
              }}
            />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: intl.formatMessage({ id: 'balance.benciduizhangjine' }),
      key: 'currentMoney',
      dataIndex: 'currentMoney',
      width: 150,
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const columnsEdit = columns.concat([
    {
      title: intl.formatMessage({ id: 'balance.caozuo' }),
      key: 'operate',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      render: (text: any, record: any, index: number) => (
        <Button
          type="link"
          onClick={() => {
            handleRemove(index, record)
          }}
        >
          {intl.formatMessage({ id: 'balance.shanchu' })}
        </Button>
      ),
    },
  ])

  useEffect(() => {
    let _amount = 0
    for (let value of tabelSource) {
      const _currentQuantity = value?.currentReconciliationQuantity || 0
      const _price = Number(value.billType === 3 ? -value.price : value.price) || 0
      _amount += Number(_currentQuantity) * Number(_price)
    }
    const _dataSource = { ...dataSource }
    _dataSource.reconciliationMoneyAmount = _amount
    const _ids = tabelSource.map((item) => item.productId)
    setIds(_ids)
    setDataSource(_dataSource)
  }, [tabelSource])

  const _handleSave = () => {
    form.validateFields().then((formRes) => {
      if (tabelSource.length <= 0) {
        message.error(intl.formatMessage({ id: 'balance.businessReconciliation.readyAdd.add.message' }))
        return
      }
      const _flag = path === 'add'
      let _fetch: any
      const _params: any = {
        reconciliationAbstract: formRes.reconciliationAbstract,
        reconciliationMoneyAmount: formRes.reconciliationMoneyAmount,
        remark: formRes.remark,
        reconciliationNo: no,
        rows: tabelSource,
      }
      if (filesRef?.current?.data && filesRef?.current?.data.length > 0) {
        _params.files = filesRef?.current?.data
      }
      if (_flag) {
        _params.payer = dataSource.payer
        _params.payee = dataSource.payee
        _params.launchReconciliation = dataSource.launchReconciliation
        _params.buyerMemberId = buyerData.buyerMemberId
        _params.buyerRoleId = buyerData.buyerRoleId
      } else {
        _params.reconciliationId = id
      }
      _fetch = _flag
        ? postSettlementBusinessReconciliationSaveReconciliation
        : postSettlementBusinessReconciliationUpdateReconciliation
      setSubmitLoading(true)
      _fetch(_params)
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
    })
  }

  const addRows = (rows) => {
    const _tabelSource = [...tabelSource]
    const _rows = _tabelSource.concat(rows)
    setTabelSource(_rows)
    setDrawerVisible(false)
  }

  return (
    <>
      <PeripheralLayout
        no={_title}
        tabLink={_tabs}
        effect={_editAble && _returnTopButton()}
        components={
          <Form {...layout} requiredMark={_editAble} form={form}>
            <Card id="basicLayout" title={intl.formatMessage({ id: 'balance.jibenxinxi' })}>
              <Row gutter={[8, 8]} justify="space-between">
                <Col span={11}>
                  <Row gutter={[8, 8]}>
                    {basicFormCol.map((item: any, index) => (
                      <Col span={24} key={index}>
                        <Form.Item {...item}>
                          {_editAble ? <Input placeholder={item.placeholder} /> : dataSource[item.name]}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </Col>
                <Col span={11}>
                  <Row gutter={[8, 8]}>
                    {basicFormColRight.map((item: any, index) => (
                      <Col span={24} key={index}>
                        <Form.Item {...item}>
                          {item.name === 'reconciliationMoneyAmount'
                            ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(dataSource[item.name])}`
                            : dataSource[item.name]}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Card>
            <Card id="billLayout" title={intl.formatMessage({ id: 'balance.duizhangdanmingxi' })}>
              {_editAble ? (
                <Button
                  type="dashed"
                  block
                  style={{
                    marginBottom: '24px',
                  }}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setDrawerVisible(true)
                  }}
                >
                  {intl.formatMessage({ id: 'balance.xuanze' })}
                </Button>
              ) : null}
              <Table
                dataSource={tabelSource}
                columns={_editAble ? columnsEdit : columns}
                scroll={{ x: 1300 }}
                pagination={false}
              />
            </Card>
            <BusinessFileLayout fetchdata={dataSource?.files} currentRef={filesRef} editAble={_editAble} />
            <DetailDrawer
              searchParams={{
                payer: dataSource.payer,
                // payee: dataSource.payee,
                taxRate: tabelSource?.[0]?.taxRate ?? '',
                ids: ids,
              }}
              visible={drawerVisible}
              onClose={() => {
                setDrawerVisible(false)
              }}
              onOk={addRows}
            />
          </Form>
        }
      />
    </>
  )
}
export default Add
