/**
 * @Description 导入弹窗
 */
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal, Button, Space, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import XSL_IMG from '@/assets/imgs/excel.png'
import { authService } from '@apps/services'
import { omit } from '@/utils'
import { IRequestSuccess } from '@/index'
import './index.less'
import queryString from 'query-string'

const defaultHeaders = {
  'Content-Type': 'Application/json',
  source: '1',
  environment: '1',
  site: import.meta.env.OUT_SITEID.toString(),
}

const normalHeader = omit(defaultHeaders, ['Content-Type'])

type ValueOf<T> = T extends any[] ? T[number] : T[keyof T]

const STEPS = ['DOWNLOAD_AND_UPLOAD', 'UPLOADING', 'UPLOAD_SUCCESS', 'UPLOAD_ERROR'] as const

type StepType = 'DOWNLOAD_AND_UPLOAD' | 'UPLOADING' | 'UPLOAD_SUCCESS' | 'UPLOAD_ERROR'

type StepTypeMap = {
  DOWNLOAD_AND_UPLOAD
  UPLOADING
  UPLOAD_SUCCESS
  UPLOAD_ERROR
}

export type DownloadFileResponseType = {
  data: Blob
  response: { [key: string]: any }
}

interface UploadModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 文件标题
   */
  fileTitle: string
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 点击下载触发事件
   */
  onDownload?: () => void
  /**
   * 点击导入触发事件，参数为 file 对象
   */
  onImport?: (file: UploadFile<unknown>['originFileObj']) => void
  /**
   * 点击导入错误日记触发事件
   */
  onExportErrorDiary?: () => void
  /**
   * 导入Upload组件 props，用于控制导入文件相关属性
   */
  uploadProps?: React.ComponentProps<typeof Upload>
  /**
   * 获取下载文件内容请求方法，与 onDownload 属性冲突
   */
  fetchDownloadFile?: () => Promise<DownloadFileResponseType>
  /**
   * 模块名称，用于导出错误日记时的前缀
   * 例如：传入 会员导入，那么导出错误文件时 文件名称为 会员导入错误日记20220516101158
   */
  modalName: string
  /**
   * 文件名是否为utf-8
   */
  utf?: boolean
}

export type UploadModalRef = {
  /**
   * 下一步
   */
  next: () => void
  /**
   * 上一步
   */
  prev: () => void
  /**
   * 跳转到指定步骤
   */
  jump: (step: StepType) => void
}

const UploadModal: React.ForwardRefRenderFunction<UploadModalRef, UploadModalProps> = (props, ref) => {
  const {
    visible,
    fileTitle,
    onClose,
    onDownload,
    onImport,
    onExportErrorDiary,
    uploadProps: externalUploadProps,
    fetchDownloadFile,
    modalName,
    utf,
  } = props
  const [step, setStep] = useState<StepType>('DOWNLOAD_AND_UPLOAD')
  const intl = useIntl()

  const responseRef = useRef<IRequestSuccess<null>>()

  const TITLE_MAP: StepTypeMap = {
    DOWNLOAD_AND_UPLOAD: '导入',
    UPLOADING: '数据导入',
    UPLOAD_SUCCESS: '导入成功',
    UPLOAD_ERROR: '导入失败',
  }

  const handleClose = () => {
    // 回到第一步
    setStep('DOWNLOAD_AND_UPLOAD')
    onClose?.()
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload?.()
      return
    }
    fetchDownloadFile?.().then((res) => {
      if (!res) {
        return
      }
      const { response } = res
      const filename = response?.headers.get('content-disposition').split('=')[1]

      let blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      let a: HTMLAnchorElement = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = utf ? Object.keys(queryString.parse(filename))[0].replaceAll('"', '') : filename.replaceAll('"', '')
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }

  const handleExportErrorDiary = () => {
    if (onExportErrorDiary) {
      onExportErrorDiary?.()
      return
    }
    let a = document.createElement('a')
    var blob = new Blob([responseRef.current.message], { type: 'application/octet-stream' })
    a.href = window.URL.createObjectURL(blob)
    a.download =
      intl.formatMessage({
        id: 'componnets.error.diary',
        fileTitle: modalName,
        date: moment().format('YYYYMMDDHHmmss'),
      }) + '.txt'
    a.click()
  }

  const handleAgain = () => {
    setStep('DOWNLOAD_AND_UPLOAD')
  }

  const renderContent = () => {
    let node: any = null
    switch (step) {
      case 'DOWNLOAD_AND_UPLOAD': {
        node = (
          <div className="upload-modal-step1">
            <div className="upload-modal-xls">
              <img src={XSL_IMG} width={72} height={72} />
            </div>
            <ul className="upload-modal-descriptions">
              <li className="upload-modal-descriptions-item">
                <span className="upload-modal-descriptions-circle">1</span>
                <p className="upload-modal-descriptions-item-txt">
                  {intl.formatMessage({ id: 'componnets.excel.template', defaultMessage: '点击下载 EXCEL 文件模板' })}
                  <a className="upload-modal-download" onClick={handleDownload}>
                    {intl.formatMessage({ id: 'componnets.download', defaultMessage: '下载' })}
                  </a>
                </p>
              </li>
              <li className="upload-modal-descriptions-item">
                <span className="upload-modal-descriptions-circle">2</span>
                <p className="upload-modal-descriptions-item-txt">
                  {intl.formatMessage({ id: 'componnets.finishing', defaultMessage: '按照模板整理' })}
                  {`${fileTitle}`}
                </p>
              </li>
              <li className="upload-modal-descriptions-item">
                <span className="upload-modal-descriptions-circle">3</span>
                <p className="upload-modal-descriptions-item-txt">
                  {intl.formatMessage({ id: 'componnets.import.sorted', defaultMessage: '点击导入按钮，导入整理好的' })}
                  {`${fileTitle}`}
                </p>
              </li>
            </ul>
          </div>
        )
        break
      }
      case 'UPLOADING': {
        node = (
          <div className="upload-modal-step2">
            <div className="upload-modal-spin">
              <LoadingOutlined style={{ fontSize: 64 }} spin />
            </div>
            <div className="upload-modal-step">
              <p className="upload-modal-step-title">
                {intl.formatMessage({ id: 'componnets.data.import', defaultMessage: '正在进行数据导入' })}
              </p>
              <p className="upload-modal-step-desc">
                {intl.formatMessage({ id: 'componnets.please.later', defaultMessage: '请稍后…' })}
              </p>
            </div>
          </div>
        )
        break
      }
      case 'UPLOAD_SUCCESS': {
        node = (
          <div className="upload-modal-step3">
            <div className="upload-modal-spin upload-modal-spin-success">
              <CheckCircleOutlined style={{ fontSize: 64 }} />
            </div>
            <div className="upload-modal-step">
              <p className="upload-modal-step-title">
                {intl.formatMessage({ id: 'componnets.import.success', defaultMessage: '数据全部导入成功' })}
              </p>
              <p className="upload-modal-step-desc">
                {intl.formatMessage({
                  id: 'componnets.continue.import.or.import.is.complete',
                  defaultMessage: '继续导入请点击继续导入，导入完成请点击导入完成',
                })}
              </p>
            </div>
            <div className="upload-modal-actions upload-modal-actions-chuRiver">
              <Space size="middle">
                <Button type="primary" onClick={handleAgain}>
                  {intl.formatMessage({ id: 'componnets.continue.import', defaultMessage: '继续导入' })}
                </Button>
                <Button onClick={handleClose}>
                  {intl.formatMessage({ id: 'componnets.import.is.complete', defaultMessage: '导入完成' })}
                </Button>
              </Space>
            </div>
          </div>
        )
        break
      }
      case 'UPLOAD_ERROR': {
        node = (
          <div className="upload-modal-step4">
            <div className="upload-modal-spin upload-modal-spin-error">
              <CloseCircleOutlined style={{ fontSize: 64 }} />
            </div>
            <div className="upload-modal-step">
              <p className="upload-modal-step-title">
                {intl.formatMessage({
                  id: 'componnets.import.exception',
                  defaultMessage: '数据导入失败，存在无法导入的数据',
                })}
              </p>
              <p className="upload-modal-step-desc">
                {intl.formatMessage({
                  id: 'componnets.generating.error.logs',
                  defaultMessage: '已生成错误日志，请导出错误日志修正数据后再次导入',
                })}
              </p>
            </div>
            <div className="upload-modal-actions upload-modal-actions-chuRiver">
              <Button onClick={handleExportErrorDiary}>
                {intl.formatMessage({ id: 'componnets.exporting.error.logs', defaultMessage: '导出错误日志' })}
              </Button>
            </div>
          </div>
        )
        break
      }
      default:
        break
    }
    return node
  }

  /**
   * 跳转
   * @param type 上一步/下一步
   * @param target 指定步骤
   */
  const handleChangeStep = (type: 'next' | 'prev', target?: StepType) => {
    const current = STEPS.findIndex((item) => item === step)
    let index = type === 'next' ? current + 1 : current - 1

    if (target) {
      setStep(target)
      return
    }
    // 确保最大最小值限制
    index = Math.min(Math.max(0, index), STEPS.length - 1)
    // 如果已经在最后一步了，则回到第一步
    if (index === STEPS.length - 1) {
      index = 0
    }
    const next = STEPS[index]
    setStep(next)
  }

  useImperativeHandle(ref, () => ({
    next: () => handleChangeStep('next'),
    prev: () => handleChangeStep('prev'),
    jump: (step) => handleChangeStep('prev', step),
  }))

  const handleUploadChange = (info: UploadChangeParam<UploadFile<unknown>>) => {
    const { file } = info
    if (file.status === 'uploading' && step !== 'UPLOADING') {
      handleChangeStep('prev', 'UPLOADING')
    }
    if (file.status === 'done') {
      if (onImport) {
        onImport?.(info.file.originFileObj)
      }
      if (!file.response) {
        return
      }
      if ((file.response as any).code !== 1000) {
        responseRef.current = file.response as IRequestSuccess<null>
        handleChangeStep('prev', 'UPLOAD_ERROR')
      } else {
        handleChangeStep('prev', 'UPLOAD_SUCCESS')
      }
    }
  }

  const { accessToken } = authService.getAuth() || {}

  const uploadProps: React.ComponentProps<typeof Upload> = {
    headers: {
      ...normalHeader,
      accessToken,
    },
    beforeUpload: () => true,
    accept: '.xls, .xlsx',
    onChange: handleUploadChange,
    showUploadList: false,
    ...externalUploadProps,
  }

  return (
    <>
      <Modal
        title={TITLE_MAP[step]}
        visible={visible}
        onCancel={handleClose}
        maskClosable={false}
        footer={
          <div
            className="upload-modal-actions"
            style={{
              display: step === 'DOWNLOAD_AND_UPLOAD' ? 'block' : 'none',
            }}
          >
            <Upload {...uploadProps}>
              <Button
                type="primary"
                style={{
                  width: 160,
                }}
              >
                {intl.formatMessage({ id: 'componnets.import', defaultMessage: '导入' })}
              </Button>
            </Upload>
          </div>
        }
        destroyOnClose
      >
        {renderContent()}
      </Modal>
    </>
  )
}

const UploadModalForWard = React.forwardRef<UploadModalRef, UploadModalProps>(UploadModal)

export default UploadModalForWard
