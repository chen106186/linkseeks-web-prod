import React, { useEffect, useRef, useState } from 'react'
import { Col, FormInstance, Modal, Radio, Row } from 'antd'
import cx from 'classnames'
import {
  getSettlementInvoiceMessageDetails,
  getSettlementInvoiceMessageList,
  postSettlementInvoiceMessageDelete,
  postSettlementInvoiceMessageUpdate,
} from '@apps/apis'
import type { PostSettlementInvoiceMessageUpdateRequest } from '@apps/apis'
import { CaretDownOutlined, CaretUpOutlined, PlusOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'
import InvoiceModal from './invoiceModal'
import styles from './index.less'
import { useOrder } from '../../orderProvider'

interface ValueType {
  /** 发票Id */
  invoiceId: number
  /** 发票种类，1-企业，2-个人 */
  invoiceKind: number
  /** 发票类型，1-增值税普通发票，2-增值税专用发票 */
  invoiceType: number
  /** 发票抬头 */
  title: string
  /** 纳税号 */
  taxNo: string
  /** 开户银行 */
  bank: string
  /** 账号 */
  account: string
  /** 地址 */
  address: string
  /** 电话 */
  phone: string
  /** 是否默认，true-是，false-否 */
  defaultInvoice: boolean
  remark?: string
  email?: string
}

interface InvoiceSelectProps {
  value?: ValueType
  disabled?: boolean
  onChange?: (value: ValueType) => void
}

const InvoiceSelect: React.FC<InvoiceSelectProps> = (props) => {
  const { disabled } = props
  const [list, setList] = useState<ValueType[]>([])
  const [selectValue, setSelectValue] = useState<ValueType>()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [modalOptionType, setModalOptionType] = useState<'add' | 'edit' | 'preview'>('add')
  const modalRef = useRef<any>()
  const { form, orderDetail } = useOrder()
  const translate = useWebIntl()

  const fetchList = () => {
    getSettlementInvoiceMessageList().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setList(
          res.data.map((item) => ({
            invoiceId: item.id,
            invoiceKind: item.kind,
            invoiceType: item.type,
            title: item.invoiceTitle,
            taxNo: item.taxNo,
            bank: item.bankOfDeposit,
            account: item.account,
            address: item.address,
            phone: item.tel,
            defaultInvoice: item.isDefault ? true : false,
            remark: item.remark,
            email: item.email,
          })),
        )
      }
    })
  }

  useEffect(() => {
    if (list && list.length > 0 && !selectValue) {
      const defaultInfo = list.find((item) => item.defaultInvoice)
      if (defaultInfo) {
        setSelectValue(defaultInfo)
        form.setFieldValue('invoice', defaultInfo)
      } else {
        setSelectValue(list[0])
        form.setFieldValue('invoice', list[0])
      }
    }
  }, [list, selectValue])

  useEffect(() => {
    if (list && list.length > 0 && orderDetail && orderDetail.invoice.invoiceId) {
      const selectItem = list.find((item) => item.invoiceId === orderDetail.invoice.invoiceId)
      if (selectItem) {
        setSelectValue(selectItem)
        form.setFieldValue('invoice', selectItem)
      }
    }
  }, [orderDetail, list])

  useEffect(() => {
    fetchList()
  }, [])

  const handleSetDefault = async (item: ValueType, e) => {
    e.stopPropagation()
    const payload: PostSettlementInvoiceMessageUpdateRequest = {
      id: item.invoiceId,
      kind: item.invoiceKind,
      type: item.invoiceType,
      invoiceTitle: item.title,
      taxNo: item.taxNo,
      bankOfDeposit: item.bank,
      account: item.account,
      address: item.address,
      tel: item.phone,
      email: item.email,
      remark: item.remark,
      isDefault: item.defaultInvoice ? 0 : 1,
    }
    const { code } = await postSettlementInvoiceMessageUpdate(payload)
    if (code === 1000) {
      fetchList()
    }
  }

  const handleDelete = async (id, e) => {
    // 选中当前的删除
    e.stopPropagation()
    try {
      Modal.confirm({
        title: translate('web.resource.logistics.shifouquerenshanchu'),
        onOk: async () => {
          const result = await postSettlementInvoiceMessageDelete({ id })
          if (result.code === 1000) {
            fetchList()
          }
        },
      })
    } catch (error) {}
  }

  const handleEdit = async (item: ValueType, e) => {
    e.stopPropagation()
    const { data } = await getSettlementInvoiceMessageDetails({ id: String(item.invoiceId) })
    setModalOptionType('edit')
    modalRef.current.setVisible(true)
    modalRef.current.form?.setFieldsValue({
      ...data,
      isDefault: item.defaultInvoice,
    })
  }

  const handleAdd = () => {
    setModalOptionType('add')
    modalRef.current?.setVisible(true)
  }

  return (
    <div style={{ width: '100%' }} className={styles.invoice}>
      <Radio.Group
        className={styles.raido_group}
        value={selectValue}
        onChange={(e) => {
          setSelectValue(e.target.value)
          form.setFieldValue('invoice', e.target.value)
        }}
      >
        <div className={styles.invoice_list}>
          <Row gutter={[8, 8]}>
            {list.map(
              (item, index) =>
                (showMore || index < 3) && (
                  <Col span={12} key={`address_list_radio_${item?.invoiceId}`}>
                    <Radio className={styles.list_radio} value={item}>
                      <div className={styles.invoice_list_item} key={`invoice_list_item_${index}`}>
                        <div className={styles.invoice_list_item_content}>
                          <div
                            className={cx(
                              styles.invoice_list_item_content_tag,
                              item.invoiceKind !== 1 ? styles.special : '',
                            )}
                          >
                            {item.invoiceKind === 1
                              ? translate('web.resource.order.zengzhishuifapiao')
                              : translate('web.resource.order.zengzhishuizhuangyongfapiao')}
                          </div>
                          <div className={styles.invoice_list_item_content_name}>
                            <span>{item.title}</span>
                            <span>
                              ({item.invoiceType === 1 ? translate('web.common.qiye') : translate('web.common.geren')})
                            </span>
                            {item.defaultInvoice ? (
                              <div className={styles.default}>{translate('web.common.default')}</div>
                            ) : (
                              <div className={styles.set_default} onClick={(e) => handleSetDefault(item, e)}>
                                {translate('web.common.setDefault')}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectValue?.invoiceId === item?.invoiceId &&
                          (!disabled ? (
                            <div className={styles.invoice_list_item_btn_group}>
                              <div className={styles.invoice_list_item_btn} onClick={(e) => handleEdit(item, e)}>
                                {translate('web.common.edit')}
                              </div>
                              <div
                                className={styles.invoice_list_item_btn}
                                onClick={(e) => handleDelete(item?.invoiceId, e)}
                              >
                                {translate('web.common.delete')}
                              </div>
                            </div>
                          ) : null)}
                      </div>
                    </Radio>
                  </Col>
                ),
            )}
            {!disabled && (
              <Col span={12}>
                <div
                  className={styles.select_style_border}
                  style={{ width: '100%', height: 72, display: 'flex', alignItems: 'center', borderStyle: 'dashed' }}
                  onClick={handleAdd}
                >
                  <p style={{ width: '100%', textAlign: 'center', fontSize: 12, marginBottom: 0 }}>
                    <PlusOutlined />
                    &nbsp;{translate('web.common.add')}
                  </p>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Radio.Group>
      {list.length > 3 && (
        <div
          onClick={() => setShowMore(!showMore)}
          style={{ textAlign: 'center', cursor: 'pointer', color: '#00a98f', marginTop: 8 }}
        >
          {!showMore ? translate('web.common.more') : translate('web.resource.mall.shouqi')}
          {showMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </div>
      )}
      <InvoiceModal
        currentRef={modalRef}
        optionType={modalOptionType}
        onOk={() => {
          fetchList()
        }}
      />
    </div>
  )
}

export default InvoiceSelect
