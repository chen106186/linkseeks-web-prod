import React, { useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Modal, List, Table, Button, Form, Input } from 'antd'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { OrderDetailContext } from '../../_public/order/context'
import MellowCard from '@/components/MellowCard'
import OverflowText from '@/components/OverflowText'
import { EditOutlined } from '@ant-design/icons'
import { postOrderVendorValidateSubmitPaymentUpdate } from '@apps/apis'
import themeConfig from '@apps/config/lingxi.theme.config'

const intl = getIntl()
// table编辑控件
const EditableContext = React.createContext<any>({})
interface EditableRowProps {
  index: number
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: any
  handleSave: (record: any) => void
  formItemProps: any
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  formItemProps = {},
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>({})
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, width: record.width || 80 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'transaction_components.cixiangweibitianxiang' }),
          },
          {
            pattern: /^\d+(\.\d{1,2})?$/,
            message: intl.formatMessage({ id: 'transaction_components.zhifubilijinxianliangwei' }),
          },
        ]}
      >
        <Input type="number" ref={inputRef} onBlur={save} onPressEnter={save} {...formItemProps} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
        <EditOutlined />
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

/**
 * 展示 支付比例和简单流程的发货信息
 */

export interface OrderPayTabsProps {}

const OrderPayTabs: React.FC<OrderPayTabsProps> = () => {
  const [visible, setVisible] = useState(false)
  const [urlsDatas, setUrlsDatas] = useState([])
  const { pathname } = useLocation()
  const {
    formContext: { data, ctl, reloadFormData },
  } = useContext(OrderDetailContext)

  // 简单流程为24
  const processEnum = data.processEnum
  const payments = data.payments.sort((a, b) => a.batchNo - b.batchNo)

  const creditsCommodity = data.orderMode === 10 || data.orderMode === 25 // @todo 积分或渠道积分下单模式

  // 是否可编辑比例
  const canEdit = pathname.indexOf('/readyApprovedOrder/detail') !== -1

  useEffect(() => {
    // 过滤支付信息 取第一个待支付或者未到账的id
    if (payments.length) {
      const payment = payments.filter((item) => item.showPayment)
      if (payment.length) {
        ctl.setPayId(payment[0].paymentId)
      }
    }
  }, [])

  const handlePreivew = (batch) => {
    setVisible(true)
    const canCtlData = payments.find((v) => v.batchNo === batch)
    const urlsDatas = canCtlData.vouchers || []
    setUrlsDatas(urlsDatas)
  }

  const handleSave = (row) => {
    const newData = [...payments]
    const index = newData.findIndex((item) => row.batchNo === item.batchNo)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    // 执行修改订单价格
    postOrderVendorValidateSubmitPaymentUpdate({
      orderId: data.orderId,
      payRates: newData.map((item) => ({ batchNo: item.batchNo, payRate: item.payRate })),
    }).then((res) => {
      if (res.code === 1000) {
        reloadFormData()
      }
    })
    ctl.setData({
      ...data,
      payments: newData.sort((a, b) => a.batchNo - b.batchNo),
    })
  }

  const columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'paymentId',
      align: 'center',
      key: 'paymentId',
      className: 'commonHide',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhifucishu' }),
      dataIndex: 'batchNo',
      align: 'center',
      key: 'batchNo',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhifuhuanjie' }),
      dataIndex: 'payNode',
      align: 'center',
      key: 'payNode',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.waibuzhuangtai' }),
      dataIndex: 'outerStatusName',
      align: 'center',
      key: 'outerStatusName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.neibuzhuangtai' }),
      dataIndex: 'innerStatusName',
      align: 'center',
      key: 'innerStatusName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhifubili' }),
      key: 'payRate',
      dataIndex: 'payRate',
      formItem: 'input',
      editable: canEdit,
      // width: 80,
      // formItemProps: {
      //   suffix: '%',
      // },
    },
    {
      title: creditsCommodity
        ? intl.formatMessage({ id: 'transaction_components.jifen' })
        : intl.formatMessage({ id: 'transaction_components.zhifujine' }),
      dataIndex: 'payAmount',
      align: 'center',
      key: 'payAmount',
      render: (t) => (creditsCommodity ? t : `${t}`),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhifufangshi' }),
      dataIndex: 'payTypeName',
      align: 'center',
      key: 'payTypeName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhifuqudao' }),
      dataIndex: 'payChannelName',
      align: 'center',
      key: 'payChannelName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      render: (t, r) =>
        r.showView && (
          <Button type="link" onClick={() => handlePreivew(r.batchNo)}>
            {intl.formatMessage({ id: 'transaction_components.zhakan' })}
          </Button>
        ),
    },
  ]

  const paymentComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const editColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItemProps: col.formItemProps,
        handleSave: handleSave,
      }),
    }
  })

  return (
    <>
      <MellowCard
        id="paymentInfoCard"
        title={intl.formatMessage({ id: 'transaction_components.zhifuxinxi' })}
        bordered={false}
        fullHeight
      >
        <Table
          columns={editColumns}
          dataSource={payments}
          components={paymentComponents}
          rowKey="paymentId"
          pagination={false}
        />
      </MellowCard>
      <Modal
        title={intl.formatMessage({ id: 'transaction_components.zhakanzhifujieguo' })}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={urlsDatas || []}
          renderItem={(item: string, index: number) => (
            <List.Item
              style={{ fontSize: 12 }}
              extra={
                <a href={urlsDatas[index]} target="_blank" rel="noreferrer">
                  {intl.formatMessage({ id: 'transaction_components.yulan' })}
                </a>
              }
            >
              <OverflowText style={{ flex: '.9' }}>{item}</OverflowText>
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

OrderPayTabs.defaultProps = {}

export default OrderPayTabs
