import React from 'react'
import { Form } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
import im_success from '@/assets/imgs/im_success.png'
import styles from './index.less'

interface IProps {
  show: boolean
  isNeedAudit: boolean
  time: number
}

const WaitExamine: React.FC<IProps> = (props) => {
  const { show, isNeedAudit, time } = props
  const intl = useIntl()

  return (
    <Form.Item hidden={!show}>
      <div className={styles.formBoxStep3}>
        <img src={im_success} />
        <h2>
          {isNeedAudit
            ? intl.formatMessage({ id: 'user.nindezhuceziliaoyijing' })
            : intl.formatMessage({ id: 'user.register.submit' })}
        </h2>
        {isNeedAudit && (
          <div className={styles.description}>
            <p>{intl.formatMessage({ id: 'user.shenhejieguohuiyiduanxin' })}</p>
            <p>{intl.formatMessage({ id: 'user.ninyekeyidenglupingtai' })}</p>
          </div>
        )}
        <p className={styles.guid}>
          <span>
            {time}s {intl.formatMessage({ id: 'user.houzidongtiaozhuanzhidenglu' })}
          </span>
          <br />
          <span>
            <Link to="/user/login">{intl.formatMessage({ id: 'user.lijitiaozhuan' })}</Link>
          </span>
        </p>
      </div>
    </Form.Item>
  )
}

export default WaitExamine
