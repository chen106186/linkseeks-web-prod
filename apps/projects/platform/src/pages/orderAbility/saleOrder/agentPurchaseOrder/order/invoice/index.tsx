import React, { useState, useEffect } from 'react'
import { Checkbox, Radio, Modal, message } from 'antd'
import AddInvoice from '../components/addInvoice'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import {
  GetSettlementInvoiceMessageListResponse,
  // getSettlementInvoiceMessageList,
  // postSettlementInvoiceMessageDelete,
  // postSettlementInvoiceMessageUpdate,
  getSettlementAgentInvoiceMessageList,
  postSettlementAgentInvoiceMessageDelete,
  postSettlementAgentInvoiceMessageUpdate,
} from '@apps/apis'
import { AgentPurchaseOrderInfoType } from '../../types'

interface InvoicePropsType {
  visible: boolean
  state: boolean
  onChange: Function
  onSelect: Function
  buyerInfo: AgentPurchaseOrderInfoType
}

const Invoice: React.FC<InvoicePropsType> = (props) => {
  const { visible, state, onChange, onSelect, buyerInfo } = props
  const [selectKey, setSelectKey] = useState<number>()
  const [invoiceFormVisible, setInvoiceFormVisible] = useState<boolean>(false)
  const [invoiceList, setInvoiceList] = useState<GetSettlementInvoiceMessageListResponse>([])
  const [editItem, setEditItem] = useState<any>()
  const [type, setType] = useState<'add' | 'edit'>('add')
  const intl = useIntl()

  useEffect(() => {
    if (visible) {
      fetchInvoiceList(true)
    }
  }, [visible])

  const fetchInvoiceList = (init = false, id?: number) => {
    const param: any = {
      subMemberId: buyerInfo.memberId,
      subRoleId: buyerInfo.roleId,
    }
    getSettlementAgentInvoiceMessageList(param).then((res) => {
      if (res.code === 1000) {
        setInvoiceList(res.data)
        if (id && res.data) {
          onSelect(res.data.filter((item: any) => item.id === id)[0])
        }
        if (init) {
          initDefaultInvoice(res.data)
        }
      }
    })
  }

  const initDefaultInvoice = (data: GetSettlementInvoiceMessageListResponse) => {
    let selectItem
    for (const item of data) {
      if (item.isDefault === 1) {
        selectItem = item
      }
    }
    if (selectItem) {
      setSelectKey(selectItem.id)
      onSelect(selectItem)
    }
  }

  const handleSelect = (e: any) => {
    setSelectKey(e.target.value)
    let selectItem
    for (const item of invoiceList) {
      if (item.id === e.target.value) {
        selectItem = item
      }
    }
    if (selectItem) {
      onSelect(selectItem)
    }
  }

  const handleAddSuccess = (id: number | undefined) => {
    fetchInvoiceList(false, id)
    setInvoiceFormVisible(false)
    setEditItem(null)
  }

  /**
   * 删除发票
   */
  const handleDelteInvoice = (id: number) => {
    Modal.confirm({
      className: styles.mallComfirm,
      content: intl.formatMessage({ id: 'order.index.invoice.deleteInformation' }),
      centered: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          const params: any = {
            id,
            subMemberId: buyerInfo.memberId,
            subRoleId: buyerInfo.roleId,
          }
          postSettlementAgentInvoiceMessageDelete(params)
            .then((res) => {
              if (res.code === 1000) {
                resolve(true)
                message.success(intl.formatMessage({ id: 'option.success' }))
                fetchInvoiceList()
              }
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  /**
   * 设置为默认
   * @param item
   */
  const handleSetDefault = (item: any) => {
    const param = item
    param.isDefault = 1
    param['subMemberId'] = buyerInfo.memberId
    param['subRoleId'] = buyerInfo.roleId
    postSettlementAgentInvoiceMessageUpdate(param).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        message.success(intl.formatMessage({ id: 'option.success' }))
        fetchInvoiceList()
      }
    })
  }

  const handleStateChange = (e: any) => {
    onChange(e.target.checked)
  }
  return visible ? (
    <div className={styles.invoice}>
      <div className={styles.common_title}>
        <span>{intl.formatMessage({ id: 'order.index.invoice.InvoiceInformation' })}</span>
        <div
          className={styles.common_title_btn}
          onClick={() => {
            setInvoiceFormVisible(true)
            setType('add')
            setEditItem(null)
          }}
        >
          {intl.formatMessage({ id: 'order.index.invoice.addInvoiceInformation' })}
        </div>
      </div>
      <div className={styles.checkbox}>
        <Checkbox checked={state} onChange={handleStateChange}>
          {intl.formatMessage({ id: 'order.index.invoice.needInformation' })}
        </Checkbox>
      </div>
      {state && (
        <Radio.Group className={styles.raido_group} value={selectKey} onChange={handleSelect}>
          <div className={styles.invoice_list}>
            {invoiceList.map((item, index) => (
              <Radio className={styles.list_radio} value={item.id} key={`address_list_radio_${item.id}`}>
                <div className={styles.invoice_list_item} key={`invoice_list_item_${index}`}>
                  <div className={styles.invoice_list_item_content}>
                    <div className={cx(styles.invoice_list_item_content_tag, item.kind !== 1 ? styles.special : '')}>
                      {item.kind === 1
                        ? intl.formatMessage({ id: 'order.index.invoice.VATOrdinary' })
                        : intl.formatMessage({ id: 'order.index.invoice.VATSpecial' })}
                    </div>
                    <div className={styles.invoice_list_item_content_name}>
                      <span>{item.invoiceTitle}</span>
                      <span>
                        {item.type === 1
                          ? intl.formatMessage({ id: 'order.index.invoice.enterprise' })
                          : intl.formatMessage({ id: 'order.index.invoice.personal' })}
                      </span>
                      {item.isDefault === 1 ? (
                        <div className={styles.default}>
                          {intl.formatMessage({ id: 'order.index.invoice.default' })}
                        </div>
                      ) : (
                        <div className={styles.set_default} onClick={() => handleSetDefault(item)}>
                          {intl.formatMessage({ id: 'order.index.invoice.SetAsDefault' })}
                        </div>
                      )}
                    </div>
                  </div>
                  {selectKey === item.id && (
                    <div className={styles.invoice_list_item_btn_group}>
                      <div
                        className={styles.invoice_list_item_btn}
                        onClick={() => {
                          setEditItem(item)
                          setType('edit')
                          setInvoiceFormVisible(true)
                        }}
                      >
                        {intl.formatMessage({ id: 'order.index.invoice.edit' })}
                      </div>
                      <div className={styles.invoice_list_item_btn} onClick={() => handleDelteInvoice(item.id)}>
                        {intl.formatMessage({ id: 'order.index.invoice.delete' })}
                      </div>
                    </div>
                  )}
                </div>
              </Radio>
            ))}
          </div>
        </Radio.Group>
      )}
      <AddInvoice
        title={
          type === 'add'
            ? intl.formatMessage({ id: 'order.index.invoice.addInvoiceInformation' })
            : intl.formatMessage({ id: 'order.index.invoice.editInvoiceInformation' })
        }
        type={type}
        editItem={editItem}
        buyerInfo={buyerInfo}
        visible={invoiceFormVisible}
        onOk={(id: number | undefined) => handleAddSuccess(id)}
        onCancel={() => setInvoiceFormVisible(false)}
      />
    </div>
  ) : null
}

export default Invoice
