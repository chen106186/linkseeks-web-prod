/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-03 11:49:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-13 15:38:46
 * @Description: 附件列表
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Empty, Descriptions, Upload } from 'antd'
import { FileData } from '@/utils'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import styles from './index.less'

interface FileListProps extends MellowCardProps {
  fileList: FileData[]
}

const FileList: React.FC<FileListProps> = ({ fileList = [], ...rest }) => {
  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.FileList.title', defaultMessage: '附件' })}
      bodyStyle={{
        paddingBottom: 6,
      }}
      {...rest}
    >
      {fileList && fileList.length ? (
        // <SchemaForm
        //   components={{ Upload }}
        //   value={{
        //     files: fileList,
        //   }}
        //   editable={false}
        //   previewPlaceholder=" "
        // >
        //   <FormMegaLayout full>
        //     <Field name="files" title="相关不良原因举证附件" x-component="Upload" />
        //   </FormMegaLayout>
        // </SchemaForm>
        <Descriptions column={1}>
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'afterService.components.FileList.fileList',
              defaultMessage: '相关不良原因举证附件',
            })}
          >
            <Upload className={styles.file} fileList={fileList} disabled />
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </MellowCard>
  )
}

export default FileList
