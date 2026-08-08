import { Toast } from '@apps/mobile-ui'
import { uploadFile } from '@apps/mobile-services/utils/taro'
import Manifest from '@/constants/manifest'
import { getIntl } from '@linkseeks/i18n'

const requestBaseUrl = Manifest.BACK_GATEWAY || 'http://10.0.0.17:8100'
const uploadFileRequest = async (imageList: any[], name?: string, options?: Taro.uploadFile.Option) => {
  // 上传时候不需要带 'Content-Type': 'multipart/form-data' 否则h5中上传失败
  const results = await Promise.all(
    imageList.map((v) =>
      uploadFile({
        ...options,
        url: `${requestBaseUrl}/support/file/upload/batch?fileType=1`,
        filePath: v.path,
        name: name || 'file',
        fileName: v.fileName,
      }),
    ),
  )
    .then((res) => {
      if (res.every((v) => v.statusCode === 200 && JSON.parse(v.data).code === 1000)) {
        try {
          const data = res.map((v, i) => {
            const _fileData = JSON.parse(v.data).data[0]
            if (imageList[i]?.originalFileObj?.name) {
              _fileData.name = imageList[i]?.originalFileObj?.name
            }
            return _fileData
          })
          return data
        } catch (error) {
          Toast.show({
            title: getIntl().formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
            icon: 'none',
          })
          return []
        }
      } else {
        Toast.show({
          title: getIntl().formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
          icon: 'none',
        })
        return []
      }
    })
    .catch(() => {
      Toast.show({
        title: getIntl().formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
        icon: 'none',
      })
      return []
    })
  return results
}

export default uploadFileRequest
