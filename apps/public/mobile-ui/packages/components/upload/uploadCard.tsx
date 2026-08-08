import React, { useEffect, useRef, useState } from 'react';
import View from '../view'
import Text from '../text'
import Icons from '../icons'
import Image from '../image'
import ActivityIndicator from '../activityIndicator'
import Upload, { createImageInstance } from './upload';
import { ImageInfoWith, UploadCardProps } from '../../types/upload';

/**
 * @description 上传组件-卡片模型
 */
const UploadCard: React.FC<UploadCardProps> = (props) => {
  const { children, actions, pickerMax, max, value, iconProps, ...restProps } = props;

  const [imageLists, setImageLists] = useState<(ImageInfoWith)[]>([]);
  useEffect(() => {
    if (value && imageLists.length === 0) {
      setImageLists(value.map((v) => createImageInstance(v, { status: 'done' })))
    }
  }, [value])
  const uploadRef = useRef<any>({})
  const uploadProps = {
    actions,
    fileList: imageLists,
    setFileList: setImageLists,
    value,
    pickerMax,
    ...restProps,
  };

  const UploadContainer = props => <Upload
    {...uploadProps}
    {...props}
  />

  const emptyContainer = (
    <UploadContainer>
      <View
        className='god-upload-card_empty_container'
      >
        <Icons name="Plus" size={40} className='god-upload-card_icon' {...iconProps}/>
        <Text className='god-upload-card_tip'>{children}</Text>
      </View>
    </UploadContainer>
  );
  return (
    <View className='god-upload-card_main'>
      {imageLists.length > 0 ? (
        <View className='god-upload-card_container'>
          {imageLists.map((v, i) => (
            <UploadContainer
              childRef={uploadRef}
              onSelect={() => {
                uploadRef.current.activeKey = v._id
              }}
            >
              <View key={v.id || i} className='god-upload-card-center'>
                {v.status !== 'done' ? (
                  <View className='god-upload-container-small'>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <Image src={v.path || ''} className='god-upload-container-image' />
                )}
              </View>
            </UploadContainer>
          ))}
          {max! > imageLists.length && emptyContainer}
        </View>
      ) : (
        emptyContainer
      )}
    </View>
  );
};

UploadCard.defaultProps = {
  multiple: false,
  // 默认为1
  pickerMax: 1,
  max: 1,
};

export default UploadCard;
