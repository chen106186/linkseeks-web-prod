import React, { useEffect } from 'react';
import UploadFiles from './UploadFiles';
import { UploadProps, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { Button } from 'antd';

interface Iprops {
  value: UploadFile[],
  editable: boolean,
  props: {
    ['x-component-props']: {
      /**
       * ☹
       * 这里表现相对奇怪，当这个组件放在了table 下切这个组件是必填的话，会出现两个错误情况，我通过外部传值干掉其中一个
       */
       showError?: boolean,
    } & {
      [key: string]: any
    },
  },
  mutators: {
    change: (params: UploadFile[]) => void
  },
  errors: string[],
}

const toArray = (value: string | UploadFile[]): UploadFile[] => {
  if (typeof value === 'undefined' || !value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
}

const FormilyUploadFiles: React.FC<Iprops> = (props: Iprops) => {
  const { value, editable, errors,  } = props;
  const componentProps = props.props?.['x-component-props'] || {};
  const { showError, ...rest } = componentProps;
  const isShowError = typeof showError === 'undefined' ? true : showError;

  const fileList = toArray(value);

  const onChange = (info: UploadChangeParam) => {

    const fileList = info.fileList;
    const newList = fileList.map((file) => {
      return {
        name: file.name,
        url: file.url || file.response?.data,
        uid: file.uid,
        status: file.status,
        percent: file.percent,
        size: file.size,
        type: file.type,
      }
    })
    props.mutators.change(newList)
  }

  const onRemove = (fileItem: UploadFile) => {
    const list = [...fileList];
    const newList = list.filter((_item) => _item.url !== fileItem.url);
    props.mutators.change(newList);
  }

  return (
    <div style={{width: '100%'}}>
      <UploadFiles fileList={fileList} onChange={onChange} onRemove={onRemove} disable={!editable} {...rest}  />
      {/* {
        isShowError && errors.length > 0 && (
          <div>
            <p style={{color: '#ff4d4f'}}>{errors.join("")}</p>
          </div>
        )
      } */}
    </div>
  )
}

const WrapFormilyUploadFiles: typeof FormilyUploadFiles & {
  isFieldComponent?: boolean,
} = FormilyUploadFiles;

WrapFormilyUploadFiles.isFieldComponent = true
export default WrapFormilyUploadFiles
