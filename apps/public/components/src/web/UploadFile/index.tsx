import { authService } from '@apps/services'
import { Space, Upload, UploadProps, Spin, Button } from '@linkseeks/ui'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { UPLOAD_FILE_ACCEPT, UploadFileType, ShowType } from './constants'
import './index.less'
import { EditIcon, PlusIcon } from '@linkseeks/icons'
import cn from 'classnames'
import { UploadChangeParam, UploadFile as AntdUploadFileProps } from 'antd/lib/upload'
import { DragableUploadListItem, useDragable } from './useDragable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useControllableValue } from '@linkseeks/hooks'
import { useControl } from './useControl'
import { ShowUploadListInterface } from 'antd/lib/upload/interface'

export type UploadAction = {
  // file?: AntdUploadFileProps,
  fileList: AntdUploadFileProps[]
  setFileList(fileList: AntdUploadFileProps[]): void
}
export interface UploadFileProps {
  /**
   * 上传的文件类型
   */
  uploadType?: UploadFileType

  showType?: ShowType

  children?: ReactNode

  onPreview?(file: AntdUploadFileProps, index: number): void
  onEdit?(file: AntdUploadFileProps, index: number, action: UploadAction): void

  showUploadList?: boolean | ShowUploadListInterface

  uploadProps?: UploadProps

  // 表单操作相关
  fileList?: AntdUploadFileProps[]
  value?: any
  onChange?(file: any): void

  // 是否可拖拽排序
  isDrag?: boolean

  // 是否单张上传
  isSingle?: boolean
}

const UploadFile = (props: UploadFileProps) => {
  const {
    uploadType = UploadFileType.IMAGE,
    showType,
    children,
    onPreview,
    onEdit,
    showUploadList: upShowUploadList,
    onChange,
    uploadProps,
    isDrag,
    isSingle,
  } = props
  const uploadRef = useRef<any>({})
  const { token } = authService.getAuth() || {}
  const [_fileList, setFileList] = useControllableValue<AntdUploadFileProps[]>(props, {
    valuePropName: 'fileList',
    defaultValue: [],
    trigger: upShowUploadList === false ? '' : 'onChange',
  })

  const maxLength = isSingle ? 1 : props.uploadProps?.maxCount
  const fileList: any[] = useMemo(() => {
    if (_fileList) {
      if (Array.isArray(_fileList)) {
        return _fileList
      } else if (typeof _fileList === 'string') {
        return [
          {
            url: _fileList,
          },
        ]
      } else {
        return [_fileList]
      }
    } else {
      return []
    }
  }, [_fileList])
  const { moveRow } = useDragable({ fileList, setFileList })
  const action: UploadAction = {
    fileList,
    setFileList,
  }
  const { handleEdit } = useControl(action, props)

  const getComponentProps = () => {
    const accept = UPLOAD_FILE_ACCEPT[uploadType].join(',')
    return {
      accept,
    }
  }

  const renderShowComponent = () => {
    switch (showType) {
      case ShowType.PICTURE_CARD: {
        const uploadBtn = (
          <div className="cp-upload-file-btn-wrap">
            <PlusIcon />
            <p>点击上传</p>
          </div>
        )
        return uploadBtn
      }

      case ShowType.TEXT: {
        return null
      }
    }
  }

  const handleImageChange = (info: UploadChangeParam<AntdUploadFileProps<any>>) => {
    if (showType === ShowType.PICTURE_CARD) {
    } else if (showType === ShowType.TEXT) {
    }
    if (info.file.status === 'done') {
      onChange && onChange(info)
    }
    setFileList([...info.fileList])
  }

  const replaceFileList = (file) => {
    const index = fileList.indexOf(file)
    if (index === -1) {
      throw '未找到对应的file在fileList中'
    }

    onPreview && onPreview(file, index)
  }

  const showUploadList: ShowUploadListInterface = {
    downloadIcon: <EditIcon color={'#fff'} size={16} />,
    showDownloadIcon: !!onEdit,
    showPreviewIcon: !!onPreview,
  }
  const baseUploadProps: UploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    headers: { token: token || '' },
    data: {
      fileType: 1,
    },
    onChange: handleImageChange,
    fileList,
    listType: showType,
    itemRender: isDrag
      ? (originNode, file, currFileList) => (
          <DragableUploadListItem originNode={originNode} file={file} fileList={currFileList} moveRow={moveRow} />
        )
      : undefined,
    onPreview(file) {
      replaceFileList(file)
    },
    // 由于下载功能用不上，所以将图标替换为修改，作为编辑功能
    onDownload: handleEdit,
    showUploadList: upShowUploadList === undefined ? showUploadList : upShowUploadList,
    ...getComponentProps(),
    ...uploadProps,
    maxCount: maxLength,
  }

  const renderUploadBtn = () => {
    return (
      <DndProvider backend={HTML5Backend}>
        <Upload {...baseUploadProps} className="standard-upload-file-instance">
          <div ref={uploadRef}>{children}</div>
        </Upload>
        <div onClick={() => uploadRef.current.click()}>{renderShowComponent()}</div>
      </DndProvider>
    )
  }

  return (
    <div className={cn('cp-upload-file', showType === ShowType.PICTURE_CARD && 'picture-card')}>
      {renderUploadBtn()}
    </div>
  )
}

export default UploadFile
