import React, { ReactNode, useState } from 'react'
import { Modal, Button, Result, Upload, Progress, Typography, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, FileExcelFilled } from '@ant-design/icons'
import style from './index.less'
import umiRequest from 'umi-request'
import { useIntl } from '@linkseeks/i18n'
export async function uploadFileExcel(url, params) {
  return umiRequest(url, {
    method: 'post',
    data: params,
    requestType: 'form',
  })
}
interface UploadImportProps {
  /** 标题 */
  title?: ReactNode
  /** 显示隐藏 */
  visible?: boolean
  /** 宽度 */
  width?: string | number
  /** 检查的接口 */
  checkfetch?: string
  /** 导入的接口 */
  importfetch?: string
  /** 完成导入 */
  onClose?: (e) => void
  /** 成功导入后返回数据 */
  fetchData?: (e) => void
  /** 下载链接 */
  downLink?: string
}

const UploadImport: React.FC<UploadImportProps> = (props: any) => {
  const intl = useIntl()
  const { visible, title, width, fetchData, checkfetch, importfetch, onClose, downLink } = props
  const [percent, setPercent] = useState<number>(0)
  const [step, setStep] = useState<number>(0)
  const [fileList, setFileList] = useState<any[]>([])
  const [exceptionCheck, setExceptionCheck] = useState<boolean>(false)

  /** 第一步: 导入检查 -> 成功 or 失败 */
  const firstStep = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText}>
          <span>1</span>
          {intl.formatMessage({ id: 'components.dianjixiazaiEXCELwenjian' })}{' '}
          <Typography.Link href={downLink} target="_blank">
            {intl.formatMessage({ id: 'components.xiazai' })}
          </Typography.Link>
        </li>
        <li className={style.wranText}>
          <span>2</span>
          {intl.formatMessage({ id: 'components.anzhaomubanzhenglihuopin' })}
        </li>
        <li className={style.wranText}>
          <span>3</span>
          {intl.formatMessage({ id: 'components.dianjidaoruanniudao' })}
        </li>
      </ul>
    </>
  )
  const firstStepLoading = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.zhengzaijinhangshujudaoru' })}</li>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.qingshaohou' })}</li>
      </ul>
    </>
  )
  const firstStep1 = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.wucuowugeshishuju' })}</li>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.jixudaoruqinganxiayi' })}</li>
      </ul>
    </>
  )
  const firstStep2 = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.cunzaicuowugeshishuju' })}</li>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.qingdaochucuowurizhixiu' })}</li>
      </ul>
    </>
  )
  const checkbeforeUpload = (file) => {
    setFileList([file])
    let extension = file.name.split('.')[1]
    const flag = ['xlsx', 'xls'].includes(extension)
    return flag
  }
  const checkOnChange = ({ file }) => {
    setExceptionCheck(true)
    setPercent(file.percent)
    if (file.response) {
      const { code } = file.response
      if (code !== 1000) {
        message.error(file.response.message)
        setStep(2)
        return
      }
      setStep(1)
    }
  }
  const handleNext = () => {
    console.log(fileList, 98)
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('file', file)
    })
    uploadFileExcel(importfetch, formData).then((res) => {
      if (res.code !== 1000) {
        setStep(4)
        return
      }
      fetchData(res.data)
      setStep(3)
    })
  }
  /** 第二步: 导入 -> 成功 or 失败 */
  const firstStep3 = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.shujuquanbudaoruchenggong' })}</li>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.jixudaoruqingdianjiji' })}</li>
      </ul>
    </>
  )
  const firstStep4 = (
    <>
      <ul className={style.ulStyle}>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.shujudaorushibaicun' })}</li>
        <li className={style.wranText1}>{intl.formatMessage({ id: 'components.yishengchengcuowurizhi' })}</li>
      </ul>
    </>
  )
  const continueImport = () => {
    setStep(0)
    setExceptionCheck(false)
  }

  const handleClose = () => {
    continueImport()
    onClose()
  }

  return (
    <Modal
      title={title}
      width={width}
      footer={null}
      bodyStyle={{ padding: 0, position: 'relative' }}
      visible={visible}
      onCancel={onClose}
    >
      {step === 0 && (
        <>
          <Result
            style={{ padding: 0 }}
            icon={
              <li className={style.iconParent}>
                <FileExcelFilled className={style.iconStyle} />
              </li>
            }
            title={firstStep}
            extra={
              <div className={style.footer}>
                <Upload
                  action={checkfetch}
                  showUploadList={false}
                  beforeUpload={checkbeforeUpload}
                  onChange={checkOnChange}
                >
                  <Button type="primary">{intl.formatMessage({ id: 'components.daoru' })}</Button>
                </Upload>
              </div>
            }
          />
          {exceptionCheck && (
            <div className={style.firstStepCheck}>
              <Result
                style={{ padding: 0 }}
                icon={
                  <Progress
                    type="circle"
                    format={(percent) => `${percent} %`}
                    width={64}
                    style={{ paddingTop: '24px' }}
                    percent={percent}
                  />
                }
                title={firstStepLoading}
              />
            </div>
          )}
        </>
      )}
      {step === 1 && (
        <Result
          icon={
            <li className={style.iconParent}>
              <CheckCircleOutlined className={style.iconStyle} />
            </li>
          }
          style={{ padding: 0, minHeight: '327px' }}
          title={firstStep1}
          extra={
            <Button type="primary" onClick={handleNext}>
              {intl.formatMessage({ id: 'components.xiayibu' })}
            </Button>
          }
        />
      )}
      {step === 2 && (
        <Result
          icon={
            <li className={style.iconParent}>
              <CloseCircleOutlined className={style.iconErrorStyle} />
            </li>
          }
          style={{ padding: 0, minHeight: '327px' }}
          title={firstStep2}
          extra={<Button onClick={continueImport}>{intl.formatMessage({ id: 'components.daochucuowurizhi' })}</Button>}
        />
      )}
      {step === 3 && (
        <Result
          icon={
            <li className={style.iconParent}>
              <CheckCircleOutlined className={style.iconStyle} />
            </li>
          }
          style={{ padding: 0, minHeight: '327px' }}
          title={firstStep3}
          extra={
            <>
              <Button type="primary" onClick={continueImport}>
                {intl.formatMessage({ id: 'components.jixudaoru' })}
              </Button>
              <Button onClick={handleClose}>{intl.formatMessage({ id: 'components.daoruwancheng' })}</Button>
            </>
          }
        />
      )}
      {step === 4 && (
        <Result
          icon={
            <li className={style.iconParent}>
              <CloseCircleOutlined className={style.iconErrorStyle} />
            </li>
          }
          style={{ padding: 0, minHeight: '327px' }}
          title={firstStep4}
          extra={<Button onClick={continueImport}>{intl.formatMessage({ id: 'components.daochucuowurizhi' })}</Button>}
        />
      )}
    </Modal>
  )
}

UploadImport.defaultProps = {
  title: 'Modal',
  width: 400,
}

UploadImport.displayName = 'UploadImport'
export default UploadImport
