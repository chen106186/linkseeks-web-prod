import React, { useMemo } from 'react'
import { Modal } from 'antd'
import moment from 'moment'
import { authService } from '@apps/services'

import style from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

interface ThankItemProps {
  visible: boolean
  detail: any
  onOk: () => void
}

const ThankItem: React.FC<ThankItemProps> = (props: any) => {
  const { visible, detail, onOk } = props
  const userInfo = useMemo(() => authService.getAuth(), [detail])
  return (
    <Modal
      title={intl.formatMessage({ id: 'detail.purchase.thanks' })}
      visible={visible}
      onOk={onOk}
      onCancel={onOk}
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
        <p>{detail.content}</p>
        <p className={style.company}>{detail.createMemberName}</p>
        <p className={style.time}>{moment().format('YYYY-MM-DD')}</p>
      </div>
    </Modal>
  )
}

export default ThankItem
