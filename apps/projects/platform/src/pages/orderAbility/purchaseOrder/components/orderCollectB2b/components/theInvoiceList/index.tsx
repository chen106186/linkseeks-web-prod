import React, { useState, useRef } from 'react'
import { ISchemaFieldComponentProps, useFieldState } from '@apps/formily'
import { Col, Radio, Row } from 'antd'
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { fetchOrderApi } from '../../apis'
import InvoiceModal from '../invoiceModal'
import styles from './index.less'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import {
  getSettlementInvoiceMessageDetails,
  postSettlementInvoiceMessageDelete,
  postSettlementInvoiceMessageUpdate,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const TheInvoiceList = (props: ISchemaFieldComponentProps) => {
  const intl = useIntl()
  const [formInitValue, setFormInitValue] = useState<any>(null)
  const [mode, setMode] = useState<'add' | 'edit' | 'default' | 'preview' | 'delete'>('default')
  const modalRef = useRef<any>({})
  let { value, mutators, form, editable } = props

  const [state, setFieldState] = useFieldState({
    dataSource: [],
    showMore: false,
    useValue: null,
  })
  const { dataSource, showMore, useValue } = state

  const { pageStatus, id } = usePageStatus()

  // const [useValue, setUseValue] = useState(() => typeof value === 'object' ? value : dataSource.find(v => v.id === value))

  // let useValue = typeof value === 'object' ? value : dataSource.find(v => v.id === value)

  if (pageStatus === PageStatus.ADD) {
    if (typeof value === 'object') {
      setFieldState({
        dataSource,
        showMore,
        useValue: value,
      })
    }
  } else if (pageStatus === PageStatus.EDIT) {
    // @bug todo 编辑情况下 默认显示有问题 固定第一个
    // console.log(value, mode, dataSource, 'EDIT')
    if (typeof value === 'object') {
      // let target = (mode === 'add' || mode === 'delete') ? dataSource[0] : value
      let target = value
      if (mode === 'add' || mode === 'delete') {
        target = dataSource[0]
      } else if (mode === 'edit') {
        target = dataSource.find((v) => v.id === value.id)
      }
      setFieldState({
        dataSource,
        showMore,
        useValue: target,
      })
      // console.log('isObject', target)
      mutators.change(target)
    } else {
      let target = dataSource.length ? dataSource.find((v) => v.id === value) : value
      setFieldState({
        dataSource,
        showMore,
        useValue: target,
      })
      // console.log('notObject', target)
      mutators.change(target)
    }
  }

  const transformDefaultData = (data: any[]) => {
    if (data.length === 0) return data

    const hasDefault = data.some((v) => v.isDefault === 1)
    return hasDefault
      ? data
      : data.map((v, i) => {
          if (i === 0) {
            v.isDefault = 1
          }
          return v
        })
  }

  const transformData = transformDefaultData(dataSource)
  const showDataSource = showMore ? [...transformData].splice(0, 3) : transformData
  const handleAdd = () => {
    setMode('add')
    modalRef.current.setVisible(true)
  }
  const handleCheck = (item) => {
    // 选中的id
    mutators.change(item)
  }

  const reload = () => {
    fetchOrderApi.getInvoicesList().then((data) => {
      if (!data.length) {
        form.setFieldValue('needTheInvoice', 0)
      }
      // 订单新增 重载全部置为第一个
      let _data = data.sort((a, b) => b.id - a.id)
      if (pageStatus === PageStatus.ADD) {
        setFieldState({
          dataSource: _data,
          showMore,
          useValue: _data[0],
        })
        mutators.change(_data[0])
      } else if (pageStatus === PageStatus.EDIT) {
        setFieldState({
          dataSource: _data,
          showMore,
          useValue,
        })
      }
    })
  }

  const toogleMore = () => {
    setFieldState({
      dataSource,
      showMore: !showMore,
      useValue,
    })
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

  const handleEdit = async (item, e, mode?) => {
    e.stopPropagation()
    const { data } = await getSettlementInvoiceMessageDetails({ id: item.id })
    setFormInitValue({ ...data, isDefault: item.isDefault })
    setMode(mode || 'edit')
    modalRef.current.setVisible(true)
  }

  const handleSetDefault = async (item, e) => {
    e.stopPropagation()
    const { data } = await postSettlementInvoiceMessageUpdate({ ...item, isDefault: item.isDefault ? 0 : 1 })
    reload()
  }

  // console.log(useValue, 'useValue', dataSource, 'dataSource', mode, value, 'value')

  return (
    <div style={{ width: '100%' }} className={styles.invoice}>
      {/* { editable && <Button block onClick={handleAdd} icon={<PlusOutlined/>}>新增发票</Button> } */}
      <Radio.Group className={styles.raido_group} value={useValue} onChange={(e) => handleCheck(e)}>
        <div className={styles.invoice_list}>
          <Row gutter={[16, 16]}>
            {showDataSource.map((item, index) => (
              <Col span={12}>
                <Radio className={styles.list_radio} value={item} key={`address_list_radio_${item?.id}`}>
                  <div className={styles.invoice_list_item} key={`invoice_list_item_${index}`}>
                    <div className={styles.invoice_list_item_content}>
                      <div className={cx(styles.invoice_list_item_content_tag, item.kind !== 1 ? styles.special : '')}>
                        {item.kind === 1
                          ? intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.kind1' })
                          : intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.kind2' })}
                      </div>
                      <div className={styles.invoice_list_item_content_name}>
                        <span>{item.invoiceTitle}</span>
                        <span>
                          (
                          {item.type === 1
                            ? intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.type1' })
                            : intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.type2' })}
                          )
                        </span>
                        {item.isDefault === 1 ? (
                          <div className={styles.default}>{intl.formatMessage({ id: 'purchaseOrder.default' })}</div>
                        ) : (
                          <div className={styles.set_default} onClick={(e) => handleSetDefault(item, e)}>
                            {intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.default2' })}
                          </div>
                        )}
                      </div>
                    </div>
                    {useValue?.id === item?.id &&
                      (editable ? (
                        <div className={styles.invoice_list_item_btn_group}>
                          <div className={styles.invoice_list_item_btn} onClick={(e) => handleEdit(item, e)}>
                            {intl.formatMessage({ id: 'purchaseOrder.edit' })}
                          </div>
                          <div className={styles.invoice_list_item_btn} onClick={(e) => handleDelete(item?.id, e)}>
                            {intl.formatMessage({ id: 'purchaseOrder.delete' })}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.invoice_list_item_btn_group}>
                          <div className={styles.invoice_list_item_btn} onClick={(e) => handleEdit(item, e, 'preview')}>
                            {intl.formatMessage({ id: 'purchaseOrder.view' })}
                          </div>
                        </div>
                      ))}
                  </div>
                </Radio>
              </Col>
            ))}
            {editable && (
              <Col span={12}>
                <div
                  className={styles.select_style_border}
                  style={{ width: '100%', height: '100%', borderStyle: 'dashed' }}
                  onClick={handleAdd}
                >
                  <p style={{ width: '100%', textAlign: 'center', fontSize: 12, marginTop: 14 }}>
                    <PlusOutlined />
                    &nbsp;{intl.formatMessage({ id: 'purchaseOrder.orderCollect.theInvoiceList.add' })}
                  </p>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Radio.Group>
      {transformData.length > 3 && (
        <div onClick={toogleMore} style={{ textAlign: 'center', cursor: 'pointer', color: '#00A98F' }}>
          {intl.formatMessage({ id: 'purchaseOrder.more' })}
          {showMore ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      )}

      <InvoiceModal mode={mode} formInitValue={formInitValue} currentRef={modalRef} reload={reload} />
    </div>
  )
}

TheInvoiceList.defaultProps = {}

TheInvoiceList.isFieldComponent = true

export default TheInvoiceList
