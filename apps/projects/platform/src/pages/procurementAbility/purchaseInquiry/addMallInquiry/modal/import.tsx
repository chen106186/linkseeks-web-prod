import React, { useState } from 'react'
import { Modal, Row, Col, Image, Progress, Button, Upload } from 'antd'
import style from './index.less'
import excelIcon from '@/assets/imgs/excel.png'
import cx from 'classnames'
import { getIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'

interface Iprops {
  flag: boolean
  onClose: () => void
}
const intl = getIntl()
const Import: React.FC<Iprops> = (props: any) => {
  const { flag, onClose } = props
  const [next, setNext] = useState<number>(1)
  const translate = useWebIntl()
  return (
    <Modal
      width={400}
      title="导入"
      visible={flag}
      onCancel={onClose}
      footer={
        next !== 1 ? null : (
          <Upload>
            <Button type="primary">导入</Button>
          </Upload>
        )
      }
    >
      {next === 1 && (
        <Row
          style={{
            flexDirection: 'column',
          }}
        >
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image width={72} height={72} preview={false} src={excelIcon} />
          </Col>
          <Col span={24} className={style.colStyle}>
            <span className={style.badgeStyle}>1</span>
            <span className={style.textStyle}>点击下载 EXCEL文件模板</span>
            <Button style={{ fontSize: '14px' }} type="link">
              下载
            </Button>
          </Col>
          <Col span={24} className={style.colStyle}>
            <span className={style.badgeStyle}>2</span>
            <span className={style.textStyle}>按照模板整理货品资料</span>
          </Col>
          <Col span={24} className={style.colStyle}>
            <span className={style.badgeStyle}>3</span>
            <span className={style.textStyle}>点击导入按钮，导入整理好的货品资料</span>
          </Col>
        </Row>
      )}
      {next === 2 && (
        <Row
          style={{
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Progress type="circle" percent={30} width={64} />
          </Col>
          <Col span={24} style={{ marginTop: '44px' }}>
            <span className={cx(style.textStyle, style.fontColor)}>正在进行数据导入检查</span>
          </Col>
          <Col span={24}>
            <span className={style.textStyle}>请稍后…</span>
          </Col>
          <Col span={24} className={style.marginTop}>
            <Button type="primary">{translate('web.common.nextStep')}</Button>
          </Col>
        </Row>
      )}
      {next === 3 && (
        <Row
          style={{
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Progress type="circle" percent={30} width={64} />
          </Col>
          <Col span={24} style={{ marginTop: '44px' }}>
            <span className={cx(style.textStyle, style.fontColor)}>正在进行数据导入</span>
          </Col>
          <Col span={24}>
            <span className={style.textStyle}>请稍后…</span>
          </Col>
          <Col span={24} className={style.marginTop}>
            <Button type="primary">继续导入</Button>
            <Button>导入完成</Button>
          </Col>
        </Row>
      )}
    </Modal>
  )
}
export default Import
