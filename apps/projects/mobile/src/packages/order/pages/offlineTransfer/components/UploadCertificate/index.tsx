import React, { useState } from 'react';
import { View, Text, Icons, Upload, Image } from '@apps/mobile-ui';
import MelloCard from '@/components/MellowCard';
import { useIntl } from '@linkseeks/i18n'
import uploadFileRequest from "@/utils/uploadFileRequest";
import styles from './index.module.scss';

interface Iprops {
  onUploadChange?: null | ((item: any) => void)
}

const UploadCertificate: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()

  const { onUploadChange } = props

  const [file, setFile] = useState<string>();

  // 图片上传
  const uplaodFile = async (result) => {
    const uploadResult = await uploadFileRequest([result[0]])
    setFile(uploadResult[0].url)
    onUploadChange?.([uploadResult[0].url]);
    return uploadResult
  }

  return (
    <MelloCard title={intl.formatMessage({id: 'offlineTransfer_components_uploadCertificate_title'})}>
      <Upload actions={uplaodFile} pickerMax={1} >
        {
          file ?
            <View className={styles['imageContainer']}>
              <Image className={styles['certificateImg']} src={file} mode='aspectFit' />
            </View>
            :
            <View className={styles['upload']}>
              <Icons size={16} name='Plus' color='#91959b' />
              <Text className={styles['uploadText']}>{intl.formatMessage({id: 'offlineTransfer_components_uploadCertificate_uploadText'})}</Text>
            </View>
        }
      </Upload>
    </MelloCard>
  )
}

UploadCertificate.defaultProps = {
  onUploadChange: null,
}

export default UploadCertificate;
