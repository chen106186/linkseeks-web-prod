import { useEffect, useState } from 'react'
import SettingPanel from '@/pages/design/components/SettingPanel'
import { changeProps, clearSelectedStatus } from '@apps/design-core'
import { Form } from 'antd'
import { BraftEditor, Editor } from '@apps/components'
import { defaultExcludeControls } from '@apps/components/src/web/Editor'
import styles from './index.less'

interface IProps {
  html?: string
}

const RichText: React.FC<IProps> = (props) => {
  const { html } = props
  const [changeState, setChangeState] = useState<boolean>(false)
  const [componentForm] = Form.useForm()

  useEffect(() => {
    if (html) {
      componentForm.setFieldValue('html', BraftEditor.createEditorState(html))
    }
  }, [html])

  const handleCancel = () => {
    clearSelectedStatus()
  }

  const handleConfirmSave = (e) => {
    componentForm.validateFields().then((values) => {
      e.preventDefault()
      if (!changeState) {
        clearSelectedStatus()
        return
      }

      changeProps({
        props: {
          html: values.html.toHTML() ?? '',
          canDelete: true,
        },
      })
      clearSelectedStatus()
    })
  }

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Form
        form={componentForm}
        labelAlign="left"
        wrapperCol={{ span: 24 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item name="html">
          <Editor className={styles['helpful-richEditable']} excludeControls={[...defaultExcludeControls, 'media']} />
        </Form.Item>
      </Form>
    </SettingPanel>
  )
}

export default RichText
