/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 11:49:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-06 10:02:30
 * @Description: 附件列表
 */
import React, { useState, useEffect } from 'react'
import { Upload } from 'antd'
import { normalizeFiledata, FileData } from '@/utils'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

export type FaultFileListItem = {
  /**
   * 文件名
   */
  fileName: string
  /**
   * 文件地址
   */
  filePath: string
}

interface FileListProps {
  fileList: FaultFileListItem[]
}

const FileList: React.FC<FileListProps> = ({ fileList = [] }) => {
  const [innerFileList, setInnerFileList] = useState<FileData[]>()

  useEffect(() => {
    if (fileList && fileList.length) {
      setInnerFileList(fileList?.map((item) => normalizeFiledata(item.filePath, item.fileName)))
    }
  }, [fileList])

  return (
    <MellowCard title="相关不良原因举证附件" fullHeight>
      <Upload className={styles.file} fileList={innerFileList} />
    </MellowCard>
  )
}

export default FileList
