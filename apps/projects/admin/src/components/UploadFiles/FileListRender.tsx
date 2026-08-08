import React from 'react'

interface Iprops {
  files: {
    name: string
    url: string
  }[]
}

const FileListRender = (props: Iprops) => {
  const { files } = props
  const length = files?.length || 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {files?.map((_row, index) => {
        return (
          <a style={index + 1 === length ? {} : { marginBottom: '4px' }} key={_row.url} href={_row.url}>
            {_row.name}
          </a>
        )
      })}
    </div>
  )
}

export default FileListRender
