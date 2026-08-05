// 生成裁剪路径
export function createClipPath(ctx, size = 100, styleIndex = 0) {
  // 这里对应的是左， 下。 右， 上 四种位置，顺时针或者逆时针向内 凹凸
  const styles = [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]
  const style = styles[styleIndex]

  const r = 0.1 * size
  ctx.save()
  ctx.beginPath()
  // left
  ctx.moveTo(r, r)
  ctx.lineTo(r, 0.5 * size - r)
  // r 园中心x, 0.5 * size 圆中心Y, r 半径， 1.5*Math.PI 起始角， 0.5*Math.PI结束角， 顺时针/逆时针
  ctx.arc(r, 0.5 * size, r, 1.5 * Math.PI, 0.5 * Math.PI, style[0])
  ctx.lineTo(r, size - r)
  // bottom
  ctx.lineTo(0.5 * size - r, size - r)
  ctx.arc(0.5 * size, size - r, r, Math.PI, 0, style[1])
  ctx.lineTo(size - r, size - r)
  // right
  ctx.lineTo(size - r, 0.5 * size + r)
  ctx.arc(size - r, 0.5 * size, r, 0.5 * Math.PI, 1.5 * Math.PI, style[2])
  ctx.lineTo(size - r, r)
  // top
  ctx.lineTo(0.5 * size + r, r)
  ctx.arc(0.5 * size, r, r, 0, Math.PI, style[3])
  ctx.lineTo(r, r)

  ctx.clip()
  ctx.closePath()
}
