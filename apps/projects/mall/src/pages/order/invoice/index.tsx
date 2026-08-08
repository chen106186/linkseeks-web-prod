import React, { useState, useEffect } from 'react'
import { Checkbox, Radio, Modal, message } from 'antd'
import cx from 'classnames'
import {
  GetSettlementInvoiceMessageListResponse,
  getSettlementInvoiceMessageList,
  postSettlementInvoiceMessageDelete,
  postSettlementInvoiceMessageUpdate,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import AddInvoice from '../components/addInvoice'
import styles from './index.module.less'

interface InvoicePropsType {
  visible: boolean
  state: boolean
  onChange: Function
  onSelect: Function
}

const Invoice: React.FC<InvoicePropsType> = (props) => {
  const { visible, state, onChange, onSelect } = props
  const [selectKey, setSelectKey] = useState<number>()
  const [invoiceFormVisible, setInvoiceFormVisible] = useState<boolean>(false)
  const [invoiceList, setInvoiceList] = useState<GetSettlementInvoiceMessageListResponse>([])
  const [editItem, setEditItem] = useState<any>()
  const [type, setType] = useState<'add' | 'edit'>('add')
  const translate = getWebIntl()

  useEffect(() => {
    if (visible) {
      fetchInvoiceList(true)
    }
  }, [visible])

  const fetchInvoiceList = (init = false, id?: number) => {
    getSettlementInvoiceMessageList().then((res) => {
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
      content: translate('web.resource.balance.shifouquerenshanchufapiaoxinxi'),
      centered: true,
      okText: translate('web.common.confirm'),
      cancelText: translate('web.common.cancel'),
      onOk: () => {
        return new Promise((resolve, reject) => {
          postSettlementInvoiceMessageDelete({ id })
            .then((res) => {
              if (res.code === 1000) {
                resolve(true)
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
    postSettlementInvoiceMessageUpdate(param).then((res) => {
      if (res.code === 1000) {
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
        <span>{translate('web.resource.balance.fapiaoxinxi')}</span>
        <div
          className={styles.common_title_btn}
          onClick={() => {
            setInvoiceFormVisible(true)
            setType('add')
            setEditItem(null)
          }}
        >
          {translate('web.resource.balance.xinzengfapiaoxinxi')}
        </div>
      </div>
      <div className={styles.checkbox}>
        <Checkbox checked={state} onChange={handleStateChange}>
          {translate('web.resource.balance.xuyaofapiao')}
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
                        ? translate('web.resource.order.zengzhishuifapiao')
                        : translate('web.resource.order.zengzhishuizhuangyongfapiao')}
                    </div>
                    <div className={styles.invoice_list_item_content_name}>
                      <span>{item.invoiceTitle}</span>
                      <span>{item.type === 1 ? translate('web.common.qiye') : translate('web.common.geren')}</span>
                      {item.isDefault === 1 ? (
                        <div className={styles.default}>{translate('web.common.default')}</div>
                      ) : (
                        <div className={styles.set_default} onClick={() => handleSetDefault(item)}>
                          {translate('web.common.setDefault')}
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
                        {translate('web.common.edit')}
                      </div>
                      <div className={styles.invoice_list_item_btn} onClick={() => handleDelteInvoice(item.id)}>
                        {translate('web.common.delete')}
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
            ? translate('web.resource.balance.xinzengfapiaoxinxi')
            : translate('web.resource.balance.bianjifapiaoxinxi')
        }
        type={type}
        editItem={editItem}
        visible={invoiceFormVisible}
        onOk={(id: number | undefined) => handleAddSuccess(id)}
        onCancel={() => setInvoiceFormVisible(false)}
      />
    </div>
  ) : null
}

export default Invoice
