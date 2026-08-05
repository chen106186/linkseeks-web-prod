import React from 'react'
import { Checkbox } from 'antd'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import { enumName } from '@/constants/environment'
import defaultLogo from '@/assets/imgs/default_logo.jpg'

interface Iprops {
  checked: boolean
  onSelect?: ((selected: boolean, postData: any) => void) | null
  dataSource: {
    id: number
  } & {
    [key: string]: any
  }
}

const ActivityTemplateItem: React.FC<Iprops> = (props: Iprops) => {
  const { checked, onSelect = null, dataSource } = props
  const onChange = (selected: boolean) => {
    const postData = dataSource
    onSelect?.(selected, postData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.checkbox}>
        <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)}></Checkbox>
      </div>
      <div className={styles.info}>
        <img className={styles.img} src={dataSource.templatePicUrl || defaultLogo} />
        <div className={styles.content}>
          <h1>{dataSource.templateName}</h1>
          <p>{dataSource.templateDescribe}</p>
        </div>
        <div className={styles.tag}>
          <StatusTag type="primary" title={enumName[dataSource.environment]} />
        </div>
      </div>
    </div>
  )
}

export default ActivityTemplateItem
