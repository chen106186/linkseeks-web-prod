import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Tag, Modal, Drawer, Button, Radio, Space, Empty } from 'antd'
import MellowCard from '@/components/MellowCard'
import { OrderDetailContext } from '../../_public/order/context'
import style from './index.less'
import cx from 'classnames'
import {
  getSettlementInvoiceMessageDetails,
  getSettlementInvoiceMessageList,
  postSettlementInvoiceMessageDelete,
  postSettlementInvoiceMessageUpdate,
} from '@apps/apis'
import InvoiceModal from '../../../orderAbility/purchaseOrder/components/orderCollectCash/components/invoiceModal'
import { PlusOutlined } from '@ant-design/icons'
import { postOrderBuyerInvoice } from '@apps/apis'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import themeConfig from '@apps/config/lingxi.theme.config'
import { ALTERATION } from '../orderDetailSection'
import { formatContext } from '../../../orderAbility/components/purchaseOrderPreview'
import RadioChangeButtonCard from '../radioChangeButton'
import RenderCard from '../renderCard'
import { authService } from '@apps/services'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()
export interface OrderMergeInfoProps {}
const payInfo = [
  { title: intl.formatMessage({ id: 'transaction_components.jiaofuriqi' }), name: 'deliverDate' },
  {
    title: intl.formatMessage({ id: 'transaction_components.jiaofudizhi' }),
    name: 'consignee',
    childKey: 'hasAddress',
    render: (_, record) => (
      <div>
        <Row>
          <Col>{record.consignee}</Col>
          <Col> / </Col>
          <Col>{record.countryCode + '' + record.phone}</Col>
          {record.defaultConsignee && (
            <Col style={{ marginLeft: 6 }}>
              <Tag color="default">{intl.formatMessage({ id: 'transaction_components.moren' })}</Tag>
            </Col>
          )}
        </Row>
        <div style={{ color: '#909399' }}>{record.areaName + '' + record.address}</div>
      </div>
    ),
  },
]

interface IState {
  dataSource: any[]
  useValue: any
}

/**
 * 交付信息
 */
const DeliveryInfo = () => {
  const { formContext, versionContext } = useContext(OrderDetailContext)
  const { data } = formContext
  const _consignee = data?.consignee
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<any>()
  const handRenderValue = (value) => {
    const { consignee, deliverDate, deliverDateChangeStatus, consigneeChangeStatus } = formatContext(
      versionContext,
      value,
    )

    setDataBo({
      consignee,
      deliverDate,
      deliverDateChangeStatus,
      consigneeChangeStatus,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  useEffect(() => {
    if (versionContext) {
      setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <MellowCard
      id="deliveryInfo"
      title={intl.formatMessage({ id: 'transaction_components.jiaofuxinxi' })}
      extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
    >
      <RenderCard
        infoList={payInfo}
        dataSource={versionContext ? { ...dataBo?.consignee, deliverDate: dataBo?.deliverDate } : _consignee}
        versionContext={versionContext}
        alteation={alteation}
      />
    </MellowCard>
  )
}

/**
 * 电子合同
 */
const ElectronicContract = () => {
  const { formContext, versionContext } = useContext(OrderDetailContext)
  const { data } = formContext
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<any>()
  const handRenderValue = (value) => {
    const { contractText, contractTextChangeStatus } = formatContext(versionContext, value)

    setDataBo({
      contractText,
      contractTextChangeStatus,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  const electronicContractInfo = [
    {
      name: 'contractText',
      render: (_item) => {
        return _item?.contractUrl ? (
          <Button type="link" href={_item?.contractUrl} target="_blank">
            {_item?.contractName}
          </Button>
        ) : (
          <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      },
    },
  ]

  useEffect(() => {
    if (versionContext) {
      console.log(dataBo)
      setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <MellowCard
      id="contractInfo"
      title="电子合同"
      extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
    >
      <RenderCard
        colSpan={24}
        infoList={electronicContractInfo}
        dataSource={versionContext ? { ...dataBo } : data}
        versionContext={versionContext}
        alteation={alteation}
      />
    </MellowCard>
  )
}

/**
 * 发票信息
 */
const InvoiceInfo = () => {
  const modalRef = useRef<any>({})
  const { pathname } = useLocation()
  const { formContext, versionContext } = useContext(OrderDetailContext)
  const { data, reloadFormData } = formContext
  const { invoice } = data
  const [formInitValue, setFormInitValue] = useState<any>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [applyVisible, setApplyVisible] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit' | 'default' | 'preview' | 'delete'>('default')
  const translate = useWebIntl()
  const [fieldState, setFieldState] = useState<IState>({
    dataSource: [],
    useValue: null,
  })
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<any>()
  // 当前url下是采购订单详情 可显示申请开票
  const applyable = pathname === '/orderAbility/purchaseOrder/orderList/detail'

  const confirmApplySubmit = () => {
    const formData = fieldState.dataSource.filter((item) => item.id === fieldState.useValue)[0]
    const params = {
      orderId: data.orderId,
      invoiceId: formData.id,
      invoiceKind: formData.kind,
      invoiceType: formData.type,
      title: formData.invoiceTitle,
      taxNo: formData.taxNo,
      bank: formData.bankOfDeposit,
      account: formData.account,
      address: formData.address,
      phone: formData.tel,
    }
    postOrderBuyerInvoice({ ...params }).then((res) => {
      if (res.code === 1000) {
        setApplyVisible(false)
        reloadFormData()
      }
    })
  }

  const invoiceInfo = [
    {
      title: intl.formatMessage({ id: 'transaction_components.xuyaofapiao' }),
      name: 'invoice',
      childKey: 'hasInvoice',
      render: (item) =>
        item?.invoiceId
          ? intl.formatMessage({ id: 'transaction_components.shi' })
          : intl.formatMessage({ id: 'transaction_components.fou' }),
    },
    {
      title: translate('web.resource.balance.fapiaotaitou'),
      name: 'invoice',
      childKey: 'title',
      render: (_item) => _item?.title,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fapiaoleixing' }),
      name: 'invoice',
      childKey: 'invoiceKindName',
      render: (item) => item?.invoiceKindName,
    },
    {
      title: translate('web.resource.balance.fapiaohaoma'),
      name: 'invoice',
      childKey: 'invoiceNo',
      render: (_item) => (
        <Button type="link" onClick={() => setIsModalVisible(true)}>
          {_item?.invoiceNo}
        </Button>
      ),
    },
  ]
  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={() => setApplyVisible(false)} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'transaction_components.quxiao' })}
      </Button>
      <Button onClick={confirmApplySubmit} type="primary">
        {intl.formatMessage({ id: 'transaction_components.queding' })}
      </Button>
    </div>
  )
  const reload = () => {
    getSettlementInvoiceMessageList().then(({ data }) => {
      const _data = data.sort((a, b) => a.id - b.id)
      setFieldState({
        dataSource: _data,
        useValue: _data[0].id,
      })
    })
  }

  const applyInvoice = () => {
    setApplyVisible(true)
    reload()
  }

  const handleAdd = () => {
    setMode('add')
    modalRef.current.setVisible(true)
  }

  const handleCheck = (e) => {
    setFieldState(() => ({
      dataSource: [...fieldState.dataSource],
      useValue: e.target.value,
    }))
  }

  const handleDelete = async (id, e) => {
    // 选中当前的删除
    e.stopPropagation()
    try {
      const result = await postSettlementInvoiceMessageDelete({ id })
      if (result.code === 1000) {
        reload()
        setMode('delete')
      }
    } catch (error) {}
  }

  const handleEdit = async (item, e, _mode?) => {
    e.stopPropagation()
    const { data } = await getSettlementInvoiceMessageDetails({ id: item.id })
    setFormInitValue({ ...data, isDefault: item.isDefault })
    setMode(_mode || 'edit')
    modalRef.current.setVisible(true)
  }

  const handleSetDefault = async (item, e) => {
    e.stopPropagation()
    await postSettlementInvoiceMessageUpdate({ ...item, isDefault: item.isDefault ? 0 : 1 })
    reload()
  }

  const handRenderValue = (value) => {
    const { invoice, invoiceChangeStatus } = formatContext(versionContext, value)

    setDataBo({
      invoice,
      invoiceChangeStatus,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  useEffect(() => {
    if (versionContext) {
      setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <Fragment>
      <MellowCard
        id="invoiceInfo"
        title={intl.formatMessage({ id: 'transaction_components.fapiaoxinxi' })}
        extra={
          <Space>
            {data.showApplyInvoice && applyable && (
              <a onClick={applyInvoice}>{intl.formatMessage({ id: 'transaction_components.shenqingkaipiao' })}</a>
            )}
            {versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
          </Space>
        }
      >
        <RenderCard
          infoList={invoiceInfo}
          dataSource={versionContext ? { ...dataBo } : { ...data }}
          versionContext={versionContext}
          alteation={alteation}
        />
      </MellowCard>
      {/* 选择开票 */}
      <Drawer
        title={intl.formatMessage({ id: 'transaction_components.shenqingkaipiao' })}
        visible={applyVisible}
        footer={footer}
        width={608}
        onClose={() => setApplyVisible(false)}
      >
        <div>
          <Radio.Group className={style.raido_group} value={fieldState.useValue} onChange={(e) => handleCheck(e)}>
            <div className={style.invoice_list}>
              {fieldState.dataSource.map((item, index) => (
                <Row style={{ marginBottom: 16 }} key={`invoice_list_item_${index}`}>
                  <Col span={24}>
                    <Radio className={cx(style.list_radio)} value={item.id} key={`address_list_radio_${item?.id}`}>
                      <div className={style.invoice_list_item}>
                        <div className={style.invoice_list_item_content}>
                          <div
                            className={cx(style.invoice_list_item_content_tag, item.kind !== 1 ? style.special : '')}
                          >
                            {item.kind === 1
                              ? intl.formatMessage({
                                  id: 'transaction_components.zengzhishuiputongfapiao',
                                })
                              : intl.formatMessage({
                                  id: 'transaction_components.zengzhishuizhuanyongfapiao',
                                })}
                          </div>
                          <div className={style.invoice_list_item_content_name}>
                            <span>{item.invoiceTitle}</span>
                            <span>
                              {item.type === 1
                                ? intl.formatMessage({ id: 'transaction_components.qiye' })
                                : intl.formatMessage({ id: 'transaction_components.geren' })}
                            </span>
                            {item.isDefault === 1 ? (
                              <div className={style.default}>
                                {intl.formatMessage({ id: 'transaction_components.moren' })}
                              </div>
                            ) : (
                              <div className={style.set_default} onClick={(e) => handleSetDefault(item, e)}>
                                {intl.formatMessage({ id: 'transaction_components.sheweimoren' })}
                              </div>
                            )}
                          </div>
                        </div>
                        {fieldState.useValue === item.id && (
                          <div className={style.invoice_list_item_btn_group}>
                            <div className={style.invoice_list_item_btn} onClick={(e) => handleEdit(item, e)}>
                              {intl.formatMessage({ id: 'transaction_components.bianji' })}
                            </div>
                            <div className={style.invoice_list_item_btn} onClick={(e) => handleDelete(item?.id, e)}>
                              {intl.formatMessage({ id: 'transaction_components.shanchu' })}
                            </div>
                          </div>
                        )}
                      </div>
                    </Radio>
                  </Col>
                </Row>
              ))}
              <Row>
                <Col span={24}>
                  <div
                    className={style.select_style_border}
                    style={{ width: '100%', height: '100%', borderStyle: 'dashed' }}
                    onClick={handleAdd}
                  >
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 12, marginTop: 14 }}>
                      <PlusOutlined />
                      &nbsp;{intl.formatMessage({ id: 'transaction_components.xinzengfapiao' })}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Radio.Group>
          <InvoiceModal mode={mode} formInitValue={formInitValue} currentRef={modalRef} reload={reload} />
        </div>
      </Drawer>
      {/* 查看发票 */}
      <Modal
        title={intl.formatMessage({ id: 'transaction_components.fapiaoxinxi' })}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Row gutter={[0, 10]} style={{ fontSize: 14 }}>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.kaijuleixing' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.invoiceTypeName : invoice?.invoiceTypeName}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.fapiaozhonglei' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.invoiceKindName : invoice?.invoiceKindName}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.fapiaotaitou' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.title : invoice?.title}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.nashuihao' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.taxNo : invoice?.taxNo}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.kaihuhang' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.bank : invoice?.bank}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.zhanghao' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.account : invoice?.account}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.dizhi' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.address : invoice?.address}</Col>
          <Col span={4} style={{ fontSize: 12, color: '#909399' }}>
            {intl.formatMessage({ id: 'transaction_components.dianhua' })}：
          </Col>
          <Col span={20}>{versionContext ? dataBo?.invoice?.phone : invoice?.phone}</Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

/**
 * 其他信息
 */
const OtherInfo = () => {
  const { formContext, versionContext } = useContext(OrderDetailContext)
  const { data } = formContext
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<any>()
  const handRenderValue = (value) => {
    const { pack, packChangeStatus, remark, remarkChangeStatus } = formatContext(versionContext, value)

    setDataBo({
      requirement: {
        pack,
        remark,
        packChangeStatus,
        remarkChangeStatus,
      },
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  useEffect(() => {
    if (versionContext) {
      handRenderValue('after')
    }
  }, [versionContext])

  const otherInfo = [
    ...(!versionContext || dataBo?.requirement?.packChangeStatus
      ? [
          {
            title: intl.formatMessage({ id: 'transaction_components.baozhuangyaoqiu' }),
            name: 'pack',
          },
        ]
      : []),
    ...(!versionContext || dataBo?.requirement?.remarkChangeStatus
      ? [{ title: intl.formatMessage({ id: 'transaction_components.qitayaoqiu' }), name: 'remark' }]
      : []),
  ]

  return (
    <MellowCard
      id="otherInfo"
      title={intl.formatMessage({ id: 'transaction_components.qitaxinxi' })}
      extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
    >
      <RenderCard
        infoList={otherInfo}
        dataSource={versionContext ? { ...dataBo?.requirement } : { ...data, ...data.requirement }}
        versionContext={versionContext}
        alteation={alteation}
      />
    </MellowCard>
  )
}

const OrderMergeInfo: React.FC<OrderMergeInfoProps> = () => {
  const userInfo: any = authService.getAuth() || {}
  const { lastTypeParams } = usePageStatus() // 修改单价页面
  const { formContext, versionContext } = useContext(OrderDetailContext)
  const ht_show = userInfo.memberRoleId === 9 && formContext.data?.innerStatus > 100
  const edit_show = lastTypeParams === '/detail' && formContext.data?.innerStatus === 101
  const { data } = formContext

  const [dataBo, setDataBo] = useState<any>()

  const promotionInfo = [
    {
      title: intl.formatMessage({ id: 'transaction_components.pintuanzhuangtai' }),
      name: 'promotionStatusName',
    },
  ]

  const handRenderValue = (value) => {
    const {
      invoice,
      invoiceChangeStatus,
      consignee,
      deliverDate,
      deliverDateChangeStatus,
      consigneeChangeStatus,
      pack,
      packChangeStatus,
      remark,
      remarkChangeStatus,
    } = formatContext(versionContext, value)

    setDataBo({
      invoice,
      invoiceChangeStatus,
      consignee,
      deliverDate,
      deliverDateChangeStatus,
      consigneeChangeStatus,
      requirement: {
        pack,
        remark,
        packChangeStatus,
        remarkChangeStatus,
      },
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
  }

  useEffect(() => {
    if (versionContext) {
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <Space direction="vertical" size={16} style={{ width: '100%', display: 'flex' }}>
      {!versionContext || dataBo?.consigneeChangeStatus || dataBo?.deliverDateChangeStatus ? <DeliveryInfo /> : null}
      {(ht_show || data?.orderKind) &&
      // data?.orderKind === OrderKindType.PURCHASE_ORDER ||
      // data?.orderKind === OrderKindType.SRM_ORDER ||
      // data?.orderKind === OrderKindType.REQUISITION_ORDER) &&
      !(ht_show && edit_show) &&
      (!versionContext || dataBo?.contractTextChangeStatus) &&
      data?.contract ? (
        <ElectronicContract />
      ) : null}
      {!versionContext || dataBo?.invoiceChangeStatus ? <InvoiceInfo /> : null}
      {/* 点击变更详情后如果没变更则不展示 */}
      {!versionContext || dataBo?.requirement?.packChangeStatus || dataBo?.requirement?.remarkChangeStatus ? (
        <OtherInfo />
      ) : null}
      {data.groupOrder ? (
        <MellowCard
          title={intl.formatMessage({ id: 'transaction_components.pintuanxinxi' })}
          extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
        >
          <RenderCard infoList={promotionInfo} dataSource={{ ...data, ...data.requirement }} />
        </MellowCard>
      ) : null}
    </Space>
  )
}

OrderMergeInfo.defaultProps = {}

export default OrderMergeInfo
