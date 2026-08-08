import React from 'react'
import { Editor } from '@apps/components'

interface Iprops {
  value: any
  props: {
    'x-component-props': any
  }
  mutators: {
    change: (value: any) => void
  }
}

const CustomEditor: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value } = props
  const editorProps = props.props['x-component-props']
  const handleChange = (editorState) => {
    const isEmpty = editorState.isEmpty()
    const value = isEmpty ? null : editorState
    props.mutators.change(value)
  }
  return (
    <div>
      <Editor {...editorProps} value={value || ''} onChange={handleChange} />
    </div>
  )
}

CustomEditor.isFieldComponent = true

export default CustomEditor
