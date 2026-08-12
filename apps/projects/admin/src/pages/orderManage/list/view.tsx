import React, { useRef, useState } from 'react'
import { Button, Drawer, Form, Input, message, Modal, Space, Timeline, Typography } from 'antd'
import {
  CarOutlined,
  CheckCircleFilled,
  CheckOutlined,
  CopyOutlined,
  DownOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ScanOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { authService } from '@apps/services'
import { getOrderPlatformManagePage, getOrderPlatformManageExport } from '@apps/apis'
import { exportFile } from '@apps/utils'
import styles from './index.less'

const MOCK_LOGISTICS_NO = '75312345678901'

const mainLogisticsCompanies = [
  { key: 'zto', logo: 'ZTO', name: '中通快递', color: '#1685df' },
  { key: 'yto', logo: 'YTO', name: '圆通速递', color: '#6c1b8e' },
  { key: 'sto', logo: 'sto', name: '申通快递', color: '#4f4f4f' },
  { key: 'yunda', logo: '韵', name: '韵达速递', color: '#202020' },
  { key: 'sf', logo: 'SF', name: '顺丰速运', color: '#202020' },
  { key: 'jd', logo: 'JDL', name: '京东物流', color: '#d71920' },
  { key: 'jt', logo: 'J&T', name: '极兔速递', color: '#e31e24' },
  { key: 'ems', logo: 'EMS', name: '中国邮政 EMS', color: '#008b4c' },
  { key: 'deppon', logo: '▣', name: '德邦快递', color: '#1455a0' },
]

const moreLogisticsCompanies = [
  { key: 'ky', logo: 'KYE', name: '跨越速运', color: '#5d1789' },
  { key: 'ane', logo: 'ane', name: '安能物流', color: '#222' },
  { key: 'best', logo: '◆', name: '百世快递', color: '#174d99' },
  { key: 'uc', logo: 'UC', name: '优速快递', color: '#6e1e91' },
  { key: 'zjs', logo: '宅', name: '宅急送', color: '#15905e' },
  { key: 'suning', logo: 'SUNING', name: '苏宁物流', color: '#1268b3' },
  { key: 'cainiao', logo: '菜鸟', name: '菜鸟速递', color: '#1889d2' },
  { key: 'ysdf', logo: '余', name: '余氏东风', color: '#df2726' },
  { key: 'cre', logo: 'CRE', name: '中铁快运', color: '#174a87' },
  { key: 'ymdd', logo: '米', name: '壹米滴答', color: '#262626' },
  { key: 'other', logo: '◇', name: '其他物流', color: '#8c8c8c' },
]

const mockLogisticsTracks = [
  {
    time: '2026-08-12 07:45:32',
    status: '运输中',
    description: '快件正在【上海中转部】运输中',
  },
  {
    time: '2026-08-12 02:31:18',
    status: '到达分拣中心',
    description: '快件到达【上海中转部】',
  },
  {
    time: '2026-08-11 23:48:05',
    status: '离开分拣中心',
    description: '快件离开【杭州转运中心】，已发往【上海中转部】',
  },
  {
    time: '2026-08-11 22:15:09',
    status: '到达分拣中心',
    description: '快件到达【杭州转运中心】',
  },
  {
    time: '2026-08-11 21:20:34',
    status: '揽件成功',
    description: '【北京市朝阳区朝阳门站点】已揽件，揽件人：张师傅 185****1234',
  },
]

const baseOrderListColumns: RecordColumns<any>[] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    searchField: {
      main: true,
    },
    fixed: 'left',
    render: (text, record) => (
      <EyeAuthButton url={`/orderManage/list/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
    ),
  },
  {
    title: '订单摘要',
    dataIndex: 'digest',
    key: 'digest',
    searchField: 'Input',
  },
  {
    title: '采购会员',
    dataIndex: 'buyerMemberName',
    key: 'buyerMemberName',
    searchField: 'Input',
  },
  {
    title: '供应会员',
    dataIndex: 'vendorMemberName',
    key: 'vendorMemberName',
    searchField: 'Input',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => formatTimeString(text),
    searchField: {
      type: 'DateRange',
      title: '下单时间',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
  },
  {
    title: '订单总额',
    dataIndex: 'amount',
    key: 'amount',
    render: (t, r) => {
      // 积分兑换订单显示0
      if (r.orderTypeName === '积分兑换') {
        return '0'
      }
      return r.orderType === 7 || r.orderType === 8 ? t : '￥' + t
    },
  },
  {
    title: '积分',
    dataIndex: 'points',
    key: 'points',
    render: (text, record) => {
      // 如果是积分兑换订单且总金额为0，积分列显示总金额的值
      if (record.orderTypeName === '积分兑换') {
        return record.amount
      }
      return text || '-'
    },
  },
  {
    title: '送货地址',
    dataIndex: 'deliverAddress',
    key: 'deliverAddress',
    width: 164,
    ellipsis: true,
  },
  {
    title: '订单类型',
    dataIndex: 'orderTypeName',
    key: 'orderTypeName',
  },
  {
    title: '外部状态',
    dataIndex: 'outerStatusName',
    key: 'outerStatusName',
    fixed: 'right',
    width: 110,
  },
  {
    title: '售后情况',
    dataIndex: 'afterSaleStatusName',
    key: 'afterSaleStatusName',
    fixed: 'right',
    width: 110,
  },
]

const fetchTableData = async (params) => {
  const { data } = await getOrderPlatformManagePage(params)
  return data
}

const hasLogisticsInfo = (record: any) =>
  Boolean(record.logisticsOrderId || record.logisticsId || record.logisticsOrderNo || record.logisticsNo)

// 订单查询
const OrderList: React.FC = () => {
  const { token } = authService.getAuth() || {}
  const ref = useRef({} as ActionType)
  const fetchParams = useRef<any>({})
  const queryTimer = useRef<number>()
  const [shipmentVisible, setShipmentVisible] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [querySuccess, setQuerySuccess] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState('zto')
  const [moreCompaniesVisible, setMoreCompaniesVisible] = useState(false)
  const [logisticsDrawerVisible, setLogisticsDrawerVisible] = useState(false)
  const [form] = Form.useForm()

  const closeShipmentModal = () => {
    window.clearTimeout(queryTimer.current)
    setShipmentVisible(false)
    setQueryLoading(false)
    setQuerySuccess(false)
    setSelectedCompany('zto')
    setMoreCompaniesVisible(false)
    form.resetFields()
  }

  const handleQuery = () => {
    form.validateFields().then(() => {
      window.clearTimeout(queryTimer.current)
      setQueryLoading(true)
      setQuerySuccess(false)
      queryTimer.current = window.setTimeout(() => {
        form.setFieldsValue({ logisticsOrderNo: MOCK_LOGISTICS_NO })
        setQueryLoading(false)
        setQuerySuccess(true)
      }, 600)
    })
  }

  const showLogisticsDrawer = () => {
    setLogisticsDrawerVisible(true)
  }

  const handleCopyLogisticsNo = () => {
    copy(MOCK_LOGISTICS_NO)
    message.success('运单号已复制')
  }

  const secondColumns: any[] = baseOrderListColumns.concat([
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 130,
      render: (_, record, index) =>
        index === 0 || hasLogisticsInfo(record) ? (
          <Button type="link" onClick={showLogisticsDrawer}>
            查看物流
          </Button>
        ) : (
          <Button type="link" onClick={() => setShipmentVisible(true)}>
            去发货
          </Button>
        ),
    },
  ])

  const fetchData = (params) => {
    const payload = { ...params }
    if (payload.startDate) {
      payload.startDate = formatTimeString(payload.startDate, 'YYYY-MM-DD')
    }
    if (payload.endDate) {
      payload.endDate = formatTimeString(payload.endDate, 'YYYY-MM-DD')
    }
    fetchParams.current = { ...payload }
    return fetchTableData(payload)
  }

  const handleExport = async () => {
    const p = { ...fetchParams.current }
    delete p.current
    delete p.pageSize
    let exportParams = ''
    Object.keys(p).forEach((item) => {
      if (p[item]) {
        exportParams += `&${item}=${p[item]}`
      }
    })
    exportFile(getOrderPlatformManageExport, exportParams)
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={secondColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="orderNo"
        actionRef={ref}
        searchButtons={[
          {
            key: 'export',
            children: '导出',
            onClick() {
              handleExport()
            },
          },
        ]}
      />
      <Modal
        className={styles.shipmentModal}
        title="去发货"
        width={1120}
        visible={shipmentVisible}
        onCancel={closeShipmentModal}
        footer={
          <div className={styles.shipmentFooter}>
            <Typography.Text>
              <InfoCircleOutlined />
              确认发货后，订单状态将更新为待收货
            </Typography.Text>
            <Space>
              <Button onClick={closeShipmentModal}>取消</Button>
              <Button type="primary">确认发货</Button>
            </Space>
          </div>
        }
      >
        <div className={styles.shipmentSection}>
          <div className={styles.shipmentSectionTitle}>
            <CarOutlined />
            物流信息
          </div>
          <div className={styles.shipmentFormRow}>
            <div className={styles.shipmentLabel}>
              物流公司 <span>*</span>
            </div>
            <div className={styles.companyArea}>
              <div className={styles.companyGrid}>
                {mainLogisticsCompanies.map((company) => (
                  <button
                    key={company.key}
                    className={`${styles.companyItem} ${selectedCompany === company.key ? styles.companySelected : ''}`}
                    type="button"
                    onClick={() => setSelectedCompany(company.key)}
                  >
                    <span className={styles.companyLogo} style={{ color: company.color }}>
                      {company.logo}
                    </span>
                    <span>{company.name}</span>
                    {selectedCompany === company.key && (
                      <span className={styles.companyCheck}>
                        <CheckOutlined />
                      </span>
                    )}
                  </button>
                ))}
                <button
                  className={`${styles.companyItem} ${moreCompaniesVisible ? styles.moreCompaniesActive : ''}`}
                  type="button"
                  onClick={() => setMoreCompaniesVisible((visible) => !visible)}
                >
                  <span>更多物流</span>
                  {moreCompaniesVisible ? <UpOutlined /> : <DownOutlined />}
                </button>
              </div>
              {moreCompaniesVisible && (
                <div className={styles.moreCompaniesPanel}>
                  {moreLogisticsCompanies.map((company) => (
                    <button
                      key={company.key}
                      className={`${styles.companyItem} ${
                        selectedCompany === company.key ? styles.companySelected : ''
                      }`}
                      type="button"
                      onClick={() => setSelectedCompany(company.key)}
                    >
                      <span className={styles.companyLogo} style={{ color: company.color }}>
                        {company.logo}
                      </span>
                      <span>{company.name}</span>
                      {selectedCompany === company.key && (
                        <span className={styles.companyCheck}>
                          <CheckOutlined />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.shipmentFormRow}>
            <div className={styles.shipmentLabel}>
              快递单号 <span>*</span>
            </div>
            <div className={styles.expressNumberArea}>
              <div className={styles.expressNumberRow}>
                <Form form={form}>
                  <Form.Item
                    name="logisticsOrderNo"
                    normalize={(value) => value?.trim()}
                    rules={[
                      { required: true, message: '请输入快递单号' },
                      { pattern: /^[A-Za-z0-9]{6,32}$/, message: '快递单号应为6-32位英文字母或数字' },
                    ]}
                  >
                    <Input placeholder="请输入快递单号" suffix={<ScanOutlined />} />
                  </Form.Item>
                </Form>
                <Button loading={queryLoading} type="primary" onClick={handleQuery}>
                  {querySuccess ? '重新查询' : '查询单号'}
                </Button>
              </div>
              {querySuccess ? (
                <div className={styles.querySuccessTip}>
                  <CheckCircleFilled />
                  已识别物流信息，可确认发货
                </div>
              ) : (
                <Typography.Text type="secondary">支持主流物流公司单号查询，自动识别并填充订单信息</Typography.Text>
              )}
            </div>
          </div>
          {querySuccess && (
            <div className={styles.logisticsQueryResult}>
              <div>
                <Typography.Text type="secondary">物流公司</Typography.Text>
                <span>
                  <b className={styles.resultLogo}>ZTO</b>中通快递
                </span>
              </div>
              <div>
                <Typography.Text type="secondary">快递单号</Typography.Text>
                <span>{MOCK_LOGISTICS_NO}</span>
              </div>
              <div>
                <Typography.Text type="secondary">运单状态</Typography.Text>
                <span>
                  <b className={styles.resultStatus}>运输中</b>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.shipmentSection}>
          <div className={styles.shipmentSectionTitle}>
            <UserOutlined className={styles.shipmentReceiverIcon} />
            收货人信息
          </div>
          <div className={`${styles.shipmentInfoGrid} ${styles.receiverInfoGrid}`}>
            <div>
              <Typography.Text type="secondary">收货人</Typography.Text>
              <span>李四</span>
            </div>
            <div>
              <Typography.Text type="secondary">手机号</Typography.Text>
              <span>139****5678</span>
            </div>
            <div>
              <Typography.Text type="secondary">收货地址</Typography.Text>
              <span>上海市浦东新区世纪大道100号 200120</span>
            </div>
          </div>
        </div>

        <div className={styles.shipmentSection}>
          <div className={styles.shipmentSectionTitle}>
            <InboxOutlined />
            订单信息
          </div>
          <div className={`${styles.shipmentInfoGrid} ${styles.goodsInfoGrid}`}>
            <div>
              <Typography.Text type="secondary">订单摘要</Typography.Text>
              <span>冻鸡爪_1_1_1</span>
            </div>
            <div>
              <Typography.Text type="secondary">采购会员</Typography.Text>
              <span>15256279069</span>
            </div>
            <div>
              <Typography.Text type="secondary">下单时间</Typography.Text>
              <span>2026-08-11 21:04:28</span>
            </div>
            <div>
              <Typography.Text type="secondary">订单总额</Typography.Text>
              <span className={styles.orderAmount}>￥120.00</span>
            </div>
          </div>
        </div>
      </Modal>
      <Drawer
        className={styles.logisticsDrawer}
        closable={false}
        destroyOnClose
        placement="right"
        visible={logisticsDrawerVisible}
        width={760}
        onClose={() => setLogisticsDrawerVisible(false)}
      >
        <div className={styles.drawerHeader}>
          <Typography.Title level={2}>物流详情</Typography.Title>
          <Space size={16}>
            <Button icon={<CopyOutlined />} onClick={handleCopyLogisticsNo}>
              复制运单号
            </Button>
            <Button type="text" onClick={() => setLogisticsDrawerVisible(false)}>
              ×
            </Button>
          </Space>
        </div>

        <div className={styles.logisticsSummary}>
          <div className={styles.summaryItem}>
            <Typography.Text type="secondary">物流平台</Typography.Text>
            <div className={styles.summaryValue}>
              <span className={styles.ztoLogo}>ZTO</span>
              中通快递
            </div>
          </div>
          <div className={styles.summaryItem}>
            <Typography.Text type="secondary">快递单号</Typography.Text>
            <div className={styles.summaryValue}>
              {MOCK_LOGISTICS_NO}
              <Button type="text" icon={<CopyOutlined />} onClick={handleCopyLogisticsNo} />
            </div>
          </div>
          <div className={styles.summaryItem}>
            <Typography.Text type="secondary">关联订单号</Typography.Text>
            <div className={`${styles.summaryValue} ${styles.orderNo}`}>SO2026081121047484</div>
          </div>
          <div className={styles.summaryItem}>
            <Typography.Text type="secondary">当前状态</Typography.Text>
            <div className={styles.summaryValue}>
              <span className={styles.statusTag}>运输中</span>
            </div>
          </div>
        </div>

        <div className={styles.trackCard}>
          <div className={styles.cardHeader}>
            <Typography.Title level={4}>物流轨迹</Typography.Title>
          </div>
          <div className={styles.trackScroll}>
            <Timeline mode="left" className={styles.logisticsTimeline}>
              {mockLogisticsTracks.map((track, index) => (
                <Timeline.Item
                  key={track.time}
                  color={index === 0 ? '#12bfae' : '#a8b0c2'}
                  label={
                    <span className={index === 0 ? styles.latestTime : undefined}>
                      {index === 0 && <span className={styles.latestTag}>最新</span>}
                      {track.time}
                    </span>
                  }
                >
                  <div className={index === 0 ? styles.latestTrack : styles.trackItem}>
                    <div className={index === 0 ? styles.latestStatus : styles.trackStatus}>{track.status}</div>
                    <div className={styles.trackDescription}>{track.description}</div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <Typography.Title level={4}>
              <UserOutlined className={styles.receiverIcon} /> 收货人信息
            </Typography.Title>
            <div className={styles.infoRow}>
              <Typography.Text type="secondary">收货人</Typography.Text>
              <span>李四</span>
            </div>
            <div className={styles.infoRow}>
              <Typography.Text type="secondary">手机号</Typography.Text>
              <span>139****5678</span>
            </div>
            <div className={styles.infoRow}>
              <Typography.Text type="secondary">收货地址</Typography.Text>
              <span>上海市浦东新区世纪大道100号 200120</span>
            </div>
          </div>
          <div className={styles.infoCard}>
            <Typography.Title level={4}>
              <InboxOutlined className={styles.goodsIcon} /> 货物信息
            </Typography.Title>
            <div className={styles.goodsGrid}>
              <div>
                <Typography.Text type="secondary">订单摘要</Typography.Text>
                <div>冻鸡爪_1_1_1</div>
              </div>
              <div>
                <Typography.Text type="secondary">采购会员</Typography.Text>
                <div>15256279069</div>
              </div>
              <div>
                <Typography.Text type="secondary">下单时间</Typography.Text>
                <div>2026-08-11 21:04:28</div>
              </div>
              <div>
                <Typography.Text type="secondary">订单总额</Typography.Text>
                <div>￥120.00</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <Typography.Text type="secondary">
            <span className={styles.infoIcon}>i</span>
            物流信息来源于快递公司系统，若信息有误请以快递公司数据为准。
          </Typography.Text>
          <Typography.Text type="secondary">
            数据更新时间：2026-08-12 07:45:32 <ReloadOutlined />
          </Typography.Text>
        </div>
      </Drawer>
    </PageHeaderWrapper>
  )
}

export default OrderList
