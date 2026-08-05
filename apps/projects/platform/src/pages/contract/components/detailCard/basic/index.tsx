import React, { useState } from 'react'
import { Row, Col, Tooltip } from 'antd'
import StatusTag from '@/components/StatusTag'
import style from '../index.less'
import type { IAntdSchemaFormProps } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import change from '@/assets/imgs/change.png'
import cx from 'classnames'
import { useWebIntl } from '@apps/locales'
import { Card } from '@linkseeks/ui'

const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  basicInfo: any
}

const Basic: React.FC<Iprops> = ({ basicInfo }) => {
  const [isNew, setIsNew] = useState<boolean>(true)
  const translate = useWebIntl()
  const tooltipHtml = (item) => {
    return (
      <div className={style.tooltip}>
        <div className={style.header}>
          <img className={style.img} src={change} />
          {isNew ? translate('web.resource.member.biangengqian') : translate('web.resource.member.biangenghou')}
        </div>
        <div className={style.text}>{item}</div>
      </div>
    )
  }

  const handleBtnChange = (data: boolean) => {
    setIsNew(data)
  }

  return (
    <Card
      id="process"
      title={intl.formatMessage({ id: 'contract.jibenxinxi' })}
      extra={
        basicInfo?.col1[0]?.old ? (
          <div className={style.changeBtn}>
            <div className={cx(style.btn, !isNew ? style.active : '')} onClick={() => handleBtnChange(false)}>
              {translate('web.resource.member.biangengqian')}
            </div>
            <div className={cx(style.btn, isNew ? style.active : '')} onClick={() => handleBtnChange(true)}>
              {translate('web.resource.member.biangenghou')}
            </div>
          </div>
        ) : null
      }
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          {basicInfo.col1.map((item: any, index: number) => (
            <div className={style.list} key={`col1_${index + 1}`}>
              <div className={style.listLable}>{item.label}</div>
              {item.url ? (
                <div className={style.gesture} onClick={() => history.push(item.url)}>
                  {item.extra}
                </div>
              ) : item.List ? (
                <div>
                  {item.extra.map((items) => {
                    console.log(items.number + '(' + items.invoiceDate + ')')
                    return <p>{items.invoiceDate + '(' + items.number + ')'}</p>
                  })}
                </div>
              ) : item.type == 'StatusTag' ? (
                <StatusTag type="success" title={item.extra} />
              ) : (
                <div className={style.extra}>
                  <div className={style.listContent}>{isNew || !item.old ? item.extra : item.old}</div>
                  {item.old ? (
                    <Tooltip color={'#ffffff'} title={() => tooltipHtml(!isNew ? item.extra : item.old)}>
                      <img className={style.img} src={change} />
                    </Tooltip>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </Col>
        <Col span={12}>
          {basicInfo.col2.map((item: any, index: number) => (
            <div className={style.list} key={`col2_${index + 1}`}>
              <div className={style.listLable}>{item.label}</div>

              {item.url ? (
                <div className={style.gesture} onClick={() => history.push(item.url)}>
                  {item.extra}
                </div>
              ) : (
                <div className={style.extra}>
                  <div className={style.listContent}>{isNew || !item.old ? item.extra : item.old}</div>
                  {item.old ? (
                    <Tooltip color={'#ffffff'} title={() => tooltipHtml(!isNew ? item.extra : item.old)}>
                      <img className={style.img} src={change} />
                    </Tooltip>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </Card>
  )
}
Basic.defaultProps = {
  basicInfo: {
    col1: [],
    col2: [],
    col3: [],
  },
}
export default Basic
