import { Toast } from '@apps/mobile-ui'
import { uploadFile } from '@apps/mobile-services/utils/taro'
import Manifest from '@/constants/manifest'
import { getIntl } from '@linkseeks/i18n'

const requestBaseUrl = Manifest.BACK_GATEWAY || 'http://10.0.1.156:8100'

export function uuid(len = 8, radix = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const value: string[] = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    /* eslint-disable-next-line */
    value[8] = value[13] = value[18] = value[23] = '-'
    value[14] = '4'

    // Fill in random data.  God i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16)
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return value.join('')
}

const uploadFileRequest = async (imageList: any[], name?: string, options?: Taro.uploadFile.Option) => {
  const intl = getIntl()
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
            title: intl.formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
            icon: 'none',
          })
          return []
        }
      } else {
        Toast.show({
          title: intl.formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
          icon: 'none',
        })
        return []
      }
    })
    .catch(() => {
      Toast.show({
        title: intl.formatMessage({ id: 'components.shangchuantupianshibai', defaultMessage: '上传图片失败' }),
        icon: 'none',
      })
      return []
    })
  return results
}

export default uploadFileRequest
