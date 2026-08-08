import { Editor } from '@apps/components'
import { message } from 'antd'

// const SchemaEditor = createVirtualBox('SchemaEditor', BraftEditor);
const CustomEditor = (props) => {
  const editorProps = props.props['x-component-props']
  const parentProps = props.props['x-component-parent-props']

  const handleChange = (editorState) => {
    const isEmpty = editorState.isEmpty()
    const value = isEmpty ? null : editorState
    props.mutators.change(value)
  }

  const upload = (param) => {
    const serverURL = '/api/support/file/upload'
    const fd = new FormData()
    fd.append('file', param.file)

    /**
     * 这里如果直接用 umi request 貌似有坑
     * https://github.com/umijs/umi-request/issues/168
     * 添加header貌似就有问题了。让浏览器自动添加content-type
     */
    fetch(serverURL, {
      method: 'POST',
      body: fd,
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        param.success({
          url: data.data,
          meta: {
            id: param.id,
            title: param.file.name,
            src: data.data,
          },
        })
      })
      .catch((e) => {
        message.error('上传失败')
      })
  }

  return (
    <div {...parentProps}>
      <Editor
        {...editorProps}
        media={{ ...editorProps['media'], uploadFn: upload }}
        value={props.value || ''}
        onChange={handleChange}
      />
    </div>
  )
}

CustomEditor.isFieldComponent = true

export default CustomEditor
