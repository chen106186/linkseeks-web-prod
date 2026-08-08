/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 11:49:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-06 10:02:30
 * @Description: 附件列表
 */
import React from 'react'
import { Upload } from 'antd'
import { FileData } from '@/utils'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

interface FileListProps {
  fileList: FileData[]
}

const FileList: React.FC<FileListProps> = ({ fileList = [] }) => {
  return (
    <MellowCard title="相关不良原因举证附件" fullHeight>
      <Upload className={styles.file} fileList={fileList} />
    </MellowCard>
  )
}

export default FileList
