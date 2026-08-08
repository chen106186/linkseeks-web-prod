/**
 * 专题页
 */
import React, { Fragment, useState } from 'react'
import { StandardFormTable } from '@apps/components'
import { getWebIntl } from '@apps/locales'
import { Col, Form, Input, Modal, Row, Select } from 'antd'
import { getCommodityAdornTopicPagePageList, postCommodityAdornTopicPageSave } from '@apps/apis'
import useCpecialPage from './hooks'

const CpecialPage = () => {
  const {
    form,
    tableRef,
    editTableProps,
    columns,
    mallList,
    shopList,
    modalVisible,
    setModalVisible,
    // fetchMallByEnvironment,
  } = useCpecialPage()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const translate = getWebIntl()

  const handleOk = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      postCommodityAdornTopicPageSave({
        name: values.name,
        shopId: values.shopId,
      })
        .then((res) => {
          if (res.code === 1000) {
            setModalVisible(false)
            tableRef.current.reload()
          }
        })
        .finally(() => {
          setConfirmLoading(false)
        })
    })
  }

  return (
    <Fragment>
      <StandardFormTable
        actionRef={tableRef}
        columns={columns}
        editableProps={editTableProps}
        autoScrollX
        request={getCommodityAdornTopicPagePageList}
        searchSelectMaps={{
          shopId: mallList,
        }}
        searchButtons={[
          {
            key: 'add',
            children: translate('web.resource.marketing.xinjianzhuantiye'),
            type: 'primary',
            icon: 'add',
            onClick() {
              setModalVisible(true)
            },
          },
        ]}
      />
      <Modal
        title={translate('web.resource.marketing.xinzengzhuantiye')}
        open={modalVisible}
        centered
        onOk={handleOk}
        maskClosable={false}
        confirmLoading={confirmLoading}
        destroyOnClose
        onCancel={() => {
          form.resetFields()
          setModalVisible(false)
        }}
      >
        <Form form={form} labelCol={{ span: 5 }} labelAlign="left">
          <Form.Item
            label={translate('web.common.name')}
            name="name"
            rules={[
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={translate('web.resource.marketing.shiyongshangcheng')} required>
            <Row gutter={8}>
              {/* <Col span={8}>
                <Form.Item
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: translate('web.common.qingxuanze'),
                    },
                  ]}
                >
                  <Select options={environmentList} onChange={(value) => fetchMallByEnvironment(value)} />
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <Form.Item
                  name="shopId"
                  rules={[
                    {
                      required: true,
                      message: translate('web.common.qingxuanze'),
                    },
                  ]}
                >
                  <Select options={shopList} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default CpecialPage
