import React from 'react'

interface Iprops {
  value: {
    url?: string
    name?: string
  }
}

const Files: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value } = props
  const onDownload = (file: any) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GEt', file.url, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      const url = window.URL.createObjectURL(xhr.response)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
    }
    xhr.send()
  }
  return (
    <div>
      <a
        onClick={() => {
          onDownload(value)
        }}
      >
        {value?.name || ''}{' '}
      </a>
    </div>
  )
}

Files.isFieldComponent = true

export default Files
