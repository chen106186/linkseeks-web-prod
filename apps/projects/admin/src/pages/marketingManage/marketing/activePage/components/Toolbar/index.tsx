import React, { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { Modal } from 'antd'
import styles from './index.less'
import type { STATE_PROPS } from '@apps/design-react'
import { changeProps, useSelector } from '@apps/design-react'
import Color from './color'
import { usePageStatus } from '@/hooks/usePageStatus'

interface Iprops {
  extra?: React.ReactNode
  title: string | React.ReactNode
  type: 'preview' | 'edit'
  onColorChange?: (color: string) => void
  onBack?: () => void | null
}

type SettingPanelType = {
  pageConfig: any
}

const Toolbar: React.FC<Iprops> = (props: Iprops) => {
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const { id } = usePageStatus()
  const color = pageConfig?.[0]?.props?.backgroundColor
  const { title, extra, type, onColorChange } = props

  useEffect(() => {
    if (onColorChange) {
      console.log(`onColorChange color`, color)
      onColorChange(color)
    }
  }, [color])

  const goback = () => {
    if (type === 'preview') {
      history.goBack()
      return
    }
    if (props.onBack) {
      props.onBack()
      return
    }
    Modal.confirm({
      title: '确认离开装修页?',
      onOk: () => {
        history.goBack()
        // history.push(`/marketingManage/marketing/activePage/edit?id=${id}`)
      },
    })
  }

  const handleChangeColor = (hex: string) => {
    if (onColorChange) {
      onColorChange(hex)
    }

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
      {(color && <Color onChange={handleChangeColor} color={color} />) || null}
      <div className={styles.extra}>{extra}</div>
    </div>
  )
}

export default Toolbar
