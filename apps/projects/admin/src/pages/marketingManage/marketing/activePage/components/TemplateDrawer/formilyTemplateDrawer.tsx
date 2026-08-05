import React from 'react'
import { Button } from 'antd'
import { useToggle } from '@linkseeks/hooks'
import defaultLogo from '@/assets/default_logo.jpg'
import styles from './index.less'
import TemplateDrawer from '.'
// import { getCommodityWebPageTemplateWebFindAllActivityTemplate } from '@apps/apis'

type ChangeValueType = {
  templateId: number
  templateName: string
  templatePicUrl: string
}

interface Iprops {
  value: ChangeValueType | null
  mutators: {
    change: (params: ChangeValueType) => void
  }
  editable: boolean
  props: {
    'x-component-props': {
      environment: string
    }
  }
}

const FormilyTemplateDrawer: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const [visible, setVisible] = useToggle(false)
  const { value = null, mutators, editable } = props
  const componentProps = props.props['x-component-props'] || {}

  const onConfirm = (record: ChangeValueType) => {
    const data = {
      templateId: record.templateId,
      templateName: record.templateName,
      templatePicUrl: record.templatePicUrl,
    }
    mutators.change(data)
    setVisible(false)
  }

  const fetchData = async (params: { current: string; pageSize }) => {
    const postData = {
      ...params,
      ...componentProps,
    }
    // const { data, code } = await getCommodityWebPageTemplateWebFindAllActivityTemplate(postData)
    // if (code === 1000) {
    //   return data
    // }
    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <div className={styles.container}>
      {value?.templateName && <img className={styles.image} src={value?.templatePicUrl || defaultLogo} />}
      <span className={styles.templateName}>{value?.templateName}</span>
      {editable && (
        <div className={styles.btn}>
          <Button onClick={() => setVisible(true)}>选择</Button>
        </div>
      )}
      <TemplateDrawer
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={onConfirm}
        fetchData={fetchData}
        // value={templateRecord}
        value={value}
      />
    </div>
  )
}

FormilyTemplateDrawer.isFieldComponent = true

export default FormilyTemplateDrawer
