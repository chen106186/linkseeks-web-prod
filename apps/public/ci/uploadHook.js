// https://oapi.dingtalk.com/robot/send?access_token=a2bb1dcab33447df3c061a6b62a5a7591e47ad688d8309ffd2f930954f4a7420
const axios = require('axios')
const fs = require('fs')

const postMessage = (message) => {
  axios({
    method: 'post',
    data: message,
    url: 'https://oapi.dingtalk.com/robot/send?access_token=a2bb1dcab33447df3c061a6b62a5a7591e47ad688d8309ffd2f930954f4a7420',
  }).catch((error) => {
    console.log('出错', error)
  })
}
module.exports = function (ctx) {
  ctx.register({
    name: 'onPreviewComplete',
    fn: ({ success, data, error }) => {
      console.log('接收预览后数据', success, data, error)
      // 你可以在这里发送钉钉或者飞书消息
    },
  })
  ctx.register({
    name: 'onUploadComplete',
    fn: ({ success, data, error }) => {
      console.log('接收上传后数据', success, data, error)

      if (success) {
        const { platform, qrCodeContent, qrCodeLocalPath } = data

        const imageData = fs.readFileSync(qrCodeLocalPath, { encoding: 'base64' })

        console.log('图片', imageData.length)

        postMessage({
          msgType: 'markdown',
          markdown: {
            title: '小程序上传通知',
            text: `#### 小程序上传通知\n> 平台: ${platform}\n> 二维码内容: ${qrCodeContent}\n![二维码](data:image/png;base64,${imageData})`,
          },
        })
      } else {
        // 上传失败
      }
      // 你可以在这里发送钉钉或者飞书消息
    },
  })
}
