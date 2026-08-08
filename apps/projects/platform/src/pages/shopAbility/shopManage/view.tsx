import React from 'react'
import { PlusIcon } from '@linkseeks/icons'
import { Modal, Form, Input, Switch } from '@linkseeks/ui'
import { Spin, Space, Button, Empty, message } from '@linkseeks/ui'
import { PageHeaderWrapper, AuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import useDataList from '../services/hooks/useDataList'
import StoreItem from '../services/components/storeItem'
import { useWebIntl } from '@apps/locales'
import { useState, createContext, useContext, useRef } from 'react'
import { StoreItemType } from '../services/types'
import {
  postCommodityWebPrinterConfigConfig,
  PostCommodityWebPrinterConfigConfigRequest,
  getCommodityWebPrinterConfigGet,
  getCommodityWebPrinterConfigDelete,
  getCommodityWebPrinterConfigTest,
} from '@apps/apis'

const ShopManage: React.FC = () => {
  const { loading, dataList, refresh } = useDataList()
  const [showModel, setShowModel] = useState<boolean>(false)
  const [storeId, setStoreId] = useState<number>(0)
  const [feieSn, setFeieSn] = useState<string>('')

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [printForm] = Form.useForm()
  const translate = useWebIntl()

  const handleFinish = (params) => {
    setConfirmLoading(true)
    // 提交时转换为 1/0
    const data = {
      ...params,
      storeId: storeId + '',
      autoPrintOrder: params.autoPrintOrder ? 1 : 0, // true -> 1, false -> 0
    } as PostCommodityWebPrinterConfigConfigRequest

    postCommodityWebPrinterConfigConfig(data)
      .then((data) => {
        if (data.code === 1000) {
          setShowModel(false)
          message.success('配置成功')
        }
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }

  const handleDel = () => {
    getCommodityWebPrinterConfigDelete({ storeId: storeId + '' }).then((data) => {
      if (data.code === 1000) {
        setShowModel(false)
        message.success('删除成功')
      }
    })
  }

  const handleTest = () => {
    getCommodityWebPrinterConfigTest({ storeId: storeId + '' }).then((data) => {
      if (data.code === 1000) {
        setShowModel(false)
        message.success('操作成功')
      }
    })
  }

  const handleShowPrint = (item: StoreItemType) => {
    setStoreId(item.id)
    printForm.resetFields()

    // if (item.setFeieSn) {
    getCommodityWebPrinterConfigGet({ storeId: item.id + '' }).then((data) => {
      if (data.code === 1000) {
        // 获取数据时，将 1/0 转换为布尔值供 Switch 使用
        const formData = {
          ...data.data,
          autoPrintOrder: data.data.autoPrintOrder === 1, // 1 -> true, 0 -> false
        }
        setFeieSn(data.data.feieSn || '')
        printForm.setFieldsValue(formData)
        setShowModel(true)
      }
    })
    // } else {
    //   setShowModel(true)
    // }
  }

  return (
    <div>
      <PageHeaderWrapper
        extra={
          !loading &&
          dataList.length === 0 && (
            <AuthButton type="add">
              <Button icon={<PlusIcon />} type="primary" onClick={() => history.push('/shopAbility/shopManage/add')}>
                {translate('web.resource.shop.create')}
              </Button>
            </AuthButton>
          )
        }
      >
        <Spin spinning={loading}>
          {dataList && dataList.length > 0 ? (
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {dataList.map((item) => (
                <StoreItem onRefresh={refresh} itemInfo={item} onShowPrint={() => handleShowPrint(item)} />
              ))}
            </Space>
          ) : (
            <Empty style={{ marginTop: 120 }} />
          )}
        </Spin>
      </PageHeaderWrapper>

      <Modal
        open={showModel}
        centered
        destroyOnClose
        title={'配置打印机'}
        onCancel={() => setShowModel(false)}
        onOk={() => printForm.submit()}
        confirmLoading={confirmLoading}
        width={600}
        footer={
          feieSn
            ? [
                <div key="footer-buttons">
                  <Button key="back" type="ghost" size="large" onClick={() => setShowModel(false)}>
                    返 回
                  </Button>
                  <Button key="delete" type="danger" size="large" loading={confirmLoading} onClick={handleDel}>
                    删 除
                  </Button>
                  <Button key="test" type="primary" size="large" loading={confirmLoading} onClick={handleTest}>
                    测 试
                  </Button>
                </div>,
              ]
            : undefined
        }
      >
        <Form
          labelCol={{ span: 8 }}
          labelAlign="left"
          form={printForm}
          onFinish={handleFinish}
          initialValues={{
            autoPrintOrder: false, // 初始为 false（对应后端的 0）
          }}
        >
          <Form.Item
            label={'飞鹅打印机设备序列号(SN)'}
            name="feieSn"
            rules={[
              {
                required: true,
                message: '请输入飞鹅打印机设备序列号(SN)',
              },
            ]}
          >
            <Input placeholder={'请输入飞鹅打印机设备序列号(SN)'} disabled={!!feieSn} />
          </Form.Item>

          <Form.Item
            label={'飞鹅打印机设备识别码(KEY)'}
            name="feieKey"
            rules={[
              {
                required: true,
                message: '请输入飞鹅打印机设备识别码(KEY)',
              },
            ]}
          >
            <Input placeholder={'请输入飞鹅打印机设备识别码(KEY)'} disabled={!!feieSn} />
          </Form.Item>

          <Form.Item label={'飞鹅打印机设备备注名称'} name="feieRemark">
            <Input placeholder={'请输入飞鹅打印机设备备注名称（选填）'} disabled={!!feieSn} />
          </Form.Item>

          <Form.Item label={'飞鹅打印机流量卡号码'} name="feieSimNumber">
            <Input placeholder={'请输入飞鹅打印机流量卡号码（选填）'} disabled={!!feieSn} />
          </Form.Item>

          <Form.Item label={'是否自动打印订单'} name="autoPrintOrder" valuePropName="checked">
            <Switch disabled={!!feieSn} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ShopManage
