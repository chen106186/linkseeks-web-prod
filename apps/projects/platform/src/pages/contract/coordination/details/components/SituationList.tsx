import React, { useState, useEffect } from 'react'
import { Button, Input, Table, Typography, Space, Tabs, DatePicker } from 'antd'
import style from '../index.less'
import type { IAntdSchemaFormProps } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import moment from 'moment'
import { getContractExecutePageExecuteInfoList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { Card } from '@linkseeks/ui'

const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  contractId: any
  TabList: any
}
const { Text } = Typography
const situationList: React.FC<Iprops> = ({ contractId, TabList }) => {
  const { RangePicker } = DatePicker
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [listLoading, setListLoading] = useState(false)
  /* 单据总金额 */
  const [orderAmount, setorderAmount] = useState<number>(0)
  /* 已付款 */
  const [payAmount, setpayAmount] = useState<number>(0)
  /* 已请款待付款 */
  const [unPayApplyAmount, setunPayApplyAmount] = useState<number>(0)
  /* 待请款 */
  const [unApplyAmount, setunApplyAmount] = useState<number>(0)
  const [data, setdata] = useState<any>([])
  /* 执行请款的选中 */
  // const [ setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  // const [value, setvalue] = useState('')

  const [executeTabKey, setExecuteTabKey] = useState<string>(contractId)

  type FromProps = {
    orderNo: string
    orderAbstract: string
    startTime: string
    endTime: string
  }

  // 设置提交数据
  const [from, setfrom] = useState<FromProps>({
    orderNo: '',
    orderAbstract: '',
    startTime: '',
    endTime: '',
  })
  // 设置搜索的值
  const setvalue = (e, name) => {
    const value = e.target.value
    from[name] = value
    console.log(value, name, from)
    setfrom({ ...from })
  }
  const onChange = (values: any) => {
    // moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
    from.startTime = values && values[0] ? moment(values[0]).format('YYYY-MM-DD HH:mm:ss') : null
    from.endTime = values && values[1] ? moment(values[1]).format('YYYY-MM-DD HH:mm:ss') : null
    console.log(from)
    setfrom(from)
  }

  /* 执行情况分页 */
  const getContracInfoList = (datas) => {
    setListLoading(true)
    getContractExecutePageExecuteInfoList(datas)
      .then((res) => {
        if (res.code === 1000) {
          let orderAmounts = 0,
            payAmounts = 0,
            unPayApplyAmounts = 0,
            unApplyAmounts = 0
          if (res.data.data) {
            const list = res.data.data.map((item: any, index: number) => {
              orderAmounts += item.orderAmount
              payAmounts += item.payAmount
              unApplyAmounts += item.unApplyAmount
              unPayApplyAmounts += item.unPayApplyAmount
              return {
                ...item,
                keyId: index + 1,
              }
            })

            setdata(list)
          } else {
            setdata([])
          }
          setTotal(res.data.totalCount)
          setunApplyAmount(unApplyAmounts)
          setunPayApplyAmount(unPayApplyAmounts)
          setpayAmount(payAmounts)
          setorderAmount(orderAmounts)
        }
      })
      .finally(() => {
        setListLoading(false)
      })
      .catch(() => {})
  }

  const query = () => {
    const datas = {
      contractId: executeTabKey,
      ...from,
      current: page,
      pageSize: size,
    }
    getContracInfoList(datas)
  }

  /* 搜素 */
  // const onSearch = (values) => {
  //   const datas = {
  //     contractId: executeTabKey,
  //     orderNo: values,
  //     orderAbstract: '',
  //     startTime: '',
  //     endTime: '',
  //     current: 1,
  //     pageSize: size,
  //   }
  //   getContracInfoList(datas)
  // }

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKey: any, selectedRows: any) => {
      console.log(selectedRowKey, selectedRows)
      setSelectedRowKeys(selectedRowKey)
      // setSelectRow(selectedRows)
    },
  }
  /* 查看付款明细 */
  const columns: any = [
    {
      title: intl.formatMessage({ id: 'contract.danjuhaozhaiyao' }),
      dataIndex: 'orderNO',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <div>
            <EyeAuthButton
              url={
                record.orderType === 1
                  ? `/orderAbility/saleOrder/orderList/detail?id=${record.orderId}`
                  : `/afterAbility/returnManage/returnQuery/detail?id=${record.orderId}`
              }
              // url={`/orderAbility/purchaseOrder/readyAddOrder/detail?id=${record.orderId}`}
            >
              {text}
            </EyeAuthButton>
            <p>{record.orderAbstract}</p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuleixing' }),
      dataIndex: 'orderTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuzhuangtai' }),
      dataIndex: 'orderStatusName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjushijian' }),
      dataIndex: 'orderTime',
      align: 'center',
      render: (text: any) => {
        return <Text>{moment(Number(text)).format('YYYY-MM-DD')}</Text>
      },
    },
    {
      dataIndex: 'orderAmount',
      align: 'center',
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.danjujine' })}</Text>
          <Text>
            {intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}
            {orderAmount}
          </Text>
        </Space>
      ),
      render: (text) => (
        <span>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hanshuishuil' }),
      dataIndex: 'taxRate',
      align: 'center',
      render: (text, record) => (
        <Space direction="vertical">
          <Text>
            {record.isHasTax == 1
              ? intl.formatMessage({ id: 'contract.shi' })
              : intl.formatMessage({ id: 'contract.fou' })}
          </Text>
          <Text>{text}%</Text>
        </Space>
      ),
    },
    {
      dataIndex: 'payAmount',
      align: 'center',
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.yifukuan' })}</Text>
          <Text>
            {intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}
            {payAmount}
          </Text>
        </Space>
      ),
      render: (text) => (
        <span>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </span>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.yiqingkuandaifukuan' })}</Text>
          <Text>
            {intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}
            {unPayApplyAmount}
          </Text>
        </Space>
      ),
      dataIndex: 'unPayApplyAmount',
      align: 'center',
      render: (text) => (
        <span>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </span>
      ),
    },
    {
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.daiqingkuan' })}</Text>
          <Text>
            {intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}
            {unApplyAmount}
          </Text>
        </Space>
      ),
      dataIndex: 'unApplyAmount',
      align: 'center',
      render: (text) => (
        <span>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </span>
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'contract.caozuo' }), dataIndex: 'type', align: 'center',
    //   render: (text, record) => {
    //     // 已付款大于0或已请款待付款大于0的才显示查看付款明细按钮。
    //     return (
    //       <div>
    //         {
    //           // onClick = {() => getPayment(record.id)}
    //           record.payAmount > 0 || record.unPayApplyAmount > 0 && <a className={style.gesture}>{intl.formatMessage({id: 'contract.zhakanfukuanmingxi'})}</a>
    //         }

    //       </div>
    //     )
    //   }
    // },
  ]
  const handlePaginationChange = (current: number, pageSize: number) => {
    const datas = {
      contractId: executeTabKey,
      orderNo: '',
      orderAbstract: '',
      startTime: '',
      endTime: '',
      current: current,
      pageSize: pageSize,
      ...from,
    }
    setPage(current)
    setSize(pageSize)
    getContracInfoList(datas)
  }

  /* 重置 */
  // const Reset = () => {
  //   setPage(1)
  //   const datas = {
  //     contractId,
  //     orderNo: '',
  //     orderAbstract: '',
  //     startTime: '',
  //     endTime: '',
  //     current: page,
  //     pageSize: size,
  //     ...from
  //   }
  //   getContracInfoList(datas)
  // }

  useEffect(() => {
    if (contractId) {
      const datas = {
        contractId,
        current: page,
        pageSize: size,
      }
      getContracInfoList(datas)
    }
  }, [contractId])

  const handleTabChange = (e) => {
    setExecuteTabKey(e)

    setPage(1)
    const datas = {
      contractId: e,
      orderNo: '',
      orderAbstract: '',
      startTime: '',
      endTime: '',
      current: 1,
      pageSize: size,
      ...from,
    }
    getContracInfoList(datas)
  }

  return (
    <Card
      id="docking"
      title={intl.formatMessage({ id: 'contract.zhixingqingkuang' })}
      extra={
        <div className={style.wrapper}>
          <Input
            style={{ width: 240, marginRight: 10 }}
            placeholder={intl.formatMessage({ id: 'contract.qingshurudanjuhao' })}
            allowClear
            value={from.orderNo}
            onChange={(e) => setvalue(e, 'orderNo')}
          />
          <Input
            style={{ width: 240, marginRight: 10 }}
            placeholder={intl.formatMessage({ id: 'contract.qingshurudanzaiyao' })}
            allowClear
            value={from.orderAbstract}
            onChange={(e) => setvalue(e, 'orderAbstract')}
          />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            style={{
              marginRight: 20,
            }}
          />
          <Button type="primary" onClick={query}>
            {intl.formatMessage({ id: 'contract.chaxun' })}
          </Button>
        </div>
      }
    >
      {TabList?.length ? (
        <Tabs size="small" activeKey={String(executeTabKey)} onChange={(e) => handleTabChange(e)}>
          {TabList.map((item) => (
            <Tabs.TabPane tab={item.contractNo} key={item.contractId} forceRender>
              <Table
                rowKey="keyId"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                loading={listLoading}
                pagination={{
                  defaultPageSize: 20,
                  pageSize: size,
                  total,
                  current: page,
                  showSizeChanger: true,
                  onChange: handlePaginationChange,
                }}
                style={{
                  width: '100%',
                }}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : null}
    </Card>
  )
}
export default situationList
