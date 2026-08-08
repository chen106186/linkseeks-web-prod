import React from 'react'
import BraftEditor, { BraftEditorProps, BuiltInControlType } from 'braft-editor'
import 'braft-editor/dist/index.css'

interface IPorps extends BraftEditorProps {
  className?: string
}

export const defaultExcludeControls: BuiltInControlType[] = [
  'letter-spacing',
  'line-height',
  'clear',
  'headings',
  'list-ol',
  'list-ul',
  'remove-styles',
  'superscript',
  'subscript',
  'hr',
]

const Editor: React.FC<IPorps> = (props) => {
  const { className, ...reset } = props

  // 自定义上传函数
  const myUploadFn = (param) => {
    const serverURL = '/api/support/file/upload' // 替换为你自己的上传接口
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = () => {
      // 上传成功后调用 param.success 并传入上传后的文件 URL
      const result = JSON.parse(xhr.responseText)
      param.success({
        url: result.data, // 从服务器响应中获取文件的 URL
      })
    }

    const progressFn = (event) => {
      // 上传进度监控，param.progress 用来更新上传进度
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = () => {
      // 上传失败时调用 param.error
      param.error({
        msg: 'unable to upload',
      })
    }

    xhr.upload.addEventListener('progress', progressFn, false)
    xhr.addEventListener('load', successFn, false)
    xhr.addEventListener('error', errorFn, false)
    xhr.addEventListener('abort', errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }

  const editorProps: BraftEditorProps = {
    contentStyle: {
      height: 256,
    },
    excludeControls: [
      'letter-spacing',
      'line-height',
      'clear',
      'headings',
      'list-ol',
      'list-ul',
      'remove-styles',
      'superscript',
      'subscript',
      'hr',
    ],
    media: {
      accepts: {
        video: false,
        audio: false,
      },
      uploadFn: myUploadFn,
    },
    ...reset,
  }

  return (
    <div className={className}>
      <BraftEditor {...editorProps} />
    </div>
  )
}

export default Editor
