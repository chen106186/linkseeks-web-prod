import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Input, Button, Modal } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import cx from 'classnames'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const formActions = createFormActions()

const RowStyleLayout = styled((props) => <div {...props} />)`
  width: 100%;
  .relevance {
    border-color: #909399;
    background-color: #909399;
  }
`

const data = [
  {
    key: '1',
    role: '采购商',
    businessType: '采购',
    roleType: '服务消费',
    memberType: '企业会员',
  },
  {
    key: '2',
    role: '供应商',
    businessType: '商品供应',
    roleType: '服务提供',
    memberType: '企业会员',
  },
]

// 模拟请求
const fetchData = (params: any) => {
  return new Promise((resolve, reject) => {
    const queryResult = data.find((v) => v.key === params.keywords)
    setTimeout(() => {
      resolve({
        code: 200,
        message: '',
        data: queryResult ? [queryResult] : data,
      })
    }, 1000)
  })
}

const Relevance = (props) => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
  const [visible, setVisible] = useState(false)
  const propsParams = props.props['x-component-props']

  useEffect(() => {
    console.log('props', propsParams)
  }, [])

  const handlePreview = () => {
    setVisible(!visible)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {},
  }

  const handleSubmit = (type) => {
    if (type === 'confirm') {
    } else {
    }
    setVisible(false)
  }

  return (
    <RowStyleLayout>
      <Row>
        <Col span={16}>
          <Input disabled></Input>
        </Col>
        <Col span={8}>
          <Button type="primary" className="relevance" icon={<LinkOutlined />} onClick={handlePreview}>
            关联
          </Button>
        </Col>
      </Row>

      <Modal
        title={propsParams.modalTitle || ''}
        visible={visible}
        width={propsParams.modalWidth || ''}
        destroyOnClose
        onOk={() => handleSubmit('confirm')}
        onCancel={() => handleSubmit('cancel')}
      >
        <StandardTable
          columns={propsParams.modalColumns}
          currentRef={ref}
          tableProps={{ rowKey: 'key' }}
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'search', FORM_FILTER_PATH)
              }}
              schema={propsParams.modalSchema}
            />
          }
        />
      </Modal>
    </RowStyleLayout>
  )
}

Relevance.defaultProps = {}

Relevance.isFieldComponent = true

export default Relevance
