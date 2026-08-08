import React from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import styles from './index.less'
import { Modal } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import Color from './color'
import { changeProps, SelectedInfoType, STATE_PROPS, useSelector } from '@apps/design-react'
import { usePageStatus } from '@/hooks/usePageStatus'

interface Iprops {
  extra?: React.ReactNode
  title: string | React.ReactNode
}

type SettingPanelType = {
  pageConfig: any
}

const Toolbar: React.FC<Iprops> = (props: Iprops) => {
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const { id } = usePageStatus()
  const color = pageConfig?.[0]?.props?.backgroundColor

  const intl = useIntl()
  const { title, extra } = props
  const goback = () => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'activityPage.confirmLeaveDecoratePage' }),
      onOk: () => {
        history.goBack()
        // history.push(`/marketingAbility/marketingActivitiesManagement/activePage/edit?id=${id}`)
      },
    })
  }

  const handleChangeColor = (hex: string) => {
    changeProps({
      treeKey: '0',
      props: {
        backgroundColor: hex,
      },
    })
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.back} onClick={goback}>
        <ArrowLeftOutlined style={{ color: '#fff', fontSize: '24px' }} />
      </div>
      <div className={styles.title}>{title}</div>
      {color && <Color onChange={handleChangeColor} color={color} />}
      <div className={styles.extra}>{extra}</div>
    </div>
  )
}

export default Toolbar
