import React from 'react'
import { chooseImage, chooseMessageFile } from '@tarojs/taro'
import { useMobileIntl } from '@apps/locales'
import View from '../view'
import Toast from '../toast'
import UploadCard from './uploadCard'
import { ImageInfoWith, UploadCardProps, UploadProps } from '../../types/upload'
import useControlProps from '../../hooks/useControlProps'
import { uuid } from '../../common/utils'

type ExtraProps = React.FC<UploadProps> & {
  Card: React.FC<UploadCardProps>
}

let imageIndex = 0
export const createImageInstance = (url: string, assignAttr?: ImageInfoWith) => {
  const imageInstance: ImageInfoWith = {
    status: 'ready',
    _id: uuid(),
    path: url,
    // 反正上传重复图片时， filename重复
    // eslint-disable-next-line no-plusplus
    fileName: url
      ? `${
          ((++imageIndex + url.split('?')[0]).split('/').pop() as string) +
          (assignAttr?.originalFileObj ? `.${assignAttr?.originalFileObj?.name?.split('.')?.pop()}` : '')
        }`
      : '',
  }

  return assignAttr ? Object.assign(imageInstance, assignAttr) : imageInstance
}

/**
 * @description 上传组件
 */
const Upload: ExtraProps = (props) => {
  const { children, chooseFile = false, pickerMax, childRef } = props
  const translate = useMobileIntl()
  const [, setValueState] = useControlProps<any>(props)
  const [fileList, setFileList] = useControlProps<ImageInfoWith[]>(props, {
    valuePropName: 'fileList',
    trigger: 'setFileList',
    defaultValue: [],
  })
  // const [state, toggle] = useControlProps<boolean>(props, {
  //   defaultValue: false,
  //   valuePropName: 'visible',
  //   trigger: 'setVisible',
  // });

  const imageFactory = (data: ImageInfoWith | ImageInfoWith[], assignAttr?: ImageInfoWith) => {
    const arrayData = Array.isArray(data) ? data : [data]
    const transformData = arrayData.map((v) => {
      const _image = createImageInstance(v.path as string, {
        status: 'ready',
        originalFileObj: v.originalFileObj,
        ...assignAttr,
      })
      return _image
    })
    return transformData
  }
  const handleUpload = async (data: ImageInfoWith | ImageInfoWith[]) => {
    const { actions } = props
    const diffImageList = imageFactory(data)
    const updateList = [...fileList]
    if (childRef && childRef.current?.activeKey) {
      const activeIndex = fileList.findIndex((v) => v._id === childRef.current.activeKey)
      childRef.current.activeKey = ''
      if (activeIndex !== -1) {
        // 希望替换图片
        updateList.splice(activeIndex, 1, ...diffImageList)
      }
    } else {
      updateList.push(...diffImageList)
    }
    if (diffImageList.length === 0) {
      Toast.show({
        title: translate('mobile.common.qingxianxuanzetupian'),
      })
      return
    }
    setFileList(updateList)
    const result: any = await actions(diffImageList)
    let fileResult: any[] = []
    fileResult = updateList.map((v) => {
      const params = { ...v }
      // 已经上传了的网络图片 直接跳过,  该前缀为微信特有
      if (!params.path?.includes('http://tmp')) {
        return params
      }
      if (result.length > 0) {
        const asyncResult = result.find((fr: any) => fr.name === params.fileName)
        if (asyncResult) {
          params.status = 'done'
          params.path = asyncResult.url
          params.originalFileObj = v.originalFileObj
        } else {
          params.status = 'error'
        }
      } else {
        params.status = 'error'
      }
      return params
    })
    if (result.length > 0) {
      // 上传成功后更新值
      setValueState(fileResult.map((v) => v.path))
    }
    setFileList([...fileResult])
    return fileResult
  }

  const openCamera = async () => {
    const result = chooseFile
      ? await chooseMessageFile({
          count: pickerMax || 1,
        })
      : await chooseImage({
          count: pickerMax || 1,
        })
    const { tempFiles } = result

    const asyncFile = await handleUpload(tempFiles as unknown as ImageInfoWith)

    // 上传成功后调用方法
    props.onCameraSuccess && props.onCameraSuccess(asyncFile)
  }

  const handleSelect = async () => {
    props.onSelect && props.onSelect()
    openCamera()
  }
  return <View onClick={handleSelect}>{children}</View>
}

Upload.defaultProps = {
  isControlPicker: false,
  visible: false,
  mode: 'actionSheet',
}
Upload.Card = UploadCard

export default Upload
