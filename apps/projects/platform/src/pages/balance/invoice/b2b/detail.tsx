import React, { useState, useMemo } from 'react'
import { Form, Popconfirm, Button } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { CheckCircleOutlined } from '@ant-design/icons'

import PeripheralLayout from '@/pages/procurementAbility/components/detail'

import InvoiceCard from './components/invoiceCard'
import { useQuery, useLocation } from '@linkseeks/router-core'
const intl = getIntl()

const Detail = () => {
  const { id, no } = useQuery()
  const { pathname } = useLocation()
  const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 2])
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<any>([{ invoiceList: [{}, {}] }, { invoiceList: [{}] }])
  const [form] = Form.useForm()
  const _editAble = useMemo(() => {
    return path !== 'preview'
  }, [path])

  const _tabs = useMemo(() => {
    let _list = []
    dataSource.forEach((_, index) => {
      _list.push({ id: `invoice_${index}`, title: `发票${index + 1}` })
    })
    return _list
  }, [dataSource])

  const _handleSubmit = () => {
    form.validateFields().then((formRes) => {
      console.log(formRes)
    })
  }

  const _returnTopButton = () => {
    return (
      <Button type="primary" icon={<CheckCircleOutlined />} onClick={_handleSubmit}>
        保存
      </Button>
    )
  }

  return (
    <div style={{ margin: '-24px -24px 0' }}>
      <PeripheralLayout
        no={_editAble ? '开具发票' : '发票详情'}
        // detail={dataSource?.reconciliationAbstract}
        effect={_editAble && _returnTopButton()}
        tabLink={_tabs}
        components={
          <Form form={form}>
            {dataSource.map((item, index) => (
              <InvoiceCard
                id={`invoice_${index}`}
                title={`发票${index + 1}`}
                data={item}
                key={`invoice_${index}`}
                formRef={form}
                editAble={_editAble}
              />
            ))}
          </Form>
        }
      />
    </div>
  )
}
export default Detail
