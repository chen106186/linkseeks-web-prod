import React, { useRef, useState } from 'react'
import { Button, Drawer, Empty, Form, Input, message, Modal, Space, Timeline, Typography } from 'antd'
import { CarOutlined, CopyOutlined, InboxOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { authService } from '@apps/services'
import { getOrderPlatformManagePage, getOrderPlatformManageExport } from '@apps/apis'
import { exportFile } from '@apps/utils'
import styles from './index.less'

const MOCK_LOGISTICS_NO = '75312345678901'

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
  const [importVisible, setImportVisible] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [queryResultVisible, setQueryResultVisible] = useState(false)
  const [logisticsDrawerVisible, setLogisticsDrawerVisible] = useState(false)
  const [form] = Form.useForm()

  const closeImportModal = () => {
    window.clearTimeout(queryTimer.current)
    setImportVisible(false)
    setQueryLoading(false)
    setQueryResultVisible(false)
    form.resetFields()
  }

  const handleQuery = () => {
    form.validateFields().then(() => {
      setQueryLoading(true)
      setQueryResultVisible(false)
      queryTimer.current = window.setTimeout(() => {
        setQueryLoading(false)
        setQueryResultVisible(true)
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
          <Button type="link" onClick={() => setImportVisible(true)}>
            导入物流信息
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
        title="导入物流订单信息"
        width={880}
        visible={importVisible}
        onCancel={closeImportModal}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">查询结果来自快递公司系统，若信息有误请以快递公司数据为准</Typography.Text>
            <Space>
              <Button onClick={closeImportModal}>取消</Button>
              <Button disabled={!queryResultVisible} type="primary">
                确认导入
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="inline">
          <Form.Item
            label="物流订单号"
            name="logisticsOrderNo"
            rules={[{ required: true, message: '请输入物流订单号' }]}
          >
            <Input placeholder="请输入物流订单号" style={{ width: 420 }} />
          </Form.Item>
          <Button loading={queryLoading} type="primary" onClick={handleQuery}>
            查询
          </Button>
        </Form>
        <Typography.Text type="secondary" style={{ display: 'block', margin: '8px 0 24px 120px' }}>
          支持主流快递平台单号查询，自动识别并填充订单信息
        </Typography.Text>
        {queryResultVisible ? (
          <Space direction="vertical" size={24} style={{ display: 'flex' }}>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 28 }}>
              <Typography.Title level={4} style={{ marginBottom: 32, marginTop: 0 }}>
                <CarOutlined style={{ color: '#00bfa5', marginRight: 12 }} />
                物流信息
              </Typography.Title>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Typography.Text type="secondary">物流平台</Typography.Text>
                  <div style={{ fontSize: 18, marginTop: 24 }}>
                    <span style={{ color: '#1478df', fontStyle: 'italic', fontWeight: 700, marginRight: 12 }}>ZTO</span>
                    中通快递
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography.Text type="secondary">快递单号</Typography.Text>
                  <div style={{ fontSize: 18, marginTop: 24 }}>75312345678901</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography.Text type="secondary">运单状态</Typography.Text>
                  <div style={{ marginTop: 20 }}>
                    <span style={{ background: '#e8f9ee', borderRadius: 16, color: '#16a34a', padding: '6px 12px' }}>
                      运输中
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 28 }}>
              <Typography.Title level={4} style={{ marginBottom: 32, marginTop: 0 }}>
                <UserOutlined style={{ color: '#8b5cf6', marginRight: 12 }} />
                收货人信息
              </Typography.Title>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  <Typography.Text type="secondary">收货人</Typography.Text>
                  <div style={{ fontSize: 18, marginTop: 24 }}>李四</div>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography.Text type="secondary">手机号</Typography.Text>
                  <div style={{ fontSize: 18, marginTop: 24 }}>139****5678</div>
                </div>
                <div style={{ flex: 2 }}>
                  <Typography.Text type="secondary">收货地址</Typography.Text>
                  <div style={{ fontSize: 18, marginTop: 24 }}>上海市浦东新区世纪大道100号 200120</div>
                </div>
              </div>
            </div>
          </Space>
        ) : (
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              minHeight: 360,
            }}
          >
            <Empty description="请输入物流订单号后进行查询" />
          </div>
        )}
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
