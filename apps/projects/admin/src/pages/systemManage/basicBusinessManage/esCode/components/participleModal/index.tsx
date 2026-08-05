import { getProductEsGetHotWordResult } from '@apps/apis'
import { LineTitle } from '@apps/components'
import { useMemoizedFn, useRequestApi, useToggle } from '@linkseeks/hooks'
import { Input, Modal, message } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useMemo, useState, useEffect } from 'react'
import { Button, Form, Tag } from 'antd'

const ParticipleModal = forwardRef<any, any>(({ tableRef }, ref) => {
  const [visible, toggle] = useToggle(false)
  const [form] = Form.useForm()
  const [result, setResult] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    toggleModal() {
      toggle()
    },
  }))

  const handleTest = () => {
    form.validateFields().then((values) => {
      setLoading(true)
      getProductEsGetHotWordResult({ hotWord: values.hotWord })
        .then((res) => {
          if (res.code === 1000 && res.data) {
            setResult(res.data)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  return (
    <Modal
      open={visible}
      title={'分词测试'}
      onCancel={() => {
        form.resetFields()
        setResult([])
        toggle()
      }}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={'分词文本'}
          name="hotWord"
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
        >
          <Input placeholder="请输入词语" allowClear />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={handleTest} loading={loading}>
            测试
          </Button>
        </div>
        <LineTitle style={{ marginTop: 24, color: '#91959b', fontSize: 12 }}>分词结果</LineTitle>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {result?.map((item) => (
            <Tag>{item.token}</Tag>
          ))}
        </div>
      </Form>
    </Modal>
  )
})

export default ParticipleModal
