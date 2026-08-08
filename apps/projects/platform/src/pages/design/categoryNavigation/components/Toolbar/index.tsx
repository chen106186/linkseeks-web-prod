import React from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import styles from './index.less'
interface Iprops {
  extra?: React.ReactNode
  title: string | React.ReactNode
}

const Toolbar: React.FC<Iprops> = (props: Iprops) => {
  const { title, extra } = props
  const intl = useIntl()
  const goback = () => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'editor.category.confirm.leave' }),
      onOk: () => {
        history.goBack()
      },
    })
    // history.goBack();
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.back} onClick={goback}>
        <ArrowLeftOutlined style={{ color: '#fff', fontSize: '24px' }} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.extra}>{extra}</div>
    </div>
  )
}

export default Toolbar
