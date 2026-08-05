import React, { useContext, useMemo, useState } from 'react'
import { Context } from '../context'
import Card from '../../../card'
import { Button, Row, Col, Modal } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import style from './index.less'
import moment from 'moment'
import { authService } from '@apps/services'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const BidLayout = () => {
  const context = useContext(Context)
  const title =
    context.isPrize === 1
      ? intl.formatMessage({ id: 'detail.purchase.bidLayout1' })
      : intl.formatMessage({ id: 'detail.purchase.bidLayout' })
  const [visible, setVisible] = useState<boolean>(false)
  const userInfo = useMemo(() => authService.getAuth(), [context])
  return (
    <Card
      id="bidLayout"
      title={title}
      backgroundColor={context.isPrize === 1 && '#00A98F'}
      extra={
        context.content && (
          <Button type="link" onClick={() => setVisible(true)}>
            {intl.formatMessage({ id: 'table.purchase.see' })}
            {intl.formatMessage({ id: 'detail.purchase.thanks' })}
          </Button>
        )
      }
    >
      {context.isPrize === 1 ? (
        <div style={{ whiteSpace: 'break-spaces' }}>{context.awardResults}</div>
      ) : (
        <Row>
          <Col>
            <ExclamationCircleFilled style={{ fontSize: '20px', color: '#91949a' }} />
          </Col>
          <Col>
            <p style={{ fontSize: '16px', marginLeft: 5 }}>{intl.formatMessage({ id: 'detail.purchase.message78' })}</p>
            <p style={{ fontSize: '12px' }}>{intl.formatMessage({ id: 'detail.purchase.message79' })}</p>
          </Col>
        </Row>
      )}

      {/* 感谢函 */}
      <Modal
        title={intl.formatMessage({ id: 'detail.purchase.thanks' })}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={660}
        className={style.thankModal}
      >
        <div className={style.thankLetter}>
          <h2>{intl.formatMessage({ id: 'detail.purchase.thanks' })}</h2>
          <h4>THANKS LETTER</h4>
          <p className={style.name}>
            {intl.formatMessage({ id: 'detail.purchase.respect' })}
            {userInfo.userName}
          </p>
          <p>{context.content}</p>
          <p className={style.company}>{context.memberName}</p>
          <p className={style.time}>{moment().format('YYYY-MM-DD')}</p>
        </div>
      </Modal>
    </Card>
  )
}
export default BidLayout
