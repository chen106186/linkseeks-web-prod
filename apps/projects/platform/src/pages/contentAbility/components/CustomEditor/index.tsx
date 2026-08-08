import { Editor } from '@apps/components'

const CustomEditor = (props) => {
  const editorProps = props.props['x-component-props']
  const parentProps = props.props['x-component-parent-props']

  const handleChange = (editorState) => {
    const isEmpty = editorState.isEmpty()
    const value = isEmpty ? null : editorState
    props.mutators.change(value)
  }

  return (
    <div {...parentProps}>
      <Editor {...editorProps} value={props.value || ''} onChange={handleChange} />
    </div>
  )
}

CustomEditor.isFieldComponent = true

export default CustomEditor
