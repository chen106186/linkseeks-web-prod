Component({
  properties: {
    canvasId: {
      type: String,
      value: 'posterCanvas',
    },
    width: {
      type: Number,
      value: 300,
    },
    height: {
      type: Number,
      value: 400,
    },
    downloadTrigger: {
      type: Number,
      value: 0,
    },
    // 背景图片路径
    backgroundUrl: String,
    // 二维码路径
    qrCodeUrl: String,
    // 画布类型
    drawType: {
      type: String,
      value: '',
    },
    // 商品信息
    product: {
      type: Object,
      value: {
        name: '',
        price: 0.0,
        unitName: '',
        mainPic: '',
        tags: [],
      },
    },
  },
  observers: {
    downloadTrigger(val) {
      if (val > 0) {
        if (this.data.drawType === 'draw') {
          this.draw()
        } else if (this.data.drawType === 'draw2'){
          this.draw2()
        }
      }
    },
  },
  methods: {
    // 绘制邀请海报
    draw() {
      const dpr = wx.getSystemInfoSync().pixelRatio
      this.createSelectorQuery()
        .in(this)
        .select(`#${this.data.canvasId}`)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node
          if (!canvas) return console.error('canvas 节点获取失败')

          const ctx = canvas.getContext('2d')
          const width = this.data.width
          const height = this.data.height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)

          // 先填充白底，避免透明时黑边
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, width, height)

          // 圆角半径
          const radius = 20

          // 画圆角裁剪路径
          ctx.beginPath()
          ctx.moveTo(radius, 0)
          ctx.lineTo(width - radius, 0)
          ctx.arcTo(width, 0, width, radius, radius)
          ctx.lineTo(width, height - radius)
          ctx.arcTo(width, height, width - radius, height, radius)
          ctx.lineTo(radius, height)
          ctx.arcTo(0, height, 0, height - radius, radius)
          ctx.lineTo(0, radius)
          ctx.arcTo(0, 0, radius, 0, radius)
          ctx.closePath()
          ctx.clip()

          wx.getImageInfo({
            src: this.data.backgroundUrl,
            success: bgRes => {
              const image = canvas.createImage()
              image.src = bgRes.path

              image.onload = () => {
                // 背景图绘制于裁剪区域内
                ctx.drawImage(image, 0, 0, width, height)

                // 绘制二维码和文字（示例尺寸，可调整）
                const qrSize = 120
                const qrX = width - qrSize - 20
                const qrY = height - qrSize - 20 - 30 // 向上偏移30px

                const qrImg = canvas.createImage()
                qrImg.src = this.data.qrCodeUrl

                qrImg.onload = () => {
                  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

                  ctx.fillStyle = '#3D3D3D'
                  ctx.font = '14px sans-serif'
                  ctx.textAlign = 'center'
                  ctx.fillText('扫描二维码查看', qrX + qrSize / 2, qrY + qrSize + 20)

                  try {
                    ctx.draw()
                  } catch (e) {}

                  wx.canvasToTempFilePath(
                    {
                      canvas,
                      destWidth: width * dpr,
                      destHeight: height * dpr,
                      fileType: 'png',
                      success: res => {
                        this.triggerEvent('success', res.tempFilePath)
                      },
                      fail: err => {
                        console.error('导出失败', err)
                      },
                    },
                    this
                  )
                }

                qrImg.onerror = err => {
                  console.error('二维码加载失败', err)
                }
              }

              image.onerror = err => {
                console.error('背景图加载失败', err)
              }
            },
            fail: err => {
              console.error('getImageInfo 加载失败', err)
            },
          })
        })
    },
    // 绘制分享商品海报
    draw2() {
      const dpr = wx.getSystemInfoSync().pixelRatio
      this.createSelectorQuery()
        .in(this)
        .select(`#${this.data.canvasId}`)
        .fields({ node: true, size: true })
        .exec(res => {
          const canvas = res[0].node
          if (!canvas) return console.error('canvas 节点获取失败')

          const ctx = canvas.getContext('2d')
          const width = this.data.width
          const height = this.data.height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)

          const { name, price, unitName = '', mainPic, tags = [] } = this.data.product || {}
          const backgroundUrl = this.data.backgroundUrl
          const qrCodeUrl = this.data.qrCodeUrl

          // 绘制超出宽度省略号文本的函数
          function drawTextWithEllipsis(ctx, text, x, y, maxWidth, font) {
            ctx.font = font
            if (ctx.measureText(text).width <= maxWidth) {
              ctx.fillText(text, x, y)
              return
            }
            let len = text.length
            while (len > 0) {
              let substr = text.substring(0, len) + '...'
              if (ctx.measureText(substr).width <= maxWidth) {
                ctx.fillText(substr, x, y)
                break
              }
              len--
            }
          }

          // 千分位格式化价格字符串
          function formatPrice(num) {
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }

          wx.getImageInfo({
            src: backgroundUrl,
            success: bgRes => {
              const bgImg = canvas.createImage()
              bgImg.src = bgRes.path

              bgImg.onload = () => {
                ctx.drawImage(bgImg, 0, 0, width, height)

                // 白色圆角背景容器，圆角20，包裹所有内容
                const containerX = 16
                const containerY = 55
                const containerW = width - 32
                const containerH = 400
                const radius = 20
                const padding = 10

                ctx.save()
                ctx.beginPath()
                ctx.moveTo(containerX + radius, containerY)
                ctx.arcTo(containerX + containerW, containerY, containerX + containerW, containerY + radius, radius)
                ctx.arcTo(containerX + containerW, containerY + containerH, containerX + containerW - radius, containerY + containerH, radius)
                ctx.arcTo(containerX, containerY + containerH, containerX, containerY + containerH - radius, radius)
                ctx.arcTo(containerX, containerY, containerX + radius, containerY, radius)
                ctx.closePath()
                ctx.clip()

                ctx.fillStyle = '#fff'
                ctx.fillRect(containerX, containerY, containerW, containerH)

                // 商品图片圆角10
                const imgX = containerX + padding
                const imgY = containerY + padding
                const imgW = 271
                const imgH = 271

                const productImg = canvas.createImage()
                productImg.src = mainPic

                productImg.onload = () => {
                  ctx.save()
                  ctx.beginPath()
                  ctx.moveTo(imgX + 10, imgY)
                  ctx.arcTo(imgX + imgW, imgY, imgX + imgW, imgY + imgH, 10)
                  ctx.arcTo(imgX + imgW, imgY + imgH, imgX, imgY + imgH, 10)
                  ctx.arcTo(imgX, imgY + imgH, imgX, imgY, 10)
                  ctx.arcTo(imgX, imgY, imgX + imgW, imgY, 10)
                  ctx.closePath()
                  ctx.clip()

                  ctx.drawImage(productImg, imgX, imgY, imgW, imgH)
                  ctx.restore()

                  // 商品名称，图片下方间距8px，最大宽度限制(和图片宽度一致)
                  const nameY = imgY + imgH + 20
                  ctx.fillStyle = '#303133'
                  ctx.textAlign = 'left'
                  drawTextWithEllipsis(ctx, name || '', imgX, nameY, imgW, '14px sans-serif')

                  // 价格区域（左侧）
                  const priceY = nameY + 30
                  const priceStr = formatPrice(price || 0) // 带千分位的价格字符串，如 "1,800.00"

                  // 逐字符绘制价格，防止错位
                  let priceX = imgX
                  ctx.fillStyle = '#f2270e'
                  ctx.font = '12px sans-serif'
                  ctx.fillText('￥', priceX, priceY)
                  priceX += ctx.measureText('￥').width + 4

                  // 绘制整数部分和千分位分隔符
                  ctx.font = '18px sans-serif'
                  ctx.fillStyle = '#ef3346'

                  // 找到小数点位置
                  const dotIndex = priceStr.indexOf('.')
                  const intPartStr = priceStr.substring(0, dotIndex)
                  const decPartStr = priceStr.substring(dotIndex) // 包含“.”

                  // 绘制整数部分（含逗号）
                  for (const ch of intPartStr) {
                    ctx.fillText(ch, priceX, priceY)
                    priceX += ctx.measureText(ch).width
                  }

                  // 绘制小数点及后两位，字体小一点12px
                  ctx.font = '12px sans-serif'
                  ctx.fillText(decPartStr, priceX + 2, priceY)

                  // 单位显示，间隔6px
                  ctx.fillStyle = '#303133'
                  ctx.font = '14px sans-serif'
                  ctx.fillText(`/${unitName}`, priceX + ctx.measureText(decPartStr).width + 6, priceY)

                  // 标签区域，价格下方上移10px，最多5个标签，间距1px
                  const tagY = priceY + 32 - 15 // 上移15px
                  let tagX = imgX
                  ctx.font = '10px sans-serif'
                  const maxTags = 5
                  tags.slice(0, maxTags).forEach(tag => {
                    const paddingTagX = 4
                    const textWidth = ctx.measureText(tag).width
                    const boxWidth = textWidth + paddingTagX * 2
                    const boxHeight = 16

                    ctx.strokeStyle = '#ef3346'
                    ctx.lineWidth = 0.5
                    ctx.strokeRect(tagX, tagY, boxWidth, boxHeight)

                    ctx.fillStyle = '#ef3346'
                    ctx.fillText(tag, tagX + paddingTagX, tagY + 12)

                    tagX += boxWidth + 2 // 间距改为1px
                  })

                  // 二维码右边缩进与价格左边间距对齐，往里缩20px
                  const qrSize = 48
                  const qrX = containerX + containerW - padding - qrSize - 20
                  const qrY = priceY - 20

                  const qrImg = canvas.createImage()
                  qrImg.src = qrCodeUrl

                  qrImg.onload = () => {
                    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

                    ctx.fillStyle = '#303133'
                    ctx.font = '12px sans-serif'
                    ctx.textAlign = 'center'
                    ctx.fillText('扫描二维码查看', qrX + qrSize / 2, qrY + qrSize + 16)

                    ctx.textAlign = 'left'

                    wx.canvasToTempFilePath(
                      {
                        canvas,
                        destWidth: width * dpr,
                        destHeight: height * dpr,
                        fileType: 'png',
                        success: res => this.triggerEvent('success', res.tempFilePath),
                        fail: err => console.error('导出失败', err),
                      },
                      this
                    )
                  }

                  qrImg.onerror = err => console.error('二维码加载失败', err)
                }

                productImg.onerror = err => console.error('商品图加载失败', err)

                ctx.restore()
              }

              bgImg.onerror = err => console.error('背景图加载失败', err)
            },
            fail: err => console.error('getImageInfo 加载失败', err),
          })
        })
    },
  },
})
