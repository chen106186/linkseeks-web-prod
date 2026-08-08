import { uploadFile as uploadFileTaro } from '@tarojs/taro'

export async function uploadFile(imageList: any[]) {
  const results = await Promise.all(
    imageList.map((v) =>
      uploadFileTaro({
        url: 'http://10.0.0.17:8100/file/file/upload/batch?fileType=1',
        filePath: v.path,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    ),
  )

  if (results.every((v) => v.statusCode === 200)) {
    try {
      const data = results.map((v) => JSON.parse(v.data).data)[0]
      return data
    } catch (error) {
      console.log('uploadError ->' + error)
      return []
    }
  }
}
