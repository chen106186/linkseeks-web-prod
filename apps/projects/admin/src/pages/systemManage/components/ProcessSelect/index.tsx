import React, { memo, useState, forwardRef, useImperativeHandle } from 'react'
import { Form, Spin } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import ProcessRadio from '../ProcessRadio'

interface ProcessSelectProps {
  disabled?: boolean
  optionsData?: any[]
  processKey?: string
  fetchApi?: Function
}

const ProcessSelectLayout = (props: ProcessSelectProps, ref) => {
  const { disabled, fetchApi, optionsData, processKey } = props

  const [processBaseList, setProcessBaseList] = useState<any[]>([])
  const [spinning, setSpinning] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    getDataSource(params = {}) {
      if (fetchApi) {
        setSpinning(true)
        fetchApi(params)
          .then(({ code, data }) => {
            if (code === 1000) {
              setProcessBaseList(data)
            }
          })
          .finally(() => {
            setSpinning(false)
          })
      }
    },
  }))

  return (
    <Spin spinning={spinning}>
      <CardLayout id="processSelect" title="流程选择" bodyStyle={{ paddingBottom: '1px' }}>
        <Form.Item name="baseProcessId" rules={[{ required: true, message: '请选择流程' }]}>
          <ProcessRadio processKey={processKey} disabled={disabled} dataSource={optionsData || processBaseList} />
        </Form.Item>
      </CardLayout>
    </Spin>
  )
}
export default memo(forwardRef(ProcessSelectLayout))
