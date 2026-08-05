import React, { useEffect, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Form, Input, Upload, Card, Tooltip, Button, message, Badge, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { UPLOAD_TYPE } from '@/constants'
import { QuestionCircleOutlined, StarOutlined, FileWordFilled, UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
import {
  GetContractContractTemplateExamplePreviewResponse,
  getContractContractTemplateExamplePreview,
  getContractContractTemplateGet,
  postContractContractTemplateAdd,
  postContractContractTemplateUpdate,
  postContractContractTemplateDownloadContract,
} from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { authService } from '@apps/services'
import moment from 'moment'
import { downloadFileByBlob } from '@apps/utils'
export interface parmas {
  page_type?: string
  id?: any
}

const intl = getIntl()

const AddContract: React.FC<parmas> = (props) => {
  const { page_type, id } = props
  const isPreview = Boolean(id)
  const { TextArea } = Input
  const [form] = Form.useForm()
  const [fileExampleUrl, setFileExampleUrl] = useState<GetContractContractTemplateExamplePreviewResponse>()
  const [uploadFile, setUploadFile] = useState<any>({})
  const [fileUrl, setFileUrl] = useState<string>('')
  const [loading, setloading] = useState(false)
  const [data, setData] = useState<any>({})
  const { token } = authService.getAuth()

  /**判断文件类型和大小 */
  const beforeDocUpload = (file: UploadFile) => {
    const name = file.name.split('.')
    const type = name[name.length - 1]
    const isJpgOrPng = type === 'doc' || type === 'docx'
    const isLt20M = (file?.size || 0) / 1024 / 1024 < 20
    if (!isJpgOrPng) {
      message.error(intl.formatMessage({ id: 'contract.bushidocdocxwenjian' }))
    }
    if (!isLt20M) {
      message.error(intl.formatMessage({ id: 'contract.shangchuanwenjiandaxiaobuchao' }))
    }
    return isJpgOrPng && isLt20M
  }

  /**上传回调 */
  const handleChange = ({ fileList }) => {
    setloading(true)
    if (fileList[0].response) {
      const file = {
        name: fileList[0].name,
        file: fileList[0].response.data,
      }
      console.log(file)
      setloading(false)
      setFileUrl(fileList[0].response.data)
      setUploadFile(file)
    }
  }

  /**合同模板样例查询 */
  useEffect(() => {
    getContractContractTemplateExamplePreview()
      .then((res) => {
        setFileExampleUrl(res.data)
      })
      .catch((err) => {})
  }, [])

  /**新增&修改 */
  const sharedFn = async (parmas: any) => {
    if (page_type === 'add') {
      await postContractContractTemplateAdd(parmas)
        .then((res) => {
          setTimeout(() => {
            history.goBack()
          }, 1000)
        })
        .catch((err) => {})
    } else {
      parmas.id = id
      await postContractContractTemplateUpdate(parmas)
        .then((res) => {
          setTimeout(() => {
            history.goBack()
          }, 1000)
        })
        .catch((err) => {})
    }
  }

  /**提交数据 */
  const onSubmit = async () => {
    await form.validateFields().then((res) => {
      if (uploadFile.name && uploadFile.file) {
        const parmas = {
          name: res.name,
          version: res.version,
          description: res.description,
          fileUrl,
          fileName: uploadFile.name,
        }
        sharedFn(parmas)
        console.log(parmas)
      } else {
        message.warning(intl.formatMessage({ id: 'contract.qingxianshangchuanhetongwenjian' }))
      }
    })
  }

  /**删除上传的合同 */
  const delectContract = () => {
    setUploadFile({})
    setFileUrl('')
  }

  const confirm = () => {
    // message.error(`未保存地址信息`)
    setTimeout(() => {
      history.goBack()
    }, 1000)
  }

  /**班级查看数据 */
  useEffect(() => {
    if (id) {
      getContractContractTemplateGet({ id })
        .then((res) => {
          setData(res.data)
          let files = res.data.fileName
            ? {
                name: res.data.fileName,
                file: res.data.fileUrl,
              }
            : {}
          setUploadFile(files)

          if (page_type === 'edit') {
            setFileUrl(res.data.fileUrl)
            form.setFieldsValue(res.data)
          }
        })
        .catch((err) => {})
    }
  }, [id])

  /**下载 */
  const onDownload = async (type: 'template' | 'example' = 'example') => {
    if (type === 'example') {
      window.location.href = `/api/contract/contractTemplate/exampleDownload`
    } else if (type === 'template') {
      const { response } = await postContractContractTemplateDownloadContract(
        { id },
        {
          responseType: 'blob',
          getResponse: true,
        },
      )

      if (response.data) {
        const contentDisposition = response.headers?.['content-disposition']
        let blob = new Blob([response.data as any])
        let downloadFilename = `${moment().format('YYYY-MM-DD HH:mm:ss')}.pdf` //设置下载的文件名
        if (contentDisposition) {
          // 使用正则表达式从头部中提取filename
          const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
          if (filenameMatch && filenameMatch[1]) {
            downloadFilename = decodeURIComponent(filenameMatch[1])
          }
        }
        downloadFileByBlob(blob, downloadFilename)
      }
    }
  }

  /**预览 */
  const onView = async (file: any) => {
    let url = '/contract/template/templateList/preview'
    if (id && !page_type) {
      url += `?id=${id}`
    } else {
      url += `?fileName=${file.name}&fileUrl=${file.file}`
    }
    history.open(url)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <div className={styles.addcontract_wrap}>
          <Form form={form}>
            <Form.Item
              label={intl.formatMessage({ id: 'contract.hetongmubanmingcheng' })}
              colon={false}
              name="name"
              rules={[
                {
                  required: Boolean(page_type) && true,
                  message: intl.formatMessage({ id: 'logistics.zuichang60gezi' }),
                },
                {
                  validator: (r, v, c) => validatorByte(r, v, c, 60),
                },
              ]}
            >
              {page_type ? <Input /> : <span>{data.name}</span>}
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ id: 'contract.banbenhao' })}
              colon={false}
              name="version"
              rules={[
                {
                  required: Boolean(page_type) && true,
                  message: intl.formatMessage({ id: 'table.purchase.zuichang12gezi' }),
                },
                {
                  validator: (r, v, c) => validatorByte(r, v, c, 12),
                },
              ]}
            >
              {page_type ? <Input /> : <span>{data.version}</span>}
            </Form.Item>
            {!page_type && (
              <Form.Item label={intl.formatMessage({ id: 'contract.zhuangtai' })} colon={false} name="status">
                <span>
                  {data.state === 1 ? (
                    <>
                      <Badge status="success" /> {intl.formatMessage({ id: 'contract.youxiao' })}
                    </>
                  ) : (
                    <>
                      <Badge status="error" /> {intl.formatMessage({ id: 'contract.shixiao' })}
                    </>
                  )}
                </span>
              </Form.Item>
            )}
            <Form.Item
              label={intl.formatMessage({ id: 'contract.hetongmubanshuoming' })}
              colon={false}
              name="description"
              rules={[
                {
                  validator: (r, v, c) => validatorByte(r, v, c, 160),
                  message: intl.formatMessage({ id: 'contract.zuichang160zifu80gehan' }),
                },
              ]}
            >
              {page_type ? <TextArea rows={4} /> : <span>{data.description}</span>}
            </Form.Item>
            {page_type && (
              <Form.Item
                label={
                  <div>
                    {intl.formatMessage({ id: 'contract.hetongwenjianmubanyangli' })}&nbsp;
                    <Tooltip placement="top" title={intl.formatMessage({ id: 'contract.zhizuohetongmubanqian' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                }
                colon={false}
              >
                <div className={styles.upload_item}>
                  <div className={styles.upload_left}>
                    <FileWordFilled />
                    <span>{fileExampleUrl?.contractName}</span>
                  </div>
                  <div className={styles.upload_right}>
                    <span onClick={() => history.open('/contract/template/templateList/preview')}>
                      {intl.formatMessage({ id: 'contract.yulan' })}
                    </span>
                    <span onClick={() => onDownload()}>{intl.formatMessage({ id: 'contract.xiazai' })}</span>
                  </div>
                </div>
              </Form.Item>
            )}
            <Form.Item
              name="uploadFile"
              rules={[
                {
                  required: Object.keys(uploadFile).length === 0,
                  message: intl.formatMessage({ id: 'contract.qingxianshangchuanhetongxinxi' }),
                },
              ]}
              label={
                <div>
                  {intl.formatMessage({ id: 'contract.hetongwenjianmuban' })}&nbsp;
                  <Tooltip placement="top" title={intl.formatMessage({ id: 'contract.zhizuowanchengdehetongmu' })}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
              }
              colon={false}
            >
              <div className={styles.upload_data}>
                {Object.keys(uploadFile).length > 0 && (
                  <div className={styles.upload_item}>
                    <div className={styles.upload_left}>
                      <FileWordFilled />
                      <span>{uploadFile.name}</span>
                    </div>
                    <div className={styles.upload_right}>
                      <span onClick={() => onView(uploadFile)}>{intl.formatMessage({ id: 'contract.yulan' })}</span>
                      {!page_type && id && (
                        <span onClick={() => onDownload('template')}>
                          {intl.formatMessage({ id: 'contract.xiazai' })}
                        </span>
                      )}
                      {page_type && <DeleteOutlined onClick={delectContract} />}
                    </div>
                  </div>
                )}
              </div>
              {Object.keys(uploadFile).length === 0 && page_type && (
                <Upload
                  action="/api/support/file/upload"
                  data={{ fileType: UPLOAD_TYPE }}
                  showUploadList={false}
                  beforeUpload={beforeDocUpload}
                  onChange={handleChange}
                  accept=".doc,.docx"
                >
                  <Button loading={loading} disabled={loading} icon={<UploadOutlined />}>
                    {intl.formatMessage({ id: 'contract.shangchuanwenjian' })}
                  </Button>
                  <div style={{ marginTop: '8px' }}>
                    {intl.formatMessage({ id: 'contract.zhichikuozhanmingdocwenjian' })}
                  </div>
                </Upload>
              )}
            </Form.Item>
            {page_type && (
              <Form.Item style={{ marginLeft: '174px' }}>
                <Button type="primary" style={{ marginRight: '24px' }} onClick={onSubmit}>
                  {intl.formatMessage({ id: 'contract.baocun' })}
                </Button>
                <Popconfirm
                  title={intl.formatMessage({ id: 'contract.weibaocunshifouqueding' })}
                  onConfirm={confirm}
                  okText={intl.formatMessage({ id: 'contract.shi' })}
                  cancelText={intl.formatMessage({ id: 'contract.fou' })}
                >
                  <Button>{intl.formatMessage({ id: 'contract.quxiao' })}</Button>
                </Popconfirm>
              </Form.Item>
            )}
          </Form>
        </div>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddContract
