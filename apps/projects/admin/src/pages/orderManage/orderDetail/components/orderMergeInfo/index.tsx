import React, { useContext, useState } from 'react'
import { Row, Col, Tag, Modal } from 'antd'
import MellowCard from '@/components/MellowCard'
import { OrderDetailContext } from '../../context'
import { formatTimeString } from '@/utils'
import style from './index.less'
import ContractList from '../ContractList'
import cx from 'classnames'
import { OrderKindType } from '../../constant'
import themeConfig from '@apps/config/lingxi.theme.config'

export interface OrderMergeInfoProps {}
const payInfo = [
  { title: '交付日期', name: 'deliverDate', render: (text) => formatTimeString(text, 'YYYY-MM-DD') },
  {
    title: '交付地址',
    name: 'address',
    render: (_, record) => (
      <div>
        <Row>
          <Col>{record.consignee}</Col>
          <Col> / </Col>
          <Col>{record.phone}</Col>
          {record.defaultConsignee && (
            <Col style={{ marginLeft: 6 }}>
              <Tag color="default">默认</Tag>
            </Col>
          )}
        </Row>
        <div style={{ color: '#909399' }}>{record.areaName + '' + record.address}</div>
      </div>
    ),
  },
  // { title: '提货方式', name: 'deliveryType', render: (text) => DELIVERY_TYPE[text] },
  // { title: '自提地址', name: 'pickUpAddress' },
  // { title: '运费', name: 'freight' }
]

const electronInfo = [{ title: '电子合同', name: 'none' }]

const RenderCard = ({ infoList, dataSource }) =>
  infoList.map((v) =>
    dataSource[v.name] ? (
      <Row key={v.name} className={style['card-list']}>
        <Col span={6} className={style['card-list_title']}>
          {v.title}
        </Col>
        <Col flex={1}>{v.render ? v.render(dataSource[v.name], dataSource) : dataSource[v.name]}</Col>
      </Row>
    ) : null,
  )

const OrderMergeInfo: React.FC<OrderMergeInfoProps> = (props) => {
  const orderDetailCtx = useContext(OrderDetailContext)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { data, ctl } = orderDetailCtx
  const { invoice } = data

  const otherInfo = [
    {
      title: '发票',
      name: 'invoice',
      render: (item) =>
        invoice?.invoiceId ? (
          <div className={style.invoice_list_item}>
            <div className={style.invoice_list_item_content}>
              <div className={cx(style.invoice_list_item_content_tag, item.invoiceType !== 1 ? style.special : '')}>
                {item.invoiceType === 1 ? '增值税普通发票' : '增值税专用发票'}
              </div>
              <div className={style.invoice_list_item_content_name}>
                <div>{item.title}</div>
                <div>{item.taxNo}</div>
              </div>
            </div>
            {
              <div className={style.invoice_list_item_btn_group}>
                {/* 查看功能todo */}
                <div className={style.invoice_list_item_btn} onClick={() => setIsModalVisible(true)}>
                  查看 &gt;
                </div>
              </div>
            }
          </div>
        ) : null,
      resetCol: { flex: '1 1 100%' },
    },
    { title: '包装要求', name: 'requirement', render: (t, d) => d.requirement.detail?.pageRequire || '' },
    { title: '其他要求', name: 'requirement', render: (t, d) => d.requirement.detail?.restsRequire || '' },
  ]

  return (
    <>
      <Row style={{ marginTop: themeConfig['@margin-md'] }} gutter={24}>
        <Col span={data.orderKind === OrderKindType.SRM_ORDER ? 15 : 12}>
          <MellowCard title="交易信息" fullHeight>
            <RenderCard infoList={payInfo} dataSource={data.consignee} />
          </MellowCard>
        </Col>
        <Col span={data.orderKind === OrderKindType.SRM_ORDER ? 9 : 6}>
          <MellowCard title="其他信息" fullHeight>
            <RenderCard infoList={otherInfo} dataSource={data} />
          </MellowCard>
        </Col>
        {data.orderKind === OrderKindType.SRM_ORDER ? null : (
          <Col span={6}>
            <MellowCard title="电子合同" fullHeight>
              <ContractList
                dataSource={
                  data.electronicContractUrl
                    ? [
                        {
                          electronicContractUrl: data.electronicContractUrl,
                          electronicContractName: data.electronicContractName,
                        },
                      ]
                    : null
                }
              />
            </MellowCard>
          </Col>
        )}
      </Row>
      <Modal
        title="发票信息"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Row gutter={[0, 10]} style={{ fontSize: 14 }}>
          <Col span={4}>开具类型：</Col>
          <Col span={20}>{invoice?.invoiceKind === 1 ? '企业' : '个人'}</Col>
          <Col span={4}>发票种类：</Col>
          <Col span={20}>{invoice?.invoiceType === 1 ? '增值税普通发票' : '增值税专用发票'}</Col>
          <Col span={4}>发票抬头：</Col>
          <Col span={20}>{invoice?.title}</Col>
          <Col span={4}>纳税号：</Col>
          <Col span={20}>{invoice?.taxNo}</Col>
          <Col span={4}>开户行：</Col>
          <Col span={20}>{invoice?.bank}</Col>
          <Col span={4}>账号：</Col>
          <Col span={20}>{invoice?.account}</Col>
          <Col span={4}>地址：</Col>
          <Col span={20}>{invoice?.address}</Col>
          <Col span={4}>电话：</Col>
          <Col span={20}>{invoice?.phone}</Col>
        </Row>
      </Modal>
    </>
  )
}

OrderMergeInfo.defaultProps = {}

export default OrderMergeInfo
