import React, { useState, useEffect } from 'react'
import { Modal, Result, Progress, Button } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import styles from './index.less'

interface Uploader {
  visibleModal: boolean
  fileText: string
  onCancel: Function
}

let timeChange: any

const UploadModal: React.FC<Uploader> = (props) => {
  const [modalTitle, setModalTitle] = useState('导入')
  const [modalStep, setModalStep] = useState(0)

  const downLoadTemplate = () => {}

  const step0Description = (
    <>
      <ul className={styles.step0Description}>
        <li>
          点击下载 EXCEL文件模板 <a onClick={downLoadTemplate}>下载</a>
        </li>
        <li>按照模板整理{props.fileText}</li>
        <li>点击导入按钮，导入整理好的{props.fileText}</li>
      </ul>
    </>
  )

  const step1Description = (
    <div className={styles.step1Description}>
      <h4>正在进行数据导入检查</h4>
      <p>请稍后…</p>
    </div>
  )

  const step1DescripSuccess = (
    <div className={styles.step1Description}>
      <h4>无错误格式数据</h4>
      <p>继续导入请按下一步</p>
      <Button type="primary" onClick={() => handleUpload('import')}>
        下一步
      </Button>
    </div>
  )

  const step1Exception = (
    <div className={styles.step1Description}>
      <h4>存在错误格式数据，已生成错误日志</h4>
      <p>请导出错误日志修正数据后再次导入</p>
    </div>
  )

  const step2Description = (
    <div className={styles.step1Description}>
      <h4>正在进行数据导入</h4>
      <p>请稍后…</p>
    </div>
  )

  const step2DescripSuccess = (
    <div className={styles.step1Description}>
      <h4>数据全部导入成功</h4>
      <p>继续导入请点击继续导入，导入完成请点击导入完成</p>
      <Button type="primary" onClick={() => handleUpload('continue')}>
        继续导入
      </Button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button onClick={() => props.onCancel()}>完成导入</Button>
    </div>
  )

  const step2Exception = (
    <div className={styles.step1Description}>
      <h4>导入完成请点击导入完成</h4>
      <p>已生成错误日志，请导出错误日志修正数据后再次导入</p>
    </div>
  )

  // 导入的时候的描述文字
  const [step1DescriptState, setStep1DescriptState] = useState(step1Description)
  const [step2DescriptState, setStep2DescriptState] = useState(step2Description)

  // timer  计时器模拟导入过程
  const [exceptionCheck, setExceptionCheck] = useState(false) // 默认无异常
  const [exceptionData, setExceptionData] = useState(false) // 默认无异常
  const [time, setTime] = useState(0) // timer

  useEffect(() => {
    clearInterval(timeChange)
  }, [])

  useEffect(() => {
    if (modalStep === 1) runTimer()
    if (modalStep === 2) runTimer()
  }, [modalStep])

  useEffect(() => {
    if (time >= 100) {
      clearInterval(timeChange)
      setTime(100)
      if (modalStep === 1) setStep1DescriptState(step1DescripSuccess)
      if (modalStep === 2) setStep2DescriptState(step2DescripSuccess)
    }
  }, [time])

  const runTimer = () => {
    setTime(0)
    timeChange = setInterval(() => setTime((t) => t + Math.floor(Math.random() * 10)), 200)
  }
  //timer end

  // 导入的时候 进度条的颜色配置
  const step1Icon = (
    <Progress
      type="circle"
      strokeColor={{
        '0%': '#669EDE',
        '100%': '#41CC9E',
      }}
      percent={time}
    />
  )

  const step2Icon = (
    <Progress
      type="circle"
      strokeColor={{
        '0%': '#669EDE',
        '100%': '#41CC9E',
      }}
      percent={time}
    />
  )

  // 上传
  const handleUpload = (type: string, step: number = 0) => {
    let title = ''
    switch (type) {
      case 'continue':
        step = 0
        title = '继续导入'
        break
      case 'upload':
        step = 1
        title = '导入检查'
        break
      case 'import':
        step = 2
        title = '数据导入'
        break
    }
    setModalStep(step)
    setModalTitle(title)
  }

  const exportErrorLog = () => {}

  const handleClose = () => {
    setModalStep(0)
    setModalTitle('导入')
    setTime(0)
    clearInterval(timeChange)
  }

  return (
    <>
      <Modal
        title={modalTitle}
        visible={props.visibleModal}
        onCancel={() => props.onCancel()}
        afterClose={() => handleClose()}
        maskClosable={false}
        footer={null}
        destroyOnClose
      >
        {modalStep === 0 && (
          <>
            <Result
              icon={<FileExcelOutlined />}
              title={step0Description}
              extra={
                <Button style={{ width: '100%' }} type="primary" onClick={() => handleUpload('upload')}>
                  上传
                </Button>
              }
            />
          </>
        )}
        {modalStep === 1 && !exceptionCheck && (
          <>
            <Result icon={step1Icon} title={step1DescriptState} />
          </>
        )}
        {modalStep === 1 && exceptionCheck && (
          <>
            <Result
              icon={<Progress type="circle" percent={100} status="exception" />}
              title={step1Exception}
              extra={<Button onClick={exportErrorLog}>导出错误日志</Button>}
            />
          </>
        )}
        {modalStep === 2 && !exceptionData && (
          <>
            <Result icon={step2Icon} title={step2DescriptState} />
          </>
        )}
        {modalStep === 2 && exceptionData && (
          <>
            <Result
              icon={<Progress type="circle" percent={100} status="exception" />}
              title={step2Exception}
              extra={<Button onClick={exportErrorLog}>导出错误日志</Button>}
            />
          </>
        )}
      </Modal>
    </>
  )
}

export default UploadModal
