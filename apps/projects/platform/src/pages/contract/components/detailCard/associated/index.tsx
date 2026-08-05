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
  associatedInfo: any
}

const Associated: React.FC<Iprops> = ({ associatedInfo }) => {
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
      id="associated"
      title={intl.formatMessage({ id: 'contract.associateInformation' })}
      extra={
        associatedInfo?.col2[0]?.old != null || associatedInfo?.col2[1]?.old != null ? (
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
          {associatedInfo?.col1?.map((item: any, index: number) =>
            item.hidden ? null : (
              <div className={style.list} key={`col1_${index + 1}`}>
                <div className={style.listLable}>{item.label}</div>
                {item.url ? (
                  <div className={style.gesture} onClick={() => history.push(item.url)}>
                    {item.extra}
                  </div>
                ) : item.List ? (
                  <div>
                    {item.extra.map((items) => {
                      return <p>{items.invoiceDate + '(' + items.number + ')'}</p>
                    })}
                  </div>
                ) : item.type == 'StatusTag' ? (
                  <StatusTag type="success" title={item.extra} />
                ) : (
                  <div className={style.extra}>
                    <div className={style.listContent}>{isNew || item.old == null ? item.extra : item.old}</div>
                    {item.old != null ? (
                      <Tooltip color={'#ffffff'} title={() => tooltipHtml(!isNew ? item.extra : item.old)}>
                        <img className={style.img} src={change} />
                      </Tooltip>
                    ) : null}
                  </div>
                )}
              </div>
            ),
          )}
        </Col>
        <Col span={12}>
          {associatedInfo?.col2?.map((item: any, index: number) =>
            item.hidden ? null : (
              <div className={style.list} key={`col1_${index + 1}`}>
                <div className={style.listLable}>{item.label}</div>
                {item.url ? (
                  <div className={style.gesture} onClick={() => history.push(item.url)}>
                    {item.extra}
                  </div>
                ) : item.List ? (
                  <div>
                    {item.extra.map((items) => {
                      return <p>{items.invoiceDate + '(' + items.number + ')'}</p>
                    })}
                  </div>
                ) : item.type == 'StatusTag' ? (
                  <StatusTag type="success" title={item.extra} />
                ) : (
                  <div className={style.extra}>
                    <div className={style.listContent}>{isNew || item.old == null ? item.extra : item.old}</div>
                    {item.old != null ? (
                      <Tooltip color={'#ffffff'} title={() => tooltipHtml(!isNew ? item.extra : item.old)}>
                        <img className={style.img} src={change} />
                      </Tooltip>
                    ) : null}
                  </div>
                )}
              </div>
            ),
          )}
        </Col>
      </Row>
    </Card>
  )
}
Associated.defaultProps = {
  associatedInfo: [],
}
export default Associated
