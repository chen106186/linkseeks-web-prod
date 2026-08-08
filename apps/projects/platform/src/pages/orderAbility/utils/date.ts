// 公共日期类工具

const getDayAll = (starDay: string, endDay: string) => {
  let arr = []
  let dates = []

  // 设置两个日期UTC时间
  let db = new Date(starDay)
  let de = new Date(endDay)

  // 获取两个日期GTM时间
  let s = db.getTime() - 24 * 60 * 60 * 1000
  let d = de.getTime() - 24 * 60 * 60 * 1000

  // 获取到两个日期之间的每一天的毫秒数
  for (let i = s; i <= d; ) {
    i = i + 24 * 60 * 60 * 1000
    arr.push(parseInt(String(i)))
  }

  // 获取每一天的时间  YY-MM-DD
  for (let j in arr) {
    let time = new Date(arr[j])
    let year = time.getFullYear()
    let mouth = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
    let day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
    // year + '-' +
    // let YYMMDD = year + '-' + mouth + '-' + day
    let MMDD = '$' + mouth + '-' + day
    dates.push(MMDD)
  }
  // dates.pop()
  return dates
}

export { getDayAll }
