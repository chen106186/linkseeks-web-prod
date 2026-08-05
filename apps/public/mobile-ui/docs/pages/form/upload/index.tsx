
import { Text, View } from '@tarojs/components'
import { uploadFile } from '../../../utils'
import React from 'react'
import { Upload, UploadCard, Button } from '../../../../packages'

export interface UploadDocsProps {}

const UploadDocs:React.FC<UploadDocsProps> = (props) => {
  return (
    <View className='page'>
      <Text>上传组件</Text>
      <Text>此方法可以自定义上传容器, actions方法必传</Text>
      <Upload
        actions={uploadFile}
        onCameraSuccess={e => {console.log(e)}}
      >
        <Button>点击上传</Button>
      </Upload>

      <Text>卡片式上传, 可传入max控制上传数量</Text>
      <UploadCard
        actions={uploadFile}
        max={2}
      />
    </View>
  )
}

UploadDocs.defaultProps = {}

export default UploadDocs
