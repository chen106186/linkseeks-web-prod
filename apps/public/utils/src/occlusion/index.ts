// 设置**遮罩隐藏  参数（ 数据  前三位 后四位）
const basecclusion = (data: string, frontShow: number, afterShow: number) => {
  if (data.length <= afterShow) return ''

  let dataLengh = data.length
  if (dataLengh > frontShow + afterShow) {
    let obscuringStar = '*'
    // 计算中间星星数
    for (let i = 0; i < dataLengh - frontShow - afterShow; i++) {
      obscuringStar += '*'
    }
    return data.substring(0, frontShow) + obscuringStar + data.substring(data.length - afterShow, data.length)
  } else {
    return '—' // 不规范时返回'-'
  }
}

// 自定义 遮盖长度
export function occlusion(data, frontShow, afterShow) {
  return basecclusion(data, frontShow, afterShow)
}
// 身份证遮盖长度
export function occlusionToidCard(data) {
  return basecclusion(data, 6, 4)
}
// 手机号遮盖长度
export function occlusionToPhone(data) {
  return basecclusion(data, 3, 4)
}
