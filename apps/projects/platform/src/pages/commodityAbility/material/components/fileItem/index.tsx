import React from 'react'
import { changeIcon } from '../wl_extras'

interface Iprops {
  value: {
    url: string
    name: string
  }
  before?: 'change' | 'del' | 'add' | undefined
}

const Files: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, before } = props
  const onDownload = (file: any) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GEt', file.url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      const url = window.URL.createObjectURL(xhr.response)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
    }
    xhr.send()
  }
  return (
    <a
      onClick={() => {
        onDownload(value)
      }}
    >
      {value?.name || ''}
      {changeIcon(before)}
    </a>
  )
}

Files.isFieldComponent = true

export default Files
