import { Button, Col, Drawer, Form, FormInstance, Input, message, Pagination, Radio, Row, Space, Table } from 'antd'
import { useCallback, useEffect, useState, useRef } from 'react'
import { LinkOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { getMemberManageUpperConsumerMerchantPage } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { getMemberUserPage } from '@apps/apis'
import StandardTable from '@/components/StandardTable'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { querySchema, TableMemberColumn } from './columns'

const RowStyleLayout = styled((props) => <div {...props} />)`
  .ant-input-group-compact {
    display: flex;
  }
  .ant-input {
    height: 32px;
  }
  .ant-btn {
    height: 32px;
  }
`
interface RoleSelectProps {
  request?: (payload: any) => Promise<any>
  params?: object
  onChange?: (e) => void
  value?: any
  formatFeils?: (e) => any
  disabled?: boolean
  isDefault?: boolean
  formProp?: FormInstance
  id?: string
  title?: string
}

/**
 * 用户角色选择器
 * @param request (payload) => Promise<any> 请求接口
 * @returns
 */
function DemandSelect(props: RoleSelectProps) {
  const formActions = createFormActions()
  const ref = useRef<any>({})

  const {
    request,
    params,
    onChange,
    value,
    formatFeils = (e) => e,
    disabled = false,
    isDefault = false,
    formProp,
    title,
  } = props

  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [select, setSelect] = useState(null)

  const [localDisabled, setLocalDisabled] = useState(disabled)

  const showDrawer = useCallback(() => {
    setVisible(true)
  }, [visible])

  const closeDrawer = useCallback(() => {
    setVisible(false)
  }, [visible])

  const handleSubmit = useCallback(() => {
    if (select === null) {
      message.error('请选择需求人')
      return
    }
    closeDrawer()
  }, [visible, select])

  useEffect(() => {
    form.setFieldsValue({ current: '1', pageSize: 10 })
    fetchData().then((data) => {
      if (data.length === 1 && isDefault) {
        if (undefined !== formProp) {
          formProp.setFieldsValue({
            [props.id]: formatFeils(data[0]),
          })
        }
        console.log([props.id])
        setLocalDisabled(true)
      }
    })
  }, [])

  const fetchData = () => {
    return request({
      ...params,
      ...form.getFieldsValue(),
      memberName: form.getFieldsValue().name,
    }).then((res) => {
      setDataSource(res.data.data)
      setTotal(res.data.totalCount)
      return res.data.data
    })
  }

  const setValue = (value) => {
    let target = formatFeils(value)
    setSelect(target)
    onChange(target)
  }

  return (
    <>
      <RowStyleLayout>
        <Input.Group compact>
          <Input value={value?.name} disabled />
          {!localDisabled && (
            <Button type="primary" icon={<LinkOutlined />} disabled={localDisabled} onClick={showDrawer}></Button>
          )}
        </Input.Group>
      </RowStyleLayout>

      <Drawer
        visible={visible}
        title={title ? title : '选择需求人'}
        onClose={closeDrawer}
        width="50vw"
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={handleSubmit}>
              确定
            </Button>
            <Button onClick={closeDrawer}>取消</Button>
          </Space>
        }
      >
        <Form form={form}>
          <Form.Item hidden name="current">
            <Input />
          </Form.Item>
          <Form.Item hidden name="pageSize">
            <Input />
          </Form.Item>

          <Form.Item name="name" style={{ width: 500 }}>
            <Input.Search
              placeholder="会员名称"
              onSearch={() => {
                form.setFieldsValue({ current: '1' })
                setCurrent(1)
                fetchData()
              }}
            />
          </Form.Item>
        </Form>
        <Radio.Group
          className="block w-full"
          onChange={(e) => {
            const value = e.target.value
            setValue(value)
          }}
        >
          <Table
            ref={ref}
            className="w-full"
            rowKey={'id'}
            columns={TableMemberColumn}
            dataSource={dataSource}
            pagination={{
              position: ['bottomRight'],
              total,
              pageSize,
              current,
              showTotal: (total: number, range: [number, number]) => `共 ${total} 条`,
              showQuickJumper: true,
              onChange: (page: number, pageSize: number) => {
                form.setFieldsValue({ current: page, pageSize: pageSize })
                setCurrent(page)
                setPageSize(pageSize)
                fetchData()
              },
            }}
          />
        </Radio.Group>
      </Drawer>
    </>
  )
}
DemandSelect.defaultProps = {
  request: getMemberUserPage,
  params: {
    current: 1,
    pageSize: 10,
    status: 1, // 只需要状态是 启用的
  },
  onChange: (e) => {},
}
export default DemandSelect
