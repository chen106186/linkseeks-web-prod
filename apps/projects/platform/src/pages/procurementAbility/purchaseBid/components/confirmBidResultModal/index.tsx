import React, { useState, useEffect, useMemo } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Modal, Tabs, Form, Checkbox, Input } from 'antd'
const { TabPane } = Tabs

const { TextArea } = Input

import { priceFormat } from '@/utils/numberFomat'

const intl = getIntl()

import styles from './index.less'

interface ConfirmBidResultModalProps {
  title: string
  visible: boolean
  record: any
  fetch: Promise<any>
  onCancel: () => void
  onOk: () => void
}

const isForType = {
  1: true,
  0: false,
}

const ConfirmBidResultModal: React.FC<ConfirmBidResultModalProps> = (props: any) => {
  const [form] = Form.useForm()
  const { title, visible, onCancel, onOk, record, fetch } = props

  // 是否发送中标公示
  const [notice, setNotice] = useState<boolean>(record && record.notice ? isForType[record.notice] : true)
  // 是否发送中标通知
  const [prizeNotice, setPrizeNotice] = useState<boolean>(
    record && record.prizeNotice ? isForType[record.prizeNotice] : true,
  )
  // 是否发送感谢函
  const [thank, setThank] = useState<boolean>(record && record.thank ? isForType[record.thank] : true)
  // 控制tabkey
  const [activeKey, setActiveKey] = useState<string>('1')

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const handleOk = () => {
    if (confirmLoading) {
      return
    }
    form.validateFields().then((res) => {
      const _params = {
        id: record.id,
        state: -1,
        prizeNotice: Number(res.prizeNotice),
        thank: Number(res.thank),
        notice: Number(res.notice),
        awardResults: res.awardResults,
        content: res.content,
      }
      setConfirmLoading(true)
      fetch &&
        fetch(_params)
          .then((res) => {
            console.log(res)
            if (res.code === 1000) {
              onOk && onOk()
            }
          })
          .finally(() => setConfirmLoading(false))
    })
  }

  const _returnDefaultAwardResults = useMemo(() => {
    return record
      ? intl.formatMessage({
          id: 'modal.purchase.awardResults',
          createMemberName: record?.purchaseMemberName ?? record?.createMemberName,
          details: record.details,
          memberName: record.memberName,
          sumAwardPrice: priceFormat(record.sumAwardPrice),
          signUpIdea: record.signUpIdea,
        })
      : ''
  }, [record])

  const _returnDefaultContent = useMemo(() => {
    return record ? intl.formatMessage({ id: 'modal.purchase.thankLetter', details: record.details }) : ''
  }, [record])

  const onCheckboxChange = (e: { target: { checked: boolean } }, func: Function, name: string) => {
    func(e.target.checked)
    form.setFieldsValue({ [`${name}`]: e.target.checked })
  }

  useEffect(() => {
    form.setFieldsValue({
      notice: record && record.notice ? isForType[record.notice] : true,
      prizeNotice: record && record.prizeNotice ? isForType[record.prizeNotice] : true,
      thank: record && record.thank ? isForType[record.thank] : true,
      awardResults: _returnDefaultAwardResults,
      content: _returnDefaultContent,
    })
    setNotice(record && record.notice ? isForType[record.notice] : true),
      setPrizeNotice(record && record.prizeNotice ? isForType[record.prizeNotice] : true),
      setThank(record && record.thank ? isForType[record.thank] : true),
      setActiveKey('1')
  }, [visible])

  return (
    <Modal
      width={600}
      title={title}
      visible={visible}
      onCancel={onCancel}
      wrapClassName={styles.wrap}
      onOk={() => {
        handleOk()
      }}
      afterClose={() => {
        form.resetFields()
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form}>
        <Tabs
          tabPosition="left"
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key)
          }}
        >
          <TabPane tab={intl.formatMessage({ id: 'table.purchase.tab.notice' })} key="1" forceRender={true}>
            <Form.Item name="notice">
              <Checkbox
                checked={notice}
                onChange={(e) => {
                  onCheckboxChange(e, setNotice, 'notice')
                }}
              >
                {intl.formatMessage({ id: 'table.purchase.tab.notice.send' })}
              </Checkbox>
            </Form.Item>
            <Form.Item name="awardResults">
              <TextArea rows={6} placeholder={intl.formatMessage({ id: 'table.purchase.tab.notice.placeholder' })} />
            </Form.Item>
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'table.purchase.tab.prizeNotice' })} key="2" forceRender={true}>
            <Form.Item name="prizeNotice">
              <Checkbox
                checked={prizeNotice}
                onChange={(e) => {
                  onCheckboxChange(e, setPrizeNotice, 'prizeNotice')
                }}
              >
                {intl.formatMessage({ id: 'table.purchase.tab.prizeNotice.send' })}
              </Checkbox>
            </Form.Item>
            <Form.Item name="awardResults">
              <TextArea
                rows={6}
                placeholder={intl.formatMessage({ id: 'table.purchase.tab.prizeNotice.placeholder' })}
              />
            </Form.Item>
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'table.purchase.tab.thank' })} key="3" forceRender={true}>
            <Form.Item name="thank">
              <Checkbox
                checked={thank}
                onChange={(e) => {
                  onCheckboxChange(e, setThank, 'thank')
                }}
              >
                {intl.formatMessage({ id: 'table.purchase.tab.thank.send' })}
              </Checkbox>
            </Form.Item>
            <Form.Item name="content">
              <TextArea rows={6} placeholder={intl.formatMessage({ id: 'table.purchase.tab.thank.placeholder' })} />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )
}

export default ConfirmBidResultModal
