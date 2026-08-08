import React, { useEffect, useState } from 'react'
import { Anchor, Table, DatePicker, Input, Space, Typography, Button, Tabs } from 'antd'
import style from './index.less'
import { ArrowLeftOutlined } from '@ant-design/icons'
const { Link } = Anchor
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, PageHeaderWrapper } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
const { Text } = Typography
const activeAnchorClassName = 'ant-anchor-link-active'
import moment from 'moment'
import BasicInfo from '../../components/detailCard/basic'
import PaymentCard from '../../components/detailCard/PaymentCard'
import DetailedList from './components/DetailedList'
import DrawerModal from './components/DrawerModal'
import PopModal from './components/PopModal'
import { getContractExecuteGetDetail, getContractExecutePageExecuteInfoList } from '@apps/apis'
import Associated from '../../components/detailCard/associated'
import ContractVersions from '../../components/ContractVersions'
import { useQuery } from '@linkseeks/router-core'
import { Card } from '@linkseeks/ui'

const intl = getIntl()
const PAGE_SIZE = 10
const { RangePicker } = DatePicker
type FromProps = {
  orderNo: string
  orderAbstract: string
  startTime: string
  endTime: string
}
const Details = (props: any) => {
  const [currLink, setCurrLink] = useState(activeAnchorClassName)
  const { contractId } = useQuery()
  /* 查看付款明细 */
  const [visible, setVisible] = useState(false)
  /**
   * 渲染信息
   * @param basics 基础信息
   * @param payPlanList 付款计划
   */
  const [basicInfo, setbasicInfo] = useState<any>({
    col1: [],
    col2: [],
    col3: [],
  })

  /** 关联信息 */
  const [associatedInfo, setAssociatedInfo] = useState<any>({
    col1: [],
    col2: [],
  })

  const [payPlanList, setpayPlanList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [listLoading, setListLoading] = useState(false)
  /** 基本信息 */
  const [data, setdata] = useState<any>([])
  const [contractNo, setcontractNo] = useState()
  const [basics, setbasics] = useState({})
  const [contractAbstract, setcontractAbstract] = useState()
  const [tabPane] = useState([
    { key: 'process', label: intl.formatMessage({ id: 'contract.rules.header.info' }) },
    { key: 'associated', label: intl.formatMessage({ id: 'contract.associateInformation' }) },
    { key: 'conditions', label: intl.formatMessage({ id: 'contract.fukuanjihua' }) },
    { key: 'versions', label: intl.formatMessage({ id: 'contract.versions' }) },
    { key: 'docking', label: intl.formatMessage({ id: 'contract.zhixingqingkuang' }) },
    { key: 'record', label: intl.formatMessage({ id: 'contract.qingkuantongji' }) },
  ])
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined)
  /* 单据总金额 */
  const [orderAmount, setorderAmount] = useState<number>(0)
  /* 已付款 */
  const [payAmount, setpayAmount] = useState<number>(0)
  /* 已请款待付款 */
  const [unPayApplyAmount, setunPayApplyAmount] = useState<number>(0)
  /* 待请款 */
  const [unApplyAmount, setunApplyAmount] = useState<number>(0)
  /* 请款单id */
  // const [applyId, setapplyId] = useState<number>(0)
  const [item, setitem] = useState({})
  /** 合同版本 */
  const [contractVersionVOData, setContractVersionVOData] = useState([])

  const [executeTabKey, setExecuteTabKey] = useState<string>()
  const [TabList, setTabList] = useState<any>()
  /* 执行情况分页 */
  const getContracInfoList = (datas: any) => {
    setListLoading(true)
    getContractExecutePageExecuteInfoList(datas)
      .then((res) => {
        if (res.code === 1000) {
          let orderAmounts = 0,
            payAmounts = 0,
            unPayApplyAmounts = 0,
            unApplyAmounts = 0
          if (res.data.data) {
            const list = res.data.data.map((items: any, index: number) => {
              orderAmounts += items.orderAmount
              payAmounts += items.payAmount
              unApplyAmounts += items.unApplyAmount
              unPayApplyAmounts += items.unPayApplyAmount
              return {
                ...items,
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
  /* 执行请款的选中 */
  const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
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
  const onChange = (value) => {
    console.log(moment(value[0]).format('YYYY-MM-DD HH:mm:ss'), '111')
    // moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
    from.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
    from.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
    console.log(from)
    setfrom(from)
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
  /* 获取详情的数据 */
  const getDetail = () => {
    console.log(contractId)
    getContractExecuteGetDetail({ contractId }).then((res: any) => {
      if (res.code === 1000) {
        const { contractVersionVO } = res.data
        const basic = res.data.basics
        setcontractNo(basic.contractNo)
        setcontractAbstract(basic.contractAbstract)
        setbasics(basic)
        const basicInfos = {
          col1: [
            {
              label: intl.formatMessage({ id: 'contract.hetongbianhao' }),
              extra: basic.contractNo ? basic.contractNo : '',
            },
            {
              label: intl.formatMessage({ id: 'contract.hetongzhaiyao' }),
              extra: basic.contractAbstract ? basic.contractAbstract : '',
            },
            {
              label: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
              extra: basic.outerStatusName ? basic.outerStatusName : '',
              type: 'StatusTag',
            },
          ],
          col2: [
            {
              label: intl.formatMessage({ id: 'contract.xunyuanleixing' }),
              extra: basic.sourceTypeName ? basic.sourceTypeName : '',
              url: '',
            },
            {
              label: intl.formatMessage({ id: 'contract.hetongyouxiaoqi' }),
              extra: `${basic.startTime}${intl.formatMessage({ id: 'common.text.to' })}${basic.endTime}`,
            },
            {
              label: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
              extra: basic.innerStatusName ? basic.innerStatusName : '',
            },
            // { label: intl.formatMessage({ id: 'contract.duiyingdanju' }), extra: basic.sourceNo ? basic.sourceNo : '', },
            // { label: intl.formatMessage({ id: 'contract.shoubiaohuiyuan' }), extra: basic.partyBName ? basic.partyBName : '' },
            // { label: intl.formatMessage({ id: 'contract.shoubiaojine' }), extra: basic.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basic.totalAmount}` : '' },
          ],
          col3: [],
        }

        const associatedInfos: any = {
          col1: [
            {
              label: intl.formatMessage({ id: 'contract.duiyingdanju' }),
              extra: basic.sourceNo ? basic.sourceNo : '',
            },
            {
              label: intl.formatMessage({ id: 'contract.supplier' }),
              extra: basic.partyBName ? basic.partyBName : '',
            },
          ],
          col2: [
            {
              label: intl.formatMessage({ id: 'contract.currency' }),
              extra: basic.currencyTypeName ? basic.currencyTypeName : '',
            },
            {
              label: intl.formatMessage({ id: 'contract.contractAmount' }),
              extra: basic.totalAmount ? `${basic.totalAmount}` : '',
            },
          ],
        }

        if (basic.sourceId) {
          switch (basic.sourceType) {
            case 1: {
              if (basic.turn && basic.sourceId) {
                basicInfos.col2[1].url = `/procurementAbility/confirmOffer/offerInquire/preview?id=${basic.sourceId}&turn=${basic.turn}`
              }
              break
            }
            case 2: {
              basicInfos.col2[1].url = `/procurementAbility/callForBids/callForBidsSearch/detail?id=${basic.sourceId}`
              break
            }
            case 3: {
              basicInfos.col2[1].url = `/procurementAbility/purchaseBid/search/detail?id=${basic.sourceId}&number=${basic.sourceNo}`
              break
            }
            case 4: {
              const urlData = `/procurementAbility/purchaseRequisition/purchaseRequisitionList/preview?id=${basic.sourceId}`
              associatedInfo.col2[1].url = urlData
              break
            }
          }
        }

        setExecuteTabKey(contractId)
        setContractVersionVOData(contractVersionVO)
        setTabList(contractVersionVO)
        setAssociatedInfo(associatedInfos)
        setpayPlanList(res.data.payPlanList)
        setbasicInfo(basicInfos)

        const datas = {
          contractId: contractId,
          ...from,
          current: page,
          pageSize: size,
        }

        getContracInfoList(datas)
      }
    })
  }
  useEffect(() => {
    getDetail()
    setTargetOffset(window.innerHeight / 4)
  }, [])
  const handleAnchorClick = (e) => {
    e.preventDefault()
  }
  const handleAnchorChange = (link) => {
    if (link && currLink) {
      setCurrLink('')
    } else if (!link && !currLink) {
      setCurrLink(activeAnchorClassName)
    }
  }

  /* 点击显示弹出 */
  const getPayment = (items) => {
    setitem(items)
    setVisible(!visible)
  }

  /* 查看付款明细 */
  const columns: any = [
    {
      title: intl.formatMessage({ id: 'contract.danjuhaozhaiyao' }),
      dataIndex: 'orderNO',
      align: 'left',
      render: (text: any, record: any) => {
        return (
          <DetailAuthButton>
            <EyeAuthButton
              url={
                record.orderType === 1
                  ? `/orderAbility/purchaseOrder/orderList/detail?id=${record.orderId}`
                  : `/afterAbility/returnApplication/returnQuery/detail?id=${record.orderId}`
              }
            >
              {text}
            </EyeAuthButton>
            <p>{record.orderAbstract}</p>
          </DetailAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuleixing' }),
      dataIndex: 'orderTypeName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuzhuangtai' }),
      dataIndex: 'orderStatusName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjushijian' }),
      dataIndex: 'orderTime',
      align: 'left',
      render: (text: any) => {
        return <Text>{moment(Number(text)).format('YYYY-MM-DD')}</Text>
      },
    },
    {
      dataIndex: 'orderAmount',
      align: 'left',
      title: (
        <Space direction="vertical">
          <Text type="secondary">{intl.formatMessage({ id: 'contract.danjujine' })}</Text>
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
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
      align: 'left',
      render: (text, record) => (
        <Space direction="vertical">
          <Text type="secondary">
            {record.isHasTax == 1
              ? intl.formatMessage({ id: 'contract.shi' })
              : intl.formatMessage({ id: 'contract.fou' })}
          </Text>
          <Text type="secondary">{text}%</Text>
        </Space>
      ),
    },
    {
      dataIndex: 'payAmount',
      align: 'left',
      title: (
        <Space direction="vertical">
          <Text type="secondary">{intl.formatMessage({ id: 'contract.yifukuan' })}</Text>
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
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
          <Text type="secondary">{intl.formatMessage({ id: 'contract.yiqingkuandaifukuan' })}</Text>
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
            {unPayApplyAmount}
          </Text>
        </Space>
      ),
      dataIndex: 'unPayApplyAmount',
      align: 'left',
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
          <Text type="secondary">{intl.formatMessage({ id: 'contract.daiqingkuan' })}</Text>
          <Text type="secondary">
            {intl.formatMessage({ id: 'common.money' })}
            {unApplyAmount}
          </Text>
        </Space>
      ),
      dataIndex: 'unApplyAmount',
      align: 'left',
      render: (text) => (
        <span>
          {intl.formatMessage({ id: 'common.money' })}
          {text}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'type',
      align: 'left',
      render: (text, record) => {
        // 已付款大于0或已请款待付款大于0的才显示查看付款明细按钮。
        return record.applyNo ? (
          <div>
            <a onClick={() => getPayment(record)} className={style.gesture}>
              {intl.formatMessage({ id: 'contract.zhakanfukuanmingxi' })}
            </a>
          </div>
        ) : null
        // if (record.payAmount !== 0) {
        //   node =
        //     <div>
        //       <a onClick={() => getPayment(record)} className={style.gesture}>{intl.formatMessage({id: 'contract.zhakanfukuanmingxi'})}</a>
        //       {/* <a onClick={() => onModal(record, false)} style={{ marginLeft: 10 }} className={style.gesture}>{intl.formatMessage({id: 'contract.qingkuan'})}</a> */}
        //     </div>
        //   return node;
        // } else if (record.unPayApplyAmount > 0) {
        //   node = <div>
        //     <a onClick={() => getPayment(record)} className={style.gesture}>{intl.formatMessage({id: 'contract.zhakanfukuanmingxi'})}</a>
        //     {/* <a onClick={() => onModal(record, false)} style={{ marginLeft: 10 }} className={style.gesture}>{intl.formatMessage({id: 'contract.qingkuan'})}</a> */}
        //   </div>
        //   return node;
        // } else {
        //   node = null
        //   // <div>
        //   //   <a onClick={() => onModal(record, false)} style={{ marginLeft: 10 }} className={style.gesture}>{intl.formatMessage({id: 'contract.qingkuan'})}</a>
        //   // </div>
        //   return node;
        // }
      },
    },
  ]

  const [ModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [payType] = useState<any>([])

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKey: any, selectedRows: any) => {
      console.log(selectedRowKey, selectedRows)
      setSelectedRowKeys(selectedRowKey)
      setSelectRow(selectedRows)
    },
  }

  /* 查看付款明细回调 */
  const setDrawerModal = () => {
    setVisible(!visible)
  }
  /* 选着请款方式弹出 */
  const setDrawerPopModal = () => {
    setIsModalVisible(!ModalVisible)
  }

  // 分页
  const handlePaginationChange = (current: number, pageSize: number) => {
    const datas = {
      contractId: executeTabKey,
      ...from,
      current: current,
      pageSize: pageSize,
    }
    setPage(current)
    setSize(pageSize)
    console.log(current, pageSize, size)
    getContracInfoList(datas)
  }

  const handleTabChange = (e) => {
    setExecuteTabKey(e)

    const datas = {
      contractId: e,
      ...from,
      current: 1,
      pageSize: 10,
    }
    setPage(1)
    setSize(10)
    getContracInfoList(datas)
  }

  return (
    <div className={style.anchorWrap}>
      <PageHeaderWrapper items={tabPane}>
        <Space direction="vertical" style={{ display: 'flex', width: '100%' }} id="content">
          {/* 基本信息 */}
          <BasicInfo basicInfo={basicInfo} />

          {/* 关联信息 */}
          <Associated associatedInfo={associatedInfo} />

          {/* 付款计划 */}
          <PaymentCard IsShow={false} payPlanList={payPlanList} basics={basics} contractId={contractId} />

          {/* 合同版本 */}
          <Card id="versions" title={intl.formatMessage({ id: 'contract.versions' })}>
            <ContractVersions contractId={contractId} contractVersionVO={contractVersionVOData} />
          </Card>

          {/* 执行情况 */}
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
                {TabList.map((items) => (
                  <Tabs.TabPane tab={items.contractNo} key={items.contractId} forceRender>
                    <Table
                      rowKey="keyId"
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={data}
                      loading={listLoading}
                      pagination={{
                        current: page,
                        showSizeChanger: true,
                        pageSize: size,
                        total,
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
          {/* 请款统计 */}
          {TabList && contractId ? <DetailedList contractId={contractId} TabList={TabList} /> : null}
        </Space>
      </PageHeaderWrapper>
      {/* 选择弹出内容 */}
      <DrawerModal visible={visible} item={item} contractId={Number(executeTabKey)} setDrawerModal={setDrawerModal} />
      {/* 请款弹出 */}
      <PopModal
        ModalVisible={ModalVisible}
        payType={payType}
        selectRowList={selectRow}
        contractId={contractId}
        basics={basics}
        setDrawerPopModal={setDrawerPopModal}
      />
    </div>
  )
}
export default Details
