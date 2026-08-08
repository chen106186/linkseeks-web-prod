import React, { useState, useEffect } from 'react'
import { Form, Input, message, Button, DatePicker, Upload } from 'antd'
import { UploadOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons'
import moment from 'moment'

import { UPLOAD_TYPE } from '@/constants'
import { authService } from '@apps/services'

import { validatorByte } from '../../validator'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const { TextArea } = Input
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

interface Iprops {
  currentRef: any
  fetchdata: any
  onBadge: (num: number, idx: number) => void
  exRef: any
}

const BidRequirement: React.FC<Iprops> = (props: any) => {
  const { currentRef, fetchdata, onBadge, exRef } = props
  const [files, setFiles] = useState<any>([])
  const [loading, setloading] = useState(false)
  const [form] = Form.useForm()
  const { token } = authService.getAuth() || {}

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              let _formData = { ...res }
              resolve({
                state: true,
                name: 'requirement',
                data: {
                  startSignUp: moment(_formData.signUpTime[0]).format('x'),
                  endSignUp: moment(_formData.signUpTime[1]).format('x'),
                  demand: _formData.demand,
                  demandUrls: files,
                },
              })
              onBadge(0, 3)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 3)
              }
            })
        }),
      signUpTime: () => form.getFieldValue('signUpTime'),
    }
  })

  useEffect(() => {
    fetchdata.demandUrls && setFiles([...fetchdata.demandUrls])
    form.setFieldsValue({
      signUpTime: [
        fetchdata.startSignUp ? moment(fetchdata.startSignUp) : '',
        fetchdata.endSignUp ? moment(fetchdata.endSignUp) : '',
      ],
      demand: fetchdata.demand,
      demandUrls: fetchdata.demandUrls,
    })
  }, [fetchdata])

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: any) => {
    const isLt20M = file.size / 1024 / 1024 < 20
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'detail.purchase.message21' }))
    }
    return isLt20M
  }
  // 上传回调
  const handleChange = ({ file }) => {
    const arr: any = files
    setloading(true)
    if (file.response) {
      if (file.response.code === 1000) {
        arr.push({
          name: file.name,
          url: file.response.data,
        })
        setloading(false)
      }
    }
    setFiles([...arr])
    form.setFieldsValue({ demandUrls: [...arr] })
  }

  // 删除附件
  const removeFiles = (index: any) => {
    const arr = [...files]
    arr.splice(index, 1)
    setFiles(arr)
    form.setFieldsValue({ demandUrls: [...arr] })
  }

  return (
    <>
      <Form {...layout} form={form} className={styles.revise_style}>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.startSignUp' })}
          name="signUpTime"
          rules={[
            { required: true, message: intl.formatMessage({ id: 'detail.purchase.message45' }) },
            () => ({
              async validator(_, value, callback) {
                let _exVal = await exRef.current.biddingTime()
                if (_exVal?.[0] && value?.[1] && moment(value?.[1]).isAfter(_exVal?.[0])) {
                  return callback(intl.formatMessage({ id: 'detail.purchase.message46' }))
                }
                if (!value?.[0] || !value?.[1]) {
                  return callback(intl.formatMessage({ id: 'detail.purchase.message45' }))
                }
                return callback()
              },
            }),
          ]}
        >
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={[
              intl.formatMessage({ id: 'detail.purchase.startTime1' }),
              intl.formatMessage({ id: 'detail.purchase.endTime1' }),
            ]}
            disabledDate={(current) => {
              return current && current < moment().startOf('second')
            }}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.signUpLayout' })}
          name="demand"
          rules={[
            // { required: true, message: '请输入报名要求' },
            {
              validator: (r, v) => validatorByte(v, 200),
            },
          ]}
        >
          <TextArea rows={3} maxLength={200} placeholder={intl.formatMessage({ id: 'detail.purchase.placeholder8' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'detail.purchase.demandUrls' })}
          name="demandUrls"
          // rules={[{ required: true, message: '请上传报名要求附件' }]}
        >
          <div className={styles.upload_data}>
            {files.length > 0 &&
              files.map((v, index) => (
                <div key={index} className={styles.upload_item}>
                  <a className={styles.upload_left} href={v.url} target="_blank">
                    <LinkOutlined />
                    <span>{v.name}</span>
                  </a>
                  <div className={styles.upload_right} onClick={() => removeFiles(index)}>
                    <DeleteOutlined />
                  </div>
                </div>
              ))}
          </div>
          <Upload
            action="/api/support/file/upload"
            data={{ fileType: UPLOAD_TYPE }}
            showUploadList={false}
            accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
            beforeUpload={beforeDocUpload}
            onChange={handleChange}
            headers={{ token }}
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              {intl.formatMessage({ id: 'detail.purchase.uploadFile' })}
            </Button>
            <div style={{ marginTop: '8px' }}>{intl.formatMessage({ id: 'detail.purchase.placeholder2' })}</div>
          </Upload>
        </Form.Item>
      </Form>
    </>
  )
}
export default BidRequirement
